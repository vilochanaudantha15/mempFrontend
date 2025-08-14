import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  Breadcrumbs,
  Typography,
  IconButton,
  Radio,
  RadioGroup,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';
import { keyframes } from '@emotion/react';
import { alpha } from '@mui/material/styles';

const API_BASE_URL = "/api"; // For office server with reverse proxy

// Blue-themed color palette
const blueTheme = {
  primary: '#1976d2',
  primaryLight: '#63a4ff',
  primaryDark: '#004ba0',
  secondary: '#82b1ff',
  background: '#f5f9ff',
  text: '#1a237e',
  lightText: '#e3f2fd',
  glass: 'rgba(225, 238, 255, 0.25)',
  error: '#d32f2f'
};

// Liquid glass animation
const liquidAnimation = keyframes`
  0% { border-radius: 60% 40% 30% 70%/60% 30% 70% 40%; }
  50% { border-radius: 30% 60% 70% 40%/50% 60% 30% 60%; }
  100% { border-radius: 60% 40% 30% 70%/60% 30% 70% 40%; }
`;

// Glass morphism effect
const glassEffect = {
  background: 'rgba(225, 238, 255, 0.25)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(200, 220, 255, 0.4)',
  boxShadow: '0 8px 32px 0 rgba(31, 96, 135, 0.2)',
};

// Neumorphism effect
const neumorphismEffect = {
  background: blueTheme.background,
  borderRadius: '16px',
  boxShadow: `
    8px 8px 16px ${alpha(blueTheme.primaryDark, 0.1)},
    -8px -8px 16px ${alpha('#fff', 0.8)}
  `,
};

// Floating animation
const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0px); }
`;

// Styled components
const DeliveryWrapper = styled('div')({
  padding: '24px',
  background: 'linear-gradient(135deg, #f0f7ff 0%, #d0e4ff 100%)',
  minHeight: '100vh',
});

const DeliveryContainer = styled('div')({
  ...glassEffect,
  borderRadius: '24px',
  padding: '32px',
  marginTop: '24px',
  background: 'rgba(240, 247, 255, 0.7)',
});

const DeliveryHeader = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '32px',
});

const DeliveryTitle = styled(Typography)({
  fontWeight: 700,
  fontSize: '1.75rem',
  color: blueTheme.text,
});

const ControlGroup = styled('div')({
  marginBottom: '20px',
  padding: '10px',
});

const ControlLabel = styled('label')({
  display: 'block',
  marginBottom: '8px',
  fontWeight: 500,
  color: blueTheme.text,
});

const ControlInput = styled('input')({
  width: '100%',
  padding: '12px 16px',
  borderRadius: '12px',
  border: '1px solid rgba(200, 220, 255, 0.6)',
  background: 'rgba(255, 255, 255, 0.6)',
  fontSize: '1rem',
  transition: 'all 0.3s ease',
  color: blueTheme.text,
  '&:focus': {
    outline: 'none',
    borderColor: blueTheme.primary,
    boxShadow: `0 0 0 3px ${alpha(blueTheme.primary, 0.2)}`,
  },
  '&.control-input--date': {
    maxWidth: '220px',
  },
  '&.control-input--readonly': {
    background: 'rgba(255, 255, 255, 0.4)',
    color: '#5c6bc0',
  },
  '&.control-input--customer': {
    minWidth: '100%',
  },
});

const ControlSelect = styled(Select)({
  width: '100%',
  '& .MuiSelect-select': {
    padding: '12px 16px',
    borderRadius: '12px',
    background: 'rgba(255, 255, 255, 0.6)',
    fontSize: '1rem',
    color: blueTheme.text,
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: '1px solid rgba(200, 220, 255, 0.6)',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: blueTheme.primary,
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: blueTheme.primary,
    boxShadow: `0 0 0 3px ${alpha(blueTheme.primary, 0.2)}`,
  },
});

const ActionButton = styled('button')({
  padding: '12px 24px',
  borderRadius: '12px',
  border: 'none',
  background: `linear-gradient(135deg, ${blueTheme.primary} 0%, ${blueTheme.secondary} 100%)`,
  color: 'white',
  fontWeight: 600,
  fontSize: '1rem',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 8px 16px ${alpha(blueTheme.primary, 0.3)}`,
    background: `linear-gradient(135deg, ${blueTheme.primaryLight} 0%, ${blueTheme.primary} 100%)`,
  },
});

