import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Breadcrumbs, Typography } from "@mui/material";
import "./defectivecrushed.scss";

const API_BASE_URL = "/api"; // For office server with reverse proxy

const DefectiveCrushed = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    date: "",
    shift: "",
    shiftNumber: "",
    displayShiftNumber: "",
    receivedQuantity: "",
    receivedWeight: "",
    crushedPCWeight: "",
  });

  const [reports, setReports] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [filterDate, setFilterDate] = useState("");
  const [filterShift, setFilterShift] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const shiftOptions = [
    { label: "Morning Shift (12:00 AM - 7:00 AM)", value: "morning", shiftIndex: 1 },
    { label: "Day Shift (7:00 AM - 4:00 PM)", value: "day", shiftIndex: 2 },
    { label: "Night Shift (4:00 PM - 12:00 AM)", value: "night", shiftIndex: 3 },
  ];

  const fetchReports = async () => {
    try {
      const params = {};
      if (filterDate) params.date = filterDate;
      if (filterShift) params.shift = filterShift;

      const response = await axios.get(`${API_BASE_URL}/defectivecrushed/defective-crushed`, { params });
      setReports(response.data);
      setErrorMessage("");
    } catch (error) {
      console.error("Failed to fetch reports:", error);
      setErrorMessage(error.response?.data?.message || "Failed to fetch reports. Please check the server connection.");
      setReports([]);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleFetchReports = () => {
    fetchReports();
  };

  const handleShiftNumberGeneration = (date, shift) => {
    if (date && shift) {
      const selectedShift = shiftOptions.find((option) => option.value === shift);
      if (!selectedShift) return;

      const shiftIndex = selectedShift.shiftIndex;
      const selectedDate = new Date(date);
      const shiftCode = selectedDate.getDate();
      const selectedYear = selectedDate.getFullYear();
      const startDate = new Date(`${selectedYear}-01-01`);
      const daysDiff = Math.floor((selectedDate - startDate) / (1000 * 60 * 60 * 24));
      const baseShiftNumberStart = 250001 + (selectedYear - 2025) * 10000;
      const baseShiftNumber = baseShiftNumberStart + daysDiff * 3;
      const shiftNumber = baseShiftNumber + (shiftIndex - 1);
      const formattedShiftNumber = `${shiftCode} ${shiftNumber.toString().padStart(6, "0")}`;

      setFormData((prev) => ({
        ...prev,
        shiftNumber: shiftNumber.toString(),
        displayShiftNumber: formattedShiftNumber,
      }));
    }
  };

  const handleInputChange = (e, field) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setFormData((prev) => ({ ...prev, date }));
    handleShiftNumberGeneration(date, formData.shift);
  };

  const handleShiftChange = (e) => {
    const shift = e.target.value;
    setFormData((prev) => ({ ...prev, shift }));
    handleShiftNumberGeneration(formData.date, shift);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (
      !formData.date ||
      !formData.shift ||
      !formData.shiftNumber ||
      formData.receivedQuantity === "" ||
      formData.receivedWeight === "" ||
      formData.crushedPCWeight === ""
    ) {
      setErrorMessage("All fields are required");
      return;
    }

    const quantity = parseInt(formData.receivedQuantity);
    const weight = parseFloat(formData.receivedWeight);
    const crushedWeight = parseFloat(formData.crushedPCWeight);
    const shiftNumber = parseInt(formData.shiftNumber);

    if (
      isNaN(quantity) || quantity < 0 ||
      isNaN(weight) || weight < 0 ||
      isNaN(crushedWeight) || crushedWeight < 0 ||
      isNaN(shiftNumber) || shiftNumber < 0
    ) {
      setErrorMessage("Invalid quantity, weight, or shift number values");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/defectivecrushed/defective-crushed`, {
        ...formData,
        shiftNumber: shiftNumber,
      });
      alert(response.data.message);
      setFormData({
        date: "",
        shift: "",
        shiftNumber: "",
        displayShiftNumber: "",
        receivedQuantity: "",
        receivedWeight: "",
        crushedPCWeight: "",
      });
      setIsPopupOpen(false);
      fetchReports();
    } catch (error) {
      console.error("Failed to submit report:", error);
      setErrorMessage(error.response?.data?.message || "Failed to submit report. Please check the server connection.");
    }
  };

  const renderFormRow = () => (
    <tr className="glass-table__row">
      <td className="glass-table__cell glass-table__cell--product">Defective Crushed</td>
      <td className="glass-table__cell">
        <input
          type="number"
          value={formData.receivedQuantity}
          onChange={(e) => handleInputChange(e, "receivedQuantity")}
          className="glass-input"
          placeholder="Qty"
          min="0"
          step="1"
        />
      </td>
      <td className="glass-table__cell">
        <input
          type="number"
          value={formData.receivedWeight}
          onChange={(e) => handleInputChange(e, "receivedWeight")}
          className="glass-input"
          placeholder="Weight (kg)"
          min="0"
          step="0.01"
        />
      </td>
      <td className="glass-table__cell">
        <input
          type="number"
          value={formData.crushedPCWeight}
          onChange={(e) => handleInputChange(e, "crushedPCWeight")}
          className="glass-input"
          placeholder="Crushed PC Weight (kg)"
          min="0"
          step="0.01"
        />
      </td>
    </tr>
  );

  const renderFetchedRow = (report) => (
    <tr key={report.shiftNumber} className="glass-table__row">
      <td className="glass-table__cell glass-table__cell--product">Defective Crushed</td>
      <td className="glass-table__cell">
        {report.receivedQuantity !== undefined && report.receivedQuantity !== null
          ? Number(report.receivedQuantity).toFixed(0)
          : "-"}
      </td>
      <td className="glass-table__cell">
        {report.receivedWeight !== undefined && report.receivedWeight !== null
          ? Number(report.receivedWeight).toFixed(2)
          : "-"}
      </td>
      <td className="glass-table__cell">
        {report.crushedPCWeight !== undefined && report.crushedPCWeight !== null
          ? Number(report.crushedPCWeight).toFixed(2)
          : "-"}
      </td>
    </tr>
  );

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
    setErrorMessage("");
  };

  return (
    <div className="glass-container">
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link
          underline="hover"
          color="inherit"
          to="/dashboard"
          onClick={(e) => {
            e.preventDefault();
            navigate("/dashboard");
          }}
          className="glass-link"
        >
          Dashboard
        </Link>
        <Typography color="text.primary" className="glass-title">Defective Crushed Report</Typography>
      </Breadcrumbs>

      {isPopupOpen && (
        <div className="glass-modal">
          <div className="glass-modal__content">
            <button
              onClick={togglePopup}
              className="glass-modal__close"
              aria-label="Close popup"
            >
              ×
            </button>
            <div className="glass-card">
              <div className="glass-card__header">
                <h2 className="glass-card__title">Defective Crushed Report</h2>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <div className="glass-controls">
                  <div className="glass-control-group">
                    <label className="glass-label">Date</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={handleDateChange}
                      className="glass-input glass-input--date"
                    />
                  </div>
                  <div className="glass-control-group">
                    <label className="glass-label">Shift</label>
                    <select
                      value={formData.shift}
                      onChange={handleShiftChange}
                      className="glass-input glass-input--select"
                    >
                      <option value="">Select Shift</option>
                      {shiftOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="glass-control-group">
                    <label className="glass-label">Shift Number</label>
                    <input
                      type="text"
                      value={formData.displayShiftNumber || formData.shiftNumber}
                      readOnly
                      className="glass-input glass-input--readonly"
                    />
                  </div>
                </div>
              </div>

              <div className="glass-card__body">
                <table className="glass-table">
                  <thead className="glass-table__header">
                    <tr className="glass-table__header-row">
                      <th className="glass-table__header-cell glass-table__header-cell--product">
                        Category
                      </th>
                      <th className="glass-table__header-cell">Received Qty</th>
                      <th className="glass-table__header-cell">Received Weight / kg</th>
                      <th className="glass-table__header-cell">Crushed PC Weight / kg</th>
                    </tr>
                  </thead>
                  <tbody className="glass-table__body">{renderFormRow()}</tbody>
                </table>
              </div>

              <div className="glass-card__footer">
                <button onClick={handleSubmit} className="glass-button glass-button--primary">
                  Submit Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="glass-card">
        <div className="glass-card__header">
          <button onClick={togglePopup} className="glass-button glass-button--accent">
            Open Defective Crushed Form
          </button>
          <h2 className="glass-card__title">Defective Crushed Reports</h2>
          <div className="glass-controls">
            <div className="glass-control-group">
              <label className="glass-label">Filter by Date</label>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="glass-input glass-input--date"
              />
            </div>
            <div className="glass-control-group">
              <label className="glass-label">Filter by Shift</label>
              <select
                value={filterShift}
                onChange={(e) => setFilterShift(e.target.value)}
                className="glass-input glass-input--select"
              >
                <option value="">Select Shift</option>
                {shiftOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="glass-control-group">
              <button onClick={handleFetchReports} className="glass-button glass-button--primary">
                Fetch Reports
              </button>
            </div>
          </div>
        </div>
        <div className="glass-card__body">
          {reports.length > 0 ? (
            reports.map((report) => (
              <div key={report.shiftNumber} className="glass-report">
                <div className="glass-controls">
                  <div className="glass-control-group">
                    <label className="glass-label">Date</label>
                    <input
                      type="text"
                      value={report.date ? new Date(report.date).toLocaleDateString() : "-"}
                      readOnly
                      className="glass-input glass-input--readonly"
                    />
                  </div>
                  <div className="glass-control-group">
                    <label className="glass-label">Shift</label>
                    <input
                      type="text"
                      value={
                        shiftOptions.find((opt) => opt.value === report.shift)?.label ||
                        report.shift ||
                        "-"
                      }
                      readOnly
                      className="glass-input glass-input--readonly"
                    />
                  </div>
                  <div className="glass-control-group">
                    <label className="glass-label">Shift Number</label>
                    <input
                      type="text"
                      value={report.shiftNumber || "-"}
                      readOnly
                      className="glass-input glass-input--readonly"
                    />
                  </div>
                </div>
                <table className="glass-table">
                  <thead className="glass-table__header">
                    <tr className="glass-table__header-row">
                      <th className="glass-table__header-cell glass-table__header-cell--product">
                        Category
                      </th>
                      <th className="glass-table__header-cell">Received Qty</th>
                      <th className="glass-table__header-cell">Received Weight / kg</th>
                      <th className="glass-table__header-cell">Crushed PC Weight / kg</th>
                    </tr>
                  </thead>
                  <tbody className="glass-table__body">{renderFetchedRow(report)}</tbody>
                </table>
              </div>
            ))
          ) : (
            <div className="glass-empty-state">
              <svg className="glass-empty-state__icon" viewBox="0 0 24 24">
                <path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,5V19H5V5H19M17,7H7V9H17V7M13,11H7V13H13V11M17,11H15V13H17V11M7,15H11V17H7V15M13,15H17V17H13V15Z" />
              </svg>
              <p>No reports available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DefectiveCrushed;