import React, { useEffect, useState } from 'react';
import { useListings } from './ListingsProvider';
import { Search } from 'lucide-react';
import './SearchBar.css';

export function SearchBar() {
  const { searchQuery, setSearchQuery, apartments, setFilteredApartments } = useListings();

  useEffect(() => {
    if (searchQuery.length >= 2) { 
      const filtered = apartments.filter((apartment) =>
        apartment.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredApartments(filtered);
    } else {
      setFilteredApartments(apartments);
    }
  }, [searchQuery, apartments, setFilteredApartments]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value); 
  };

  return (
    <div className="search-bar-container">
      <div className="search-bar-wrapper">
        <Search className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search for a location..."
          value={searchQuery}
          onChange={handleSearch}
          aria-label="Search for a location"
        />
      </div>
    </div>
  );
}
