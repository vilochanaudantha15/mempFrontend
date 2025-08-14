import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AiOutlineFund } from "react-icons/ai"; // New Icon for Revenue
import "./weeklyincome.scss";

const WeeklyRevenue = (props) => {
  const [weeklyRevenue, setWeeklyRevenue] = useState({
   
  });


  useEffect(() => {
    const fetchWeeklyRevenueData = async () => {
      try {
        const response = await axios.get("");
        console.log("Weekly Revenue API Response:", response.data);

       

        setWeeklyRevenue(parsedData);
      } catch (error) {
        console.error("Error fetching weekly revenue data:", error);
      }
    };

    fetchWeeklyRevenueData();
  }, []);

  return (
    <div className="chartBox">
      <div className="boxInfo">
        <div className="title">
          <AiOutlineFund size={24} color="#2196F3" />
          {/* Green Dollar Icon */}
          <span>Weekly Revenue</span>
        </div>

        <h1>10,000,000</h1>
        <Link to="/"><span className="viewbtn">View all</span></Link>
      </div>
      <div className="chartInfo">
        <div className="chart"></div>
        <div className="texts">z
          <span className="duration">Last 7 Days</span>
        </div>
      </div>
    </div>
  );
};

export default WeeklyRevenue;