const SecondaryButton = styled('button')({
  padding: '10px 20px',
  borderRadius: '10px',
  border: `1px solid ${blueTheme.primary}`,
  background: 'rgba(255, 255, 255, 0.6)',
  color: blueTheme.primary,
  fontWeight: 500,
  fontSize: '0.95rem',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  '&:hover': {
    background: 'rgba(200, 220, 255, 0.4)',
  },
});

const ErrorMessage = styled('div')({
  padding: '12px 16px',
  borderRadius: '12px',
  background: 'rgba(239, 68, 68, 0.1)',
  color: blueTheme.error,
  marginBottom: '20px',
  border: '1px solid rgba(239, 68, 68, 0.2)',
});

const PopupOverlay = styled('div')({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0, 40, 80, 0.5)',
  backdropFilter: 'blur(5px)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
});

const PopupContent = styled('div')({
  ...glassEffect,
  borderRadius: '24px',
  padding: '32px',
  width: '90%',
  maxWidth: '800px',
  maxHeight: '90vh',
  overflowY: 'auto',
  position: 'relative',
  background: 'rgba(240, 247, 255, 0.9)',
  border: `1px solid ${alpha(blueTheme.primary, 0.2)}`,
  boxShadow: `0 12px 40px ${alpha(blueTheme.primaryDark, 0.2)}`,
  animation: `${floatAnimation} 4s ease-in-out infinite`,
});

const CloseButton = styled(IconButton)({
  position: 'absolute',
  top: '16px',
  right: '16px',
  color: blueTheme.text,
  '&:hover': {
    color: blueTheme.primary,
    backgroundColor: alpha(blueTheme.primary, 0.1),
  },
});

