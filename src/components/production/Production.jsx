import React, { useState } from "react";
import { FaCalendarDay, FaCalendarAlt, FaEdit } from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./production.scss";

const data = [
  { day: "Mon", production: 1200 },
  { day: "Tue", production: 1350 },
  { day: "Wed", production: 1100 },
  { day: "Thu", production: 1450 },
  { day: "Fri", production: 1600 },
  { day: "Sat", production: 1250 },
  { day: "Sun", production: 1400 },
];

const Production = () => {
  const [dailyProduction, setDailyProduction] = useState(1250);
  const [annualProduction, setAnnualProduction] = useState(450000);
  const [productionDate, setProductionDate] = useState("");

  const [isDailyOpen, setIsDailyOpen] = useState(false);
  const [isAnnualOpen, setIsAnnualOpen] = useState(false);

  const handleDailySubmit = (e) => {
    e.preventDefault();
    console.log("Daily:", dailyProduction, "Date:", productionDate);
    setIsDailyOpen(false);
  };

  const handleAnnualSubmit = (e) => {
    e.preventDefault();
    console.log("Annual:", annualProduction);
    setIsAnnualOpen(false);
  };

  return (
    <div className="production-container">
      <div className="production-stats">
        <div className="production-section daily">
          <div className="heading">
            <FaCalendarDay className="icon" />
            <h3>Daily Production</h3>
            <FaEdit
              className="edit-icon"
              onClick={() => setIsDailyOpen(true)}
            />
          </div>
          <p>{dailyProduction} units</p>
        </div>

        <div className="divider"></div>

        <div className="production-section annual">
          <div className="heading">
            <FaCalendarAlt className="icon" />
            <h3>Annual Production</h3>
            <FaEdit
              className="edit-icon"
              onClick={() => setIsAnnualOpen(true)}
            />
          </div>
          <p>{annualProduction} units</p>
        </div>
      </div>

      <div className="chart-wrapper">
        <h3 className="chart-title">Weekly Production</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <XAxis dataKey="day" stroke="#333" />
              <YAxis stroke="#333" />
              <Tooltip
                wrapperStyle={{ backgroundColor: "#fff", color: "#333" }}
              />
              <Bar
                dataKey="production"
                fill="#fea116"
                barSize={40}
                radius={[5, 5, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Daily Production Modal */}
      {isDailyOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Update Daily Production</h3>
            <form onSubmit={handleDailySubmit}>
              <label>Select Date:</label>
              <input
                type="date"
                value={productionDate}
                onChange={(e) => setProductionDate(e.target.value)}
                required
              />

              <label>Daily Production:</label>
              <input
                type="number"
                value={dailyProduction}
                onChange={(e) => setDailyProduction(Number(e.target.value))}
                required
              />

              <div className="modal-actions">
                <button type="submit" className="submitBtn">
                  Update
                </button>
                <button
                  type="button"
                  className="cancelBtn"
                  onClick={() => setIsDailyOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Annual Production Modal */}
      {isAnnualOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Update Annual Production</h3>
            <form onSubmit={handleAnnualSubmit}>
              <label>Annual Production:</label>
              <input
                type="number"
                value={annualProduction}
                onChange={(e) => setAnnualProduction(Number(e.target.value))}
                required
              />

              <div className="modal-actions">
                <button type="submit" className="submitBtn">
                  Update
                </button>
                <button
                  type="button"
                  className="cancelBtn"
                  onClick={() => setIsAnnualOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Production;
