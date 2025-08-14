import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../scss/menu.scss";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userType, setUserType] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString()); // State for time
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserData = sessionStorage.getItem("userData");
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      setUserData(parsedUserData);
      fetchUserType(parsedUserData.email);
    }
  }, []);

  const fetchUserType = async (email) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/users/get-user-type",
        { email }
      );
      setUserType(response.data.userType || "Unknown");
    } catch (error) {
      console.error("Error fetching userType:", error);
      setUserType("Unknown");
    }
  };

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval); // Cleanup to prevent memory leaks
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsOpen(window.innerWidth >= 768);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
     

      <div className="sidebar-time">
        <span className="time">{currentTime}</span>
      </div>

      <div className="sidebar-header">
        <h2>Galigamuwa</h2>
        <span>Meter Manufacturing</span>
      </div>

      <ul className="sidebar-menu">
        <li>
          <a href="#">
            <span className="icon">🏠</span>
            <span className="text">Dashboard</span>
          </a>
        </li>

        <li>
          <a href="/productionsummary">
            <span className="icon">📅</span>
            <span className="text">Production Summary</span>
          </a>
        </li>

        <li>
          <a href="/assemblysummary">
            <span className="icon">📅</span>
            <span className="text">Asssembly Line </span>
          </a>
        </li>

        <li>
          <a href="/defective">
            <span className="icon">📅</span>
            <span className="text"> Defectives Crushing Summary  </span>
          </a>
        </li>

        <li>
          <a href="/calender">
            <span className="icon">📅</span>
            <span className="text">Calendar</span>
          </a>
        </li>

        {userType === "admin" && (
          <li>
            <a href="/profile">
              <span className="icon">👥</span>
              <span className="text">Employees</span>
            </a>
          </li>
        )}

       
      </ul>
    </div>
  );
};

export default Sidebar;
