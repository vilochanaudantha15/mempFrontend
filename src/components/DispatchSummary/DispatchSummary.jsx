import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Breadcrumbs, Typography } from "@mui/material";
import "./ShiftDispatchSummary.scss";

const API_BASE_URL = "/api"; // For office server with reverse proxy

const ShiftDispatchSummary = () => {
  const navigate = useNavigate();

  const defaultEntry = () => ({
    customer: "",
    quantity: "",
    invoiceNo: "",
  });

  const [formData, setFormData] = useState({
    date: "",
    shift: "",
    shiftNumber: "",
    entries: Array.from({ length: 8 }, defaultEntry),
    totalQuantity: "",
    balance: {
      ceb: "",
      leco: "",
    },
    plaName: "",
    supervisorName: "",
    managerName: "Kanishka Ravindranath",
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

      const response = await axios.get(`${API_BASE_URL}/shift-dispatch`, { params });
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

      setFormData((prev) => ({ ...prev, shiftNumber: formattedShiftNumber }));
    }
  };

  const handleInputChange = (e, index, field) => {
    const { value } = e.target;
    setFormData((prev) => {
      const newEntries = [...prev.entries];
      newEntries[index] = { ...newEntries[index], [field]: value };
      return { ...prev, entries: newEntries };
    });
  };

  const handleTotalChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, totalQuantity: value }));
  };

  const handleBalanceChange = (e, type) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      balance: { ...prev.balance, [type]: value },
    }));
  };

  const handleNameChange = (e, role) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, [`${role}Name`]: value }));
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

  const sanitizeEntry = (entry) => ({
    customer: entry.customer || null,
    quantity: entry.quantity === "" ? null : Number(entry.quantity),
    invoiceNo: entry.invoiceNo || null,
  });

  const validateForm = () => {
    if (!formData.date || !formData.shift || !formData.shiftNumber) {
      setErrorMessage("Date, shift, and shift number are required");
      return false;
    }
    for (let index = 0; index < formData.entries.length; index++) {
      const entry = formData.entries[index];
      if (entry.quantity !== "" && (isNaN(entry.quantity) || Number(entry.quantity) < 0)) {
        setErrorMessage(`Invalid quantity in row ${index + 1}`);
        return false;
      }
    }
    if (
      formData.totalQuantity !== "" &&
      (isNaN(formData.totalQuantity) || Number(formData.totalQuantity) < 0)
    ) {
      setErrorMessage("Invalid total quantity");
      return false;
    }
    const balanceFields = ["ceb", "leco"];
    for (const field of balanceFields) {
      const value = formData.balance[field];
      if (value !== "" && (isNaN(value) || Number(value) < 0)) {
        setErrorMessage(`Invalid balance ${field.toUpperCase()}`);
        return false;
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
      entries: formData.entries.map(sanitizeEntry),
      totalQuantity:
        formData.totalQuantity === "" ? null : Number(formData.totalQuantity),
      balance: {
        ceb: formData.balance.ceb === "" ? null : Number(formData.balance.ceb),
        leco: formData.balance.leco === "" ? null : Number(formData.balance.leco),
      },
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/shift-dispatch`, sanitizedFormData);
      setFormData({
        date: "",
        shift: "",
        shiftNumber: "",
        entries: Array.from({ length: 8 }, defaultEntry),
        totalQuantity: "",
        balance: {
          ceb: "",
          leco: "",
        },
        plaName: "",
        supervisorName: "",
        managerName: "Kanishka Ravindranath",
      });
      setIsPopupOpen(false);
      fetchReports();
    } catch (error) {
      console.error("Submission error:", error);
      setErrorMessage(error.response?.data?.message || "Failed to submit report. Please check the server connection.");
    }
  };

  const renderEntryRow = (index, entry) => (
    <tr key={index} className="report-table__row">
      <td className="report-table__cell">{index + 1}</td>
      <td className="report-table__cell">
        <input
          type="text"
          value={entry.customer}
          onChange={(e) => handleInputChange(e, index, "customer")}
          className="report-table__input"
          placeholder="Customer Name"
        />
      </td>
      <td className="report-table__cell">
        <input
          type="number"
          value={entry.quantity}
          onChange={(e) => handleInputChange(e, index, "quantity")}
          className="report-table__input"
          min="0"
          step="1"
          placeholder="Quantity"
        />
      </td>
      <td className="report-table__cell">
        <input
          type="text"
          value={entry.invoiceNo}
          onChange={(e) => handleInputChange(e, index, "invoiceNo")}
          className="report-table__input"
          placeholder="Invoice No"
        />
      </td>
    </tr>
  );

  const renderFetchedEntryRow = (index, entry) => (
    <tr key={index} className="report-table__row">
      <td className="report-table__cell">{index + 1}</td>
      <td className="report-table__cell">{entry.customer || "-"}</td>
      <td className="report-table__cell">
        {entry.quantity !== undefined && entry.quantity !== null
          ? Number(entry.quantity).toFixed(0)
          : "-"}
      </td>
      <td className="report-table__cell">{entry.invoiceNo || "-"}</td>
    </tr>
  );

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
    setErrorMessage("");
  };

  return (
    <div className="shift-dispatch-summary">
      <Breadcrumbs aria-label="breadcrumb" className="breadcrumbs">
        <Link
          underline="hover"
          color="inherit"
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
          Shift Dispatch Summary
        </Typography>
      </Breadcrumbs>

      {isPopupOpen && (
        <div className="popup-overlay">
          <div className="popup-container">
            <button
              onClick={togglePopup}
              className="popup-close"
              aria-label="Close popup"
            >
              ×
            </button>
            <div className="popup-content">
              <div className="popup-header">
                <h2 className="popup-title">
                  Shift Dispatch Summary
                </h2>
                {errorMessage && (
                  <p className="error-message">{errorMessage}</p>
                )}
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
                      <th className="rounded-tl-lg">NO.</th>
                      <th>CUSTOMER</th>
                      <th>QUANTITY</th>
                      <th className="rounded-tr-lg">INVOICE NO</th>
                    </tr>
                  </thead>
                  <tbody className="table-body">
                    {formData.entries.map((entry, index) => renderEntryRow(index, entry))}
                    <tr className="total-row">
                      <td className="font-bold">Total</td>
                      <td></td>
                      <td>
                        <input
                          type="number"
                          value={formData.totalQuantity}
                          onChange={handleTotalChange}
                          className="total-input"
                          min="0"
                          step="1"
                        />
                      </td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>

                <div className="balance-section">
                  <table className="balance-table">
                    <thead>
                      <tr>
                        <th className="rounded-tl-lg">BALANCE</th>
                        <th>CEB</th>
                        <th className="rounded-tr-lg">LECO</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td></td>
                        <td>
                          <input
                            type="number"
                            value={formData.balance.ceb}
                            onChange={(e) => handleBalanceChange(e, "ceb")}
                            className="balance-input"
                            min="0"
                            step="1"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={formData.balance.leco}
                            onChange={(e) => handleBalanceChange(e, "leco")}
                            className="balance-input"
                            min="0"
                            step="1"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="signatures-section">
                  <div className="signature-card">
                    <div className="signature-header">
                      <div className="signature-title">Recommended by PLA</div>
                      <div className="signature-line">Signature: ____________________</div>
                    </div>
                    <div className="signature-name">
                      <span>Name:</span>
                      <input
                        type="text"
                        value={formData.plaName}
                        onChange={(e) => handleNameChange(e, "pla")}
                        className="name-input"
                      />
                    </div>
                  </div>

                  <div className="signature-card">
                    <div className="signature-header">
                      <div className="signature-title">Checked by Supervisor</div>
                      <div className="signature-line">Signature: ____________________</div>
                    </div>
                    <div className="signature-name">
                      <span>Name:</span>
                      <input
                        type="text"
                        value={formData.supervisorName}
                        onChange={(e) => handleNameChange(e, "supervisor")}
                        className="name-input"
                      />
                    </div>
                  </div>

                  <div className="signature-card">
                    <div className="signature-header">
                      <div className="signature-title">Approved by Manager</div>
                      <div className="signature-line">Signature: ____________________</div>
                    </div>
                    <div className="signature-name">
                      <span>Name:</span>
                      <input
                        type="text"
                        value={formData.managerName}
                        onChange={(e) => handleNameChange(e, "manager")}
                        className="name-input"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-footer">
                <button
                  onClick={handleSubmit}
                  className="submit-button"
                >
                  Submit Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="main-container">
        <div className="header-controls">
          <button
            onClick={togglePopup}
            className="open-form-button"
          >
            Open Shift Dispatch Form
          </button>
          <h2 className="page-title">Shift Dispatch Summaries</h2>
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
            <button
              onClick={handleFetchReports}
              className="fetch-button"
            >
              Fetch Reports
            </button>
          </div>
        </div>
        <div className="reports-container">
          {reports.length > 0 ? (
            reports.map((report) => (
              <div key={report.shiftNumber} className="report-card">
                <div className="report-header">
                  <div className="report-info">
                    <div className="info-group">
                      <label>Date</label>
                      <div className="info-value">
                        {report.date ? new Date(report.date).toLocaleDateString() : "-"}
                      </div>
                    </div>
                    <div className="info-group">
                      <label>Shift</label>
                      <div className="info-value">
                        {shiftOptions.find((opt) => opt.value === report.shift)?.label || report.shift || "-"}
                      </div>
                    </div>
                    <div className="info-group">
                      <label>Shift Number</label>
                      <div className="info-value">
                        {report.shiftNumber || "-"}
                      </div>
                    </div>
                  </div>
                </div>

                <table className="report-table">
                  <thead>
                    <tr>
                      <th className="rounded-tl-lg">NO.</th>
                      <th>CUSTOMER</th>
                      <th>QUANTITY</th>
                      <th className="rounded-tr-lg">INVOICE NO</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.entries.map((entry, index) => renderFetchedEntryRow(index, entry))}
                    <tr className="total-row">
                      <td className="font-bold">Total</td>
                      <td></td>
                      <td>
                        {report.totalQuantity !== undefined && report.totalQuantity !== null
                          ? Number(report.totalQuantity).toFixed(0)
                          : "-"}
                      </td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>

                <div className="report-balance">
                  <table className="balance-table">
                    <thead>
                      <tr>
                        <th className="rounded-tl-lg">BALANCE</th>
                        <th>CEB</th>
                        <th className="rounded-tr-lg">LECO</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td></td>
                        <td>
                          {report.balance.ceb !== undefined && report.balance.ceb !== null
                            ? Number(report.balance.ceb).toFixed(0)
                            : "-"}
                        </td>
                        <td>
                          {report.balance.leco !== undefined && report.balance.leco !== null
                            ? Number(report.balance.leco).toFixed(0)
                            : "-"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="report-signatures">
                  <div className="signature-card">
                    <div className="signature-header">
                      <div className="signature-title">Recommended by PLA</div>
                      <div className="signature-line">Signature: ____________________</div>
                    </div>
                    <div className="signature-name">
                      Name: {report.plaName || "-"}
                    </div>
                  </div>

                  <div className="signature-card">
                    <div className="signature-header">
                      <div className="signature-title">Checked by Supervisor</div>
                      <div className="signature-line">Signature: ____________________</div>
                    </div>
                    <div className="signature-name">
                      Name: {report.supervisorName || "-"}
                    </div>
                  </div>

                  <div className="signature-card">
                    <div className="signature-header">
                      <div className="signature-title">Approved by Manager</div>
                      <div className="signature-line">Signature: ____________________</div>
                    </div>
                    <div className="signature-name">
                      Name: {report.managerName || "-"}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="no-reports">No reports available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShiftDispatchSummary;