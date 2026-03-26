import React from "react";
import "@/styles/ActionCards.css";

const ActionCards = ({ items }) => {
  return (
    <a href="/allProduct">
    <div className="action-container">
      {items.map((item, index) => (
        <div key={index} className="action-card">
          <div className="icon">{item.icon}</div>
          <div className="content">
            <h3>{item.title}</h3>
            <p>{item.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
    </a>
  );
};

export default ActionCards;