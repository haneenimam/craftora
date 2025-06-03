import React from 'react';
import styles from './Footer.module.css';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className={`${styles['custom-footer']} footer py-3`}>
      <div className="container d-flex align-items-center justify-content-center position-relative flex-wrap">
        {/* Logo aligned left */}
        <img
          src="/logo.jpg"
          alt="Local Market Logo"
          className={styles.logoImage}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        />

        {/* Centered content */}
        <div className="text-center w-100">
          <p>© 2025 Local Market. All rights reserved.</p>

          <div className={styles['contact-row']}>
            <span className={styles['contact-label']}>Contact Us</span>
            <div className={styles['contact-icons']}>
              <FaEnvelope />
              <FaPhone />
              <FaMapMarkerAlt />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
