import React, { useEffect, useState, useContext, useCallback } from "react";
import Head from "next/head";
import LaunchIcon from "@mui/icons-material/Launch";
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
import { useUser } from "@auth0/nextjs-auth0";

import prisma from "../lib/prisma.ts";

// Internal
import Layout from "../components/Layout";
import "mapbox-gl/dist/mapbox-gl.css";
import styles from "../styles/Results.module.scss";
import CountyGrid from "../components/countyGrid";

const baseURL = "https://reroot-data-app.herokuapp.com/";

function Results({ categories, factors, parameters, languages, countries }) {
  console.log("====================================");
  console.log(categories, factors, parameters, languages);
  console.log("====================================");

  const { data, setData } = useContext(AppContext);
  const { user, error, isLoading } = useUser();
  const router = useRouter();
  const [params, setParams] = useState(router.query);
  const [queryCounty, setQueryCounty] = useState("");
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);
  const [counties, setCounties] = useState([]);

  const parametersLookup = Object.fromEntries(
    parameters.map((p) => [p.name, p])
  );

  const getParameter = (item, type = "p") => {
    switch (type) {
      case "p":
        return parametersLookup[item];
      case "f":
        return parameters.find((p) => p.factorId === item.id);
      case "l":
        const y = parameters.find((p) => p.id === item.parameterId);
        // console.log("item: ", item);
        // console.log("find: ", y);
        return y;
      case "c":
        const x = parameters.find((p) => p.id === item.parameterId);
        // console.log("item: ", item);
        // console.log("find: ", x);
        return x;
      default:
        return null;
    }
  };
  const getCategory = (parameter) => {
    const factor = factors.find((f) => f.id === parameter.factorId);
    return categories.find((c) => c.id === factor.categoryId).id;
  };

  // Handle Favorited Counties
  const [favCounties, setFavCounties] = useState({});

  setData(
    Object.assign(data, {
      parameters: parameters,
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

  const getParamText = (param) => {
    if (param.languageId) {
      return languages.find((l) => l.id == param.languageId).text;
    } else if (param.countryId) {
      return countries.find((c) => c.id == param.countryId).text;
    } else {
      return factors.find((f) => f.id == param.factorId).text;
    }
  };

  // Handle direct GET requests
  useEffect(() => {
    getScores(router.query);
    return () => {
      setCounties([]);
    };
  }, [router.query, getScores]);

  useEffect(() => {
    if (window) {
      const newFavCountiesArray = JSON.parse(localStorage.getItem("favorites"));
      const newFavCounties = Object.fromEntries(
        newFavCountiesArray.map((c) => [c.index, c])
      );
      setFavCounties(newFavCounties);
      console.log("from local storage:");
      console.log(newFavCounties);
    }
  }, []);

  const updateScores = async (newParam, newValue) => {
    // TODO Make sure update scores remove value
    // Country name remove mismatch

    const newParams = { ...params };
    if (newValue == 0) {
      console.log("deleting", newParam);
      delete newParams[newParam];
    } else {
      newParams[newParam] = newValue;
    }

    // console.log("====================================");
    // console.log(newParam);
    // console.log(newValue);
    // console.log(newParams);
    // console.log("====================================");

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
        zoom: 10,
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
                selectedParams={params}
                updateScores={updateScores}
                categories={categories}
                factors={factors}
                parameters={parameters}
                countries={countries}
                languages={languages}
                getParameter={getParameter}
                getCategory={getCategory}
                getParamText={getParamText}
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
                {Object.values(favCounties).length > 0 && (
                  <Link href="/favorite" passHref>
                    <IconButton aria-label="launch">
                      <LaunchIcon />
                    </IconButton>
                  </Link>
                )}
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
                        console.log("local storage on remove");
                        console.log(Object.values(newFavCounties));
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
                  getParameter={getParameter}
                  getParamText={getParamText}
                  factors={factors}
                  parameters={parameters}
                  countries={countries}
                  languages={languages}
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

                        // TODO implement fav with user

                        if (window) {
                          localStorage.setItem(
                            "favorites",
                            JSON.stringify(Object.values(newFavCounties))
                          );

                          console.log("local storage on Like");
                          console.log(Object.values(newFavCounties));
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
  const categories = await prisma.category.findMany();
  const factors = await prisma.factor.findMany();
  const parameters = await prisma.parameter.findMany();
  const languages = await prisma.language.findMany();
  const countries = await prisma.country.findMany();

  return {
    props: {
      categories,
      factors,
      parameters,
      languages,
      countries,
    }, // will be passed to the page component as props
  };
}

export default Results;
