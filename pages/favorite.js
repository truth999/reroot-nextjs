import React, { useEffect, useState, useContext, useCallback } from "react";
import Head from "next/head";
import ReactDOMServer from "react-dom/server";
import AppContext from "../contexts/AppContext";
import { useRouter } from "next/router";
import fetch from "unfetch";
import AdjustButton from "../components/adjustButton";
import NextButton from "../components/nextButton";
import LikeButton from "../components/likeButton";
import RemoveButton from "../components/removeButton";
import Preference from "../components/preference";
import SearchBar from "../components/searchBar";
import Loading from "../components/loading";
import CountyAccordion from "../components/countyAccordion";
import ReactMapGL, { FlyToInterpolator } from "react-map-gl";
import Link from "next/link";
import prisma from "../lib/prisma.ts";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Map from "../components/map";
import { useUser } from "@auth0/nextjs-auth0";
import useSWR from "swr";
// Third Party
// import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

// Internal
import Layout from "../components/Layout";
import "mapbox-gl/dist/mapbox-gl.css";
import styles from "../styles/Results.module.scss";

const baseURL = "https://reroot-data-app.herokuapp.com/";

function Favorite({ categories, factors, parameters, languages, countries }) {
  const { data, setData } = useContext(AppContext);
  const router = useRouter();
  const [params, setParams] = useState({});
  const [queryCounty, setQueryCounty] = useState("");
  const [loading, setLoading] = useState(false);
  const [counties, setCounties] = useState([]);
  const { user, error, isLoading } = useUser();

  setData(
    Object.assign(data, {
      parameters: parameters,
    })
  );

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
  const getParamText = (param) => {
    if (param.languageId) {
      return languages.find((l) => l.id == param.languageId).text;
    } else if (param.countryId) {
      return countries.find((c) => c.id == param.countryId).text;
    } else {
      return factors.find((f) => f.id == param.factorId).text;
    }
  };
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
          counties.some((county) => county.code === c.code)
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
  const delFav = async (county) => {
    try {
      console.log("===del fav===", county);
      await fetch("/api/del-fav", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, county }),
      });
    } catch (error) {
      console.error(error);
    }
  };

  // Load favorites
  useEffect(() => {
    if (user) {
      const loadFavsFromDB = async () => {
        try {
          console.log("===get favs===");
          const res = await fetch("/api/get-favs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user }),
          });
          const userData = await res.json();
          const favs = userData.favorites;
          setCounties(
            favs.map((c) => {
              c.lng_lat = [c.longitude, c.latitude];
              c.ranks = [];
              c.breakdown = [];
              return c;
            })
          );
        } catch (error) {
          console.error(error);
        }
      };

      loadFavsFromDB();
    } else {
      if (window) {
        const favsRaw = localStorage.getItem("favorites");
        const favs = JSON.parse(favsRaw);
        setCounties(favs);
      }
    }

    return () => {
      setCounties([]);
    };
  }, [user]);

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
                  {counties.length === 0 && (
                    <Link href="/results" passHref>
                      <ArrowBackIcon className="ms-2 mb-1" />
                    </Link>
                  )}
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
                  emptyText="Heart some places, and they will show here!"
                  actionBtn={(county) => (
                    <RemoveButton
                      county={county}
                      handleClick={(county) => {
                        const newCounties = counties.filter(
                          (c) => c.code != county.code
                        );
                        // Update for logged in
                        user && delFav(county);
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

export default Favorite;
