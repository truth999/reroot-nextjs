import React, {
  useRef,
  useEffect,
  useState,
  useContext,
  useCallback,
} from "react";
import Head from "next/head";
import AppContext from "../contexts/AppContext";

import AdjustButton from "../components/adjustButton";
import NextButton from "../components/nextButton";
import RemoveButton from "../components/removeButton";
import Preference from "../components/preference";
import SearchBar from "../components/searchBar";
import Loading from "../components/loading";
import CountyAccordion from "../components/countyAccordion";
import ReactMapGL, { FlyToInterpolator } from "react-map-gl";
import Map from "../components/map";

// Third Party
// import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

// Internal
import Layout from "../components/Layout";
import "mapbox-gl/dist/mapbox-gl.css";
import styles from "../styles/Favorite.module.scss";

const base_url = "https://reroot-data-app.herokuapp.com/";

export default function Favorite({ factorsData }) {
  const { data, setData, favorites, setFavorites } = useContext(AppContext);

  const newFactors =
    data.factors.length === 0 ? factorsData.factors : data.factors;
  setData(
    Object.assign(data, {
      factors: newFactors,
    })
  );

  const [queryCounty, setQueryCounty] = useState("");
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({});

  const [counties, setCounties] = useState(favorites);

  const updateScores = async (newParam, newValue) => {
    console.log(`Setting ${newParam} to ${newValue}`);
    const newParams = { ...params };
    if (newValue == 0) {
      delete newParams[newParam];
    } else {
      newParams[newParam] = newValue;
    }

    setParams(newParams);

    console.log("Updating ");
    console.log(params);

    setLoading(true);
    const query = new URLSearchParams(newParams);
    const req = await fetch(`${base_url}scores?${query}&page=1`);
    const newScores = await req.json();
    setLoading(false);
    setCounties(newScores.scores);
    setPage(2);
    // console.log("updateScores called");
    console.log(newScores.scores);
    // console.log(page);
  };

  const handleLoadMore = async () => {
    // setLoading(true);
    const query = new URLSearchParams(params);
    const req = await fetch(`${base_url}scores?${query}&page=${page}`);
    const newScores = await req.json();
    // setLoading(false);
    const newCounties = newScores.scores;

    // Update states
    setCounties([...counties, ...newCounties]);
    setPage(page + 1);

    // console.log("handleLoadMore called");
    // console.log(counties);
    // console.log(page);
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
            className={`${styles.toggleSidebar}`}
            onClick={() => {
              setCounties(counties.map((_) => _));
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
                favs={[]}
              />
            </div>

            <div className={`${styles.counties} col-12 mb-3`}>
              <div className="d-flex">
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
  const res = await fetch(`https://reroot-data-app.herokuapp.com/factors`);
  const factorsData = await res.json();

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
    props: { factorsData }, // will be passed to the page component as props
  };
}
