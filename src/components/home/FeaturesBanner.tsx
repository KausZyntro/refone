import React from 'react';
import '@/styles/FeaturesBanner.css';
import { FaCheckCircle, FaShieldAlt, FaUndoAlt, FaCreditCard } from 'react-icons/fa';

const FeaturesBanner = () => {
  const features = [
    {
      icon: <FaCheckCircle />,
      title: "32+ Quality Checks",
      description: "Every phone is tested across 32+ points"
    },
    {
      icon: <FaShieldAlt />,
      title: "12 Months Warranty",
      description: "Worry-free coverage on all devices"
    },
    {
      icon: <FaUndoAlt />,
      title: "7 Days Replacement",
      description: "Not satisfied? Replace it easily"
    },
    {
      icon: <FaCreditCard />,
      title: "Secure Payments",
      description: "100% safe & secure payment options"
    }
  ];

  return (
    <div className="container" style={{ marginTop: '0', marginBottom: '32px' }}>
      <div className="features-banner-wrapper">
        {features.map((feature, index) => (
          <div key={index} className="feature-item">
            <div className="feature-icon">
              {feature.icon}
            </div>
            <div className="feature-text">
              <h4>{feature.title}</h4>
              <p>{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesBanner;
