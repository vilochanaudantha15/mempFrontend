// ProfileCard.jsx
import React from "react";
import "./profile.scss";

const ProfileCard = ({
  name = "John Doe",
  position = "Software Engineer",
  department = "Engineering",
  avatar = "https://randomuser.me/api/portraits/men/32.jpg",
  email = "john.doe@company.com",
  phone = "+1 (555) 123-4567",
  office = "Room 4B-12",
  teamSize = 8,
  projects = 12,
  status = "Active",
}) => {
  return (
    <div className="profile-card">
      <div className="profile-header">
        <div className="avatar-container">
          <img src={avatar} alt={name} className="avatar" />
          <div className={`status-indicator ${status.toLowerCase()}`}></div>
        </div>
        <div className="header-info">
          <h2 className="name">{name}</h2>
          <p className="position">{position}</p>
          <p className="department">{department}</p>
        </div>
      </div>

      <div className="profile-contact">
        <div className="contact-item">
          <span className="icon">✉️</span>
          <span>{email}</span>
        </div>
        <div className="contact-item">
          <span className="icon">📞</span>
          <span>{phone}</span>
        </div>
      </div>

      <div className="profile-details">
        <div className="detail-item">
          <span className="label">Office</span>
          <span className="value">{office}</span>
        </div>
        <div className="detail-item">
          <span className="label">Team Size</span>
          <span className="value">{teamSize}</span>
        </div>
        <div className="detail-item">
          <span className="label">Projects</span>
          <span className="value">{projects}</span>
        </div>
      </div>

      <div className="profile-actions">
        <button className="contact-btn">Contact</button>
        <button className="view-btn">View Profile</button>
      </div>
    </div>
  );
};

export default ProfileCard;
