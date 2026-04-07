import React from "react";
import "@/styles/ActionCards.css";

const ActionCards = ({ items }) => {
  return (
    <div className="action-container">
      {items.map((item, index) => (
        <a key={index} href="/allProduct" className="action-card">
          <div className="icon">{item.icon}</div>
          <div className="content">
            <h3>{item.title}</h3>
            <p>{item.subtitle}</p>
          </div>
        </a>
      ))}
    </div>
  );
};

export default ActionCards;