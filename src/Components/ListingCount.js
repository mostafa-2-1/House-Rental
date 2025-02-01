'use client'

import { useListings } from './ListingsProvider.js'
import './ListingCount.css'

export function ListingCount() {
  const { filteredApartments  } = useListings()
  console.log('Filtered Listings:', filteredApartments );

  const listingsCount = Array.isArray(filteredApartments ) ? filteredApartments .length : 0;

  return <span className="listing-count">{listingsCount} Listings</span>
}
