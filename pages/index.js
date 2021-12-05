import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Landing.module.scss";
import Layout, { siteTitle } from "../components/Layout";
import StartButton from "../components/startButton";
import Card from "../components/Card";

export default function Landing() {
  return (
    <Layout landing>
      <div className="container">
        <Head>
          <title>{siteTitle}</title>
        </Head>

        <section className={`${styles.cover}`}>
          <div className={`${styles.sec1Text}`}>
            <div className={styles.sec1Title}>reRoot</div>
            <div className={styles.sec1Subtitle}>Find your home</div>
          </div>
          <div className={`${styles.sec1Button} text-center pb-5`}>
            <StartButton to="/prep">Start Survey</StartButton>
          </div>
        </section>

        <section className={`${styles.sec2Cover}`}>
          <div className="row">
            <div className="col-8">
              <div className={`${styles.sec2Title} row`}>
                <p>Where you choose to live is an important decision.</p>
              </div>
              <div className={`${styles.sec2Subtitle} row`}>
                <p>
                  We want to make sure families are finding communities that are
                  <span className={styles.sec2Special}> welcoming</span> and
                  <span className={styles.sec2Special}> prosperous</span>.
                </p>
              </div>
            </div>
            <div className={`${styles.sec2Image} col-4`}>
              <Image
                priority
                src="/img/landing_person.png"
                alt="person"
                layout="responsive"
                height={750}
                width={450}
              />
            </div>
          </div>

          <div
            className={`${styles.sec2Banner} row text-center align-items-center`}
          >
            <div className="col-3">
              <Image
                src="/img/org_census.png"
                alt="census"
                layout="responsive"
                height={100}
                width={300}
              />
            </div>
            <div className="col-6">
              <Image
                src="/img/org_top.png"
                alt="census"
                layout="responsive"
                height={100}
                width={570}
              />
            </div>
            <div className="col-3">
              <Image
                src="/img/org_harvard.png"
                alt="census"
                layout="fixed"
                height={100}
                width={100}
              />
            </div>
          </div>
        </section>

        <section className={styles.sec3Cover}>
          <div className={`${styles.sec3Title} my-5`}>Fast, simple, free</div>
          <div className="row my-3">
            <div className="col-4">
              <Card src="/img/landing_step1.png">
                Take a 3-minute survey
                <br />
                Select what matters to you
              </Card>
            </div>
            <div className="col-4">
              <Card src="/img/landing_step2.png">
                We’ll use data and math to find places that matches your
                preferences.
              </Card>
            </div>
            <div className="col-4">
              <Card src="/img/landing_step3.png">You get your results.</Card>
            </div>
          </div>
        </section>
        <section className={styles.secAction}>
          <div className={`${styles.actionSpecial} mt-5`}>
            Make the right move!
          </div>
          <div className="my-5 text-center">
            <StartButton to="/prep">Start Survey</StartButton>
          </div>
        </section>
      </div>
    </Layout>
  );
}