const DeliveryNote = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    date: "",
    deliveryNoteNumber: "",
    chequeReceived: "No",
    purchaseOrderNo: "",
    proformaInvoiceNo: "",
    invoiceNo: "",
    customer: "",
    from: "Meter Enclosure Manufacturing Plant, Galigamuwa",
    to: "",
    description: "CEB Meter Enclosure",
    quantity: "",
    checkedBy: "",
    approvedBy: "Kanishka Ravindranath",
    remarks: "",
    receivedByName: "",
    signature: "",
    receivedDate: "",
  });

  const [notes, setNotes] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [filterDate, setFilterDate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const fetchNotes = async () => {
    try {
      const params = {};
      if (filterDate) params.date = filterDate;

      const response = await axios.get(`${API_BASE_URL}/delivery-notes`, { params });
      setNotes(response.data);
      setErrorMessage("");
    } catch (error) {
      console.error("Failed to fetch delivery notes:", error);
      setErrorMessage(error.response?.data?.message || "Failed to fetch delivery notes. Please check the server connection.");
      setNotes([]);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleFetchNotes = () => {
    fetchNotes();
  };

  const handleInputChange = (e, field) => {
    const value = e.target ? e.target.value : e;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRadioChange = (e) => {
    setFormData((prev) => ({ ...prev, chequeReceived: e.target.value }));
  };

  const generateDeliveryNoteNumber = async (date) => {
    if (date) {
      const selectedDate = new Date(date);
      const year = selectedDate.getFullYear();
      const dayOfYear = Math.floor(
        (selectedDate - new Date(`${year}-01-01`)) / (1000 * 60 * 60 * 24)
      ) + 1;
      const baseNoteNumber = `DN${year}${dayOfYear.toString().padStart(3, "0")}-`;

      try {
        const response = await axios.get(`${API_BASE_URL}/delivery-notes`, {
          params: { date },
        });
        const existingNotes = response.data.filter((note) =>
          note.deliveryNoteNumber.startsWith(baseNoteNumber)
        );
        const sequence = (existingNotes.length + 1).toString().padStart(2, "0");
        const noteNumber = `${baseNoteNumber}${sequence}`;
        setFormData((prev) => ({ ...prev, deliveryNoteNumber: noteNumber }));
        setErrorMessage("");
      } catch (error) {
        console.error("Error generating delivery note number:", error);
        setErrorMessage(error.response?.data?.message || "Failed to generate unique delivery note number. Please check the server connection.");
      }
    }
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setFormData((prev) => ({ ...prev, date }));
    generateDeliveryNoteNumber(date);
  };

  const validateForm = () => {
    if (!formData.date || !formData.deliveryNoteNumber || !formData.customer || !formData.receivedByName || !formData.quantity || !formData.description) {
      setErrorMessage("Date, delivery note number, customer, received by name, quantity, and description are required");
      return false;
    }
    if (isNaN(formData.quantity) || Number(formData.quantity) < 0) {
      setErrorMessage("Invalid quantity");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!validateForm()) return;

    try {
      const response = await axios.post(`${API_BASE_URL}/delivery-notes`, {
        deliveryNoteNumber: formData.deliveryNoteNumber,
        receivedByName: formData.receivedByName,
        signature: formData.signature,
        deliveryDate: formData.date,
        customer: formData.customer,
        description: formData.description,
        quantity: formData.quantity,
      });
      setFormData({
        date: "",
        deliveryNoteNumber: "",
        chequeReceived: "No",
        purchaseOrderNo: "",
        proformaInvoiceNo: "",
        invoiceNo: "",
        customer: "",
        from: "Meter Enclosure Manufacturing Plant, Galigamuwa",
        to: "",
        description: "CEB Meter Enclosure",
        quantity: "",
        checkedBy: "",
        approvedBy: "Kanishka Ravindranath",
        remarks: "",
        receivedByName: "",
        signature: "",
        receivedDate: "",
      });
      setIsPopupOpen(false);
      fetchNotes();
    } catch (error) {
      console.error("Submission error:", error);
      setErrorMessage(error.response?.data?.message || "Failed to submit delivery note. Please check the server connection.");
    }
  };

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
    setErrorMessage("");
  };

  return (
    <DeliveryWrapper>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link
          underline="hover"
          color="inherit"
          to="/dashboard"
          onClick={(e) => {
            e.preventDefault();
            navigate("/dashboard");
          }}
          style={{ color: blueTheme.primary }}
        >
          Dashboard
        </Link>
        <Typography color={blueTheme.text}>Delivery Note</Typography>
      </Breadcrumbs>

      {isPopupOpen && (
        <PopupOverlay>
          <PopupContent>
            <CloseButton onClick={togglePopup} aria-label="Close popup">
              <CloseIcon />
            </CloseButton>
            <DeliveryHeader>
              <DeliveryTitle variant="h2">Delivery Note</DeliveryTitle>
            </DeliveryHeader>
            
            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
              gap: '20px',
              marginBottom: '32px',
              background: 'rgba(200, 220, 255, 0.2)',
              padding: '20px',
              borderRadius: '16px',
              border: `1px dashed ${alpha(blueTheme.primary, 0.2)}`
            }}>
              <ControlGroup>
                <ControlLabel>Date</ControlLabel>
                <ControlInput
                  type="date"
                  value={formData.date}
                  onChange={handleDateChange}
                  className="control-input--date"
                  required
                />
              </ControlGroup>
              <ControlGroup>
                <ControlLabel>Delivery Note No</ControlLabel>
                <ControlInput
                  type="text"
                  value={formData.deliveryNoteNumber}
                  readOnly
                  className="control-input--readonly"
                />
              </ControlGroup>
              <ControlGroup>
                <ControlLabel>Cheque Received</ControlLabel>
                <RadioGroup
                  value={formData.chequeReceived}
                  onChange={handleRadioChange}
                  row
                >
                  <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="No" control={<Radio />} label="No" />
                </RadioGroup>
              </ControlGroup>
              <ControlGroup>
                <ControlLabel>Purchase Order No</ControlLabel>
                <ControlInput
                  type="text"
                  value={formData.purchaseOrderNo}
                  onChange={(e) => handleInputChange(e, "purchaseOrderNo")}
                />
              </ControlGroup>
              <ControlGroup>
                <ControlLabel>Proforma Invoice No</ControlLabel>
                <ControlInput
                  type="text"
                  value={formData.proformaInvoiceNo}
                  onChange={(e) => handleInputChange(e, "proformaInvoiceNo")}
                />
              </ControlGroup>
              <ControlGroup>
                <ControlLabel>Invoice No</ControlLabel>
                <ControlInput
                  type="text"
                  value={formData.invoiceNo}
                  onChange={(e) => handleInputChange(e, "invoiceNo")}
                />
              </ControlGroup>
              <ControlGroup style={{ gridColumn: '1 / -1' }}>
                <ControlLabel>Customer</ControlLabel>
                <ControlInput
                  type="text"
                  value={formData.customer}
                  onChange={(e) => handleInputChange(e, "customer")}
                  placeholder="Enter customer"
                  required
                  className="control-input--customer"
                />
              </ControlGroup>
              <ControlGroup style={{ gridColumn: '1 / -1', display: 'flex', gap: '20px' }}>
                <div style={{ flex: 1, padding: '10px' }}>
                  <ControlLabel>From</ControlLabel>
                  <ControlInput
                    type="text"
                    value={formData.from}
                    onChange={(e) => handleInputChange(e, "from")}
                    readOnly
                    className="control-input--readonly"
                  />
                </div>
                <div style={{ flex: 1, padding: '10px' }}>
                  <ControlLabel>To</ControlLabel>
                  <ControlInput
                    type="text"
                    value={formData.to}
                    onChange={(e) => handleInputChange(e, "to")}
                    placeholder="Enter destination"
                  />
                </div>
              </ControlGroup>
              <ControlGroup style={{ gridColumn: '1 / -1', display: 'flex', gap: '20px' }}>
                <div style={{ flex: 1, padding: '10px' }}>
                  <ControlLabel>Description</ControlLabel>
                  <FormControl fullWidth>
                    <ControlSelect
                      value={formData.description}
                      onChange={(e) => handleInputChange(e, "description")}
                    >
                      <MenuItem value="CEB Meter Enclosure">CEB Meter Enclosure</MenuItem>
                      <MenuItem value="LECO Meter Enclosure">LECO Meter Enclosure</MenuItem>
                    </ControlSelect>
                  </FormControl>
                </div>
                <div style={{ flex: 1, padding: '10px' }}>
                  <ControlLabel>Quantity</ControlLabel>
                  <ControlInput
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange(e, "quantity")}
                    placeholder="Enter quantity"
                    min="0"
                    step="1"
                    required
                  />
                </div>
              </ControlGroup>
              <ControlGroup>
                <ControlLabel>Checked & Verified By</ControlLabel>
                <ControlInput
                  type="text"
                  value={formData.checkedBy}
                  onChange={(e) => handleInputChange(e, "checkedBy")}
                  placeholder="Enter supervisor name"
                />
              </ControlGroup>
              <ControlGroup>
                <ControlLabel>Approved By</ControlLabel>
                <ControlInput
                  type="text"
                  value={formData.approvedBy}
                  onChange={(e) => handleInputChange(e, "approvedBy")}
                  readOnly
                  className="control-input--readonly"
                />
              </ControlGroup>
              <ControlGroup>
                <ControlLabel>Remarks</ControlLabel>
                <ControlInput
                  type="text"
                  value={formData.remarks}
                  onChange={(e) => handleInputChange(e, "remarks")}
                  placeholder="Enter remarks"
                />
              </ControlGroup>
              <ControlGroup>
                <ControlLabel>Received By Name</ControlLabel>
                <ControlInput
                  type="text"
                  value={formData.receivedByName}
                  onChange={(e) => handleInputChange(e, "receivedByName")}
                  placeholder="Enter name"
                  required
                />
              </ControlGroup>
              <ControlGroup>
                <ControlLabel>Signature</ControlLabel>
                <ControlInput
                  type="text"
                  value={formData.signature}
                  onChange={(e) => handleInputChange(e, "signature")}
                  placeholder="Enter signature or filename"
                />
              </ControlGroup>
              <ControlGroup>
                <ControlLabel>Received Date</ControlLabel>
                <ControlInput
                  type="date"
                  value={formData.receivedDate}
                  onChange={(e) => handleInputChange(e, "receivedDate")}
                  className="control-input--date"
                />
              </ControlGroup>
            </div>

            <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              marginTop: '32px',
              paddingTop: '20px',
              borderTop: `1px solid ${alpha(blueTheme.primary, 0.2)}`
            }}>
              <ActionButton onClick={handleSubmit}>
                Submit Delivery Note
              </ActionButton>
            </div>
          </PopupContent>
        </PopupOverlay>
      )}

      <DeliveryContainer>
        <DeliveryHeader>
          <DeliveryTitle variant="h2">Delivery Notes</DeliveryTitle>
          <ActionButton onClick={togglePopup}>
            <AddIcon /> New Delivery Note
          </ActionButton>
        </DeliveryHeader>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '20px', 
          marginBottom: '32px',
          background: 'rgba(200, 220, 255, 0.2)',
          padding: '20px',
          borderRadius: '16px'
        }}>
          <ControlGroup>
            <ControlLabel>Filter by Date</ControlLabel>
            <ControlInput
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="control-input--date"
            />
          </ControlGroup>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <SecondaryButton onClick={handleFetchNotes}>
              <SearchIcon /> Search Notes
            </SecondaryButton>
          </div>
        </div>

        {notes.length > 0 ? (
          notes.map((note) => (
            <div key={note.deliveryNoteNumber} style={{ 
              ...glassEffect, 
              borderRadius: '16px', 
              padding: '24px', 
              marginBottom: '24px',
              background: 'rgba(255, 255, 255, 0.8)',
              border: `1px solid ${alpha(blueTheme.primary, 0.2)}`
            }}>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
                gap: '20px',
                marginBottom: '24px',
                paddingBottom: '20px',
                borderBottom: `1px dashed ${alpha(blueTheme.primary, 0.2)}`
              }}>
                <ControlGroup>
                  <ControlLabel>Date</ControlLabel>
                  <ControlInput
                    type="text"
                    value={note.date ? new Date(note.date).toLocaleDateString() : "-"}
                    readOnly
                    className="control-input--readonly"
                  />
                </ControlGroup>
                <ControlGroup>
                  <ControlLabel>Delivery Note No</ControlLabel>
                  <ControlInput
                    type="text"
                    value={note.deliveryNoteNumber || "-"}
                    readOnly
                    className="control-input--readonly"
                  />
                </ControlGroup>
                <ControlGroup>
                  <ControlLabel>Customer</ControlLabel>
                  <ControlInput
                    type="text"
                    value={note.customer || "-"}
                    readOnly
                    className="control-input--readonly control-input--customer"
                  />
                </ControlGroup>
                <ControlGroup>
                  <ControlLabel>Description</ControlLabel>
                  <ControlInput
                    type="text"
                    value={note.description || "-"}
                    readOnly
                    className="control-input--readonly"
                  />
                </ControlGroup>
                <ControlGroup>
                  <ControlLabel>Quantity</ControlLabel>
                  <ControlInput
                    type="text"
                    value={note.quantity !== undefined && note.quantity !== null ? note.quantity : "-"}
                    readOnly
                    className="control-input--readonly"
                  />
                </ControlGroup>
                <ControlGroup>
                  <ControlLabel>Received By Name</ControlLabel>
                  <ControlInput
                    type="text"
                    value={note.receivedByName || "-"}
                    readOnly
                    className="control-input--readonly"
                  />
                </ControlGroup>
                <ControlGroup>
                  <ControlLabel>Signature</ControlLabel>
                  <ControlInput
                    type="text"
                    value={note.signature || "-"}
                    readOnly
                    className="control-input--readonly"
                  />
                </ControlGroup>
              </div>
            </div>
          ))
        ) : (
          <div style={{ 
            ...glassEffect, 
            padding: '24px', 
            borderRadius: '16px', 
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.8)',
            border: `1px solid ${alpha(blueTheme.primary, 0.2)}`
          }}>
            <Typography variant="body1" style={{ color: blueTheme.text }}>
              No delivery notes available
            </Typography>
          </div>
        )}
      </DeliveryContainer>
    </DeliveryWrapper>
  );
};

export default DeliveryNote;