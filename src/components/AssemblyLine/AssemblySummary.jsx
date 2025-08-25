import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Breadcrumbs, Typography } from "@mui/material";
import "./assembly.scss";

const AssemblySummary = () => {
  const navigate = useNavigate();
  const API_BASE_URL = "/api"; // For office server with reverse proxy

  const [formData, setFormData] = useState({
    date: "",
    shift: "",
    shiftNumber: "",
    receivedItems: {
      cebCovers: "",
      lecoCovers: "",
      base: "",
      shutters: "",
      coverBeading: "",
      shutterBeading: "",
      springs: "",
      corrugatedBoxes: "",
      sellotapes: "",
    },
    rejectedItems: {
      cebCovers: "",
      lecoCovers: "",
      base: "",
      shutters: "",
      coverBeading: "",
      shutterBeading: "",
      springs: "",
      corrugatedBoxes: "",
      sellotapes: "",
    },
    assembledItems: {
      ceb: { quantity: "", qcNoStart: "", qcNoEnd: "" },
      leco1: { quantity: "", qcNoStart: "", qcNoEnd: "" },
    },
  });

  const [receivedReports, setReceivedReports] = useState([]);
  const [rejectedReports, setRejectedReports] = useState([]);
  const [assembledReports, setAssembledReports] = useState([]);
  const [isReceivedPopupOpen, setIsReceivedPopupOpen] = useState(false);
  const [isRejectedPopupOpen, setIsRejectedPopupOpen] = useState(false);
  const [isAssembledPopupOpen, setIsAssembledPopupOpen] = useState(false);
  const [receivedFilterDate, setReceivedFilterDate] = useState("");
  const [rejectedFilterDate, setRejectedFilterDate] = useState("");
  const [assembledFilterDate, setAssembledFilterDate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const shiftOptions = [
    { label: "Morning Shift (12:00 AM - 7:00 AM)", value: "morning", shiftIndex: 1 },
    { label: "Day Shift (7:00 AM - 4:00 PM)", value: "day", shiftIndex: 2 },
    { label: "Night Shift (4:00 PM - 12:00 AM)", value: "night", shiftIndex: 3 },
  ];

  const fetchReports = async (section, filterDate, setReports) => {
    try {
      const params = {};
      if (filterDate) params.date = filterDate;

      let endpoint;
      if (section === "receivedItems") {
        endpoint = `${API_BASE_URL}/assembly/received`;
      } else if (section === "rejectedItems") {
        endpoint = `${API_BASE_URL}/rejected/rejected`;
      } else if (section === "assembledItems") {
        endpoint = `${API_BASE_URL}/assemblyLine/assembled`;
      } else {
        return;
      }

      const response = await axios.get(endpoint, { params });
      setReports(response.data);
    } catch (error) {
      console.error(`Failed to fetch ${section} reports:`, error);
      setErrorMessage(error.response?.data?.message || `Failed to fetch ${section} reports. Please check the server connection.`);
      setReports([]);
    }
  };

  useEffect(() => {
    fetchReports("receivedItems", receivedFilterDate, setReceivedReports);
    fetchReports("rejectedItems", rejectedFilterDate, setRejectedReports);
    fetchReports("assembledItems", assembledFilterDate, setAssembledReports);
  }, []);

  const handleFetchReceivedReports = () => {
    fetchReports("receivedItems", receivedFilterDate, setReceivedReports);
  };

  const handleFetchRejectedReports = () => {
    fetchReports("rejectedItems", rejectedFilterDate, setRejectedReports);
  };

  const handleFetchAssembledReports = () => {
    fetchReports("assembledItems", assembledFilterDate, setAssembledReports);
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

  const handleInputChange = (e, section, field, subField) => {
    const { value } = e.target;
    if (section === "assembledItems") {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: {
            ...prev[section][field],
            [subField]: value,
          },
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
    }
  };

  const validateForm = (type) => {
    if (!formData.date || !formData.shift || !formData.shiftNumber) {
      setErrorMessage("Date, shift, and shift number are required");
      return false;
    }

    if (type === "assembledItems") {
      const assembled = formData.assembledItems;
      for (const key in assembled) {
        if (assembled[key].quantity && (isNaN(assembled[key].quantity) || Number(assembled[key].quantity) < 0)) {
          setErrorMessage(`Invalid quantity for ${key}`);
          return false;
        }
      }
    } else {
      const items = formData[type];
      for (const key in items) {
        if (items[key] && (isNaN(items[key]) || Number(items[key]) < 0)) {
          setErrorMessage(`Invalid value for ${key}`);
          return false;
        }
      }
    }

    return true;
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

  const handleSubmit = async (e, type) => {
    e.preventDefault();
    setErrorMessage("");

    if (!validateForm(type)) return;

    try {
      const submitData = {
        date: formData.date,
        shift: formData.shift,
        shiftNumber: formData.shiftNumber,
        [type]: formData[type],
      };

      let endpoint;
      if (type === "receivedItems") {
        endpoint = `${API_BASE_URL}/assembly/received`;
      } else if (type === "rejectedItems") {
        endpoint = `${API_BASE_URL}/rejected/rejected`;
      } else if (type === "assembledItems") {
        endpoint = `${API_BASE_URL}/assemblyLine/assembled`;
      } else {
        alert(`API for ${type} not implemented`);
        return;
      }

      const response = await axios.post(endpoint, submitData);
      alert(response.data.message);
      setFormData({
        date: "",
        shift: "",
        shiftNumber: "",
        receivedItems: {
          cebCovers: "",
          lecoCovers: "",
          base: "",
          shutters: "",
          coverBeading: "",
          shutterBeading: "",
          springs: "",
          corrugatedBoxes: "",
          sellotapes: "",
        },
        rejectedItems: {
          cebCovers: "",
          lecoCovers: "",
          base: "",
          shutters: "",
          coverBeading: "",
          shutterBeading: "",
          springs: "",
          corrugatedBoxes: "",
          sellotapes: "",
        },
        assembledItems: {
          ceb: { quantity: "", qcNoStart: "", qcNoEnd: "" },
          leco1: { quantity: "", qcNoStart: "", qcNoEnd: "" },
        },
      });
      setIsReceivedPopupOpen(false);
      setIsRejectedPopupOpen(false);
      setIsAssembledPopupOpen(false);
      if (type === "receivedItems") {
        handleFetchReceivedReports();
      } else if (type === "rejectedItems") {
        handleFetchRejectedReports();
      } else if (type === "assembledItems") {
        handleFetchAssembledReports();
      }
    } catch (error) {
      console.error("Submission error:", error);
      setErrorMessage(error.response?.data?.message || `Failed to submit ${type} report. Please check the server connection.`);
    }
  };

  const renderItemRow = (itemName, field, section) => (
    <tr key={field} className="report-table__row">
      <td className="report-table__cell report-table__cell--product">
        {itemName}
      </td>
      <td className="report-table__cell">
        <input
          type="number"
          value={formData[section][field]}
          onChange={(e) => handleInputChange(e, section, field)}
          className="report-table__input"
          placeholder="Qty"
          min="0"
          step="1"
        />
      </td>
    </tr>
  );

  const renderAssembledItemRow = (itemName, field) => (
    <tr key={field} className="report-table__row">
      <td className="report-table__cell report-table__cell--product">
        {itemName}
      </td>
      <td className="report-table__cell">
        <input
          type="number"
          value={formData.assembledItems[field].quantity}
          onChange={(e) => handleInputChange(e, "assembledItems", field, "quantity")}
          className="report-table__input"
          placeholder="Qty"
          min="0"
          step="1"
        />
      </td>
      <td className="report-table__cell">
        <input
          type="text"
          value={formData.assembledItems[field].qcNoStart}
          onChange={(e) => handleInputChange(e, "assembledItems", field, "qcNoStart")}
          className="report-table__input"
          placeholder="QC No. Start"
        />
      </td>
      <td className="report-table__cell">
        <input
          type="text"
          value={formData.assembledItems[field].qcNoEnd}
          onChange={(e) => handleInputChange(e, "assembledItems", field, "qcNoEnd")}
          className="report-table__input"
          placeholder="QC No. End"
        />
      </td>
    </tr>
  );

  const aggregateItems = (reports, section) => {
    if (section === "assembledItems") {
      const aggregated = {
        ceb: { quantity: 0, qcNoStart: "", qcNoEnd: "" },
        leco1: { quantity: 0, qcNoStart: "", qcNoEnd: "" },
      };

      reports.forEach((report) => {
        if (report[section]) {
          Object.keys(aggregated).forEach((key) => {
            if (report[section][key]) {
              aggregated[key].quantity += Number(report[section][key].quantity) || 0;
              aggregated[key].qcNoStart = report[section][key].qcNoStart || aggregated[key].qcNoStart;
              aggregated[key].qcNoEnd = report[section][key].qcNoEnd || aggregated[key].qcNoEnd;
            }
          });
        }
      });

      return aggregated;
    } else {
      const aggregated = {
        cebCovers: 0,
        lecoCovers: 0,
        base: 0,
        shutters: 0,
        coverBeading: 0,
        shutterBeading: 0,
        springs: 0,
        corrugatedBoxes: 0,
        sellotapes: 0,
      };

      reports.forEach((report) => {
        if (report[section]) {
          Object.keys(aggregated).forEach((key) => {
            if (report[section][key]) {
              aggregated[key] += Number(report[section][key]) || 0;
            }
          });
        }
      });

      return aggregated;
    }
  };

  const renderAggregatedTable = (aggregatedData, section, title) => {
    if (section === "assembledItems") {
      return (
        <table className="report-table">
          <thead className="report-table__header">
            <tr className="report-table__header-row">
              <th className="report-table__header-cell">Product</th>
              <th className="report-table__header-cell">Quantity</th>
              <th className="report-table__header-cell">QC No. Start</th>
              <th className="report-table__header-cell">QC No. End</th>
            </tr>
          </thead>
          <tbody className="report-table__body">
            <tr className="report-table__row">
              <td className="report-table__cell">CEB</td>
              <td className="report-table__cell">
                {aggregatedData.ceb.quantity !== undefined && aggregatedData.ceb.quantity !== null
                  ? Number(aggregatedData.ceb.quantity).toFixed(0)
                  : "-"}
              </td>
              <td className="report-table__cell">
                {aggregatedData.ceb.qcNoStart || "-"}
              </td>
              <td className="report-table__cell">
                {aggregatedData.ceb.qcNoEnd || "-"}
              </td>
            </tr>
            <tr className="report-table__row">
              <td className="report-table__cell">LECO (1)</td>
              <td className="report-table__cell">
                {aggregatedData.leco1.quantity !== undefined && aggregatedData.leco1.quantity !== null
                  ? Number(aggregatedData.leco1.quantity).toFixed(0)
                  : "-"}
              </td>
              <td className="report-table__cell">
                {aggregatedData.leco1.qcNoStart || "-"}
              </td>
              <td className="report-table__cell">
                {aggregatedData.leco1.qcNoEnd || "-"}
              </td>
            </tr>
          </tbody>
        </table>
      );
    } else {
      return (
        <table className="report-table">
          <thead className="report-table__header">
            <tr className="report-table__header-row">
              <th className="report-table__header-cell">CEB Covers</th>
              <th className="report-table__header-cell">LECO Covers</th>
              <th className="report-table__header-cell">Base</th>
              <th className="report-table__header-cell">Shutters</th>
              <th className="report-table__header-cell">Cover Beading</th>
              <th className="report-table__header-cell">Shutter Beading</th>
              <th className="report-table__header-cell">Springs</th>
              <th className="report-table__header-cell">Corrugated Boxes</th>
              <th className="report-table__header-cell">Sellotapes</th>
            </tr>
          </thead>
          <tbody className="report-table__body">
            <tr className="report-table__row">
              <td className="report-table__cell">
                {aggregatedData.cebCovers !== undefined && aggregatedData.cebCovers !== null
                  ? Number(aggregatedData.cebCovers).toFixed(0)
                  : "-"}
              </td>
              <td className="report-table__cell">
                {aggregatedData.lecoCovers !== undefined && aggregatedData.lecoCovers !== null
                  ? Number(aggregatedData.lecoCovers).toFixed(0)
                  : "-"}
              </td>
              <td className="report-table__cell">
                {aggregatedData.base !== undefined && aggregatedData.base !== null
                  ? Number(aggregatedData.base).toFixed(0)
                  : "-"}
              </td>
              <td className="report-table__cell">
                {aggregatedData.shutters !== undefined && aggregatedData.shutters !== null
                  ? Number(aggregatedData.shutters).toFixed(0)
                  : "-"}
              </td>
              <td className="report-table__cell">
                {aggregatedData.coverBeading !== undefined && aggregatedData.coverBeading !== null
                  ? Number(aggregatedData.coverBeading).toFixed(0)
                  : "-"}
              </td>
              <td className="report-table__cell">
                {aggregatedData.shutterBeading !== undefined && aggregatedData.shutterBeading !== null
                  ? Number(aggregatedData.shutterBeading).toFixed(0)
                  : "-"}
              </td>
              <td className="report-table__cell">
                {aggregatedData.springs !== undefined && aggregatedData.springs !== null
                  ? Number(aggregatedData.springs).toFixed(0)
                  : "-"}
              </td>
              <td className="report-table__cell">
                {aggregatedData.corrugatedBoxes !== undefined && aggregatedData.corrugatedBoxes !== null
                  ? Number(aggregatedData.corrugatedBoxes).toFixed(0)
                  : "-"}
              </td>
              <td className="report-table__cell">
                {aggregatedData.sellotapes !== undefined && aggregatedData.sellotapes !== null
                  ? Number(aggregatedData.sellotapes).toFixed(0)
                  : "-"}
              </td>
            </tr>
          </tbody>
        </table>
      );
    }
  };

  const toggleReceivedPopup = () => {
    setIsReceivedPopupOpen(!isReceivedPopupOpen);
    setErrorMessage("");
  };

  const toggleRejectedPopup = () => {
    setIsRejectedPopupOpen(!isRejectedPopupOpen);
    setErrorMessage("");
  };

  const toggleAssembledPopup = () => {
    setIsAssembledPopupOpen(!isAssembledPopupOpen);
    setErrorMessage("");
  };

  const renderPopupForm = (type, isOpen, togglePopup, title) => (
    isOpen && (
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
              <h2 className="popup-title">{title}</h2>
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
                    {type === "assembledItems" ? (
                      <>
                        <th className="rounded-tl-lg">Product</th>
                        <th>Quantity</th>
                        <th>QC No. Start</th>
                        <th className="rounded-tr-lg">QC No. End</th>
                      </>
                    ) : (
                      <>
                        <th className="rounded-tl-lg">Item</th>
                        <th className="rounded-tr-lg">Quantity</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="table-body">
                  {type === "assembledItems" ? (
                    <>
                      {renderAssembledItemRow("CEB", "ceb")}
                      {renderAssembledItemRow("LECO (1)", "leco1")}
                    </>
                  ) : (
                    <>
                      {renderItemRow("CEB Covers", "cebCovers", type)}
                      {renderItemRow("LECO Covers", "lecoCovers", type)}
                      {renderItemRow("Base", "base", type)}
                      {renderItemRow("Shutters", "shutters", type)}
                      {renderItemRow("Cover Beading", "coverBeading", type)}
                      {renderItemRow("Shutter Beading", "shutterBeading", type)}
                      {renderItemRow("Springs", "springs", type)}
                      {renderItemRow("Corrugated Boxes", "corrugatedBoxes", type)}
                      {renderItemRow("Sellotapes", "sellotapes", type)}
                    </>
                  )}
                </tbody>
              </table>
            </div>

            <div className="form-footer">
              <button
                onClick={(e) => handleSubmit(e, type)}
                className="submit-button"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );

  const receivedAggregated = aggregateItems(receivedReports, "receivedItems");
  const rejectedAggregated = aggregateItems(rejectedReports, "rejectedItems");
  const assembledAggregated = aggregateItems(assembledReports, "assembledItems");

  return (
    <div className="assembly-summary">
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
          Assembly Summary
        </Typography>
      </Breadcrumbs>

      {renderPopupForm("receivedItems", isReceivedPopupOpen, toggleReceivedPopup, "Received Items Report")}
      {renderPopupForm("rejectedItems", isRejectedPopupOpen, toggleRejectedPopup, "Rejected Items Report")}
      {renderPopupForm("assembledItems", isAssembledPopupOpen, toggleAssembledPopup, "Assembled Items Report")}

      <div className="main-container">
        <div className="header-controls">
          <div className="button-group">
            <button onClick={toggleReceivedPopup} className="open-form-button">
              Open Received Items Form
            </button>
            <button onClick={toggleRejectedPopup} className="open-form-button">
              Open Rejected Items Form
            </button>
            <button onClick={toggleAssembledPopup} className="open-form-button">
              Open Assembled Items Form
            </button>
          </div>
          <h2 className="page-title">Assembly Line Summary</h2>
        </div>

        <div className="reports-container">
          <div className="report-section">
            <div className="report-header">
              <h3>Received Items</h3>
              <div className="filter-controls">
                <div className="filter-group">
                  <label className="filter-label">Filter by Date</label>
                  <input
                    type="date"
                    value={receivedFilterDate}
                    onChange={(e) => setReceivedFilterDate(e.target.value)}
                    className="filter-input"
                  />
                </div>
                <button onClick={handleFetchReceivedReports} className="fetch-button">
                  Fetch Reports
                </button>
              </div>
            </div>
            {receivedReports.length > 0 ? (
              renderAggregatedTable(receivedAggregated, "receivedItems", "Received Items")
            ) : (
              <p className="no-reports">No received reports available for the selected date.</p>
            )}
          </div>

          <div className="report-section">
            <div className="report-header">
              <h3>Rejected Items</h3>
              <div className="filter-controls">
                <div className="filter-group">
                  <label className="filter-label">Filter by Date</label>
                  <input
                    type="date"
                    value={rejectedFilterDate}
                    onChange={(e) => setRejectedFilterDate(e.target.value)}
                    className="filter-input"
                  />
                </div>
                <button onClick={handleFetchRejectedReports} className="fetch-button">
                  Fetch Reports
                </button>
              </div>
            </div>
            {rejectedReports.length > 0 ? (
              renderAggregatedTable(rejectedAggregated, "rejectedItems", "Rejected Items")
            ) : (
              <p className="no-reports">No rejected reports available for the selected date.</p>
            )}
          </div>

          <div className="report-section">
            <div className="report-header">
              <h3>Assembled Items</h3>
              <div className="filter-controls">
                <div className="filter-group">
                  <label className="filter-label">Filter by Date</label>
                  <input
                    type="date"
                    value={assembledFilterDate}
                    onChange={(e) => setAssembledFilterDate(e.target.value)}
                    className="filter-input"
                  />
                </div>
                <button onClick={handleFetchAssembledReports} className="fetch-button">
                  Fetch Reports
                </button>
              </div>
            </div>
            {assembledReports.length > 0 ? (
              renderAggregatedTable(assembledAggregated, "assembledItems", "Assembled Items")
            ) : (
              <p className="no-reports">No assembled reports available for the selected date.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssemblySummary;
