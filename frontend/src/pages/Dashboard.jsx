import React, { useEffect, useState } from "react";
import { Button, Container, Alert } from "react-bootstrap";
import axios from "axios";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/v1/users/me", { withCredentials: true });
        setUser(res.data.user);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load user data");
        window.location.href = "/login"; // redirect if unauthorized
      }
    };
    fetchUser();
  }, []);

  const logout = async () => {
    try {
      await axios.post("/api/v1/users/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error(err);
    } finally {
      window.location.href = "/login";
    }
  };

  return (
    <Container className="mt-5">
      <h3>Dashboard</h3>
      {error && <Alert variant="danger">{error}</Alert>}
      {user ? (
        <pre>{JSON.stringify(user, null, 2)}</pre>
      ) : (
        <p>Loading user data...</p>
      )}
      <Button variant="secondary" onClick={logout}>
        Logout
      </Button>
    </Container>
  );
}
