import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./landing.scss";

import energies1 from "../../assets/memp5.webp";
import energies2 from "../../assets/memp4.webp";
import energies3 from "../../assets/memp3.webp";
import logo from "../../assets/energieslogo1.png"; // Import the logo

const images = [energies1, energies2, energies3];

const HeroSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <div className="hero-section">
      <header className="header">
        <div className="container">
          <div className="logo">
            <img
              src={logo}
              alt="Sri Lanka Energies Logo"
              className="logo-img"
            />{" "}
            {/* Add logo */}
            <span>Sri Lanka Energies</span>
          </div>
          <nav className="nav">
            <Link to="/login" className="nav-button login-button">
              Login
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="hero"
        style={{ backgroundImage: `url(${images[currentImageIndex]})` }}
      >
        <div className="container">
          <h1 className="hero-title">Welcome to Sri Lanka Energies</h1>
          <p className="hero-description">
            Join us in powering a sustainable future with cutting-edge renewable
            energy solutions.
          </p>
          <div className="hero-buttons">
            <Link to="/login">
              <button className="hero-button primary">Get Started</button>
            </Link>
          </div>
          <div className="hero-dashboard">
            <div className="dashboard-card">
              <div className="icon">⚡</div>
              <p className="metric">1.2 kWh</p>
              <p className="label">Daily Generation</p>
            </div>
            <div className="dashboard-card">
              <div className="icon">💰</div>
              <p className="metric">5,000,000</p>
              <p className="label">Weekly Revenue</p>
            </div>
            <div className="dashboard-card">
              <div className="icon">🌍</div>
              <p className="metric">10,000+</p>
              <p className="label">Satisfied Customers</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
