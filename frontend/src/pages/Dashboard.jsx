import React, { useEffect, useState } from "react";
import { Button, Container, Alert } from "react-bootstrap";
import axios from "axios";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const fetchData = async () => {
      try {
        const res = await axios.get("/api/protected", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load protected data"
        );
      }
    };

    fetchData();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <Container className="mt-5">
      <h3>Dashboard</h3>
      {error && <Alert variant="danger">{error}</Alert>}
      {data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p>Loading protected data...</p>
      )}
      <Button variant="secondary" onClick={logout}>
        Logout
      </Button>
    </Container>
  );
}
