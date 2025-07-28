// src/pages/Login.js

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
        {/* Animation on the Left */}
        <div className="login-left">
          <div className="typewriter">
            <div className="slide"><i></i></div>
            <div className="paper"></div>
            <div className="keyboard"></div>
          </div>
        </div>

        {/* Login Content on the Right */}
        <div className="login-right">
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
    </div>
  );
};

export default Login;
