import React, { useRef, useEffect, useState, useContext } from "react";
import Head from "next/head";
import AppContext from "../contexts/AppContext";
import { useRouter } from "next/router";
import Accordion from "../components/Accordion";
import Progress from "../components/progress";

// Third Party
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

// Internal
import Layout from "../components/Layout";
import styles from "../styles/Results.module.scss";

mapboxgl.accessToken =
  "pk.eyJ1IjoiemhqMDkyNCIsImEiOiJja3ZnangxdXljMXBlMnBtYTF0c29oN2N3In0.HsgAF-xISYEHuqdLlpJL2A";
const base_url = "https://reroot-data-app.herokuapp.com/";

function Results({ scores, initParams }) {
  const { data, useData } = useContext(AppContext);
  const [pageIsMounted, setPageIsMounted] = useState(false);
  const [favCounties, setFavCounties] = useState([]);
  const [params, setParams] = useState(initParams);
  const router = useRouter();

  console.log(params);

  const PER_PAGE = 10;
  const top = (counties) => (n) => counties.slice(0, n);

  const counties_raw = scores.scores;
  counties_raw.forEach((county) => {
    county.lngLat = [
      county.coordinates.county_long,
      county.coordinates.county_lat,
    ];
  });

  const [counties, setCounties] = useState(counties_raw);

  const updateScores = async (newParam) => {
    setParams(Object.assign(params, newParam));
    const query = new URLSearchParams(params);
    const req = await fetch(`${base_url}scores?${query}`);
    const newScores = await req.json();
    counties = newScores.scores;
    counties.forEach((county) => {
      county.lngLat = [
        county.coordinates.county_long,
        county.coordinates.county_lat,
      ];
    });
    setCounties(newScores.scores);
    return true;
  };

  const handleRangeChange = (event) => {
    event.preventDefault();
    // TODO
    let newParams = [];
    fetchData(newParams);
  };

  const myMap = useRef();

  // Map configurations
  useEffect(() => {
    setPageIsMounted(true);
    const LNG_LAT_DC = [-99.0909, 39.8355];
    const map = new mapboxgl.Map({
      container: "my-map",
      style: "mapbox://styles/zhj0924/ckwd55u2n5fb314pc0egsi3ii",
      center: LNG_LAT_DC,
      zoom: 4,
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
    top(counties)(PER_PAGE).forEach((county) => {
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

      <Progress />

      <div className="row flex-nowrap">
        {/* Sidebar */}
        <div className="col-auto px-0">
          <div
            id="sidebar"
            className="collapse collapse-horizontal show border-end"
          >
            <div
              id="sidebar-nav"
              className="list-group border-0 rounded-0 text-sm-start min-vh-100 ps-5"
              style={{ width: "15vw" }}
            >
              <div
                className="flex-shrink-0 p-3 bg-white"
                style={{ width: "13vw" }}
              >
                <div className="d-flex align-items-center pb-3 mb-3 link-dark text-decoration-none border-bottom fs-5 fw-semibold">
                  Preference
                </div>
                <ul className="list-unstyled ps-0">
                  {data.factors.map((factor) => (
                    <li className="mb-1" key={factor.name}>
                      <button
                        className={`${styles.factor} btn btn-toggle align-items-center rounded collapsed pb-1`}
                        data-bs-toggle="collapse"
                        data-bs-target={`#${factor.name}-collapse`}
                        aria-expanded="true"
                      >
                        {factor.text}
                        <span>▼</span>
                      </button>
                      <div
                        className={`collapse ${factor.selected ? "show" : ""}`}
                        id={`${factor.name}-collapse`}
                      >
                        <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                          {factor.sub.map((sub) => (
                            <li key={sub.name}>
                              <label
                                htmlFor={`${sub.name}-range`}
                                className="form-label"
                              >
                                {sub.text}
                              </label>
                              <div className="range">
                                <input
                                  type="range"
                                  className="form-range"
                                  min="0"
                                  max="4"
                                  defaultValue={params[sub.param] || "0"}
                                  step="1"
                                  id={`${sub.name}-range`}
                                  onChange={(event) => {
                                    event.preventDefault();
                                    let newValue = event.target.value;
                                    if (sub.param)
                                      updateScores({
                                        [`${sub.param}`]: newValue,
                                      });
                                  }}
                                />
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </li>
                  ))}
                  <li className="border-top my-3"></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Main App */}
        <main className="col ps-md-2 pt-2">
          <a
            href="#"
            data-bs-target="#sidebar"
            data-bs-toggle="collapse"
            className="border rounded-3 p-1 text-decoration-none"
          >
            <i className="bi bi-list bi-lg py-2 p-1"></i> Menu
          </a>
          <div className="row">
            <div className={`${styles.map} col-12`} id="my-map" />
            <div className="col-12 favorite">
              <div className="fav-title">FAVORITE COUNTIES</div>
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
            <div className={`${styles.counties} col-12 counties`}>
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
                      if (
                        favCounties.some((c) => c.name == county.county_name)
                      ) {
                      } else {
                        setFavCounties([...favCounties, county]);
                      }
                    }}
                  />
                )}
              ></Accordion>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const params = new URLSearchParams(context.query);
  const initParams = context.query;
  const res_scores = await fetch(base_url + "scores?" + params);
  const scores = await res_scores.json();

  if (!scores) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
      scoreNotFound: true,
    };
  }

  return {
    props: { scores, initParams }, // will be passed to the page component as props
  };
}

export default Results;
