import React from 'react';

export function SearchBar({ searchTerm, onSearchChange }) {
  return (
    <div className="search-box">
      <input
        type="text"
        placeholder="Поиск по имени, email, группе..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="search-input"
      />
      {searchTerm && (
        <button className="clear-btn" onClick={() => onSearchChange('')}>
          ✕
        </button>
      )}
    </div>
  );
}