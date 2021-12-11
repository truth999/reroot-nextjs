import Image from "next/image";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
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

  const additionals = ["slidesGo", "Flaticon", "Freepik"];

  return (
    <footer className={`${styles.footer}`}>
      <nav className="navbar navbar-expand-lg">
        <Row>
          <Col xs={12} sm={6} md={2}>
            <div className={styles.footerTitle}>Created by ...</div>
            <div className={styles.footerContent}>
              <ul>
                {contributors.map((contributor, i) => (
                  <li key={i}>{contributor}</li>
                ))}
              </ul>
            </div>
          </Col>
          <Col xs={12} sm={6} md={2}>
            <div className={styles.footerTitle}>Special thanks to...</div>
            <div className={styles.footerContent}>
              <ul>
                {advisors.map((advisor, i) => (
                  <li key={i}>{advisor}</li>
                ))}
              </ul>
            </div>
          </Col>
          <Col xs={12} sm={6} md={3}>
            <div className={styles.footerTitle}>Additional credits to...</div>
            <div className={styles.footerContent}>
              <ul>
                {additionals.map((additional, i) => (
                  <li key={i}>{additional}</li>
                ))}
              </ul>
            </div>
          </Col>
          <Col xs={12} sm={6} md={{ span: 3, offset: 2 }}>
            <div className={styles.footerTitle}>Contact Us</div>
            <div className={styles.footerContent}>
              <p>
                reRoot is a free, open-source project created by the people for
                the people. Please send any feedback, suggestions, or inquiries
                to:
              </p>
              <p>inquiries@reroot.com</p>
            </div>
          </Col>
        </Row>
      </nav>
    </footer>
  );
}
