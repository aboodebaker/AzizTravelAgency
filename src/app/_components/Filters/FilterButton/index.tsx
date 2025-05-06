import React from 'react'

interface FilterButtonProps {
  label: string
  active?: boolean
  onClick: () => void
}

const FilterButton = ({ label, active = false, onClick }: FilterButtonProps) => {
  // Base styles for the button
  const baseStyles = {
    padding: '8px 16px',
    borderRadius: '9999px', // Full rounded (pill)
    border: '1px solid',
    fontSize: '14px',
    fontWeight: 500,
    transition: 'background-color 0.2s, border-color 0.2s, color 0.2s',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    outline: 'none',
  }

  // Active state styles
  const activeStyles = {
    backgroundColor: '#3182ce', // primary blue color
    color: 'white',
    borderColor: '#3182ce',
  }

  // Inactive state styles
  const inactiveStyles = {
    backgroundColor: 'white',
    color: '#4a5568', // text color
    borderColor: '#e2e8f0', // border color
  }

  // Combined styles based on active state
  const buttonStyles = {
    ...baseStyles,
    ...(active ? activeStyles : inactiveStyles),
  }

  // Hover handling for inactive buttons
  const handleMouseOver = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!active) {
      e.currentTarget.style.backgroundColor = '#f7fafc' // hover bg
      e.currentTarget.style.borderColor = '#718096' // hover border
    }
  }

  const handleMouseOut = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!active) {
      e.currentTarget.style.backgroundColor = 'white'
      e.currentTarget.style.borderColor = '#e2e8f0'
    }
  }

  return (
    <button
      onClick={onClick}
      style={buttonStyles}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      {label}
    </button>
  )
}

export default FilterButton
