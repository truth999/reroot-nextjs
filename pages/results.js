import React, { useEffect, useState, useContext, useCallback } from "react";
import Head from "next/head";
import ReactDOMServer from "react-dom/server";
import AppContext from "../contexts/AppContext";
import { useRouter } from "next/router";
import IconButton from "@mui/material/IconButton";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
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
import CountyGrid from "../components/countyGrid";

const baseURL = "https://reroot-data-app.herokuapp.com/";

function Results({ parameters, factorsData }) {
  const { data, setData } = useContext(AppContext);
  const router = useRouter();
  const [params, setParams] = useState(router.query);
  const [queryCounty, setQueryCounty] = useState("");
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);
  const [counties, setCounties] = useState([]);

  // Handle Favorited Counties
  const [favCounties, setFavCounties] = useState({});

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
        setCounties([]);
        return;
      }

      const queryParams = new URLSearchParams(newParams);
      try {
        setLoading(true);
        const resScores = await fetch(
          baseURL + "scores?" + queryParams + "&page=1"
        );
        const scoresData = await resScores.json();

        setCounties(scoresData.scores);
        setParams(newParams);
        setPage(2);
        setLoading(false);
      } catch (err) {
        alert("Invalid parameters. Please try again.");
        setLoading(false);
        router.push({ pathname: "/results" });
      }
    },
    [router]
  );

  // Handle direct GET requests
  useEffect(() => {
    getScores(router.query);
    return () => {
      setCounties([]);
    };
  }, [router.query, getScores]);

  useEffect(() => {
    if (window) {
      // const favCounties = localStorage.setItem(
      //   "favorites",
      //   JSON.stringify(Object.values(newFavCounties))
      // );
    }
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

  const handleLoadMore = async () => {
    if (page > 6) {
      alert("Too many markers on the map.");
      return;
    }

    const query = new URLSearchParams(params);
    try {
      setLoading(true);
      const req = await fetch(`${baseURL}scores?${query}&page=${page}`);
      const newScores = await req.json();
      setLoading(false);
      const newCounties = newScores.scores;
      setCounties([...counties, ...newCounties]);
      setPage(page + 1);
    } catch (err) {
      alert("Failed to fetch from server. Please try again.");
      setLoading(false);
    }
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
                counties={showingCounties}
                onViewportChange={setViewport}
                viewport={viewport}
                favs={Object.values(favCounties)}
              />
            </div>

            <div className={`${styles.favorite} col-12 mb-4`}>
              <div className={`${styles.mainTitle}`}>
                FAVORITE COUNTIES
                <Link href="/favorite" passHref>
                  <IconButton aria-label="go">
                    <ArrowRightAltIcon />
                  </IconButton>
                </Link>
              </div>
              <CountyGrid
                counties={Object.values(favCounties)}
                emptyText="Heart some places, and they will show here!"
                onSelectCounty={onSelectCounty}
                actionBtn={(county) => (
                  <RemoveButton
                    county={county}
                    handleClick={(county) => {
                      const newFavCounties = { ...favCounties };
                      newFavCounties[county.index].faved = false;
                      delete newFavCounties[county.index];
                      setFavCounties(newFavCounties);
                      if (window) {
                        localStorage.setItem(
                          "favorites",
                          JSON.stringify(Object.values(newFavCounties))
                        );
                      }
                    }}
                  />
                )}
              ></CountyGrid>
            </div>
            <div className={`${styles.counties} col-12 mb-3`}>
              <div className="d-flex justify-content-between">
                <div className={`${styles.mainTitle} pe-3`}>
                  ALL COUNTIES <span>{"(BY SCORE)"}</span>
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
                  emptyText="Adjust preference bars to compare."
                  loadMoreBtn={
                    <NextButton handleClick={handleLoadMore}>
                      Load More
                    </NextButton>
                  }
                  actionBtn={(county) => (
                    <LikeButton
                      county={county}
                      handleChange={(county) => {
                        const newFavCounties = { ...favCounties };
                        if (county.index in newFavCounties) {
                          county.faved = false;
                          delete newFavCounties[county.index];
                        } else {
                          county.faved = true;
                          newFavCounties[county.index] = county;
                        }
                        setFavCounties(newFavCounties);

                        if (window) {
                          localStorage.setItem(
                            "favorites",
                            JSON.stringify(Object.values(newFavCounties))
                          );
                        }
                      }}
                      checked={county.index in favCounties}
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

export default Results;
