'use client';

import React, { useState } from 'react';
import styles from './searchhotel.module.css';
import { Bed, Calendar, Users, Search } from 'lucide-react';

export default function SearchHotel() {
  const [destination, setDestination] = useState('');
  const [dates, setDates] = useState('Check-in — Check-out');
  const [guests, setGuests] = useState('2 adults · 0 children · 1 room');

  const handleHotelSearch = (e) => {
    e.preventDefault();
    console.log('Booking Hotel Search:', { destination, dates, guests });
  };

  return (
    <form onSubmit={handleHotelSearch} className={styles.bookingForm}>
      <div className={styles.bookingGrid}>
        
        {/* Destination Field */}
        <div className={styles.inputBox}>
          <Bed className={styles.inputIcon} size={22} />
          <div className={styles.inputContent}>
            <input 
              type="text" 
              value={destination} 
              onChange={(e) => setDestination(e.target.value)} 
              placeholder="Where are you going?" 
              className={styles.textField}
            />
          </div>
        </div>

        {/* Date Field */}
        <div className={styles.inputBox}>
          <Calendar className={styles.inputIcon} size={22} />
          <div className={styles.inputContent}>
            <input 
              type="text" 
              value={dates} 
              onChange={(e) => setDates(e.target.value)} 
              placeholder="Check-in — Check-out" 
              className={styles.textField}
            />
          </div>
        </div>

        {/* Guests Field */}
        <div className={styles.inputBox}>
          <Users className={styles.inputIcon} size={22} />
          <div className={styles.inputContent}>
            <input 
              type="text" 
              value={guests} 
              onChange={(e) => setGuests(e.target.value)} 
              placeholder="Guests & rooms" 
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