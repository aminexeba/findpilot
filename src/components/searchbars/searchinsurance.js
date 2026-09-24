'use client';

import React, { useState } from 'react';
import styles from './searchinsurance.module.css';
import { ShieldCheck, FileText, Calendar, Search } from 'lucide-react';

export default function SearchInsurance() {
  const [coverageType, setCoverageType] = useState('Comprehensive Travel Protection');
  const [destinationRegion, setDestinationRegion] = useState('Worldwide (Inc. USA/Canada)');
  const [travelDates, setTravelDates] = useState('Select coverage dates');

  const handleInsuranceSearch = (e) => {
    e.preventDefault();
    console.log('Booking Insurance Search:', { coverageType, destinationRegion, travelDates });
  };

  return (
    <form onSubmit={handleInsuranceSearch} className={styles.bookingForm}>
      <div className={styles.bookingGrid}>
        
        {/* Coverage Type Field */}
        <div className={styles.inputBox}>
          <ShieldCheck className={styles.inputIcon} size={22} />
          <div className={styles.inputContent}>
            <input 
              type="text" 
              value={coverageType} 
              onChange={(e) => setCoverageType(e.target.value)} 
              placeholder="Protection type" 
              className={styles.textField}
            />
          </div>
        </div>

        {/* Region Field */}
        <div className={styles.inputBox}>
          <FileText className={styles.inputIcon} size={22} />
          <div className={styles.inputContent}>
            <input 
              type="text" 
              value={destinationRegion} 
              onChange={(e) => setDestinationRegion(e.target.value)} 
              placeholder="Destination region" 
              className={styles.textField}
            />
          </div>
        </div>

        {/* Dates Field */}
        <div className={styles.inputBox}>
          <Calendar className={styles.inputIcon} size={22} />
          <div className={styles.inputContent}>
            <input 
              type="text" 
              value={travelDates} 
              onChange={(e) => setTravelDates(e.target.value)} 
              placeholder="Coverage period" 
              className={styles.textField}
            />
          </div>
        </div>

        {/* Search Action Button */}
        <button type="submit" className={styles.searchSubmitBtn}>
          <Search size={20} />
          <span>Search</span>
        </button>

      </div>
    </form>
  );
}