import React, { useRef, useEffect, useState, useContext } from "react";
import Head from "next/head";
import ReactDOMServer from "react-dom/server";
import AppContext from "../contexts/AppContext";
import { useRouter } from "next/router";

import AdjustButton from "../components/adjustButton";
import NextButton from "../components/nextButton";
import LikeButton from "../components/likeButton";
import RemoveButton from "../components/removeButton";
import Preference from "../components/preference";
import SearchBar from "../components/searchBar";
import Loading from "../components/loading";
import CountyAccordion from "../components/countyAccordion";
import CountyPopup from "../components/countyPopup";

import Favorite from "@mui/icons-material/Favorite";
import CloseButton from "react-bootstrap/CloseButton";

// Third Party
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

// Internal
import Layout from "../components/Layout";
import "mapbox-gl/dist/mapbox-gl.css";
import styles from "../styles/Results.module.scss";

mapboxgl.accessToken =
  "pk.eyJ1IjoiemhqMDkyNCIsImEiOiJja3ZnangxdXljMXBlMnBtYTF0c29oN2N3In0.HsgAF-xISYEHuqdLlpJL2A";
const base_url = "https://reroot-data-app.herokuapp.com/";

function Results({ scores, initParams, parameters }) {
  const { data, setData } = useContext(AppContext);
  setData(
    Object.assign(data, {
      params: parameters,
    })
  );
  const [queryCounty, setQueryCounty] = useState("");
  const [page, setPage] = useState(2);
  const [pageIsMounted, setPageIsMounted] = useState(false);
  // const [favCounties, setFavCounties] = useState([]);
  const [params, setParams] = useState(initParams);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const initCounties = scores.scores;

  const [counties, setCounties] = useState(initCounties);
  const [favs, setFavs] = useState(counties.map((_) => false));

  const updateScores = async (newParam) => {
    setLoading(true);
    setParams(Object.assign(params, newParam));
    const query = new URLSearchParams(params);
    const req = await fetch(`${base_url}scores?${query}&page=1`);
    const newScores = await req.json();
    setLoading(false);
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

    // console.log("handleLoadMore called");
    // console.log(counties);
    // console.log(page);
  };

  const myMap = useRef();

  const showingCounties =
    queryCounty.trim() == ""
      ? counties
      : counties.filter((county) =>
          county.name.toLowerCase().includes(queryCounty.toLowerCase())
        );

  const favCounties = counties.filter((c) => favs[c.ranking - 1]);

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
      attributionControl: false,
    });

    myMap.current = map;

    map
      .addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
          trackUserLocation: true,
        })
      )
      .addControl(new mapboxgl.FullscreenControl())
      .addControl(
        new mapboxgl.AttributionControl({
          customAttribution: "Map design by Thomas Zhang",
        })
      )
      .addControl(new mapboxgl.NavigationControl());

    // Populate markers
    showingCounties.forEach((county) => {
      fetch(`${base_url}stats?county=${county.code}`)
        .then((res) => res.json())
        .then((stats_raw) => {
          const stats = stats_raw.stats;

          new mapboxgl.Marker({
            color: "#E7654B",
          })
            .setLngLat(county.lng_lat)
            .setPopup(
              new mapboxgl.Popup()
                .setHTML(
                  ReactDOMServer.renderToString(
                    <CountyPopup stats={stats} county={county} />
                  )
                )
                .addClassName("map-popup")
            )
            .addTo(map);
        });
    });

    favCounties.forEach((county) => {
      // Create a DOM element for each marker.
      const el = document.createElement("div");
      const width = 80;
      const height = 80;
      el.className = "marker";
      el.style.backgroundImage = `url(https://placekitten.com/g/${width}/${height}/)`;
      el.style.width = `${width}px`;
      el.style.height = `${height}px`;
      el.style.backgroundSize = "100%";

      fetch(`${base_url}stats?county=${county.code}`)
        .then((res) => res.json())
        .then((stats_raw) => {
          const stats = stats_raw.stats;

          new mapboxgl.Marker(el)
            .setLngLat(county.lng_lat)
            .setPopup(
              new mapboxgl.Popup()
                .setHTML(
                  ReactDOMServer.renderToString(
                    <CountyPopup stats={stats} county={county} />
                  )
                )
                .addClassName("map-popup")
            )
            .addTo(map);
        });
    });

    setLoading(false);
  }, [
    showingCounties,
    favCounties,
    router,
    data.factors,
    page,
    stats,
    queryCounty,
  ]);

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
              className={`${styles.sidebar} list-group border-0 rounded-0 min-vh-100 px-4`}
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
        <main className="col px-0">
          {/* toggle sidebar */}
          <a
            href="#"
            data-bs-target="#sidebar"
            data-bs-toggle="collapse"
            className="p-2 text-decoration-none"
            onClick={() => {
              setCounties(counties.map((_) => _));
            }}
          >
            <AdjustButton side={30} collapse={true} />
          </a>

          {/* main */}
          <div className={`${styles.main} row mx-0`}>
            <div className={`${styles.map} col-12`} id="my-map" />
            <div className="col-12 favorite">
              <div className={`${styles.mainTitle}`}>FAVORITE COUNTIES</div>
              <CountyAccordion
                counties={favCounties}
                map={myMap}
                emptyText="Heart some places, and they will show here!"
                actionBtn={(county) => (
                  <RemoveButton
                    county={county}
                    handleClick={(j) => {
                      const newFavs = favs.map((f, i) => (i === j ? false : f));
                      setFavs(newFavs);
                    }}
                  />
                )}
              ></CountyAccordion>
            </div>
            <div className={`${styles.counties} col-12 mb-3`}>
              <div className="d-flex">
                <div className={`${styles.mainTitle} pe-3`}>ALL COUNTIES</div>
                <SearchBar
                  value={queryCounty}
                  placeholder="Filter Counties"
                  handleChange={(event) => {
                    setQueryCounty(event.target.value);
                  }}
                />
              </div>
              {loading ? (
                <Loading />
              ) : (
                <CountyAccordion
                  type={``}
                  counties={showingCounties}
                  map={myMap}
                  emptyText="Loading..."
                  loadMoreBtn={
                    <NextButton handleClick={handleLoadMore}>
                      Load More
                    </NextButton>
                  }
                  actionBtn={(county) => (
                    <LikeButton
                      county={county}
                      handleChange={(j) => {
                        const newFavs = favs.map((f, i) => (i === j ? !f : f));
                        setFavs(newFavs);
                      }}
                      checked={favs[county.ranking - 1]}
                    />
                  )}
                ></CountyAccordion>
              )}
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const queryParams = new URLSearchParams(context.query);
  const initParams = context.query;
  const res_scores = await fetch(
    base_url + "scores?" + queryParams + "&page=1"
  );
  const scores = await res_scores.json();

  if (!scores) {
    return {
      redirect: {
        destination: "/survey",
        permanent: false,
      },
      scoreNotFound: true,
    };
  }

  const res_parameters = await fetch(base_url + "parameters");
  const parameters = await res_parameters.json();

  if (!parameters) {
    return {
      redirect: {
        destination: "/survey",
        permanent: false,
      },
      parametersNotFound: true,
    };
  }

  return {
    props: { scores, initParams, parameters }, // will be passed to the page component as props
  };
}

export default Results;
