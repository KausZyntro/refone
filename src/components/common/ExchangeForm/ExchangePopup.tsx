'use client';

import React, { useState, useEffect } from 'react';
import ExchangeForm from './ExchangeForm';

export default function ExchangePopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    
    const hasShown = sessionStorage.getItem('exchangePopupShown');
    
    if (!hasShown) {
     
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem('exchangePopupShown', 'true');
      }, 1500); 
      
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      backdropFilter: 'blur(5px)',
    }}>
      <div style={{
        position: 'relative',
        backgroundColor: '#fff',
        borderRadius: '16px',
        maxWidth: '1000px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      }} className="exchangePopupContent">
        
        {/* Close Button */}
        <button 
          onClick={() => setIsOpen(false)}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: '#f1f5f9',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 100,
            fontSize: '24px',
            color: '#333',
            transition: 'background 0.2s',
          }}
          onMouseOver={(e) => e.currentTarget.style.background = '#e2e8f0'}
          onMouseOut={(e) => e.currentTarget.style.background = '#f1f5f9'}
          title="Close"
        >
          &times;
        </button>       
        <div>
          <ExchangeForm />
        </div>

      </div>
    </div>
  );
}
