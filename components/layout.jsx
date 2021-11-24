// import styles from "./layout.module.scss";
import utilStyles from "../styles/utils.module.scss";

import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

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
    <div className=".container">
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

      <header className=".header"></header>

      <main>{children}</main>

      {!survey && (
        <footer className=".footer">
          <nav className="navbar navbar-expand-lg navbar-light">
            <div className="col-1"></div>
            <div className="col-2">
              <div className="footer-title">Created by ...</div>
              <div className="footer-content">
                <ul>
                  {contributors.map((contributor, i) => (
                    <li key={i}>{contributor}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="col-2">
              <div className="footer-title">Special thanks to...</div>
              <div className="footer-content">
                <ul>
                  {advisors.map((advisor, i) => (
                    <li key={i}>{advisor}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="col-3">
              <div className="footer-title">In collaboration with...</div>
              <div className="footer-content">
                {logos.map((logo, i) => (
                  <Image
                    priority
                    key={i}
                    src={"/img/" + logo}
                    className="{utilStyles.borderCircle}"
                    height={50}
                    width={100}
                    alt={logo}
                  />
                ))}
              </div>
            </div>
            <div className="col-2">
              <div className="footer-title">Contact Us</div>
              <div className="footer-content">inquiries@reroot.com</div>
            </div>
            <div className="col-1"></div>
          </nav>
        </footer>
      )}
    </div>
  );
}
