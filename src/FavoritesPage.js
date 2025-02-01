
import React, { useContext, useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight, FaComments, FaInfoCircle, FaHeart } from "react-icons/fa";
import "./Components/ListingContainer.css";
import { useNavigate } from 'react-router-dom';
import { NavigationBar } from "./Components/NavigationBar.js";

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [showDetails, setShowDetails] = useState(null);

  const navigate = useNavigate();
  const handleReviewsClick = () => {
    navigate('/reviews');
  };


  useEffect(() => {
    console.log('Now?');
    const fetchFavorites = async () => {
      const memberIdGot = localStorage.getItem('memberId');
      if (!memberIdGot) {
        console.error('No member ID found in localStorage');
        setLoading(false);
        return;
      }
      console.log('Now??');
      try {
        console.log('IN');
        const response = await fetch(`http://localhost:3000/favorites/list/${memberIdGot}`);
        if (response.ok) {
          const data = await response.json();
          setFavorites(data.favorites);
        } else {
          console.error('Failed to fetch favorites:', response.status);
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setLoading(false);
      }
    };
    console.log('Now!');
    fetchFavorites();
  }, []);

  const handleImageChange = (direction, propertyId) => {
    setCurrentImageIndex((prevState) => {
      const totalImages = favorites.find((apt) => apt.propertyId === propertyId)?.images?.length || 0;
      let newIndex = prevState[propertyId] || 0;

      if (direction === "next") {
        newIndex = (newIndex + 1) % totalImages;
      } else {
        newIndex = (newIndex - 1 + totalImages) % totalImages;
      }

      return { ...prevState, [propertyId]: newIndex };
    });
  };

  const handleViewDetails = (apartment) => {
    setShowDetails(apartment);
  };

  const handleCloseDetails = () => {
    setShowDetails(null);
  };

  const handleToggleFavorite = async (propertyId) => {
    const memberId = localStorage.getItem('memberId');
    if (!memberId) {
      console.error('No member ID found in localStorage');
      return;
    }
    
    const isFavorite = favorites.some(item => item.propertyId === propertyId);
    const method = isFavorite ? 'DELETE' : 'POST';
    const url = `http://localhost:3000/favorites/${method === 'POST' ? 'add' : 'remove'}`;
  
    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ memberId, propertyId }),
      });
  
      const data = await response.json();
      if (data.success) {
        setFavorites((prevFavorites) => {
          let updatedFavorites;
          if (isFavorite) {
            updatedFavorites = prevFavorites.filter(item => item.propertyId !== propertyId);
          } else {
            
            updatedFavorites = [...prevFavorites, { propertyId }];
          }
          localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
          return updatedFavorites;
        });
      } else {
        console.error('Error toggling favorite:', data.message);
      }
    } catch (error) {
      console.error('Error handling favorite toggle:', error);
    }
  };
  

  return (
    <div className="listing-container">
      <div className="listing-grid">
        {loading?(
          <p>loading....</p>
        ): favorites.length === 0 ?(
          <p>No favorites found</p>
        ):(

        favorites.map((apartment) => {  
          const currentIndex = currentImageIndex[apartment.propertyId] || 0;
          return (
            <div key={apartment.propertyId} className="listing-card">
              <div className="image-container">
                {Array.isArray(apartment.images) && apartment.images.length > 0 ? (
                  <>
                    <img
                      style={{ objectFit: "contain" }}
                      src={`http://localhost:3000${apartment.images[currentIndex]}`}
                      alt={`Apartment`}
                      className="listing-image"
                    />
                    <button
                      className="arrow-button left"
                      onClick={() => handleImageChange("prev", apartment.propertyId)}
                    >
                      <FaChevronLeft />
                    </button>
                    <button
                      className="arrow-button right"
                      onClick={() => handleImageChange("next", apartment.propertyId)}
                    >
                      <FaChevronRight />
                    </button>
                    <button
                    style={{color:'red'}}
                      className={`favorite-btn ${favorites.includes(apartment.propertyId) ? "active" : ""}`}
                      onClick={() => handleToggleFavorite(apartment.propertyId)}
                    >
                      <FaHeart />
                    </button>
                  </>
                ) : (
                  <p>No image available</p>
                )}
              </div>

              <div className="listing-details">
                <h3>{apartment.type}</h3>
                <p className="price">Price: ${apartment.price}</p>
                <div className="button-container">
                  <button className="btn btn-outline-primary" onClick={() => {}}>
                    <FaComments /> Chat
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleViewDetails(apartment)}
                  >
                    <FaInfoCircle /> Details
                  </button>
                </div>
              </div>
            </div>
          );
        })
      )}
      </div>

      {showDetails && (
        <div className="details-modal">
          <div className="details-content">
            <h2>{showDetails.type}</h2>
            <p><strong>Price:</strong> ${showDetails.price}</p>
            <p><strong>Bedrooms:</strong> {showDetails.bedrooms}</p>
            <p><strong>Bathrooms:</strong> {showDetails.bathrooms}</p>
            <p><strong>Capacity:</strong> {showDetails.capacity}</p>
            <p><strong>Location:</strong> {showDetails.city}</p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={handleCloseDetails}>
                Close
              </button>
              <button className="reviews-btn" onClick={handleReviewsClick}>Reviews</button>
            </div>
          </div>
        </div>
      )}
      <NavigationBar/>
    </div>
  );
};

export default FavoritesPage;
