"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import axios from "axios";
import styles from "./DynamicPage.module.css";

interface FooterLink {
    id: number;
    section: string;
    page_key: string;
    title: string;
    content: string;
}

const DynamicFooterPage = () => {
    const params = useParams();
    const router = useRouter();
    const pageKey = params?.page_key as string;

    const [content, setContent] = useState<FooterLink | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!pageKey) return;

        // Redirect about-us to custom page
        if (pageKey === "about-us") {
            router.push("/about-us-new");
            return;
        }
        if(pageKey === "careers"){
            router.push("/careers-new");
            return;
        }
        if(pageKey === "faq"){
            router.push("/faq-new");
            return;
        }

        const fetchPageContent = async () => {
            setLoading(true);

            try {
                const response = await axios.get(
                    "https://refones.com/api-auth_v1/api/footer-links"
                );

                if (response.data.status === "success") {
                    const data = response.data.data;
                    let foundContent: FooterLink | null = null;

                    // Search through all sections
                    for (const section in data) {
                        const match = data[section].find(
                            (item: FooterLink) => item.page_key === pageKey
                        );

                        if (match) {
                            foundContent = match;
                            break;
                        }
                    }

                    if (foundContent) {
                        setContent(foundContent);
                    } else {
                        setError("Page Not Found");
                    }
                } else {
                    setError("Failed to fetch content");
                }
            } catch (err) {
                setError("An error occurred while fetching page content");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPageContent();
    }, [pageKey, router]);

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>Loading content...</div>
            </div>
        );
    }

    if (error || !content) {
        return (
            <div className={styles.container}>
                <h1 className={styles.errorTitle}>
                    {error || "Page Not Found"}
                </h1>
                <p className={styles.errorText}>
                    The page you are looking for does not exist or has been moved.
                </p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>{content.title}</h1>
                <div className={styles.underline}></div>
            </header>

            <main className={styles.contentWrapper}>
                <div
                    className={styles.content}
                    dangerouslySetInnerHTML={{ __html: content.content }}
                />
            </main>
        </div>
    );
};

export default DynamicFooterPage;