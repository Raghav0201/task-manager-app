import React from 'react';
import { FaGoogle } from "react-icons/fa";
import { FaFilePen } from "react-icons/fa6";
import '../styles/Login.css';

const Login = () => {
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/api/auth/google/login';
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <h1>
          <FaFilePen style={{ marginRight: '0.5em' }} />
          Task Manager
        </h1>
        <p>Login to manage your tasks smartly.</p>

        <button className="google-btn" onClick={handleGoogleLogin}>
          <FaGoogle style={{ marginRight: '0.5em' }} />
          Login with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
