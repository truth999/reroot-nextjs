import React from "react";
import { useUser } from "@auth0/nextjs-auth0";
import Layout from "../components/Layout";
import Container from "react-bootstrap/Container";
import styles from "../styles/profile.module.scss";
import Link from "next/link";
import Image from "next/image";
import Row from "react-bootstrap/Row";
import { useRouter } from "next/router";

export default function Profile(props) {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    (user && (
      <Layout>
        <Container bsPrefix={`container ${styles.container} `}>
          <Row>
            <Image
              width={100}
              height={100}
              layout="fixed"
              src={user.picture}
              alt={user.name}
            />
          </Row>
          <Row bsPrefix="py-2">
            <h2>{user.name}</h2>
          </Row>
          <p>{user.email}</p>
          <Row></Row>
          <Row>
            <Link href="/favorite">
              <a>View favorite counties</a>
            </Link>
          </Row>
        </Container>
      </Layout>
    )) || <p>Please log in to see your profile.</p>
  );
}
