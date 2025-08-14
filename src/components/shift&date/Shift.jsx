import React from "react";
import { FaCalendarAlt, FaClock } from "react-icons/fa";
import "./shift.scss";

const CurrentDateShift = () => {
  const currentDate = new Date().toLocaleDateString();
  const currentHour = new Date().getHours();

  let shift;
  if (currentHour >= 6 && currentHour < 14) {
    shift = "Morning Shift";
  } else if (currentHour >= 14 && currentHour < 22) {
    shift = "Evening Shift";
  } else {
    shift = "Night Shift";
  }

  return (
    <div className="date-shift-container">
      <div className="date-section">
        <FaCalendarAlt className="icon" />
        <h3>Current Date</h3>
        <p>{currentDate}</p>
      </div>
      <div className="divider"></div>
      <div className="shift-section">
        <FaClock className="icon" />
        <h3>Current Shift</h3>
        <p>{shift}</p>
      </div>
    </div>
  );
};

export default CurrentDateShift;
