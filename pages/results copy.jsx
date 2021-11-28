import React, { useRef, useEffect, useState, useContext } from "react";
import Head from "next/head";
import { URLSearchParams } from "url";
import AppContext from "../contexts/AppContext";
import { useRouter } from "next/router";
import Accordion from "../components/Accordion";

// Third Party
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

// Internal
import Layout from "../components/Layout";
import styles from "../styles/Results.module.scss";

mapboxgl.accessToken =
  "pk.eyJ1IjoiemhqMDkyNCIsImEiOiJja3ZnangxdXljMXBlMnBtYTF0c29oN2N3In0.HsgAF-xISYEHuqdLlpJL2A";
const base_url = "https://reroot-data-app.herokuapp.com/";

function Results({ scores }) {
  const { data, useData } = useContext(AppContext);
  const [pageIsMounted, setPageIsMounted] = useState(false);
  const [favCounties, setFavCounties] = useState([]);
  const router = useRouter();

  console.log(scores);
  const PER_PAGE = 10;

  const counties = scores.scores;
  counties.forEach((county) => {
    county.lngLat = [
      county.coordinates.county_long,
      county.coordinates.county_lat,
    ];
  });

  const myMap = useRef();
  counties.top = (n) => {
    return counties.slice(0, n);
  };

  // Map configurations
  useEffect(() => {
    setPageIsMounted(true);
    const LNG_LAT_DC = [-77.02, 38.887];
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
    counties.top(PER_PAGE).forEach((county) => {
      new mapboxgl.Marker({
        color: "red",
      })
        .setLngLat(county.lngLat)
        .setPopup(
          new mapboxgl.Popup().setHTML(`<h1>${county.county_name}</h1>`)
        )
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

      <section className="row">
        <div className="col-3 sidebar">
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
                    {factor.text}
                  </button>
                  <div className="collapse show" id="home-collapse">
                    <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                      {factor.selected &&
                        factor.sub.map((sub) => (
                          <li key={sub.name}>
                            <a href="#" className="link-dark rounded">
                              {sub.text}
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

        <div className="col-9 main">
          {/* Map */}
          <div className="row map">
            <div className={styles.map} id="my-map" />
          </div>

          <div className="row favorite">
            <div className="fav-title">FAVORITED COUNTIES</div>
            <Accordion
              counties={favCounties}
              per_page={PER_PAGE}
              map={myMap}
              emptyText="Heart some places, and they will show here!"
              rightBtn={(county) => (
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
              )}
            ></Accordion>
          </div>

          <div className={`${styles.counties} row`}>
            <div className="counties-title">ALL COUNTIES</div>
            <Accordion
              counties={counties}
              per_page={PER_PAGE}
              map={myMap}
              rightBtn={(county) => (
                <input
                  type="button"
                  name={`$like-{county.county_code}`}
                  value="♡"
                  onClick={() => {
                    if (favCounties.some((c) => c.name == county.county_name)) {
                    } else {
                      setFavCounties([...favCounties, county]);
                    }
                  }}
                />
              )}
            ></Accordion>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const params = new URLSearchParams(context.query);
  const res_scores = await fetch(base_url + "scores?" + params);
  const scores = await res_scores.json();

  if (!scores) {
    return {
      scoreNotFound: true,
    };
  }

  return {
    props: { scores }, // will be passed to the page component as props
  };
}

export default Results;
