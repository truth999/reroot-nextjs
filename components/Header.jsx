import React, { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import styles from "./Header.module.scss";
import Avatar from "@mui/material/Avatar";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { useUser } from "@auth0/nextjs-auth0";

const Header = () => {
  const { user, error, isLoading } = useUser();
  const settings = ["profile", "logout"];
  const pages = ["Survey", "Results", "Favorite"];
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const router = useRouter();
  return (
    <header className={`${styles.header}`}>
      <Navbar collapseOnSelect expand="lg" bg="transparent">
        <Container>
          <Navbar.Brand>
            {["/prep", "/survey"].includes(router.pathname) && (
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
            {!["/prep", "/survey"].includes(router.pathname) && (
              <Link href="/">
                <a className={styles.logo}>reRoot</a>
              </Link>
            )}
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto"></Nav>
            <Nav>
              {["/results", "/profile"].includes(router.pathname) && (
                <Nav.Link>
                  <Link href="/favorite">
                    <a className={`${styles.link}`}>FAVORITE</a>
                  </Link>
                </Nav.Link>
              )}
              {["/favorite", "/profile"].includes(router.pathname) && (
                <Nav.Link>
                  <Link href="/results">
                    <a className={`${styles.link}`}>RESULTS</a>
                  </Link>
                </Nav.Link>
              )}
              {user ? (
                <Box sx={{ flexGrow: 0 }}>
                  <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar alt={`${user.name}`} src={`${user.picture}`} />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: "45px" }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    <MenuItem key={"profile"} onClick={handleCloseNavMenu}>
                      <Typography textAlign="center">
                        <Link href="/profile">
                          <a>Profile</a>
                        </Link>
                      </Typography>
                    </MenuItem>
                    <MenuItem key={"logout"} onClick={handleCloseNavMenu}>
                      <Typography textAlign="center">
                        <Link href="/api/auth/logout">
                          <a>Logout</a>
                        </Link>
                      </Typography>
                    </MenuItem>
                  </Menu>
                </Box>
              ) : (
                <Link href="/api/auth/login">
                  <a className={`${styles.link}`}>REGISTER / LOGIN</a>
                </Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};
export default Header;
