'use client'

import React from 'react';
import { useListings } from './ListingsProvider';
import './SortDropdown.css';

export function SortDropdown() {
  const { sortCriteria, setSortCriteria } = useListings();

  return (
    <div className="sort-dropdown-container">
      <label htmlFor="sortDropdown" className="sort-label">Sort by:</label>
      <select
        id="sortDropdown"
        className="sort-dropdown"
        value={sortCriteria}
        onChange={(e) => setSortCriteria(e.target.value)}
      >
        <option value="">Select</option>
        <option value="priceLowHigh">Price: Low to High</option>
        <option value="priceHighLow">Price: High to Low</option>
        <option value="bedrooms">Bedrooms</option>
        <option value="bathrooms">Bathrooms</option>
      </select>
    </div>
  );
}

