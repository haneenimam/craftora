import React from 'react';
import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';

const NotFound = () => {
  return (
    <div className={styles.container}>
      <img
        src="/PageNotFound.jpg" // Ensure the image is inside the "public" folder
        alt="Page Not Found"
        className={styles.image}
      />
      <Link to="/" className={styles.backButton}>
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
