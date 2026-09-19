'use client';

import React from 'react';
import Link from 'next/link';
import styles from './AssessmentResult.module.css';
import Image from 'next/image';

export default function AssessmentResultPage() {
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.iconWrapper}>
                    {/* <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                        <path d="M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208 208-93.31 208-208S370.69 48 256 48zm86.63 272L320 342.63l-64-64-64 64L169.37 320l64-64-64-64L192 169.37l64 64 64-64L342.63 192l-64 64z"></path>
                    </svg> */}
                    <img src="https://i.pinimg.com/1200x/4d/4e/10/4d4e10cea8adc95e02b34c9bb3b6aaca.jpg" alt="" className={styles.imgs}/>
                    {/* <Image
                    src="https://i.pinimg.com/1200x/4d/4e/10/4d4e10cea8adc95e02b34c9bb3b6aaca.jpg"
                    alt="Hero banner description"
                    width={800}
                    height={500}
                    /> */}
                    
                </div>
                <h1 className={styles.title}>
                    Assessment Rejected
                </h1>
                <p className={styles.description}>
                    This buyback assessment is already rejected as your device does not match our requirement.
                </p>
                <Link href="/" className={styles.button}>
                    Back to Home
                </Link>
            </div>
        </div>
    );
}
