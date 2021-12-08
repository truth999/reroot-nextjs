import React, { useEffect, useState, useContext, useCallback } from "react";
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
import ReactMapGL, { FlyToInterpolator } from "react-map-gl";
import Link from "next/link";
import Map from "../components/map";

// Third Party
// import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

// Internal
import Layout from "../components/Layout";
import "mapbox-gl/dist/mapbox-gl.css";
import styles from "../styles/Results.module.scss";

const baseURL = "https://reroot-data-app.herokuapp.com/";

function Favorite({ parameters, factorsData }) {
  const { data, setData } = useContext(AppContext);
  const router = useRouter();
  const [params, setParams] = useState({});
  const [queryCounty, setQueryCounty] = useState("");
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);
  const [counties, setCounties] = useState([]);

  const newFactors =
    data.factors.length === 0 ? factorsData.factors : data.factors;

  setData(
    Object.assign(data, {
      parameters: parameters,
      factors: newFactors,
    })
  );

  const getScores = useCallback(
    async (newParams) => {
      if (Object.keys(newParams).length === 0) {
        alert("Please select at least one factors.");
        return;
      }

      const queryParams = new URLSearchParams(newParams);
      try {
        setLoading(true);
        const resScores = await fetch(baseURL + "scores?" + queryParams);
        const scoresData = await resScores.json();

        const newCounties = scoresData.scores.filter((c) =>
          counties.some((county) => county.index === c.index)
        );

        setCounties(newCounties);
        setParams(newParams);
        setLoading(false);
      } catch (err) {
        alert("Invalid parameters. Please try again.");
        setLoading(false);
        router.push({ pathname: "/favorite" });
      }
    },
    [router, counties]
  );

  // Handle direct GET requests
  useEffect(() => {
    if (window) {
      const favsRaw = localStorage.getItem("favorites");
      const favs = JSON.parse(favsRaw);
      setCounties(favs);
    }
    return () => {
      setCounties([]);
    };
  }, []);

  const updateScores = async (newParam, newValue) => {
    const newParams = { ...params };
    if (newValue == 0) {
      delete newParams[newParam];
    } else {
      newParams[newParam] = newValue;
    }

    getScores(newParams);
  };

  // Map states
  const CENTER_US48 = [-99.0909, 39.8355];
  const [initLng, initLat] = CENTER_US48;
  const [viewport, setViewport] = useState({
    longitude: initLng,
    latitude: initLat,
    zoom: 3,
    bearing: 0,
    pitch: 45,
  });

  const onSelectCounty = useCallback(
    (county) => {
      const [longitude, latitude] = county.lng_lat;
      setViewport({
        ...viewport,
        longitude,
        latitude,
        zoom: 11,
        transitionInterpolator: new FlyToInterpolator({ speed: 1.2 }),
        transitionDuration: "auto",
      });
    },
    [viewport]
  );

  const showingCounties =
    queryCounty.trim() == ""
      ? counties
      : counties.filter((county) =>
          county.name.toLowerCase().includes(queryCounty.toLowerCase())
        );

  return (
    <Layout results>
      <Head>
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v2.6.0/mapbox-gl.css"
          rel="stylesheet"
        />
        <title>Favorite</title>
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
                selectedParams={params}
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
            className={`${styles.toggleSidebar}`}
            onClick={() => {
              setViewport({ ...viewport });
            }}
          >
            <AdjustButton side="30" collapse={true} />
          </a>

          {/* main */}
          <div className={`${styles.main} row mx-0`}>
            <div className={`${styles.map} col-12`}>
              <Map
                counties={[]}
                onViewportChange={setViewport}
                viewport={viewport}
                favs={showingCounties}
              />
            </div>

            <div className={`${styles.counties} col-12 my-3`}>
              <div className="d-flex justify-content-between">
                <div className={`${styles.mainTitle} pe-3`}>
                  FAVORITE COUNTIES
                </div>
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
                  onSelectCounty={onSelectCounty}
                  counties={showingCounties}
                  emptyText="Heart some places, and they will show here!"
                  actionBtn={(county) => (
                    <RemoveButton
                      county={county}
                      handleClick={(county) => {
                        const newCounties = counties.filter(
                          (c) => c.index != county.index
                        );
                        setCounties(newCounties);
                        if (window) {
                          localStorage.setItem(
                            "favorites",
                            JSON.stringify(Object.values(newCounties))
                          );
                        }
                      }}
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

export async function getStaticProps(context) {
  const resParameters = await fetch(baseURL + "parameters");
  const parameters = await resParameters.json();

  if (!parameters) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
      parametersNotFound: true,
    };
  }

  const resFactors = await fetch(
    `https://reroot-data-app.herokuapp.com/factors`
  );
  const factorsData = await resFactors.json();

  if (!factorsData) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
      notFound: true,
    };
  }

  return {
    props: { parameters, factorsData }, // will be passed to the page component as props
  };
}

export default Favorite;
