import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [userReviews, setUserReviews] = useState([]);
  const navigate = useNavigate();
  const user = auth.currentUser;

  // Fetch reviews by the current user
  useEffect(() => {
    const fetchUserReviews = async () => {
      if (user) {
        // Fetch reviews from all product collections
        const productCollections = [
          "product1Reviews",
          "product2Reviews",
          "product3Reviews",
          "product4Reviews",
        ];

        let allReviews = [];
        for (const collectionName of productCollections) {
          const q = query(
            collection(db, collectionName),
            where("userId", "==", user.uid)
          );
          const querySnapshot = await getDocs(q);
          const reviewsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            collection: collectionName, // Save the collection name
            ...doc.data(),
          }));
          allReviews = [...allReviews, ...reviewsData];
        }

        setUserReviews(allReviews);
      }
    };

    fetchUserReviews();
  }, [user]);

  // Handle editing a review
  const handleEditReview = async (reviewId, collectionName) => {
    const newReviewText = prompt("Edit your review:");
    if (newReviewText) {
      try {
        // Update the review in Firestore
        await updateDoc(doc(db, collectionName, reviewId), {
          text: newReviewText,
        });
        alert("Review updated successfully!");
        // Refresh the reviews list
        const updatedReviews = userReviews.map((review) =>
          review.id === reviewId ? { ...review, text: newReviewText } : review
        );
        setUserReviews(updatedReviews);
      } catch (error) {
        console.error("Error updating review:", error);
      }
    }
  };

  // Handle deleting a review
  const handleDeleteReview = async (reviewId, collectionName) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this review?");
    if (confirmDelete) {
      try {
        // Delete the review from Firestore
        await deleteDoc(doc(db, collectionName, reviewId));
        alert("Review deleted successfully!");
        // Refresh the reviews list
        const updatedReviews = userReviews.filter((review) => review.id !== reviewId);
        setUserReviews(updatedReviews);
      } catch (error) {
        console.error("Error deleting review:", error);
      }
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>User Profile</h2>
      {user ? (
        <>
          <p>
            <strong>Name:</strong> {user.displayName || "Anonymous"}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>

          <h3>Your Reviews</h3>
          {userReviews.length === 0 ? (
            <p>No reviews yet.</p>
          ) : (
            userReviews.map((review) => (
              <div
                key={review.id}
                style={{
                  border: "1px solid #000000",
                   
                  backgroundColor: "#edf2fa",
                  borderRadius: "8px",
                  padding: "10px",
                  marginBottom: "10px",
                  textAlign: "left",
                }}
              >
                <p>
                  <strong>Product:</strong> {review.productName}
                </p>
                <p>{review.text}</p>
                <p>
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
                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                  <button
                    onClick={() => handleEditReview(review.id, review.collection)}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#007bff",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteReview(review.id, review.collection)}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#ff4d4d",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>



                  
                </div>
              </div>
            ))
          )}
        </>
      ) : (
        <p>Please log in to view your profile.</p>
      )}

      <button
        onClick={() => navigate("/product")}
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

export default Profile;