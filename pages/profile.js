import React from "react";
import { useUser } from "@auth0/nextjs-auth0";
import Layout from "../components/Layout";
import Container from "react-bootstrap/Container";

export default function Profile() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    user && (
      <Layout>
        <Container>
          <img src={user.picture} alt={user.name} />
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </Container>
      </Layout>
    )
  );
}
