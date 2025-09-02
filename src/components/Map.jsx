import React, { useState, useEffect } from 'react';
import L from 'leaflet'; // Import Leaflet for map rendering
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS

const SriLankaMap = () => {
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [hoveredProvince, setHoveredProvince] = useState(null);

  // Province data with real-world coordinates (approximated from SVG centers)
  const provinces = [
    {
      id: 'western',
      name: 'Western Province',
      color: '#FF6B6B',
      capital: 'Colombo',
      center: { lat: 6.9271, lng: 79.8612 }, // Colombo
    },
    {
      id: 'central',
      name: 'Central Province',
      color: '#4ECDC4',
      capital: 'Kandy',
      center: { lat: 7.2906, lng: 80.6337 }, // Kandy
    },
    {
      id: 'southern',
      name: 'Southern Province',
      color: '#45B7D1',
      capital: 'Galle',
      center: { lat: 6.0535, lng: 80.2210 }, // Galle
    },
    {
      id: 'northern',
      name: 'Northern Province',
      color: '#96CEB4',
      capital: 'Jaffna',
      center: { lat: 9.6615, lng: 80.0255 }, // Jaffna
    },
    {
      id: 'eastern',
      name: 'Eastern Province',
      color: '#FFEAA7',
      capital: 'Trincomalee',
      center: { lat: 8.5874, lng: 81.2152 }, // Trincomalee
    },
    {
      id: 'northWestern',
      name: 'North Western Province',
      color: '#DDA0DD',
      capital: 'Kurunegala',
      center: { lat: 7.4863, lng: 80.3659 }, // Kurunegala
    },
    {
      id: 'northCentral',
      name: 'North Central Province',
      color: '#98D8C8',
      capital: 'Anuradhapura',
      center: { lat: 8.3114, lng: 80.4037 }, // Anuradhapura
    },
    {
      id: 'uva',
      name: 'Uva Province',
      color: '#F7DC6F',
      capital: 'Badulla',
      center: { lat: 6.9934, lng: 81.0550 }, // Badulla
    },
    {
      id: 'sabaragamuwa',
      name: 'Sabaragamuwa Province',
      color: '#BB8FCE',
      capital: 'Ratnapura',
      center: { lat: 6.6828, lng: 80.3993 }, // Ratnapura
    },
  ];

  // Initialize the map
  useEffect(() => {
    const map = L.map('map', {
      center: [7.8731, 80.7718], // Center of Sri Lanka
      zoom: 8,
      maxBounds: [
        [5.5, 79.0], // Southwest
        [10.0, 82.0], // Northeast
      ],
      maxBoundsViscosity: 1.0,
    });

    // Define base layers
    const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    });

    const satelliteLayer = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        attribution:
          '&copy; <a href="https://www.esri.com/">Esri</a>, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      }
    );

    // Add default OSM layer to the map
    osmLayer.addTo(map);

    // Add layer control to switch between OSM and Satellite
    const baseLayers = {
      'Street Map': osmLayer,
      'Satellite View': satelliteLayer,
    };
    L.control.layers(baseLayers).addTo(map);

    // Add province markers
    provinces.forEach((province) => {
      const marker = L.circleMarker([province.center.lat, province.center.lng], {
        radius: 12, // Increased marker size for better visibility
        fillColor: province.color,
        color: '#2c3e50',
        weight: 3,
        opacity: 1,
        fillOpacity: selectedProvince?.id === province.id ? 0.9 : hoveredProvince?.id === province.id ? 0.8 : 1,
      }).addTo(map);

      // Add click event
      marker.on('click', () => {
        setSelectedProvince(province);
        console.log(`Clicked: ${province.name}`);
      });

      // Add hover events
      marker.on('mouseover', () => {
        setHoveredProvince(province);
      });
      marker.on('mouseout', () => {
        setHoveredProvince(null);
      });

      // Add popup with province name
      marker.bindPopup(province.name, {
        offset: [0, -10],
        autoClose: false,
        closeOnClick: false,
      }).openPopup();
    });

    // Cleanup map on component unmount
    return () => {
      map.remove();
    };
  }, [selectedProvince, hoveredProvince]);

  const handleProvinceClick = (province) => {
    setSelectedProvince(province);
    console.log(`Clicked: ${province.name}`);
  };

  const handleProvinceHover = (province) => {
    setHoveredProvince(province);
  };

  const handleMouseLeave = () => {
    setHoveredProvince(null);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: '40px',
        fontFamily: "'Roboto', sans-serif", // Modern font
        background: 'linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%)', // Modern gradient background
        minHeight: '100vh',
        boxSizing: 'border-box',
        gap: '40px',
      }}
    >
      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <header
          style={{
            width: '100%',
            textAlign: 'center',
            marginBottom: '30px',
          }}
        >
          <h1
            style={{
              color: '#1a237e',
              fontSize: '36px', // Larger title
              fontWeight: '700',
              margin: '0',
              textShadow: '1px 1px 2px rgba(0,0,0,0.1)', // Subtle shadow for modern feel
            }}
          >
            Explore Sri Lanka Provinces
          </h1>
          <p
            style={{
              color: '#3949ab',
              fontSize: '18px', // Larger subtitle
              marginTop: '10px',
              maxWidth: '600px',
              margin: '10px auto 0',
            }}
          >
            Interactive map with province details. Hover over markers for info or switch to satellite view using the layer control.
          </p>
        </header>

        <div
          style={{
            position: 'relative',
            backgroundColor: 'white',
            borderRadius: '20px', // More rounded for modern look
            boxShadow: '0 8px 30px rgba(0,0,0,0.15)', // Deeper shadow
            padding: '20px',
            width: '100%',
            maxWidth: '900px', // Made larger
            height: '700px', // Made taller
            overflow: 'hidden',
            transition: 'all 0.3s ease', // Smooth transition
          }}
        >
          <div id="map" style={{ width: '100%', height: '100%', borderRadius: '16px' }}></div>

          {/* Highlighted province name on hover */}
          {hoveredProvince && (
            <div
              style={{
                position: 'absolute',
                top: '30px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'rgba(26, 35, 126, 0.95)', // Modern dark blue
                color: 'white',
                padding: '12px 20px',
                borderRadius: '30px',
                fontSize: '16px', // Larger font
                fontWeight: '600',
                pointerEvents: 'none',
                zIndex: 10,
                boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
              }}
            >
              {hoveredProvince.name}
            </div>
          )}
        </div>

        {/* Selected province info */}
        {selectedProvince && (
          <div
            style={{
              padding: '30px',
              backgroundColor: 'white',
              border: `4px solid ${selectedProvince.color}`,
              borderRadius: '20px',
              marginTop: '30px',
              textAlign: 'center',
              width: '100%',
              maxWidth: '500px',
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
              transition: 'transform 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <h3
              style={{
                color: selectedProvince.color,
                margin: '0 0 20px 0',
                fontSize: '28px', // Larger
                fontWeight: '700',
              }}
            >
              {selectedProvince.name}
            </h3>
            <p style={{ margin: '15px 0', color: '#333', fontSize: '18px' }}>
              <strong>Capital:</strong> {selectedProvince.capital}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '20px' }}>
              <div
                style={{
                  width: '35px', // Larger color swatch
                  height: '35px',
                  backgroundColor: selectedProvince.color,
                  borderRadius: '8px',
                  marginRight: '15px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                }}
              />
              <span style={{ color: '#6c757d', fontSize: '16px' }}>Province Color</span>
            </div>
            <button
              onClick={() => setSelectedProvince(null)}
              style={{
                marginTop: '20px',
                padding: '12px 24px',
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '16px',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#c0392b')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#e74c3c')}
            >
              Close
            </button>
          </div>
        )}
      </div>

      {/* Sidebar for Province Legend */}
      <aside
        style={{
          width: '300px', // Fixed sidebar width
          backgroundColor: 'white',
          borderRadius: '20px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
          padding: '30px',
          height: 'fit-content',
          position: 'sticky',
          top: '40px',
        }}
      >
        <h3
          style={{
            color: '#1a237e',
            marginBottom: '25px',
            fontSize: '24px', // Larger
            fontWeight: '700',
          }}
        >
          Provinces of Sri Lanka
        </h3>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
          }}
        >
          {provinces.map((province) => (
            <div
              key={`legend-${province.id}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                padding: '15px',
                borderRadius: '12px',
                backgroundColor: selectedProvince?.id === province.id ? '#e8f0fe' : 'transparent',
                transition: 'all 0.3s ease',
                border:
                  selectedProvince?.id === province.id
                    ? `3px solid ${province.color}`
                    : '3px solid transparent',
              }}
              onClick={() => handleProvinceClick(province)}
              onMouseEnter={(e) => {
                handleProvinceHover(province);
                e.currentTarget.style.backgroundColor = '#f8f9fa';
              }}
              onMouseLeave={(e) => {
                handleMouseLeave();
                e.currentTarget.style.backgroundColor =
                  selectedProvince?.id === province.id ? '#e8f0fe' : 'transparent';
              }}
            >
              <div
                style={{
                  width: '28px', // Larger swatch
                  height: '28px',
                  backgroundColor: province.color,
                  marginRight: '15px',
                  borderRadius: '6px',
                  boxShadow: '0 3px 6px rgba(0,0,0,0.2)',
                }}
              />
              <span style={{ fontSize: '16px', fontWeight: '500', color: '#333' }}>{province.name}</span>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
};

export default SriLankaMap;
