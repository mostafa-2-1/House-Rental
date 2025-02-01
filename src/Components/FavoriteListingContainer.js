import React from 'react';
import { Heart } from 'lucide-react';
import { useListings } from './ListingsProvider';
import './FavoriteListingContainer.css';
import image from '../Assets/logo.png'

export function FavoriteListingContainer() {
  const { listings, favorites, toggleFavorite } = useListings();

  console.log("Favorites Array:", favorites);
  console.log("Listings Data:", listings);

  const favoriteListings = listings.map((listing) => ({
    ...listing,
    isFavorite: favorites.includes(listing.id),
  }));
  
  console.log("Favorite Listings:", favoriteListings);

  return (
    <div className="favorite-listing-container">
      {favoriteListings.length === 0 ? (
        <p>No favorite listings found.</p>
      ) : (
        <div className="favorite-listing-grid">
          {favoriteListings.map((listing) => (
            <div key={listing.id} className="card listing-card">
              <div className="card-body p-0 relative">
                <img
                  src={image || "/placeholder.svg"}
                  alt={listing.location}
                  width={300}
                  height={200}
                  className="listing-image"
                />
                <button
                  className="favorite-btn"
                  onClick={() => toggleFavorite(listing.id)}
                >
                  <Heart className="heart-icon active" /> 
                </button>
                <div className="listing-details">
                  <h3>{listing.location}</h3>
                  <p>{listing.description}</p>
                  <p>${listing.price} / night</p>
                </div>
              </div>
              <div className="card-footer listing-footer">
                <button className="btn btn-outline-primary">View Details</button>
                <button className="btn btn-secondary chat-btn">
                  Chat with Owner
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
