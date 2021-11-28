import Layout, { siteTitle } from "../components/Layout";
import { useState, useContext } from "react";
import AppContext from "../contexts/AppContext";
import StartButton from "../components/StartButton";
import styles from "../styles/Prep.module.scss";

export default function Prep({ parameters }) {

  return (
    <Layout>
      <div className={`${styles.container} container-fluid text-center`}>
        <div className={`row pb-5`}>
          <p className={`${styles.title}`}>3 minutes</p>
          <p className={`${styles.subtitle}`}>to complete</p>
          <p className={`${styles.text}`}>
            Feed your answers to our algorithm, we will find the best cities for
            you based on the data we have.
          </p>
        </div>
        <div className="row pt-5">
          <StartButton to="/survey">Start-&gt;</StartButton>
        </div>
      </div>
    </Layout>
  );
}

