import React, {
  useRef,
  useEffect,
  useState,
  useContext,
  useCallback,
} from "react";
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
import ReactMapGL, {
  AttributionControl,
  FullscreenControl,
  GeolocateControl,
  NavigationControl,
  FlyToInterpolator,
} from "react-map-gl";
import Favorite from "@mui/icons-material/Favorite";
import CloseButton from "react-bootstrap/CloseButton";
import Map from "../components/map";

// Third Party
// import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

// Internal
import Layout from "../components/Layout";
import "mapbox-gl/dist/mapbox-gl.css";
import styles from "../styles/Results.module.scss";

// mapboxgl.accessToken =
//   "pk.eyJ1IjoiemhqMDkyNCIsImEiOiJja3ZnangxdXljMXBlMnBtYTF0c29oN2N3In0.HsgAF-xISYEHuqdLlpJL2A";
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
  // const [favCounties, setFavCounties] = useState([]);
  const [params, setParams] = useState(initParams);
  const [loading, setLoading] = useState(false);

  const initCounties = scores.scores;

  const [counties, setCounties] = useState(initCounties);
  const [favs, setFavs] = useState(counties.map((_) => false));

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
  const mapContainer = useRef(null);
  const map = useRef(null);

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

  const favCounties = counties.filter((c) => favs[c.ranking - 1]);

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
            <div className={`${styles.map} col-12`} ref={mapContainer}>
              <Map
                counties={showingCounties}
                onViewportChange={setViewport}
                viewport={viewport}
                favs={favs}
              />
            </div>

            <div className="col-12 favorite">
              <div className={`${styles.mainTitle}`}>FAVORITE COUNTIES</div>
              <CountyAccordion
                counties={favCounties}
                emptyText="Heart some places, and they will show here!"
                onSelectCounty={onSelectCounty}
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
                  onSelectCounty={onSelectCounty}
                  counties={showingCounties}
                  map={map}
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
        destination: "/",
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
        destination: "/",
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
