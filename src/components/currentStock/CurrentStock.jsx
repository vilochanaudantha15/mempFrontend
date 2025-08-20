import React, { useState, useEffect, useRef } from "react";
import { FaBox, FaCog, FaCubes, FaThumbtack, FaTv, FaSearch, FaFilter, FaSortAmountDownAlt, FaExclamationTriangle, FaChevronDown } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CurrentStock.scss";

const API_BASE_URL = "/api";

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

const colorMap = {
  "CEB Covers": "#007AFF",
  "LECO Covers": "#5856D6",
  Base: "#FF2D55",
  Shutters: "#FF9500",
  "Defective Quantity": "#4CD964",
  "Defective Weight": "#FF3B30",
  PC: "#5AC8FA",
  "Crushed PC": "#FFCC00",
  MB: "#8E8E93",
  "Cover Beading": "#AF52DE",
  "Shutter Beading": "#34C759",
  Springs: "#00C7BE",
  corrugated_boxes: "#A2845E",
};

const CurrentStock = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("name");
  const [lowStockFilter, setLowStockFilter] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const contentRef = useRef(null);

  // Check if content is scrollable
  useEffect(() => {
    const checkScrollable = () => {
      if (contentRef.current) {
        const { scrollHeight, clientHeight } = contentRef.current;
        setShowScrollIndicator(scrollHeight > clientHeight);
      }
    };

    checkScrollable();
    window.addEventListener('resize', checkScrollable);
    
    return () => {
      window.removeEventListener('resize', checkScrollable);
    };
  }, [filteredItems]);

  // Fetch stock items
  useEffect(() => {
    const fetchStockItems = async () => {
      try {
        setLoading(true);
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
          color: colorMap[item.name] || "#007AFF",
        }));
        setItems(formattedItems);
        setFilteredItems(formattedItems);
        setLoading(false);
        setRefreshing(false);
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error(error.message || "Failed to load stock items. Please check the server connection.");
        setLoading(false);
        setRefreshing(false);
      }
    };
    fetchStockItems();
  }, []);

  // Filter and sort items
  useEffect(() => {
    let result = [...items];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply low stock filter
    if (lowStockFilter) {
      result = result.filter(item => item.quantity < 10);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "quantity") {
        return b.quantity - a.quantity;
      }
      return 0;
    });
    
    setFilteredItems(result);
  }, [searchTerm, items, sortBy, lowStockFilter]);

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate API call with timeout
    setTimeout(() => {
      setRefreshing(false);
      toast.success("Stock data refreshed");
    }, 1500);
  };

  const scrollToBottom = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: contentRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return (
      <div className="ios-loader-container">
        <div className="ios-spinner"></div>
        <p className="ios-loading-text">Loading Inventory</p>
      </div>
    );
  }

  return (
    <div className="ios-stock-container">
      <div className="ios-header">
        <h1 className="ios-title">Inventory</h1>
        <p className="ios-subtitle">Current stock levels</p>
      </div>

      <div className="ios-search-container">
        <div className="ios-search-bar">
          <FaSearch className="ios-search-icon" />
          <input
            type="text"
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search stock items"
            className="ios-search-input"
          />
          {(searchTerm || lowStockFilter) && (
            <button 
              className="ios-clear-search"
              onClick={() => {
                setSearchTerm("");
                setLowStockFilter(false);
              }}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="ios-controls">
        <div className="ios-filter-tabs">
          <button 
            className={`ios-filter-tab ${!lowStockFilter ? 'active' : ''}`}
            onClick={() => setLowStockFilter(false)}
          >
            All Items
          </button>
          <button 
            className={`ios-filter-tab ${lowStockFilter ? 'active' : ''}`}
            onClick={() => setLowStockFilter(true)}
          >
            <FaExclamationTriangle className="warning-icon" />
            Low Stock
          </button>
        </div>

        <div className="ios-sort-container">
          <div className="ios-sort-label">Sort by:</div>
          <select 
            value={sortBy} 
            onChange={(e) => handleSortChange(e.target.value)}
            className="ios-sort-select"
          >
            <option value="name">Name</option>
            <option value="quantity">Quantity</option>
          </select>
        </div>
      </div>

      <motion.div 
        className="ios-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="ios-stats">
          <div className="ios-stat-card">
            <span className="ios-stat-value">{items.length}</span>
            <span className="ios-stat-label">Total Items</span>
          </div>
          <div className="ios-stat-card">
            <span className="ios-stat-value">{items.filter(item => item.quantity < 10).length}</span>
            <span className="ios-stat-label">Low Stock</span>
          </div>
          <div className="ios-stat-card">
            <span className="ios-stat-value">
              {items.reduce((total, item) => total + item.quantity, 0)}
            </span>
            <span className="ios-stat-label">Total Units</span>
          </div>
        </div>

        <div className="ios-section-header">
          <h2>Stock Items</h2>
          <span className="ios-count-badge">{filteredItems.length} items</span>
        </div>

        <div className="ios-scroll-container" ref={contentRef}>
          <AnimatePresence>
            {filteredItems.length > 0 ? (
              <motion.div 
                className="ios-items-list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                {filteredItems.map((item) => (
                  <motion.div
                    key={item.id}
                    className="ios-item-card"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div 
                      className="ios-item-icon"
                      style={{ backgroundColor: `${item.color}15` }}
                    >
                      <span style={{ color: item.color }}>
                        {item.icon}
                      </span>
                    </div>
                    <div className="ios-item-details">
                      <h3 className="ios-item-name">{item.name}</h3>
                      <div className="ios-stock-info">
                        <span className={`ios-item-quantity ${item.quantity < 5 ? 'low-stock' : ''}`}>
                          {item.quantity} units
                        </span>
                        <div className="ios-stock-bar">
                          <div 
                            className="ios-stock-fill"
                            style={{ 
                              width: `${Math.min(item.quantity, 100)}%`,
                              backgroundColor: item.quantity < 10 ? '#FF3B30' : item.color
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    {item.quantity < 10 && (
                      <div className="ios-low-stock-indicator">
                        <FaExclamationTriangle />
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                className="ios-empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="ios-empty-icon">📦</div>
                <h3>No items found</h3>
                <p>Try adjusting your search or filter criteria</p>
                <button 
                  className="ios-empty-action"
                  onClick={() => {
                    setSearchTerm("");
                    setLowStockFilter(false);
                  }}
                >
                  Reset Filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {showScrollIndicator && (
          <motion.div 
            className="ios-scroll-indicator"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            onClick={scrollToBottom}
          >
            <FaChevronDown />
            <span>Scroll for more</span>
          </motion.div>
        )}
      </motion.div>

      <button 
        className={`ios-refresh-button ${refreshing ? 'refreshing' : ''}`}
        onClick={handleRefresh}
        disabled={refreshing}
      >
        {refreshing ? 'Refreshing...' : 'Refresh Data'}
      </button>

      <ToastContainer 
        position="bottom"
        autoClose={3000}
        hideProgressBar={true}
        toastClassName="ios-toast"
        progressClassName="ios-toast-progress"
      />
    </div>
  );
};

export default React.memo(CurrentStock);
