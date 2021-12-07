import React, { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import styles from "./Header.module.scss";

import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";

const Header = () => {
  const settings = ["Profile", "Logout"];
  const pages = ["Survey", "Results", "Favorite"];
  const [loggedIn, setLoggedIn] = useState(false);

  const router = useRouter();
  return (
    <header className={`${styles.header}`}>
      <Navbar collapseOnSelect expand="lg" bg="transparent">
        <Container>
          <Navbar.Brand>
            {["/survey"].includes(router.pathname) && (
              <Image
                className="back"
                alt="back button"
                src="/img/back.png"
                layout="fixed"
                width={44}
                height={44}
                onClick={() => router.back()}
              />
            )}
            {["/", "/results", "/favorite"].includes(router.pathname) && (
              <Link href="/">
                <a className={styles.logo}>reRoot</a>
              </Link>
            )}
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto"></Nav>
            <Nav>
              {["/results"].includes(router.pathname) && (
                <Nav.Link>
                  <Link href="/favorite">
                    <a className={`${styles.link}`}>FAVORITE</a>
                  </Link>
                </Nav.Link>
              )}
              {["/favorite"].includes(router.pathname) && (
                <Nav.Link>
                  <Link href="/results">
                    <a className={`${styles.link}`}>RESULTS</a>
                  </Link>
                </Nav.Link>
              )}
              {loggedIn ? (
                <NavDropdown
                  title="User"
                  id="collasible-nav-dropdown"
                  className={`${styles.link}`}
                >
                  <NavDropdown.Item>Profile</NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Nav.Link>
                  <a className={`${styles.link}`}>REGISTER / SIGN IN</a>
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};
export default Header;
