import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import styles from "../styles/Landing.module.scss";
import Layout, { siteTitle } from "../components/Layout";
import StartButton from "../components/StartButton";

export default function Landing() {
  return (
    <Layout landing>
      <div className="container">
        <Head>
          <title>{siteTitle}</title>
        </Head>

        <section className={styles.cover}>
          <div className={styles.bgWrap}>
            <Image
              className={styles.bgImage}
              src="/img/landing_cover.png"
              alt="cover image"
              height={300}
              width={300}
            />
          </div>
          <div className={styles.bgText}>
            <h1>reRoot</h1>
            <p>Find your home</p>
          </div>
          <div className={styles.btnTop}>
            <StartButton></StartButton>
          </div>
        </section>

        <section className={`${styles.cover2} row`}>
          <div className="col-8">
            <div className={`${styles.title2} row`}>
              <p>Where you choose to live is an important decision.</p>
            </div>
            <div className={`${styles.subtitle2} row`}>
              <p>
                We want to make sure families are finding communities that are
                <span className={styles.special2}> welcoming</span> and
                <span className={styles.special2}> prosperous</span>.
              </p>
            </div>
          </div>
          <div className="col-4">
            <Image
              src="/img/landing_person.png"
              alt="person"
              height={750}
              width={450}
            />
          </div>
        </section>

        <section className={styles.cover3}>
          <h1>Fast, simple, free</h1>
          <p>1 Answer 30-second questionnaire. Tell us what matters to you.</p>
          <p>
            2 We’ll use data and math to find places that matches your
            preferences.
          </p>
          <p>3 You get your results.</p>
        </section>
        <section className={styles.action}>
          <h1>Make the right move!</h1>
          <StartButton></StartButton>
          <Image
            src="/img/left_arrow.png"
            alt="left arrow"
            width={30}
            height={30}
          />
        </section>
      </div>
    </Layout>
  );
}
