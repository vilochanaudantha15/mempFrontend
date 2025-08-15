import React, { useState, useEffect } from "react";
import { FaBox, FaCog, FaCubes, FaThumbtack, FaTv, FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./currentStock.scss";

const API_BASE_URL = "/api"; // For office server with reverse proxy

const iconMap = {
  "CEB Covers": <FaBox />,
  "LECO Covers": <FaCog />,
  Base: <FaCubes />,
  Shutters: <FaThumbtack />,
  "Defective Quantity": <FaTv />,
  "Defective Weight": <FaTv />,
  PC: <FaBox />,
  "Crushed PC": <FaBox />,
  MB: <FaCubes />,
  "Cover Beading": <FaThumbtack />,
  "Shutter Beading": <FaThumbtack />,
  Springs: <FaCog />,
  corrugated_boxes: <FaCog />,
};

const CurrentStock = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch stock items
  useEffect(() => {
    const fetchStockItems = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/stock`);
        if (!response.ok) {
          throw new Error(`Failed to fetch stock items: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        const formattedItems = data.map((item) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          icon: iconMap[item.name] || <FaBox />,
        }));
        setItems(formattedItems);
        setFilteredItems(formattedItems);
        setLoading(false);
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error(error.message || "Failed to load stock items. Please check the server connection.");
        setLoading(false);
      }
    };
    fetchStockItems();
  }, []);

  // Filter items based on search term
  useEffect(() => {
    setFilteredItems(
      items.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, items]);

  if (loading) {
    return (
      <div className="loader">
        <div className="spinner"></div>
        Loading stock items...
      </div>
    );
  }

  return (
    <div className="stock-container">
      <h2 className="stock-title">Current Stock</h2>
      <div className="search-bar">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search stock items"
        />
      </div>
      <div className="stock-list">
        {filteredItems.map((item) => (
          <motion.div
            key={item.id}
            className="stock-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.03 }}
          >
            <div className="icon-wrapper">{item.icon}</div>
            <div className="info">
              <h3 className="item-name">{item.name}</h3>
              <p className="item-quantity">Quantity: {item.quantity}</p>
            </div>
          </motion.div>
        ))}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default React.memo(CurrentStock);
