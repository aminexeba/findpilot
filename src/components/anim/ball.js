import React from 'react';
import Image from 'next/image';
import styles from './ball.module.css';

export default function Ball() {
  return (
    <div className={styles.ballWrapper}>
      <Image
        src="/anim/ball.png"
        alt="Bowling Ball"
        width={300}
        height={300}
        className={styles.ballImage}
      />
    </div>
  );
}