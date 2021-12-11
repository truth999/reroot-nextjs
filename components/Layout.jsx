import styles from "./Layout.module.scss";

import Head from "next/head";
import Image from "next/image";
import Footer from "./footer";

import Header from "./Header";
export const siteTitle = "reRoot";

export default function Layout({ children, survey, landing }) {
  return (
    <section>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="reRoot" />
        <meta
          property="og:image"
          content={`https://og-image.vercel.app/${encodeURI(
            siteTitle
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      {!landing && <Header></Header>}

      <div className="container-fluid">{children}</div>

      {!survey && <Footer></Footer>}
    </section>
  );
}
