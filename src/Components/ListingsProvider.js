

import React, { createContext, useState, useContext, useEffect } from 'react';

export const ListContext = createContext();

export const ListingsProvider = ({ children }) => {
  const [apartments, setApartments] = useState([]);
  const [filteredApartments, setFilteredApartments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortCriteria, setSortCriteria] = useState('');

  useEffect(() => {
    fetchApartments();
  }, []);

  const fetchApartments = async () => {
    try {
      const response = await fetch('http://localhost:3000/apartments');
      if (response.ok) {
        const data = await response.json();
        setApartments(data.apartments);
        setFilteredApartments(data.apartments);
      } else {
        console.error('Failed to fetch apartments');
      }
    } catch (error) {
      console.error('Error fetching apartments:', error);
    }
  };

  const filterApartments = (category) => {
    if (category === 'All') {
      setFilteredApartments(apartments);
    } else {
      const filtered = apartments.filter(apartment => apartment.type === category);
      setFilteredApartments(filtered); 
    }
  };

  const sortApartments = (criteria) => {
    let sorted = [...filteredApartments];
    switch (criteria) {
      case 'priceLowHigh':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'priceHighLow':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'bedrooms':
        sorted.sort((a, b) => a.bedrooms - b.bedrooms);
        break;
      case 'bathrooms':
        sorted.sort((a, b) => a.bathrooms - b.bathrooms);
        break;
      default:
        return;
    }
    setFilteredApartments(sorted);
  };

  useEffect(() => {
    if (sortCriteria) {
      sortApartments(sortCriteria);
    }
  }, [sortCriteria]);


  return (
    <ListContext.Provider value={{ 
      apartments, 
      setApartments, 
      filteredApartments, 
      setFilteredApartments,
      filterApartments, 
      searchQuery, 
      setSearchQuery, 
      selectedCategory, 
      setSelectedCategory ,
      sortCriteria, 
      setSortCriteria
    }}>
      {children}
    </ListContext.Provider>
  );
};

export function useListings() {
  const context = useContext(ListContext);
  if (context === undefined) {
    throw new Error('useListings must be used within a ListingsProvider');
  }
  return context;
}
