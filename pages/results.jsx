import React, { useRef, useEffect, useState, useContext } from "react";
import Head from "next/head";
import { URLSearchParams } from "url";
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

  const updateScores = async (newParams) => {
    setParams(params.concat(newParams));
    const query = new URLSearchParams(params);
    const req = await fetch(`${base_url}?query`);
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

  const handleClick = (event) => {
    event.preventDefault();
    // TODO
    let newParams = [];
    fetchData(newParams);
  };

  const myMap = useRef();

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
              <a className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-decoration-none">
                <span className="fs-5 d-none d-sm-inline">Preference</span>
              </a>
              <ul
                className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start"
                id="menu"
              >
                {data.factors.map((factor) => (
                  <li key={factor.name}>
                    <a
                      href={`#submenu-${factor.name}`}
                      data-bs-toggle="collapse"
                      className="nav-link px-0 align-middle"
                    >
                      <i className="fs-4 bi-speedometer2"></i>
                      <span className="ms-1 d-none d-sm-inline">
                        {factor.text}
                      </span>
                    </a>
                    <ul
                      className="collapse show nav flex-column ms-1"
                      id={`submenu-${factor.name}`}
                      data-bs-parent="#menu"
                    >
                      {factor.sub.map((sub) => (
                        <li className="w-100" key={sub.name}>
                          <a href="#" className="nav-link px-0">
                            {sub.text}
                            {/* <span className="d-none d-sm-inline"></span> */}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
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
            <div className="col-12 map">
              <div className={styles.map} id="my-map" />
            </div>
            <div className="col-12 favorite">
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
