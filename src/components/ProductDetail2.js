import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase"; // Import auth from firebase.js
import { collection, addDoc, getDocs } from "firebase/firestore";
import Sentiment from "sentiment"; // Sentiment analysis library
// import { useNavigate } from "react-router-dom";

const ProductDetail2 = () => {
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([]);
  const sentiment = new Sentiment(); // Initialize sentiment analyzer
  // const navigate = useNavigate();

  // Fetch reviews from Firestore
  useEffect(() => {
    const fetchReviews = async () => {
      const querySnapshot = await getDocs(collection(db, "product2Reviews"));
      const reviewsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReviews(reviewsData);
    };

    fetchReviews();
  }, []);

  // Calculate total counts and overall sentiment
  const totalPositive = reviews.filter((r) => r.sentiment === "positive").length;
  const totalNegative = reviews.filter((r) => r.sentiment === "negative").length;
  const totalNeutral = reviews.filter((r) => r.sentiment === "neutral").length;

  const overallSentiment =
    totalPositive > totalNegative && totalPositive > totalNeutral
      ? "Positive"
      : totalNegative > totalPositive && totalNegative > totalNeutral
      ? "Negative"
      : "Neutral";

  // Handle review submission
  const handleAddReview = async () => {
    const user = auth.currentUser; // Get the current user
    if (!user) {
      alert("Please log in to submit a review.");
      return;
    }

    if (!review.trim()) {
      alert("Please enter a review.");
      return;
    }

    // Perform sentiment analysis
    const result = sentiment.analyze(review);
    const sentimentScore = result.score;
    let sentimentLabel = "neutral";
    if (sentimentScore > 0) sentimentLabel = "positive";
    else if (sentimentScore < 0) sentimentLabel = "negative";

    // Save review to Firestore with user details and product name
    try {
      await addDoc(collection(db, "product2Reviews"), {
        text: review,
        sentiment: sentimentLabel,
        timestamp: new Date(),
        userId: user.uid, // Save user ID
        userName: user.displayName || "Anonymous", // Save user name
        productName: "Product 2", // Save product name
      });
      setReview(""); // Clear the input field
      alert("Review added successfully!");
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      {/* Product Image and Name */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <img
          src={require("./images/product2.png")}
          alt="Product 1"
          style={{ width: "100%", maxWidth: "400px", borderRadius: "8px" }}
        />
        <h2 style={{ marginTop: "10px" }}>Product 2</h2>
        <p><strong>Price:</strong> $29.99</p>
        <p><strong>Description:</strong> <br></br>Don't let the rain stop you in this lightweight, water-repellent jacket. <br></br>With a stowaway hood and curved, elongated back hem for extra coverage, you can feel prepared for changing conditions. <br></br>Add the vent on the back that helps increase airflow, and you're ready to push through that extra mile, whatever the weather.
<br></br>
<br></br>

✤  Colour Shown: Mink Brown/Black/Mink Brown<br></br>
✤  Style: FB7452-233<br></br>
✤  Country/Region of Origin: Vietnam</p>
      </div>

      {/* Add Review Section */}
      <div style={{ marginTop: "20px" }}>
        <h3>Add a Review</h3>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Write your review here..."
          style={{ width: "100%", height: "100px", padding: "10px" }}
        />
        <button
          onClick={handleAddReview}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginTop: "10px",
          }}
        >
          Submit Review
        </button>
      </div>

      {/* Display Reviews */}
      <div style={{ marginTop: "20px", textAlign: "left" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          {/* Overall Sentiment (Center) */}
          <div style={{ flex: 1, textAlign: "center" }}>
            <h3>
              Overall Sentiment:{" "}
              <span
                style={{
                  color:
                    overallSentiment === "Positive"
                      ? "green"
                      : overallSentiment === "Negative"
                      ? "red"
                      : "gray",
                }}
              >
                {overallSentiment}
              </span>
            </h3>
          </div>

          {/* Total Counts (Right Side) */}
          <div style={{ textAlign: "right" }}>
            <p>
              <strong>Positive:</strong>{" "}
              <span style={{ color: "green" }}>{totalPositive}</span>
            </p>
            <p>
              <strong>Negative:</strong>{" "}
              <span style={{ color: "red" }}>{totalNegative}</span>
            </p>
            <p>
              <strong>Neutral:</strong>{" "}
              <span style={{ color: "gray" }}>{totalNeutral}</span>
            </p>
          </div>
        </div>

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <p>No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "10px",
                marginBottom: "10px",
              }}
            >
              {/* Review Text (Left Side) */}
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0 }}>{review.text}</p>
                <p style={{ margin: 0, fontSize: "0.9em", color: "#666" }}>
                  <strong>By:</strong> {review.userName}
                </p>
              </div>

              {/* Sentiment Score (Right Side) */}
              <p style={{ margin: 0, marginLeft: "20px" }}>
                <strong>Sentiment:</strong>{" "}
                <span
                  style={{
                    color:
                      review.sentiment === "positive"
                        ? "green"
                        : review.sentiment === "negative"
                        ? "red"
                        : "gray",
                  }}
                >
                  {review.sentiment}
                </span>
              </p>
            </div>
          ))
        )}
      </div>

      {/* Back Button */}
      <button
        onClick={() => window.history.back()}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          marginTop: "20px",
        }}
      >
        Back to Products
      </button>
    </div>
  );
};

export default ProductDetail2;