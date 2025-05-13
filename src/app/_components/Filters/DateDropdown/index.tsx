'use client'

import React, { useEffect, useRef, useState } from 'react'

const DateDropdown = ({ options, value, onChange }) => {
  const selectRef = useRef(null)

  // Handle change from native select
  const handleSelectChange = e => {
    onChange(e.target.value)
  }

  const styles = {
    container: {
      position: 'relative' as 'relative',
      display: 'inline-block',
      marginBotton: '10px',
    },
    button: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '8px',
      padding: '2px 16px',
      backgroundColor: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: '9999px',
      color: '#4a5568',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 500,
    },
    icon: {
      width: '16px',
      height: '16px',
      pointerEvents: 'none' as 'none', // Prevent chevron from interfering with clicks
    },
    // Native select styling
    select: {
      position: 'absolute' as 'absolute',
      top: 7,
      left: 0,
      width: '100%',
      height: '100%',
      opacity: 0, // Hide the native element but keep it functional
      cursor: 'pointer',
      zIndex: 1,
    },
    select2: {
      position: 'absolute' as 'absolute',
      top: 20,
      left: 0,
      width: '100%',
      height: '100%',
      opacity: 0, // Hide the native element but keep it functional
      cursor: 'pointer',
      zIndex: 1,
    },
  }

  // Handle hover states
  const handleButtonHover = (e, isHovering) => {
    e.currentTarget.style.backgroundColor = isHovering ? '#f7fafc' : 'white'
    e.currentTarget.style.borderColor = isHovering ? '#cbd5e0' : '#e2e8f0'
  }

  return (
    <div style={styles.container}>
      {/* Visual button */}
      <div
        style={styles.button}
        onMouseEnter={e => handleButtonHover(e, true)}
        onMouseLeave={e => handleButtonHover(e, false)}
      >
        <span>Travel dates</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={styles.icon}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>

      {/* Actual select element */}
      <select ref={selectRef} value={value} onChange={handleSelectChange} style={styles.select}>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <select ref={selectRef} value={value} onChange={handleSelectChange} style={styles.select2}>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default DateDropdown
