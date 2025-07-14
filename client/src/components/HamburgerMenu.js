import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/HamburgerMenu.css';

const HamburgerMenu = () => {
  const [active, setActive] = useState(false);

  const toggleMenu = () => {
    setActive(prev => !prev);
    const menu = document.getElementById('menu');
    if (menu) menu.classList.toggle('show');
  };

  return (
    <div className="hamburger-container">
      <svg
        className={`hamburger ${active ? 'active' : ''}`}
        viewBox="0 0 100 100"
        width="40"
        height="40"
        onClick={toggleMenu}
      >
        <path className="line top" d="M 30,33 H 70" />
        <path className="line middle" d="M 30,50 H 70" />
        <path className="line bottom" d="M 30,67 H 70" />
      </svg>

      <nav id="menu" className="menu hidden">
        <ul className="menu-items">
          <li>
            <Link to="/dashboard">
              <i className="fa-solid fa-house"></i> Dashboard
            </Link>
          </li>
          <li>
            <Link to="/Completed">
              <i className="fa-solid fa-circle-check"></i> Completed
            </Link>
          </li>
          <li>
            <Link to="/Yet">
              <i className="fa-solid fa-spinner"></i> Pending
            </Link>
          </li>
          <li>
            <Link to="/prioritize">
              <i className="fa-solid fa-gauge-high"></i> Priority
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default HamburgerMenu;
