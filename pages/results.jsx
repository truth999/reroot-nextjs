import React, { useRef, useEffect, useState, useContext } from "react";
import Head from "next/head";
import { URLSearchParams } from "url";
import counties_10 from "../data/counties";
import AppContext from "../contexts/AppContext";
import { useRouter } from "next/router";

// Third Party
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

// Internal
import Layout from "../components/Layout";
import styles from "../styles/Results.module.scss";

mapboxgl.accessToken =
  "pk.eyJ1IjoiemhqMDkyNCIsImEiOiJja3ZnangxdXljMXBlMnBtYTF0c29oN2N3In0.HsgAF-xISYEHuqdLlpJL2A";
const base_url = "https://reroot-data-app.herokuapp.com/";

function Results({ scores, query }) {
  const { data, useData } = useContext(AppContext);
  const [pageIsMounted, setPageIsMounted] = useState(false);
  const [favCounties, setFavCounties] = useState([]);
  const router = useRouter();

  console.log(Object.keys(query));
  console.log(scores);

  // console.log(scores);

  const LNG_LAT_DC = [-77.02, 38.887];

  // sort by score, descending
  for (const [code, score] of Object.entries(scores)) {
    score.code = code;
  }

  const top = Object.keys(scores).sort(
    (a, b) => scores[b].score - scores[a].score
  );
  const top_ = (n) => top.slice(0, n).map((c) => scores[c]);
  for (const [code, county] of Object.entries(counties_10)) {
    county.code = code;
    county.name = county.county_name;
  }
  const counties = Object.values(counties_10);
  counties.forEach((c, i) => {
    let s = top_(10)[i];
    c.score = s.score;
    c.lngLat = { lon: c.coordinates[1], lat: c.coordinates[0] };
    c.breakdown = {};
    for (const [k, v] of Object.entries(s)) {
      if (k === "score" || k === "code") {
        continue;
      }
      c.breakdown[k] = v;
    }
  });

  const myMap = useRef();

  // Map configurations
  useEffect(() => {
    setPageIsMounted(true);
    const map = new mapboxgl.Map({
      container: "my-map",
      style: "mapbox://styles/zhj0924/ckwd55u2n5fb314pc0egsi3ii",
      center: LNG_LAT_DC,
      zoom: 12.5,
      pitch: 45,
    });

    myMap.current = map;

    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
      })
    );

    // Populate markers
    counties.forEach((county) => {
      new mapboxgl.Marker({
        color: "red",
      })
        .setLngLat(county.lngLat)
        .setPopup(new mapboxgl.Popup().setHTML(`<h1>${county.name}</h1>`))
        .addTo(map);
    });
  }, [counties]);

  return (
    <Layout results>
      <Head>
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v2.6.0/mapbox-gl.css"
          rel="stylesheet"
        />
        <title>Results</title>
      </Head>

      <section>
        <div className="row">
          <div className="col-2">
            <div className="flex-shrink-0 p-3 bg-white" width={280}>
              <a className="d-flex align-items-center pb-3 mb-3 link-dark text-decoration-none border-bottom">
                <span className="fs-5 fw-semibold">Preference</span>
              </a>
              <ul className="list-unstyled ps0">
                {data.factors.map((factor) => (
                  <li className="mb-1" key={factor.name}>
                    <button
                      className="btn btn-toggle align-items-center rounded collapsed"
                      data-bs-toggle="collapse"
                      data-bs-target="#home-collapse"
                      aria-expanded="true"
                    >
                      {factor.name.toUpperCase()}
                    </button>
                    <div className="collapse show" id="home-collapse">
                      <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                        {factor.selected &&
                          factor.sub_factors.map((sub) => (
                            <li key={sub.name}>
                              <a href="#" className="link-dark rounded">
                                {sub.name}
                              </a>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="col-10">
            {/* Map */}
            <div className="row map">
              <div className={styles.map} id="my-map" />
            </div>

            <div className="row favorite">
              <div className="fav-title">FAVORITED COUNTIES</div>
              <div className="fav-list">
                {favCounties.map((county) => (
                  <div className="fav-item row" key={county.code}>
                    <p style={{ color: "red" }}>
                      {county.name}
                      <input
                        type="button"
                        value="X"
                        onClick={() => {
                          const newFavCounties = favCounties.filter(
                            (c) => c !== county
                          );
                          setFavCounties(newFavCounties);
                        }}
                      />
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="row counties">
              <div className="counties-title">ALL COUNTIES</div>
              <div className="accordion counties-list" id="accordionCounties">
                {counties.map((county) => (
                  // Accordion Item
                  <div className="accordion-item" key={county.code}>
                    <h2
                      className="accordion-header"
                      id={`heading-${county.code}`}
                    >
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#collapse-${county.code}`}
                        aria-expanded="false"
                        aria-controls={`collapse-${county.code}`}
                        onClick={() => {
                          myMap.current.flyTo({
                            center: county.lngLat,
                            zoom: 12.5,
                          });
                        }}
                      >
                        {county.name}
                      </button>
                    </h2>

                    <div className="row">
                      <div className="col-10 progress">
                        <div
                          className="progress-bar"
                          role="progressbar"
                          aria-valuenow={county.score}
                          aria-valuemin="0"
                          aria-valuemax="100"
                          aria-label={county.name}
                          style={{ width: `${county.score * 10}%` }}
                        ></div>
                      </div>

                      <div className="col-2">
                        <input
                          type="button"
                          name={`like-${county.code}`}
                          value="♡"
                          onClick={() => {
                            if (
                              favCounties.some((c) => c.name == county.name)
                            ) {
                            } else {
                              setFavCounties([...favCounties, county]);
                            }
                          }}
                        />
                      </div>
                    </div>

                    <div
                      className="accordion-collapse collapse"
                      id={`collapse-${county.code}`}
                      aria-labelledby={`heading-${county.code}`}
                      data-bs-parent="#accordionCounties"
                    >
                      <div className="accordion-body">
                        {Object.entries(county.breakdown).map(
                          ([factor, score]) => (
                            <div key={factor}>{`${factor}: ${score}`}</div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  let query = context.query;
  const sample_params = new URLSearchParams(context.query);

  const res_scores = await fetch(base_url + "scores?" + sample_params);
  const scores = await res_scores.json();

  if (!scores) {
    return {
      scoreNotFound: true,
    };
  }

  return {
    props: { scores, query }, // will be passed to the page component as props
  };
}

export default Results;
