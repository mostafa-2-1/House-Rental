
import React, { useContext, useState, useEffect } from "react";
import { ListContext } from "./ListingsProvider.js";
import AddListingForm from "./AddListingForm";
import { FaChevronLeft, FaChevronRight, FaComments, FaInfoCircle, FaHeart } from "react-icons/fa";
import "./ListingContainer.css";
import { useNavigate } from 'react-router-dom';
import { getFirestore, query, where, getDocs, collection, doc, setDoc, Timestamp } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBE9yal7KzrezuvF5-qAQeGXA4F61mTwCQ",
  authDomain: "house-184b9.firebaseapp.com",
  projectId: "house-184b9",
  storageBucket: "house-184b9.firebasestorage.app",
  messagingSenderId: "641558261694",
  appId: "1:641558261694:web:d0f2293e8d2c9a1b9353ef",
  measurementId: "G-X1TEV5F5TK"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); 
export const ListingContainer = () => {
  const { setApartments, setFilteredApartments, filterApartments, filteredApartments } = useContext(ListContext); 
  const [showAddForm, setShowAddForm] = useState(false);
  const [ownerId, setOwnerId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [showDetails, setShowDetails] = useState(null);
  const [favorites, setFavorites] = useState({});
  const [citySearch, setCitySearch] = useState("");
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('authToken');
  const role = localStorage.getItem('role');

  const handleReviewsClick = () => {
    if(!isLoggedIn){
      navigate('signup');
      return;
    }
    navigate('/reviews');
  };
  useEffect(() => {
    const storedOwnerId = localStorage.getItem("userId");
    if (storedOwnerId) {
      setOwnerId(storedOwnerId);
    }
  }, []);
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!isLoggedIn) return;
      const memberId = localStorage.getItem('memberId');
      if (!memberId) {
        console.error('No member ID found');
        return;
      }

      try {
        const response = await fetch(`http://localhost:3000/favorites/list/${memberId}`);
        const data = await response.json();

        if (data.success) {
          const favoritesFromDB = data.favorites.reduce((acc, curr) => {
            acc[curr.propertyId] = true;
            return acc;
          }, {});

          localStorage.setItem('favorites', JSON.stringify(favoritesFromDB));
          setFavorites(favoritesFromDB);
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };
    if (isLoggedIn) {
      fetchFavorites();
    }
  }, [isLoggedIn]);



  useEffect(() => {
    if (isLoggedIn) {
      const storedFavorites = localStorage.getItem('favorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } else {
      setFavorites({});
    }
  }, [isLoggedIn]);
  
  const handleAddListing = () => {
    if(!isLoggedIn){
      navigate('signup');
      return;
    }
    setShowAddForm(true);
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
  };
  
  const handleCitySearchChange = (event) => {
    const city = event.target.value;
    setCitySearch(city);
    filterApartmentsByCity(city);
  };

  const filterApartmentsByCity = (city) => {
    if (city) {
      const filteredByCity = filteredApartments.filter((apartment) =>
        apartment.city.toLowerCase().includes(city.toLowerCase()) 
      );
      setFilteredApartments(filteredByCity); 
    } else {
      setFilteredApartments(filteredApartments);
    }
  };

  
  const uniqueApartments = filteredApartments.filter(
    (value, index, self) => index === self.findIndex((t) => t.propertyId === value.propertyId)
  );

 
  const handleImageChange = (direction, propertyId) => {
    setCurrentImageIndex((prevState) => {
      const totalImages = uniqueApartments.find((apt) => apt.propertyId === propertyId)?.images?.length || 0;
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
    if (!isLoggedIn) {
      navigate('/signup');
      return;
    }

    const memberId = localStorage.getItem('memberId');
    if (!memberId) {
      console.error('No member ID found in localStorage');
      return;
    }

    const isFavorite = favorites[propertyId];
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
          const newFavorites = { ...prevFavorites, [propertyId]: !prevFavorites[propertyId] };

          localStorage.setItem('favorites', JSON.stringify(newFavorites));

          return newFavorites;
        });
      } else {
        console.error('Error updating favorites:', data.message);
      }
    } catch (error) {
      console.error('Error handling favorite:', error);
    }
  };

  
  const handleChatClick = async (apartment) => {
    if (!isLoggedIn) {
      navigate('/signup');
      return;
    }
  
    const memberId = localStorage.getItem('memberId');
    if (!memberId) {
      console.error('No member ID found');
      return;
    }
  
    console.log(apartment);
    console.log(memberId);
    console.log(apartment.ownerId);
  
    const messagesQuery = query(
      collection(db, "messages"),
      where("sender", "in", [memberId, apartment.ownerId]),
      where("receiver", "in", [memberId, apartment.ownerId])
    );
  
    const messagesSnapshot = await getDocs(messagesQuery);
  
    let existingChat = null;
  
    messagesSnapshot.forEach((doc) => {
      const data = doc.data();
      if (
        (data.sender === memberId && data.receiver === apartment.ownerId) ||
        (data.sender === apartment.ownerId && data.receiver === memberId)
      ) {
        existingChat = doc;
      }
    });
  
    if (existingChat) {
      console.log("CONVO EXISTS");
      navigate(`/chat/${existingChat.id}`);
    } else {
      console.log("No conversation exists, creating a new one");
  
      const newMessageRef = doc(collection(db, "messages"));
  
      await setDoc(newMessageRef, {
        sender: memberId,
        receiver: apartment.ownerId, 
        message: "", 
        timestamp: new Date(), 
      });
  
      console.log("New conversation created");
      navigate(`/chat/${newMessageRef.id}`);
    }
  };
  
  

  return (
    <div className="listing-container">

      <button className="floating-btn" onClick={handleAddListing}>
        +
      </button>

      <div className="listing-grid">
        {uniqueApartments.map((apartment) => {
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
                    {console.log('Favorites:   ',favorites)}; 

                    <button
                      className={`favorite-btn ${favorites[apartment.propertyId] ? "active" : ""}`}
                      onClick={() => handleToggleFavorite(apartment.propertyId)}
                    >
                      {(role !== 'admin')? <FaHeart />:<></>}
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
                  <button className="btn btn-outline-primary" onClick={() => handleChatClick(apartment)}>
                    <FaComments /> Chat
                  </button>
                  <button className="btn btn-secondary" onClick={() => handleViewDetails(apartment)}>
                    <FaInfoCircle /> Details
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showAddForm && (
        <AddListingForm onClose={handleCloseForm} setApartments={setApartments} ownerIdProp={localStorage.getItem("memberId")} />
      )}

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
    </div>
  );
};

export default ListingContainer;
