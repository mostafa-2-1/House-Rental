import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaComments, FaHeart, FaUser } from 'react-icons/fa';
import './NavigationBar.css';

export function NavigationBar() {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const handleNavigation = (targetPage) => {
    const token = localStorage.getItem('authToken'); 
    if (token) {
      console.log('Logged in to the system');
      navigate(`/${targetPage}`);  
    } else {
      navigate('/signup');  
    }
  };

  return (
    <nav className="navigation-bar">
      <ul className="nav-links">
        <li>
          <Link to="/home">
            <FaHome className="nav-icon" /> Home
          </Link>
        </li>
        <li>
          <button onClick={() => handleNavigation('chat')}>
            <FaComments className="nav-icon" /> Chat
          </button>
        </li>

        {role !== "admin" && (
          <li>
            <button onClick={() => handleNavigation('favorites')}>
              <FaHeart className="nav-icon" /> Favorites
            </button>
          </li>
        )}

{role !== "admin" ? (
          <li>
            <button onClick={() => handleNavigation('profile')}>
              <FaHeart className="nav-icon" /> Profile
            </button>
          </li>
        ):
        <li>
            <button onClick={() => handleNavigation('dashboard')}>
              <FaHeart className="nav-icon" /> dashboard
            </button>
          </li>
        }

       
      </ul>
    </nav>
  );
};

