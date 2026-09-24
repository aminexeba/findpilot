import React from 'react';
import Image from 'next/image';
import Ball from './ball';
import styles from './bolling.module.css';

export default function Bolling() {
  return (
    <div className={styles.container}>
      {/* 500px Background Image */}
      <Image
        src="/anim/bolling.png"
        alt="Bowling Lane Background"
        fill
        priority
        className={styles.bollingImage}
      />

      {/* Animated Ball Overlap */}
      <Ball />
    </div>
  );
}