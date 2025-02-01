'use client'

import { useListings } from './ListingsProvider.js'
import './Categories.css'

const categories = ['All', 'chalet', 'apartment', 'villa', 'studio'];

export function Categories() {
  const { selectedCategory, setSelectedCategory, filterApartments  } = useListings()
  
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    filterApartments(category);   
  };
  return (
    <div className="categories-container">
      {categories.map((category) => (
        <button
          key={category}
          className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
          onClick={() => handleCategorySelect(category)}
        >
          {category}
        </button>
      ))}
    </div>
  )

}
