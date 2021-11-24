import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Landing.module.scss";
import Layout, { siteTitle } from "../components/layout";

export default function Landing() {
  return (
    <Layout landing>
      <div className={styles.container}>
        <Head>
          <title>{siteTitle}</title>
        </Head>

        <main className={styles.main}>
          <section>
            <h1 className={styles.title}>reROOT</h1>
            <p className={styles.description}>finding home</p>
            <Link href="/survey">
              <button>Start</button>
            </Link>
          </section>

          <section>
            <p>
              Where you choose to live is an important decision. We want to make
              sure families are finding communities that are welcoming and
              prosperous.
            </p>
          </section>

          <section>
            <h1>Fast, simple, free</h1>
            <p>
              1 Answer 30-second questionnaire. Tell us what matters to you.
            </p>
            <p>
              2 We’ll use data and math to find places that matches your
              preferences.
            </p>
            <p>3 You get your results.</p>
          </section>

          <section></section>
        </main>
      </div>
    </Layout>
  );
}
