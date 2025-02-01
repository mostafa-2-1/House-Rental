import { Suspense } from 'react';
import React, { useState, useEffect } from 'react';
import { SearchBar } from './Components/SearchBar.js';
import { Categories } from './Components/Categories.js';
import { ListingCount } from './Components/ListingCount.js';
import { SortDropdown } from './Components/SortDropdown.js';
import { ListingContainer } from './Components/ListingContainer.js';
import { ListingsProvider } from './Components/ListingsProvider.js';
import { NavigationBar } from './Components/NavigationBar.js';
import { useNavigate } from 'react-router-dom';
import './home.css'

export default function HomePage() {
  const navigate = useNavigate(); 
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);
  return (
    <ListingsProvider>
      <div className="home-page">
        <SearchBar />
        <Categories />
        <div className="listing-controls">
          <ListingCount />
          <SortDropdown />
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <ListingContainer defaultFavorite={false} />
        </Suspense>
        <NavigationBar />
      </div>
    </ListingsProvider>
  );
}