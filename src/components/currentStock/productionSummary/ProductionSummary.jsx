import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Breadcrumbs, Typography } from "@mui/material";
import "./productionsummary.scss";

const ProductionShiftReport = () => {
  const navigate = useNavigate();
  const API_BASE_URL = "/api"; // For office server with reverse proxy

  const [formData, setFormData] = useState({
    date: "",
    shift: "",
    shiftNumber: "",
    cebCovers: defaultSection(),
    lecoCovers: defaultSection(),
    base: defaultSection(),
    shutters: defaultSection(),
  });

  const [reports, setReports] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [filterDate, setFilterDate] = useState("");
  const [filterShift, setFilterShift] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function defaultSection() {
    return {
      rawMaterialPC: "",
      rawMaterialCrushedPC: "",
      rawMaterialMB: "",
      goodProductsQty: "",
      goodProductsWeight: "",
      defectiveProductsQty: "",
      defectiveProductsWeight: "",
      wastage: "",
    };
  }

  const shiftOptions = [
    { label: "Morning Shift (12:00 AM - 7:00 AM)", value: "morning", shiftIndex: 1 },
    { label: "Day Shift (7:00 AM - 4:00 PM)", value: "day", shiftIndex: 2 },
    { label: "Night Shift (4:00 PM - 12:00 AM)", value: "night", shiftIndex: 3 },
  ];

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      const params = {};
      if (filterDate) params.date = filterDate;
      if (filterShift) params.shift = filterShift;

      const response = await axios.get(`${API_BASE_URL}/production-shift`, { params });
      setReports(response.data);
      setErrorMessage("");
    } catch (error) {
      console.error("Failed to fetch reports:", error);
      setErrorMessage(error.response?.data?.message || "Failed to fetch reports. Please check the server connection.");
      setReports([]);
    } finally {
      setIsLoading(false);
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

      setFormData((prev) => ({ ...prev, shiftNumber: formattedShiftNumber }));
    }
  };

  const handleInputChange = (e, section, field) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
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

  const sanitizeSection = (section) => {
    const sanitized = {};
    for (const [key, value] of Object.entries(section)) {
      sanitized[key] = value === "" ? null : Number(value);
    }
    return sanitized;
  };

  const validateForm = () => {
    if (!formData.date || !formData.shift || !formData.shiftNumber) {
      setErrorMessage("Date, shift, and shift number are required");
      return false;
    }
    const sections = ["cebCovers", "lecoCovers", "base", "shutters"];
    for (const section of sections) {
      const data = formData[section];
      for (const [field, value] of Object.entries(data)) {
        if (value !== "" && (isNaN(value) || Number(value) < 0)) {
          setErrorMessage(`Invalid ${field} in ${section}`);
          return false;
        }
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!validateForm()) return;

    const sanitizedFormData = {
      ...formData,
      cebCovers: sanitizeSection(formData.cebCovers),
      lecoCovers: sanitizeSection(formData.lecoCovers),
      base: sanitizeSection(formData.base),
      shutters: sanitizeSection(formData.shutters),
    };

    try {
      setIsLoading(true);
      const response = await axios.post(`${API_BASE_URL}/production-shift`, sanitizedFormData);
      alert(response.data.message);
      setFormData({
        date: "",
        shift: "",
        shiftNumber: "",
        cebCovers: defaultSection(),
        lecoCovers: defaultSection(),
        base: defaultSection(),
        shutters: defaultSection(),
      });
      setIsPopupOpen(false);
      fetchReports();
    } catch (error) {
      console.error("Submission error:", error);
      setErrorMessage(error.response?.data?.message || "Failed to submit report. Please check the server connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderProductRow = (productName, section) => (
    <tr key={section} className="report-table__row">
      <td className="report-table__cell report-table__cell--product">{productName}</td>
      {[
        "rawMaterialPC",
        "rawMaterialCrushedPC",
        "rawMaterialMB",
        "goodProductsQty",
        "goodProductsWeight",
        "defectiveProductsQty",
        "defectiveProductsWeight",
        "wastage",
      ].map((field, index) => (
        <td key={index} className="report-table__cell">
          <input
            type="number"
            value={formData[section][field]}
            onChange={(e) => handleInputChange(e, section, field)}
            className="report-table__input"
            placeholder={formatPlaceholder(field)}
            min="0"
            step={field.includes("Weight") || field === "wastage" ? "0.01" : "1"}
          />
        </td>
      ))}
    </tr>
  );

  const renderFetchedProductRow = (productName, section, report) => (
    <tr key={`${report.shiftNumber}-${section}`} className="report-table__row">
      <td className="report-table__cell report-table__cell--product">{productName}</td>
      {[
        "rawMaterialPC",
        "rawMaterialCrushedPC",
        "rawMaterialMB",
        "goodProductsQty",
        "goodProductsWeight",
        "defectiveProductsQty",
        "defectiveProductsWeight",
        "wastage",
      ].map((field, index) => (
        <td key={index} className="report-table__cell">
          {report[section][field] !== undefined && report[section][field] !== null
            ? Number(report[section][field]).toFixed(field.includes("Weight") || field === "wastage" ? 2 : 0)
            : "-"}
        </td>
      ))}
    </tr>
  );

  const formatPlaceholder = (field) => {
    const placeholders = {
      rawMaterialPC: "PC",
      rawMaterialCrushedPC: "Crushed PC",
      rawMaterialMB: "MB",
      goodProductsQty: "Qty",
      goodProductsWeight: "Weight (kg)",
      defectiveProductsQty: "Qty",
      defectiveProductsWeight: "Weight (kg)",
      wastage: "Wastage (kg)",
    };
    return placeholders[field] || "";
  };

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
    setErrorMessage("");
  };

  return (
    <div className="production-summary">
      <Breadcrumbs aria-label="breadcrumb" className="breadcrumbs">
        <Link
          to="/dashboard"
          onClick={(e) => {
            e.preventDefault();
            navigate("/dashboard");
          }}
          className="breadcrumb-link"
        >
          Dashboard
        </Link>
        <Typography color="text.primary" className="breadcrumb-current">
          Production Shift Report
        </Typography>
      </Breadcrumbs>

      {isPopupOpen && (
        <div className="popup-overlay">
          <div className="popup-container">
            <button onClick={togglePopup} className="popup-close" aria-label="Close popup">
              ×
            </button>
            <div className="popup-content">
              <div className="popup-header">
                <h2 className="popup-title">Production Shift Summary</h2>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <div className="form-controls">
                  <div className="control-group">
                    <label className="control-label">Date</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={handleDateChange}
                      className="control-input"
                      required
                    />
                  </div>
                  <div className="control-group">
                    <label className="control-label">Shift</label>
                    <select
                      value={formData.shift}
                      onChange={handleShiftChange}
                      className="control-input"
                      required
                    >
                      <option value="">Select Shift</option>
                      {shiftOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="control-group">
                    <label className="control-label">Shift Number</label>
                    <input
                      type="text"
                      value={formData.shiftNumber}
                      readOnly
                      className="control-input readonly"
                    />
                  </div>
                </div>
              </div>

              <div className="form-content">
                <table className="data-table">
                  <thead className="table-header">
                    <tr>
                      <th rowSpan="2" className="rounded-tl-lg">Product</th>
                      <th colSpan="3">Raw Material / kg</th>
                      <th colSpan="2">Good Products</th>
                      <th colSpan="2">Defective Products</th>
                      <th rowSpan="2" className="rounded-tr-lg">Wastage / kg</th>
                    </tr>
                    <tr>
                      <th>PC</th>
                      <th>Crushed PC</th>
                      <th>MB</th>
                      <th>Qty</th>
                      <th>Weight</th>
                      <th>Qty</th>
                      <th>Weight</th>
                    </tr>
                  </thead>
                  <tbody className="table-body">
                    {renderProductRow("CEB Covers", "cebCovers")}
                    {renderProductRow("LECO Covers", "lecoCovers")}
                    {renderProductRow("Base", "base")}
                    {renderProductRow("Shutters", "shutters")}
                  </tbody>
                </table>
              </div>

              <div className="form-footer">
                <button
                  onClick={handleSubmit}
                  className="submit-button"
                  disabled={isLoading}
                >
                  {isLoading ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="main-container">
        <div className="header-controls">
          <div className="button-group">
            <button onClick={togglePopup} className="open-form-button">
              Open Shift Report Form
            </button>
          </div>
          <h2 className="page-title">Production Shift Reports</h2>
        </div>

        <div className="reports-container">
          <div className="report-section">
            <div className="report-header">
              <h3>Filter Reports</h3>
              <div className="filter-controls">
                <div className="filter-group">
                  <label className="filter-label">Filter by Date</label>
                  <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="filter-input"
                  />
                </div>
                <div className="filter-group">
                  <label className="filter-label">Filter by Shift</label>
                  <select
                    value={filterShift}
                    onChange={(e) => setFilterShift(e.target.value)}
                    className="filter-input"
                  >
                    <option value="">Select Shift</option>
                    {shiftOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <button onClick={handleFetchReports} className="fetch-button">
                  {isLoading ? 'Loading...' : 'Fetch Reports'}
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="loading-indicator">
                <div className="spinner"></div>
                <p>Loading reports...</p>
              </div>
            ) : reports.length > 0 ? (
              reports.map((report) => (
                <div key={report.shiftNumber} className="report-table-wrapper">
                  <div className="report-controls">
                    <div className="control-group">
                      <label className="control-label">Date</label>
                      <input
                        type="text"
                        value={report.date ? new Date(report.date).toLocaleDateString() : "-"}
                        readOnly
                        className="control-input readonly"
                      />
                    </div>
                    <div className="control-group">
                      <label className="control-label">Shift</label>
                      <input
                        type="text"
                        value={
                          shiftOptions.find((opt) => opt.value === report.shift)?.label || report.shift || "-"
                        }
                        readOnly
                        className="control-input readonly"
                      />
                    </div>
                    <div className="control-group">
                      <label className="control-label">Shift Number</label>
                      <input
                        type="text"
                        value={report.shiftNumber || "-"}
                        readOnly
                        className="control-input readonly"
                      />
                    </div>
                  </div>
                  <table className="report-table">
                    <thead className="report-table__header">
                      <tr>
                        <th rowSpan="2" className="rounded-tl-lg">Product</th>
                        <th colSpan="3">Raw Material / kg</th>
                        <th colSpan="2">Good Products</th>
                        <th colSpan="2">Defective Products</th>
                        <th rowSpan="2" className="rounded-tr-lg">Wastage / kg</th>
                      </tr>
                      <tr>
                        <th>PC</th>
                        <th>Crushed PC</th>
                        <th>MB</th>
                        <th>Qty</th>
                        <th>Weight</th>
                        <th>Qty</th>
                        <th>Weight</th>
                      </tr>
                    </thead>
                    <tbody className="report-table__body">
                      {renderFetchedProductRow("CEB Covers", "cebCovers", report)}
                      {renderFetchedProductRow("LECO Covers", "lecoCovers", report)}
                      {renderFetchedProductRow("Base", "base", report)}
                      {renderFetchedProductRow("Shutters", "shutters", report)}
                    </tbody>
                  </table>
                </div>
              ))
            ) : (
              <p className="no-reports">No reports available for the selected filters.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductionShiftReport;