
import React, { useState } from 'react';
import Select from 'react-select';
import './AddListingForm.css';
import { useNavigate } from 'react-router-dom';

const AddListingForm = ({ onClose, setApartments, ownerIdProp }) => {
  const [formData, setFormData] = useState({
    price: '',
    type: '',
    city: '',
    capacity: '',
    bedrooms: '',
    bathrooms: '',
  });
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSelectChange = (selectedOption) => {
    setFormData((prevState) => ({
      ...prevState,
      type: selectedOption.value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files); 
    setImages(files);
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (images.length !== parseInt(formData.capacity)) {
      alert(`You must upload exactly ${formData.capacity} images.`);
      return;
    }
  
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/signup');
      return;
    }
  
    const formDataToSend = new FormData();
    formDataToSend.append('price', formData.price);
    formDataToSend.append('type', formData.type);
    formDataToSend.append('city', formData.city);
    formDataToSend.append('capacity', formData.capacity);
    formDataToSend.append('bedrooms', formData.bedrooms);
    formDataToSend.append('bathrooms', formData.bathrooms);
    formDataToSend.append('ownerId', Number(ownerIdProp));
  
    images.forEach((image, index) => {
      formDataToSend.append(`images[]`, image);
    });
  
    try {
      const response = await fetch('http://localhost:3000/apartments/add', {
        method: 'POST',
        body: formDataToSend,
      });
  
      if (response.ok) {
        const { propertyId, price, type, capacity, bedrooms, bathrooms, city, images } = await response.json();
        setApartments(prev => [...prev, { propertyId, price, type, capacity, bedrooms, bathrooms, city, images }]);
        onClose();
      } else {
        const errorResponse = await response.json();
        console.error('Failed to add listing:', errorResponse.message || response.statusText);
      }
    } catch (error) {
      console.error('Error adding listing:', error);
      alert(`An error occurred: ${error.message}`);
    }
  };
  

  const options = [
    { value: 'studio', label: 'Studio' },
    { value: 'chalet', label: 'Chalet' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'villa', label: 'Villa' },
  ];

  return (
    <div className="add-listing-form-overlay">
      <div className="add-listing-form">
        <h2>Add New Listing</h2>
        
        <div className="images-container">
          {images.length > 0 && (
            <div className="uploaded-images">
              {Array.from(images).map((image, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(image)}
                  alt={`image-${index}`}
                  className="uploaded-image"
                />
              ))}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-section">
            {Object.entries(formData).map(([key, value]) =>
              key === 'type' ? (
                <div key={key} className="form-group">
                  <label htmlFor={key}>Apartment Type:</label>
                  <Select
                    id={key}
                    name={key}
                    value={options.find((option) => option.value === value)}
                    onChange={handleSelectChange}
                    options={options}
                    isSearchable={false}
                    placeholder="Select a type"
                    required
                  />
                </div>
              ) : (
                <div key={key} className="form-group">
                  <label htmlFor={key}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}:
                  </label>
                  <input
                    type={
                      key === 'price' ||
                      key === 'capacity' ||
                      key === 'bedrooms' ||
                      key === 'bathrooms'
                        ? 'number'
                        : 'text'
                    }
                    id={key}
                    name={key}
                    value={value}
                    onChange={handleChange}
                    required
                  />
                </div>
              )
            )}
          </div>

          <div className="form-group">
            <label htmlFor="images">Upload Images:</label>
            <input
              type="file"
              id="images"
              name="images"
              multiple
              onChange={handleFileChange}
              accept="image/*"
              required
            />
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              +
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddListingForm;
