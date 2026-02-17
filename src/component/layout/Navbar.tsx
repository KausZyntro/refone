import React from 'react'
import styles from "@/app/page.module.css";

const Navbar = () => {
  return (
    <div className={styles.navbar}>
        <ul className={styles.leftNavbarList}> 
            <li>LOGO</li>
            <li>Buy</li>
            <li>Sell</li>
            <li>Warranty</li>
            <li>Support</li>
        </ul>
    </div>
  )
}

export default Navbar