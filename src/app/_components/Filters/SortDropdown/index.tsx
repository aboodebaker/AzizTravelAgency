'use client'
import React, { useRef, useState } from 'react'

// SortDropdown Component - Using native select with custom styling
const SortDropdown = ({ options, value, onChange }) => {
  const dropdownRef = useRef(null)
  const selectRef = useRef(null)

  // Find the selected option
  const selectedOption = options.find(option => option.value === value)

  // Handle change from native select
  const handleSelectChange = e => {
    onChange(e.target.value)
  }

  // Toggle dropdown and trigger native select
  const handleButtonClick = () => {
    if (selectRef.current) {
      selectRef.current.focus()
      // This triggers the native dropdown on most browsers
      selectRef.current.click()
    }
  }

  // Styles
  const styles = {
    container: {
      position: 'relative' as 'relative',
      display: 'inline-block',
    },
    button: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      backgroundColor: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: '9999px',
      padding: '2px 16px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 500,
      color: '#4a5568',
      transition: 'background-color 0.2s, border-color 0.2s',
      position: 'relative' as 'relative',
      zIndex: 0,
    },
    chevron: {
      width: '16px',
      height: '16px',
      transition: 'transform 0.2s',
      pointerEvents: 'none' as 'none', // Prevent chevron from interfering with clicks
    },
    // Native select styling
    select: {
      position: 'absolute' as 'absolute',
      top: 4,
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
    <div style={styles.container} ref={dropdownRef} onClick={handleButtonClick}>
      {/* Visual button */}

      <div
        style={styles.button}
        onMouseEnter={e => handleButtonHover(e, true)}
        onMouseLeave={e => handleButtonHover(e, false)}
      >
        <span>Sort</span>
        {/* ChevronDown icon */}
        <svg
          style={styles.chevron}
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
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

export default SortDropdown
