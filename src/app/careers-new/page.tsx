"use client";

import React from "react";
import Image from "next/image";
import styles from "./Careers.module.css";
import {
    FiBriefcase,
    FiUsers,
    FiMapPin,
    FiBookOpen,
    FiCoffee,
    FiAward
} from "react-icons/fi";

const CareersPage = () => {
    const benefits = [
        {
            icon: <FiBriefcase />,
            title: "Large Beautiful Office",
            description: "Work in a modern, spacious environment designed for creativity and productivity."
        },
        {
            icon: <FiUsers />,
            title: "Great Co-Workers",
            description: "Join a diverse team of passionate individuals who support and inspire each other."
        },
        {
            icon: <FiMapPin />,
            title: "Easy Location",
            description: "Our office is centrally located with excellent transport links and local amenities."
        },
        {
            icon: <FiBookOpen />,
            title: "Education Opportunity",
            description: "We invest in your growth with workshops, courses, and technical training."
        },
        {
            icon: <FiCoffee />,
            title: "Free Lunch & Snacks",
            description: "Enjoy daily catered lunches and a fully stocked pantry to keep you energized."
        },
        {
            icon: <FiAward />,
            title: "Performance Award",
            description: "We recognize and reward excellence with monthly and annual performance bonuses."
        }
    ];

    return (
        <div className={styles.careersPage}>
            {/* Decorative Background Shapes */}
            <div className={`${styles.shape} ${styles.shape1}`}></div>
            <div className={`${styles.shape} ${styles.shape2}`}></div>

            <div className={styles.container}>
                {/* Hero Section */}
                <section className={styles.hero}>
                    <div className={styles.heroContent}>
                        <h1>
                            Join Our Team At
                            <span className={styles.brandName}>Refone</span>
                        </h1>
                        <p className={styles.heroSubtitle}>
                            Be part of a forward-thinking team where your ideas matter. We're looking for passionate individuals to help us build the future of technology.
                        </p>
                        <button className={styles.btnPrimary} onClick={() => document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' })}>
                            View Openings
                        </button>
                    </div>
                    <div className={styles.heroImage}>
                        <Image
                            src="/images/careers_hero.png"
                            alt="Team discussion"
                            width={600}
                            height={500}
                            priority
                        />
                    </div>
                </section>

                {/* Benefits Section */}
                <section id="benefits" className={styles.benefits}>
                    <div className={styles.benefitsContainer}>
                        <div className={styles.benefitsLeft}>
                            <div className={styles.cardGrid}>
                                {benefits.map((benefit, index) => (
                                    <div key={index} className={styles.benefitCard}>
                                        <div className={styles.iconWrapper}>
                                            {benefit.icon}
                                        </div>
                                        <h3>{benefit.title}</h3>
                                        <p>{benefit.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className={styles.benefitsRight}>
                            <h2 className={styles.sectionTitle}>
                                Your Life At <span className={styles.highlight}>Refone</span>
                            </h2>
                            <p className={styles.cultureText}>
                                At Refone, we believe that our people are our greatest asset. We foster a culture of transparency, collaboration, and continuous learning. Whether you're a seasoned professional or just starting your career, you'll find a supportive environment where you can thrive.
                            </p>
                            <p className={styles.cultureText}>
                                We balance hard work with fun, offering flexible working hours and regular team-building activities. Join us and be part of a company that values your contribution and supports your professional aspirations.
                            </p>
                            <button className={styles.btnSecondary}>Learn More</button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default CareersPage;
