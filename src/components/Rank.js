import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Rank = () => {
  const [rankedProducts, setRankedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch reviews and calculate rankings
  useEffect(() => {
    const fetchAndRankProducts = async () => {
      try {
        // List of all review collections (match the names in ProductDetail1.js)
        const reviewCollections = [
          "product1Reviews", // Note the "s" at the end
          "product2Reviews",
          "product3Reviews",
          "product4Reviews",
        ];

        // Fetch all reviews from all collections
        const allReviews = [];
        for (const col of reviewCollections) {
          const snapshot = await getDocs(collection(db, col));
          snapshot.forEach((doc) => {
            allReviews.push(doc.data());
          });
        }

        // Aggregate sentiment counts by productName
        const productStats = {};

        allReviews.forEach((review) => {
          const productName = review.productName;
          if (!productStats[productName]) {
            productStats[productName] = {
              positive: 0,
              negative: 0,
              neutral: 0,
            };
          }

          // Count sentiment (ensure it matches the values in Firestore)
          switch (review.sentiment.toLowerCase()) {
            case "positive":
              productStats[productName].positive++;
              break;
            case "negative":
              productStats[productName].negative++;
              break;
            default:
              productStats[productName].neutral++;
          }
        });

        // Convert to array and calculate total reviews
        const productsArray = Object.keys(productStats).map((productName) => ({
          productName,
          ...productStats[productName],
          total:
            productStats[productName].positive +
            productStats[productName].negative +
            productStats[productName].neutral,
        }));

        // Sort by positive reviews (descending)
        const sortedProducts = productsArray.sort(
          (a, b) => b.positive - a.positive
        );

        // Add ranking
        const ranked = sortedProducts.map((product, index) => ({
          ...product,
          rank: index + 1,
        }));

        setRankedProducts(ranked);
        setLoading(false);

      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchAndRankProducts();
  }, []);

  return (
    <div>
      {/* Ribbon */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#d7f9f8",
          padding: "10px 20px",
          borderBottom: "1px solid #ccc",
        }}
      >
        <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>Product Rankings</h2>
        <button
          onClick={() => navigate("/product")}
          style={{
            padding: "8px 16px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Back to Products
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: "20px" }}>
        {loading ? (
          <p>Loading rankings...</p>
        ) : rankedProducts.length === 0 ? (
          <p>No reviews found to rank products.</p>
        ) : (
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            {/* Ranking Table */}
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "20px",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#f0f0f0" }}>
                  <th style={{ padding: "12px", textAlign: "left" }}>Rank</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>Product</th>
                  <th style={{ padding: "12px", textAlign: "center" }}>👍 Positive</th>
                  <th style={{ padding: "12px", textAlign: "center" }}>👎 Negative</th>
                  <th style={{ padding: "12px", textAlign: "center" }}>😐 Neutral</th>
                  <th style={{ padding: "12px", textAlign: "center" }}>Total Reviews</th>
                </tr>
              </thead>
              <tbody>
                {rankedProducts.map((product) => (
                  <tr
                    key={product.productName}
                    style={{
                      borderBottom: "1px solid #ddd",
                      backgroundColor: "#fff",
                    }}
                  >
                    <td style={{ padding: "12px", fontWeight: "bold" }}>
                      #{product.rank}
                    </td>
                    <td style={{ padding: "12px", fontWeight: "500" }}>
                      {product.productName}
                    </td>
                    <td style={{ padding: "12px", textAlign: "center", color: "green" }}>
                      {product.positive}
                    </td>
                    <td style={{ padding: "12px", textAlign: "center", color: "red" }}>
                      {product.negative}
                    </td>
                    <td style={{ padding: "12px", textAlign: "center", color: "gray" }}>
                      {product.neutral}
                    </td>
                    <td style={{ padding: "12px", textAlign: "center" }}>
                      {product.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Rank;