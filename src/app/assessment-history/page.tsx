"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaCheckCircle, FaClock, FaTimesCircle, FaChartBar, FaSearch, FaMobileAlt, FaPlus } from "react-icons/fa";
import styles from "./AssessmentHistory.module.css";
import Link from "next/link";

export default function AssessmentHistory() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          "https://refones.com/ApiAuthUat/api/buyback/assessments/customer",
          { user_id: 37 }
        );
        if (response.data && response.data.status) {
          setData(response.data.data || []);
        }
      } catch (error) {
        console.error("Error fetching assessments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getFilteredData = () => {
    let filtered = data;
    if (activeTab === "Completed") filtered = data.filter((item) => item.status === "completed");
    if (activeTab === "In Progress") filtered = data.filter((item) => item.status === "in_progress");
    if (activeTab === "Rejected") filtered = data.filter((item) => item.status === "rejected");

    if (searchQuery) {
      filtered = filtered.filter((item) =>
        item.device?.model.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  };

  const formatCurrency = (value: string | number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(value));
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  const summary = {
    completed: { count: 0, value: 0 },
    inProgress: { count: 0, value: 0 },
    rejected: { count: 0, value: 0 },
    total: { count: data.length, value: 0 },
  };

  data.forEach((item) => {
    const finalPrice = Number(item.final_price) || 0;
    const basePrice = Number(item.base_price) || 0;
    
    // In actual image total value seems to be the sum of base_price for In Progress and final_price for completed.
    // We will sum base_price for in_progress and final_price for completed, or just whatever is non zero.
    const itemValue = finalPrice > 0 ? finalPrice : (item.status === 'in_progress' ? basePrice : 0);
    summary.total.value += itemValue;

    if (item.status === "completed") {
      summary.completed.count++;
      summary.completed.value += finalPrice;
    } else if (item.status === "in_progress") {
      summary.inProgress.count++;
      summary.inProgress.value += basePrice;
    } else if (item.status === "rejected") {
      summary.rejected.count++;
      summary.rejected.value += finalPrice;
    }
  });

  const filteredData = getFilteredData();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1>Assessments</h1>
          <div className={styles.subtitle}>
            Customer #37 &gt; <strong>All Assessments</strong>
          </div>
        </div>
        {/* <button className={styles.createBtn} onClick={() => window.location.href = '/exchange-phone'}>
          <FaPlus /> Create Assessment
        </button> */}
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>Loading assessments...</div>
      ) : (
        <>
          <div className={styles.summaryCards}>
            <div className={`${styles.card} ${styles.cardCompleted}`}>
              <div className={styles.cardIcon}>
                <FaCheckCircle />
              </div>
              <div className={styles.cardContent}>
                <h3>Completed</h3>
                <p>
                  Count: <strong>{summary.completed.count}</strong> &nbsp; Value: <strong>{formatCurrency(summary.completed.value)}</strong>
                </p>
              </div>
            </div>
            <div className={`${styles.card} ${styles.cardInProgress}`}>
              <div className={styles.cardIcon}>
                <FaClock />
              </div>
              <div className={styles.cardContent}>
                <h3>In Progress</h3>
                <p>
                  Count: <strong>{summary.inProgress.count}</strong> &nbsp; Value: <strong>{formatCurrency(summary.inProgress.value)}</strong>
                </p>
              </div>
            </div>
            <div className={`${styles.card} ${styles.cardRejected}`}>
              <div className={styles.cardIcon}>
                <FaTimesCircle />
              </div>
              <div className={styles.cardContent}>
                <h3>Rejected</h3>
                <p>
                  Count: <strong>{summary.rejected.count}</strong> &nbsp; Value: <strong>{formatCurrency(summary.rejected.value)}</strong>
                </p>
              </div>
            </div>
            <div className={`${styles.card} ${styles.cardTotal}`}>
              <div className={styles.cardIcon}>
                <FaChartBar />
              </div>
              <div className={styles.cardContent}>
                <h3>Total</h3>
                <p>
                  Count: <strong>{summary.total.count}</strong> &nbsp; Value: <strong>{formatCurrency(summary.total.value)}</strong>
                </p>
              </div>
            </div>
          </div>

          <div className={styles.tableContainer}>
            <div className={styles.tableHeader}>
              <div className={styles.tabs}>
                <button
                  className={`${styles.tab} ${activeTab === "All" ? styles.tabActive : ""}`}
                  onClick={() => setActiveTab("All")}
                >
                  All ({data.length})
                </button>
                <button
                  className={`${styles.tab} ${activeTab === "Completed" ? styles.tabActive : ""}`}
                  // onClick={() => setActiveTab("Completed")}
                >
                  Completed ({summary.completed.count})
                </button>
                <button
                  className={`${styles.tab} ${activeTab === "In Progress" ? styles.tabActive : ""}`}
                  // onClick={() => setActiveTab("In Progress")}
                >
                  In Progress ({summary.inProgress.count})
                </button>
                <button
                  className={`${styles.tab} ${activeTab === "Rejected" ? styles.tabActive : ""}`}
                  // onClick={() => setActiveTab("Rejected")}
                >
                  Rejected ({summary.rejected.count})
                </button>
              </div>
              <div className={styles.searchBar}>
                <FaSearch className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search assessments..."
                  className={styles.searchInput}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Device</th>
                  <th>Assessment ID</th>
                  <th>Create Date</th>
                  <th>Progress</th>
                  <th>Base Price</th>
                  <th>Final Offer</th>
                  <th>Status</th>
                  {/* <th>Actions</th> */}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
                  <tr key={item.assessment_id}>
                    <td>
                      <div className={styles.deviceInfo}>
                        <div className={styles.deviceIcon}>
                          <FaMobileAlt />
                        </div>
                        <div className={styles.deviceDetails}>
                          <h4>
                            {item.device?.brand} {item.device?.model}
                          </h4>
                          <p>
                            {item.device?.storage} • {item.device?.color}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>#{item.assessment_id.toString().padStart(3, "0")}</td>
                    <td>{formatDate(item.created_at)}</td>
                    <td>
                      <span
                        className={`${styles.progressBadge} ${
                          item.status === "rejected"
                            ? styles.rejected
                            : item.status === "in_progress"
                            ? styles.inProgress
                            : ""
                        }`}
                      >
                        Step {item.current_step} of 8
                      </span>
                    </td>
                    <td>{formatCurrency(item.base_price)}</td>
                    <td className={item.status === "rejected" ? styles.priceStrikethrough : ""}>
                      {formatCurrency(item.final_price)}
                    </td>
                    <td>
                      <span
                        className={`${styles.statusBadge} ${
                          item.status === "completed"
                            ? styles.statusCompleted
                            : item.status === "rejected"
                            ? styles.statusRejected
                            : styles.statusInProgress
                        }`}
                      >
                        {item.status.replace("_", " ")}
                      </span>
                    </td>
                    {/* <td>
                      <button className={styles.actionBtn}>
                        {item.status === "in_progress" ? "Resume" : "View"}
                      </button>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>

            <div className={styles.pagination}>
              <button className={styles.pageBtn}>&larr; Previous</button>
              <div className={styles.pageNumbers}>
                <div className={`${styles.pageNumber} ${styles.pageNumberActive}`}>1</div>
              </div>
              <button className={styles.pageBtn}>Next &rarr;</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
