import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Login from './SignInPage.js';
import SignUp from './SignUpPage.js'; 
import ForgotPasswordEmail from './ForgotPasswordEmailPage.js';
import ResetPassword from './ResetPasswordPage.js';
import HomePage from './HomePage.js';
import FavoritesPage from './FavoritesPage.js';
import ChatPage from './ChatPage.js';
import ProfilePage from './ProfilePage.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReviewPage from './Components/ReviewPage.js';
import ChatListPage from './ChatPage.js';
import AdminDashboard from './AdminDashboard.js';
export default function App() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('authToken');
  }, []);

  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPasswordEmail />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/chat" element={<ChatListPage />}/>
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/reviews" element={<ReviewPage />} />
        <Route path="/chat/:id" element={<ChatPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
      </Routes>
    </div>
  );
}
