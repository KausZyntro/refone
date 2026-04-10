'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './AboutUs.module.css';

interface PageDataType {
    id?: number;
    section?: string;
    page_key?: string;
    title?: string;
    content?: string;
}

interface FooterLinksResponse {
    data: Record<string, PageDataType[]>;
}

const AboutUsPage = () => {
    const [pageData, setPageData] = useState<PageDataType | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPageData = async () => {
            try {
                const response = await fetch(
                    'https://refones.com/api-auth_v1/api/footer-links'
                );

                const result: FooterLinksResponse = await response.json();

                if (result?.data) {
                    const allPages: PageDataType[] = Object.values(
                        result.data
                    ).flat();

                    const aboutPage = allPages.find(
                        (item: PageDataType) =>
                            item.page_key === 'about-us'
                    );

                    if (aboutPage) {
                        setPageData(aboutPage);
                    }
                }
            } catch (error) {
                console.error('Error fetching page data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPageData();
    }, []);

    return (
        <div className={styles.container}>
            {/* Hero Section */}
              <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1 className={styles.heroHeading}>
                        Tested. Trusted.
                        <br />
                        Reborn.
                    </h1>
                    <p className={styles.heroSubheading}>
                        Certified reborn iPhones at prices everyone can afford.
                    </p>
                    <p className={styles.heroSecondaryText}>
                        Quality tested. Warranty included. Affordable pricing.
                    </p>
                    <Link href="/allProduct" className={styles.heroButton}>
                        Explore Devices
                    </Link>
                </div>

                <div className={styles.heroImageWrapper}>
                    <Image
                        src="/images/about-hero.webp"
                        alt="Premium iPhones"
                        width={1200}
                        height={600}
                        className={styles.heroImage}
                        priority
                    />
                </div>
            </section>

            {/* Section 1: About RefOne */}
            <section className={styles.aboutSection}>
                <div className={styles.contentWrapper}>
                    <div className={styles.textSide}>
                        <h2 className={styles.sectionHeading}>
                            {pageData?.title || 'About RefOne'}
                        </h2>

                        {loading ? (
                            <div className={styles.paragraphContainer}>
                                <p>Loading content...</p>
                            </div>
                        ) : (
                            <div
                                className={styles.paragraphContainer}
                                dangerouslySetInnerHTML={{
                                    __html:
                                        pageData?.content ||
                                        `
                                        <p>At RefOne, we believe everyone should have access to premium iPhones without paying premium prices.</p>

                                        <p>We specialize in certified reborn and second-hand iPhones that are carefully tested for quality, performance, and reliability. Every device goes through detailed inspections, including battery health checks, functionality testing, and cosmetic evaluation, to ensure it meets our standards before reaching our customers.</p>

                                        <p>Our goal is to provide a trusted and affordable way for people to own high-quality iPhones with complete confidence. With warranty support, transparent pricing, and a customer-first approach, RefOne is committed to making your buying experience simple, secure, and stress-free.</p>

                                        <p>Whether you are upgrading your current phone or buying your first iPhone, RefOne is here to help you find the right device at the right price.</p>
                                        `
                                }}
                            />
                        )}
                    </div>

                    <div className={styles.imageSide}>
                        <Image
                            src="/images/about-reborn-new.png"
                            alt="Refurbished iPhones"
                            width={600}
                            height={400}
                            className={styles.roundedImage}
                        />
                    </div>
                </div>
            </section>

            {/* Section 2: Why Choose RefOne */}
            <section className={styles.whyChooseSection}>
                <div className={styles.contentWrapperReverse}>
                    <div className={styles.imageSide}>
                        <Image
                            src="/images/why-choose-new.png"
                            alt="Quality Assurance"
                            width={600}
                            height={400}
                            className={styles.roundedImage}
                        />
                    </div>

                    <div className={styles.textSide}>
                        <h2 className={styles.sectionHeading}>
                            Why Choose RefOne
                        </h2>

                        <div className={styles.featuresGrid}>
                            <div className={styles.featureCard}>
                                <div className={styles.featureIcon}>✨</div>
                                <h3>Certified reborn iPhones</h3>
                                <p>
                                    Every device is restored to meet our high
                                    performance standards.
                                </p>
                            </div>

                            <div className={styles.featureCard}>
                                <div className={styles.featureIcon}>🔋</div>
                                <h3>Battery health tested</h3>
                                <p>
                                    We ensure battery performance meets or
                                    exceeds industry expectations.
                                </p>
                            </div>

                            <div className={styles.featureCard}>
                                <div className={styles.featureIcon}>🛡️</div>
                                <h3>Warranty support</h3>
                                <p>
                                    Every purchase is backed by our dedicated
                                    warranty for peace of mind.
                                </p>
                            </div>

                            <div className={styles.featureCard}>
                                <div className={styles.featureIcon}>💰</div>
                                <h3>Affordable pricing</h3>
                                <p>
                                    Premium tech should not break the bank. Get
                                    more for your money.
                                </p>
                            </div>

                            <div className={styles.featureCard}>
                                <div className={styles.featureIcon}>🔒</div>
                                <h3>Secure payments</h3>
                                <p>
                                    Your transactions are protected with
                                    industry-leading security protocols.
                                </p>
                            </div>

                            <div className={styles.featureCard}>
                                <div className={styles.featureIcon}>🚀</div>
                                <h3>Fast delivery</h3>
                                <p>
                                    Quick and reliable shipping directly to your
                                    doorstep.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 3: Final CTA */}
            <section className={styles.ctaSection}>
                <div className={styles.ctaContent}>
                    <h2 className={styles.ctaHeading}>
                        Find Your Next iPhone Today
                    </h2>

                    <p className={styles.ctaText}>
                        Browse our premium collection of reborn iPhones and
                        discover quality devices at better prices.
                    </p>

                    <div className={styles.ctaButtons}>
                        <Link href="/allProduct" className={styles.primaryBtn}>
                            Shop Now
                        </Link>

                        <Link
                            href="/contact-us"
                            className={styles.secondaryBtn}
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutUsPage;