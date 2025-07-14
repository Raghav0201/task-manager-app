import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem("token");
    if (tokenFromStorage) {
      navigate("/dashboard");
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const name = params.get("name");
    const email = params.get("email");

    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("name", name);
      localStorage.setItem("email", email);
      navigate("/dashboard");
    } else {
      alert("Token missing. Login failed.");
    }
  }, [navigate]);

  return <p>Logging in with Google, please wait...</p>;
};

export default AuthCallback;
