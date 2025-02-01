
import React, { useState } from "react"
import { ArrowLeft, X, Edit2, Plus } from "lucide-react"
import {useNavigate } from 'react-router-dom';
import PFPUNKNOWN from './Assets/PFP UNKNOWN.jpg'
import "./ProfilePage.css"
import { NavigationBar } from "./Components/NavigationBar";
const ProfilePage = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [showTrackProperties, setShowTrackProperties] = useState(false)
  const [showModifyProperty, setShowModifyProperty] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [preferences, setPreferences] = useState({
    priceMin: "",
    priceMax: "",
    capacityMin: "",
    capacityMax: "",
    location: "",
    bathroomsMin: "",
    bathroomsMax: "",
    bedroomsMin: "",
    bedroomsMax: "",
  })
const navigate = useNavigate();
  const [properties, setProperties] = useState([
    {
      id: 1,
      name: "Sunny Beach House",
      location: "Miami, FL",
      price: 250,
      capacity: 6,
      bedrooms: 3,
      bathrooms: 2,
      images: ["/placeholder.svg?height=100&width=150", "/placeholder.svg?height=100&width=150"],
    },
    {
      id: 2,
      name: "Mountain Cabin Retreat",
      location: "Aspen, CO",
      price: 180,
      capacity: 4,
      bedrooms: 2,
      bathrooms: 1,
      images: ["/placeholder.svg?height=100&width=150"],
    },
    {
      id: 3,
      name: "Downtown Loft",
      location: "New York, NY",
      price: 300,
      capacity: 2,
      bedrooms: 1,
      bathrooms: 1,
      images: [
        "/placeholder.svg?height=100&width=150",
        "/placeholder.svg?height=100&width=150",
        "/placeholder.svg?height=100&width=150",
      ],
    },
    {
      id: 4,
      name: "Lakeside Cottage",
      location: "Lake Tahoe, CA",
      price: 220,
      capacity: 8,
      bedrooms: 4,
      bathrooms: 3,
      images: ["/placeholder.svg?height=100&width=150", "/placeholder.svg?height=100&width=150"],
    },
  ])

  const handleChangePassword = () => {
    alert("Change password functionality to be implemented")
  }

  const handleNotificationToggle = () => {
    setNotificationsEnabled(!notificationsEnabled)
    //alert(`Notifications ${!notificationsEnabled ? "enabled" : "disabled"}`)
  }

  const handleTrackProperties = () => {
    setShowTrackProperties(true)
  }

  const handleBackToProfile = () => {
    setShowTrackProperties(false)
  }

  const handleAddPreferences = () => {
    setShowPreferences(true)
  }

  const handleClosePreferences = () => {
    setShowPreferences(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('memberId');
    localStorage.removeItem('authToken');

    navigate('/login');
    console.log("Logout functionality to be implemented");
  }

  const handlePreferenceChange = (e) => {
    const { name, value } = e.target
    setPreferences((prev) => ({ ...prev, [name]: value }))
  }

  const handleSavePreferences = () => {
    console.log("Saved preferences:", preferences)
    setShowPreferences(false)
  }

  const handlePropertyAction = (propertyId, action) => {
    if (action === "modify") {
      const property = properties.find((p) => p.id === propertyId)
      setSelectedProperty({ ...property })
      setShowModifyProperty(true)
    } else {
      alert(`Action ${action} for property ${propertyId} to be implemented`)
    }
  }

  const handleCloseModifyProperty = () => {
    setShowModifyProperty(false)
    setSelectedProperty(null)
  }

  const handleEditProperty = (field) => {
    const newValue = prompt(`Enter new ${field}:`, selectedProperty[field])
    if (newValue !== null) {
      setSelectedProperty((prev) => ({ ...prev, [field]: newValue }))
    }
  }

  const handleAddImage = () => {
    const newImage = prompt("Enter URL for new image:")
    if (newImage) {
      setSelectedProperty((prev) => ({
        ...prev,
        images: [...prev.images, newImage],
      }))
    }
  }

  const handleDeleteImage = (index) => {
    setSelectedProperty((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const handleSaveChanges = () => {
    setProperties((prev) => prev.map((p) => (p.id === selectedProperty.id ? selectedProperty : p)))
    handleCloseModifyProperty()
  }

  const handleDeleteProperty = () => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      setProperties((prev) => prev.filter((p) => p.id !== selectedProperty.id))
      handleCloseModifyProperty()
    }
  }

  if (showTrackProperties) {
    return (
      <div className={`track-properties-page ${showModifyProperty ? "blurred" : ""}`}>
        <div className="track-properties-header">
          <button className="back-button" onClick={handleBackToProfile}>
            <ArrowLeft size={24} />
            Back to Profile
          </button>
          <h2>Your Properties</h2>
        </div>
        <div className="properties-list">
          {properties.map((property) => (
            <div key={property.id} className="property-item">
              <div className="property-info">
                <h3>{property.name}</h3>
                <p>{property.location}</p>
              </div>
              <select
                className="property-action"
                onChange={(e) => handlePropertyAction(property.id, e.target.value)}
                value=""
              >
                <option value="">Select Action</option>
                <option value="rented">Rented</option>
                <option value="available">Available</option>
                <option value="remove">Remove</option>
                <option value="modify">Modify</option>
              </select>
            </div>
          ))}
        </div>
        {showModifyProperty && selectedProperty && (
          <div className="modify-property-modal">
            <div className="modify-property-content">
              <div className="modify-property-header">
                <h2>Modify Property: {selectedProperty.name}</h2>
                <button className="close-button" onClick={handleCloseModifyProperty}>
                  <X size={24} />
                </button>
              </div>
              <div className="property-images">
                {selectedProperty.images.map((image, index) => (
                  <div key={index} className="property-image-container">
                    <img src={image || "/placeholder.svg"} alt={`Property ${index + 1}`} className="property-image" />
                    <button className="delete-image-button" onClick={() => handleDeleteImage(index)}>
                      <X size={16} />
                    </button>
                  </div>
                ))}
                <button className="add-image-button" onClick={handleAddImage}>
                  <Plus size={24} />
                  Add Image
                </button>
              </div>
              <div className="property-details">
                {["price", "location", "capacity", "bedrooms", "bathrooms"].map((field) => (
                  <div key={field} className="property-detail-row">
                    <span className="detail-label">{field.charAt(0).toUpperCase() + field.slice(1)}</span>
                    <span className="detail-value">{selectedProperty[field]}</span>
                    <button className="edit-button" onClick={() => handleEditProperty(field)}>
                      <Edit2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="modify-property-actions">
                <button className="delete-property-button" onClick={handleDeleteProperty}>
                  Delete Property
                </button>
                <button className="discard-changes-button" onClick={handleCloseModifyProperty}>
                  Discard Changes
                </button>
                <button className="save-changes-button" onClick={handleSaveChanges}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="profile-page">
      <div className={`profile-container ${showPreferences ? "blurred" : ""}`}>
        <img src={PFPUNKNOWN} alt="Profile" className="profile-picture" />
        <h2 className="username">MOSTAFA AB</h2>
        <button className="profile-button" onClick={handleChangePassword}>
          Change Password
        </button>
        <div className="toggle-container">
          <label htmlFor="notificationToggle">Enable Notifications</label>
          <div className="toggle-switch">
            <input
              type="checkbox"
              id="notificationToggle"
              checked={notificationsEnabled}
            />
            <span onClick={handleNotificationToggle} className="slider"></span>
          </div>
        </div>
        <button className="profile-button" onClick={handleTrackProperties}>
          Track Properties
        </button>
        <button className="profile-button" onClick={handleAddPreferences}>
          Add Preferences
        </button>
        <button className="profile-button logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {showPreferences && (
        <div className="preferences-modal">
          <div className="preferences-content">
            <div className="preferences-header">
              <h2>Add Preferences</h2>
              <button className="close-button" onClick={handleClosePreferences}>
                <X size={24} />
              </button>
            </div>
            <div className="preference-group">
              <label>Price Range</label>
              <div className="preference-inputs">
                <input
                  type="number"
                  name="priceMin"
                  placeholder="Min"
                  value={preferences.priceMin}
                  onChange={handlePreferenceChange}
                />
                <input
                  type="number"
                  name="priceMax"
                  placeholder="Max"
                  value={preferences.priceMax}
                  onChange={handlePreferenceChange}
                />
              </div>
            </div>
            <div className="preference-group">
              <label>Capacity</label>
              <div className="preference-inputs">
                <input
                  type="number"
                  name="capacityMin"
                  placeholder="Min"
                  value={preferences.capacityMin}
                  onChange={handlePreferenceChange}
                />
                <input
                  type="number"
                  name="capacityMax"
                  placeholder="Max"
                  value={preferences.capacityMax}
                  onChange={handlePreferenceChange}
                />
              </div>
            </div>
            <div className="preference-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                placeholder="Enter location"
                value={preferences.location}
                onChange={handlePreferenceChange}
              />
            </div>
            <div className="preference-group">
              <label>Bathrooms</label>
              <div className="preference-inputs">
                <input
                  type="number"
                  name="bathroomsMin"
                  placeholder="Min"
                  value={preferences.bathroomsMin}
                  onChange={handlePreferenceChange}
                />
                <input
                  type="number"
                  name="bathroomsMax"
                  placeholder="Max"
                  value={preferences.bathroomsMax}
                  onChange={handlePreferenceChange}
                />
              </div>
            </div>
            <div className="preference-group">
              <label>Bedrooms</label>
              <div className="preference-inputs">
                <input
                  type="number"
                  name="bedroomsMin"
                  placeholder="Min"
                  value={preferences.bedroomsMin}
                  onChange={handlePreferenceChange}
                />
                <input
                  type="number"
                  name="bedroomsMax"
                  placeholder="Max"
                  value={preferences.bedroomsMax}
                  onChange={handlePreferenceChange}
                />
              </div>
            </div>
            <div className="preference-actions">
              <button className="profile-button" onClick={handleSavePreferences}>
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
      <NavigationBar/>
    </div>
  )
}

export default ProfilePage

