'use client';

import React from 'react';
import styles from './BuybackRequest.module.css';
import { FiHeadphones, FiCopy, FiEye, FiClock, FiEdit2, FiInfo, FiCheck } from 'react-icons/fi';
import { MdOutlineLocalShipping } from 'react-icons/md';

export default function BuybackRequest() {
  const steps = [
    { id: 1, title: 'Request Created', date: '10 Sep, 10:24 AM', status: 'completed' },
    { id: 2, title: 'Pickup Scheduled', date: '12 Sep, 9:00 AM', status: 'completed' },
    { id: 3, title: 'Device Picked Up', date: '12 Sep, 11:15 AM', status: 'completed' },
    { id: 4, title: 'Device Inspection', date: 'In Progress', status: 'active' },
    { id: 5, title: 'Final Quote', date: '', status: 'pending' },
    { id: 6, title: 'Payment', date: '', status: 'pending' },
  ];

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.badge}>SELL DEVICE</span>
          <h1 className={styles.title}>Your Buyback Request</h1>
          <p className={styles.subtitle}>Here's the latest update on your device. We'll keep you informed at every step.</p>
        </div>
        <div className={styles.needHelp}>
          <FiHeadphones className={styles.helpIcon} />
          <div className={styles.helpText}>
            <span className={styles.helpTitle}>Need help?</span>
            <span className={styles.helpDesc}>Get support for your request</span>
          </div>
        </div>
      </div>

      {/* Device Card */}
      <div className={styles.deviceCard}>
        <div className={styles.deviceInfo}>
          <img src="https://m.media-amazon.com/images/I/71bErtQPC3L._SX679_.jpg" alt="Apple iPhone 14" className={styles.deviceImage} onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/80x80?text=iPhone" }} />
          <div className={styles.deviceDetails}>
            <h2 className={styles.deviceName}>Apple iPhone 14</h2>
            <p className={styles.deviceSpec}>128 GB | Midnight (Black)</p>
            <div className={styles.requestId}>
              Request ID: RFN123456
              <FiCopy className={styles.copyIcon} />
            </div>
          </div>
        </div>
        <div className={styles.quoteSection}>
          <span className={styles.verifiedQuoteBadge}>Verified Quote</span>
          <h3 className={styles.quoteAmount}>₹28,430</h3>
          <p className={styles.requestDate}>Requested on 10 Sep 2024, 10:24 AM</p>
        </div>
        <div className={styles.actionSection}>
          <button className={styles.viewDetailsBtn}>
            <FiEye /> View Details
          </button>
        </div>
      </div>

      {/* Stepper */}
      <div className={styles.stepperContainer}>
        <div className={styles.stepper}>
          <div className={styles.stepperLine}></div>
          <div className={styles.stepperProgress} style={{ width: '50%' }}></div>
          {steps.map((step) => (
            <div key={step.id} className={`${styles.step} ${styles[step.status]}`}>
              <div className={styles.stepCircle}>
                {step.status === 'completed' ? <FiCheck /> : step.id}
              </div>
              <span className={styles.stepTitle}>{step.title}</span>
              {step.date && <span className={styles.stepDate}>{step.date}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Status Container */}
      <div className={styles.statusContainer}>
        <div className={styles.statusLeft}>
          <div className={styles.statusImageWrapper}>
            <img src="/assets/images/inspection.png" alt="Inspection" className={styles.statusIllustration} onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/100x100?text=Inspection" }} />
            <div className={styles.statusContent}>
              <h3 className={styles.statusTitle}>Your device is under inspection</h3>
              <p className={styles.statusDesc}>
                Our experts are checking your device's condition. This usually takes 24-48 hours.
              </p>
              <div className={styles.estimatedBox}>
                <FiClock className={styles.estimatedIcon} />
                <div className={styles.estimatedText}>
                  <span className={styles.estimatedLabel}>Estimated completion</span>
                  <span className={styles.estimatedTime}>By 14 Sep 2024, 6:00 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.statusRight}>
          <div className={styles.timeline}>
            <div className={`${styles.timelineItem} ${styles.completed}`}>
              <div className={styles.timelineIcon}><FiCheck size={14} /></div>
              <div className={styles.timelineContent}>
                <h4 className={styles.timelineTitle}>Device received at facility</h4>
                <p className={styles.timelineSubtitle}>12 Sep, 11:15 AM</p>
              </div>
            </div>
            <div className={`${styles.timelineItem} ${styles.active}`}>
              <div className={styles.timelineIcon}>4</div>
              <div className={styles.timelineContent}>
                <h4 className={styles.timelineTitle}>Inspection in progress</h4>
                <p className={styles.timelineSubtitle}>Currently in progress</p>
              </div>
            </div>
            <div className={styles.timelineItem}>
              <div className={styles.timelineIcon}></div>
              <div className={styles.timelineContent}>
                <h4 className={styles.timelineTitle}>Final quote will be shared</h4>
              </div>
            </div>
            <div className={styles.timelineItem}>
              <div className={styles.timelineIcon}></div>
              <div className={styles.timelineContent}>
                <h4 className={styles.timelineTitle}>Complete payment</h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Section */}
      <div className={styles.gridSection}>
        <div className={styles.detailsCard}>
          <div className={styles.detailsHeader}>
            <div className={styles.detailsTitleWrapper}>
              <MdOutlineLocalShipping size={20} />
              <h3 className={styles.detailsTitle}>Pickup Details</h3>
            </div>
            <button className={styles.editBtn}>
              <FiEdit2 size={14} /> Edit
            </button>
          </div>
          <div className={styles.infoGrid}>
            <span className={styles.infoLabel}>Pickup Address</span>
            <span className={styles.infoValue}>123, Green Park, Sector 45, Gurgaon, Haryana - 122003</span>
            
            <span className={styles.infoLabel}>Pickup Date</span>
            <span className={styles.infoValue}>12 Sep 2024</span>
            
            <span className={styles.infoLabel}>Time Slot</span>
            <span className={styles.infoValue}>9:00 AM - 11:00 AM</span>
            
            <span className={styles.infoLabel}>Picked Up By</span>
            <span className={styles.infoValue}>Rahul Kumar | +91 98765 43210</span>
          </div>
        </div>

        <div className={styles.detailsCard}>
          <div className={styles.detailsHeader}>
            <div className={styles.detailsTitleWrapper}>
              <FiInfo size={20} />
              <h3 className={styles.detailsTitle}>Important Information</h3>
            </div>
          </div>
          <ul className={styles.bulletList}>
            <li>You'll receive an SMS and email at every step.</li>
            <li>Final quote may vary slightly after inspection, depending on actual device condition.</li>
            <li>Once you approve the final quote, payment will be processed within 24 hours.</li>
            <li>If we're unable to proceed, your device will be returned free of cost.</li>
          </ul>
        </div>
      </div>

      {/* Footer Banner */}
      {/* <div className={styles.footerBanner}>
        <div className={styles.footerContent}>
          <div className={styles.leafIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
          </div>
          <div className={styles.footerText}>
            <h3 className={styles.footerTitle}>Thanks for choosing Refone!</h3>
            <p className={styles.footerSubtitle}>You're helping create a greener, more sustainable future.</p>
          </div>
        </div>
        <div className={styles.footerGraphic}>
          <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#16a34a', fontStyle: 'italic', marginRight: '20px' }}>Good Devices<br/>Brighter Tomorrow</span>
        </div>
      </div> */}
    </div>
  );
}
