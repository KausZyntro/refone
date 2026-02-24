"use client";
import React from "react";
import {
  FaTruck,
  FaUndo,
  FaLock,
  FaAward,
  FaDollarSign,
  FaThumbsUp,
} from "react-icons/fa";

// import "./BadgeSection.css";

const TrustBadge = () => {
  const badges = [
    {
      icon: <FaTruck />,
      title: "Free Shipping",
    },
    {
      icon: <FaUndo />,
      title: "Easy Returns",
    },
    {
      icon: <FaLock />,
      title: "Secure Checkout",
    },
    {
      icon: <FaAward />,
      title: "1 Year Warranty",
    },
    {
      icon: <FaDollarSign />,
      title: "Money Back Guarantee",
    },
    {
      icon: <FaThumbsUp />,
      title: "Satisfaction Guarantee",
    },
  ];

  return (
    <div className="badge-container">
      {badges.map((badge, index) => (
        <div className="badge-card" key={index}>
          <div className="badge-icon">{badge.icon}</div>
          <p className="badge-title">{badge.title}</p>
        </div>
      ))}
    </div>
  );
};

export default TrustBadge;