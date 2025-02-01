import React from "react";
import { useNavigate } from "react-router-dom"; 
import "./ReviewPage.css";

const ReviewPage = () => {
  const navigate = useNavigate();

  const reviews = [
    {
      name: "Jane Doe",
      rating: 5,
      comment: "Very very good.",
    },
    {
      name: "John Smith",
      rating: 4,
      comment: "Very good.",
    },
    {
      name: "Emily Davis",
      rating: 3,
      comment: "Good.",
    },
    {
      name: "Michael Lee",
      rating: 5,
      comment: "Very very good.",
    },
  ];

  const handleBackClick = () => {
    navigate("/");
  };

  const handleAddReviewClick = () => {
    console.log("Add Review button clicked");
  };

  return (
    <div className="review-container">
      <div className="top-buttons">
        <button className="back-btn" onClick={handleBackClick}>
          Back
        </button>
        <button className="add-review-btn" onClick={handleAddReviewClick}>
          Add Review
        </button>
      </div>

      <h1>Program Reviews</h1>
      <div className="rating-summary">
        <h2>Overall Rating</h2>
        <div className="stars">
          <span>⭐⭐⭐⭐☆</span> <span>(4.2/5)</span>
        </div>
        <div className="rating-bars">
          <div className="bar">
            <span>5 Stars</span>
            <div className="progress-bar" style={{ width: "70%", backgroundColor: "#4caf50" }}></div>
            <span className="percentage">70%</span>
          </div>
          <div className="bar">
            <span>4 Stars</span>
            <div className="progress-bar" style={{ width: "20%", backgroundColor: "#2196f3" }}></div>
            <span className="percentage">20%</span>
          </div>
          <div className="bar">
            <span>3 Stars</span>
            <div className="progress-bar" style={{ width: "7%", backgroundColor: "#ffc107" }}></div>
            <span className="percentage">7%</span>
          </div>
          <div className="bar">
            <span>2 Stars</span>
            <div className="progress-bar" style={{ width: "2%", backgroundColor: "#ff9800" }}></div>
            <span className="percentage">2%</span>
          </div>
          <div className="bar">
            <span>1 Star</span>
            <div className="progress-bar" style={{ width: "1%", backgroundColor: "#f44336" }}></div>
            <span className="percentage">1%</span>
          </div>
        </div>
      </div>

      <div className="reviews">
        <h2>User Reviews</h2>
        {reviews.map((review, index) => (
          <div className="review" key={index}>
            <div className="review-header">
              <h3>{review.name}</h3>
              <span>{"⭐".repeat(review.rating)}</span>
            </div>
            <p>{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewPage;
