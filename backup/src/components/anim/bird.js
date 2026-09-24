import React from 'react';
import styles from './bird.module.css';

export default function BirdAnimation() {
  return (
    <div className={styles.container}>
      {/* Bird 1: Starts immediately from the left */}
      <img 
        src="/anim/bird1.png" 
        alt="Flying Bird 1" 
        className={`${styles.bird} ${styles.bird1}`} 
      />

      {/* Bird 2: Starts 3 seconds later from the left */}
      <img 
        src="/anim/bird2.png" 
        alt="Flying Bird 2" 
        className={`${styles.bird} ${styles.bird2}`} 
      />
    </div>
  );
}