import React, { useRef, useEffect, useState, useContext } from "react";
import Head from "next/head";
import Image from "next/image";
import AppContext from "../contexts/AppContext";
import { useRouter } from "next/router";
import Accordion from "../components/Accordion";
import AdjustButton from "../components/adjustButton";
import NextButton from "../components/nextButton";
import LikeButton from "../components/likeButton";
import Preference from "../components/preference";

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
  const [page, setPage] = useState(2);
  const [pageIsMounted, setPageIsMounted] = useState(false);
  const [favCounties, setFavCounties] = useState([]);
  const [params, setParams] = useState(initParams);
  const router = useRouter();

  const counties_raw = scores.scores;
  const [counties, setCounties] = useState(counties_raw);

  const updateScores = async (newParam) => {
    setParams(Object.assign(params, newParam));
    const query = new URLSearchParams(params);
    const req = await fetch(`${base_url}scores?${query}&page=1`);
    const newScores = await req.json();
    counties = newScores.scores;

    setCounties(newScores.scores);
    setPage(2);
    console.log("updateScores called");
    console.log(counties);
    console.log(page);
  };

  const handleLoadMore = async () => {
    const query = new URLSearchParams(params);
    const req = await fetch(`${base_url}scores?${query}&page=${page}`);
    const newScores = await req.json();
    let newCounties = newScores.scores;

    // Update states
    setCounties([...counties, ...newCounties]);
    setPage(page + 1);

    console.log("handleLoadMore called");
    console.log(counties);
    console.log(page);
  };

  const myMap = useRef();

  // Map configurations
  useEffect(() => {
    // Ensure user can't access the page without completing the survey
    if (data.factors.length == 0) {
      router.push("/");
    }

    setPageIsMounted(true);
    const CENTER_US48 = [-99.0909, 39.8355];
    const map = new mapboxgl.Map({
      container: "my-map",
      style: "mapbox://styles/zhj0924/ckwd55u2n5fb314pc0egsi3ii",
      center: CENTER_US48,
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
    counties.forEach((county) => {
      new mapboxgl.Marker({
        color: "red",
      })
        .setLngLat([
          county.coordinates.county_long,
          county.coordinates.county_lat,
        ])
        .setPopup(
          new mapboxgl.Popup()
            .setHTML(`<h1>${county.county_name}</h1>`)
            .addClassName("map-popup")
        )
        .addTo(map);
    });
  }, [counties, router, data.factors.length, page]);

  return (
    <Layout results>
      <Head>
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v2.6.0/mapbox-gl.css"
          rel="stylesheet"
        />
        <title>Results</title>
      </Head>

      <div className="row flex-nowrap">
        {/* Sidebar */}
        <div className="col-auto px-0">
          <div
            id="sidebar"
            className="collapse collapse-horizontal show border-end"
          >
            <div
              id="sidebar-nav"
              className={`${styles.sidebar} list-group border-0 rounded-0 text-sm-start min-vh-100 px-4`}
            >
              <Preference
                factors={data.factors}
                params={params}
                updateScores={updateScores}
              ></Preference>
            </div>
          </div>
        </div>

        {/* Main App */}
        <main className="col ps-md-2">
          {/* toggle sidebar */}
          <a
            href="#"
            data-bs-target="#sidebar"
            data-bs-toggle="collapse"
            className="p-1 text-decoration-none"
          >
            <AdjustButton side={30} collapse={true} />
          </a>

          {/* main */}
          <div className={`${styles.main} row`}>
            <div className={`${styles.map} col-12`} id="my-map" />
            <div className="col-12 favorite">
              <div className={`${styles.mainTitle}`}>FAVORITE COUNTIES</div>
              <Accordion
                type={`fav`}
                counties={favCounties}
                map={myMap}
                emptyText="Heart some places, and they will show here!"
                rightBtn={(county) => (
                  <input
                    className="btn"
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
              <div className={`${styles.mainTitle}`}>ALL COUNTIES</div>
              <Accordion
                type={``}
                counties={counties}
                map={myMap}
                emptyText="Loading..."
                loadMoreButton={
                  <NextButton handleClick={handleLoadMore}>
                    Load More
                  </NextButton>
                }
                rightBtn={(county) => (
                  <LikeButton
                    county={county}
                    handleClick={() => {
                      if (
                        !favCounties.some(
                          (c) => c.county_code == county.county_code
                        )
                      ) {
                        setFavCounties([...favCounties, county]);
                      }
                    }}
                  ></LikeButton>
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
  const res_scores = await fetch(base_url + "scores?" + params + "&page=1");
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
