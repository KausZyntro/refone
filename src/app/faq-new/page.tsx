"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import styles from "./FAQ.module.css";
import { FiSearch, FiChevronDown } from "react-icons/fi";

const FAQPage = () => {
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

    const categories = ["All", "General", "Order & Shipping", "Returns", "Payment"];

    const faqs = [
        {
            question: "What is Refone's return policy?",
            answer: "We offer a 7-day hassle-free return policy for most items. The product must be in its original condition and packaging. Some exceptions apply to consumable items.",
            category: "Returns"
        },
        {
            question: "How can I track my order?",
            answer: "Once your order is shipped, you will receive a tracking link via email and SMS. You can also track it directly from the 'My Orders' section in your account.",
            category: "Order & Shipping"
        },
        {
            question: "Do you offer international shipping?",
            answer: "Currently, we only ship within the country. We are working hard to bring Refone to international customers soon. Stay tuned!",
            category: "Order & Shipping"
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept all major credit/debit cards, UPI, Net Banking, and popular digital wallets. Cash on Delivery (COD) is also available for select pin codes.",
            category: "Payment"
        },
        {
            question: "How long does delivery take?",
            answer: "Standard delivery typically takes 3-5 business days depending on your location. Express shipping options are available at checkout.",
            category: "Order & Shipping"
        },
        {
            question: "Is my personal information secure?",
            answer: "Absolutely. We use industry-standard encryption and follow strict data protection protocols to ensure your information is always safe with us.",
            category: "General"
        },
        {
            question: "Can I change my shipping address after placing an order?",
            answer: "Address changes are possible only until the order is processed for shipping. Please contact our support team immediately if you need to make a change.",
            category: "Order & Shipping"
        },
        {
            question: "How do I cancel my order?",
            answer: "You can cancel your order from the 'My Orders' page as long as it hasn't been shipped yet. For shipped orders, you'll need to follow our return process.",
            category: "Order & Shipping"
        }
    ];

    const filteredFaqs = useMemo(() => {
        return faqs.filter(faq => {
            const matchesCategory = activeCategory === "All" || faq.category === activeCategory;
            const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [activeCategory, searchQuery]);

    const toggleAccordion = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    return (
        <div className={styles.faqPage}>
            {/* Decorative Background Shapes */}
            <div className={`${styles.shape} ${styles.shape1}`}></div>
            <div className={`${styles.shape} ${styles.shape2}`}></div>

            <div className={styles.container}>
                {/* Hero Section */}
                <section className={styles.hero}>
                    {/* <div className={styles.heroImage}>
                        <Image
                            src="/images/faq_hero.png"
                            alt="Help center"
                            width={200}
                            height={200}
                            priority
                        />
                    </div> */}
                    <div className={styles.heroContent}>
                        <h1>How can we <span className={styles.highlight}>help you?</span></h1>
                        <p className={styles.heroSubtitle}>
                            Find answers to frequently asked questions about our products, shipping, returns, and more.
                        </p>
                    </div>

                    <div className={styles.searchWrapper}>
                        {/* <FiSearch className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Search for questions..."
                            className={styles.searchInput}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        /> */}
                    </div>

                    <div className={styles.categories}>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                className={`${styles.categoryTab} ${activeCategory === cat ? styles.activeTab : ""}`}
                                onClick={() => setActiveCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </section>

                {/* FAQ Content */}
                <section className={styles.accordion}>
                    {filteredFaqs.length > 0 ? (
                        filteredFaqs.map((faq, index) => (
                            <div
                                key={index}
                                className={`${styles.faqItem} ${expandedIndex === index ? styles.faqItemActive : ""}`}
                            >
                                <button
                                    className={styles.question}
                                    onClick={() => toggleAccordion(index)}
                                >
                                    {faq.question}
                                    <FiChevronDown className={styles.icon} />
                                </button>
                                <div className={styles.answer}>
                                    <p>{faq.answer}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                            No results found for "{searchQuery}"
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default FAQPage;
