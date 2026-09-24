import React from 'react';
import styles from './city.module.css';
import BirdAnimation from './bird'; // Adjust path if necessary

export default function CityScene() {
  return (
    <div className={styles.cityContainer}>
      <div className={styles.birdsLayer}>
        <BirdAnimation />
      </div>
    </div>
  );
}