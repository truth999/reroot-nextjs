import styles from "./Layout.module.scss";

import Head from "next/head";
import Image from "next/image";

const contributors = [
  "Mier Chen",
  "Lily Huang",
  "Karma Tarap",
  "Pranay Varada",
  "Yujie Wang",
  "Thomas Zhang",
];

const advisors = [
  "Sabelo Mhlambi",
  "Jack Cushman",
  "Lins Derry",
  "Lucas Chu",
  "Matthew Battles",
  "Alice Cai",
];

const logos = ["logo-census.png", "logo-harvard.png", "logo-top.png"];

export const siteTitle = "ReRoot";

export default function Layout({ children, survey }) {
  return (
    <div className="container">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="ReRoot" />
        <meta
          property="og:image"
          content={`https://og-image.vercel.app/${encodeURI(
            siteTitle
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <header className="header"></header>

      <main>{children}</main>

      {!survey && (
        <footer className={styles.footer}>
          <nav className="navbar navbar-expand-lg navbar-light">
            <div className="footer-section col-md-3 col-sm-6 col-xs-12">
              <div className={styles.footerTitle}>Created by ...</div>
              <div className={styles.footerContent}>
                <ul>
                  {contributors.map((contributor, i) => (
                    <li key={i}>{contributor}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="footer-section col-md-3 col-sm-6 col-xs-12">
              <div className={styles.footerTitle}>Special thanks to...</div>
              <div className={styles.footerContent}>
                <ul>
                  {advisors.map((advisor, i) => (
                    <li key={i}>{advisor}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="footer-section col-md-4 col-sm-6 col-xs-12">
              <div className={styles.footerTitle}>In collaboration with...</div>
              <div className={styles.footerContent}>
                {logos.map((logo, i) => (
                  <Image
                    key={i}
                    src={"/img/" + logo}
                    alt={logo}
                    layout="intrinsic"
                    width={150}
                    height={50}
                  />
                ))}
              </div>
            </div>
            <div className="footer-section col-md-2 col-sm-6 col-xs-12">
              <div className={styles.footerTitle}>Contact Us</div>
              <div className={styles.footerContent}>inquiries@reroot.com</div>
            </div>
          </nav>
        </footer>
      )}
    </div>
  );
}
