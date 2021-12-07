import Image from "next/image";
import styles from "./footer.module.scss";

export default function Footer() {
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

  const logos = [
    { name: "logo-census.png", w: 127, h: 41 },
    { name: "logo-harvard.png", w: 162, h: 41 },
    { name: "logo-top.png", w: 214, h: 44 },
  ];

  return (
    <footer className={`${styles.footer}`}>
      <nav className="navbar navbar-expand-lg">
        <div className="row">
          <div className="col-md-3 col-sm-6 col-xs-12">
            <div className={styles.footerTitle}>Created by ...</div>
            <div className={styles.footerContent}>
              <ul>
                {contributors.map((contributor, i) => (
                  <li key={i}>{contributor}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="col-md-3 col-sm-6 col-xs-12">
            <div className={styles.footerTitle}>Special thanks to...</div>
            <div className={styles.footerContent}>
              <ul>
                {advisors.map((advisor, i) => (
                  <li key={i}>{advisor}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="col-md-4 col-sm-6 col-xs-12">
            <div className={styles.footerTitle}>In collaboration with...</div>
            <div className={styles.footerContent}>
              {logos.map((logo, i) => {
                return (
                  <Image
                    key={i}
                    src={"/img/" + logo.name}
                    alt={logo.name}
                    layout="intrinsic"
                    width={logo.w}
                    height={logo.h}
                  />
                );
              })}
            </div>
          </div>
          <div className="col-md-2 col-sm-6 col-xs-12">
            <div className={styles.footerTitle}>Contact Us</div>
            <div className={styles.footerContent}>inquiries@reroot.com</div>
          </div>
        </div>
      </nav>
    </footer>
  );
}
