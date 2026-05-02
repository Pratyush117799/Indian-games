import React from 'react'

const LEVELS = ['easy', 'medium', 'hard']

export default function DifficultyChips({ value, onChange }) {
  return (
    <div className="diff-row">
      {LEVELS.map(d => (
        <div key={d}
          className={`diff-chip ${value === d ? 'selected' : ''}`}
          onClick={() => onChange(d)}>
          {d.toUpperCase()}
        </div>
      ))}
    </div>
  )
}
