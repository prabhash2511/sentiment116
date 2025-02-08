import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

// import { Link } from "react-router-dom"; // Import Link

const Product = () => {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUserName(userDoc.data().name);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUserName("");
      }
    });

    return () => unsubscribe();
  }, []);

  const products = [
    {
      id: 1,
      name: "Air Jordan 1",
      price: "$19.99",
      image: require("./images/product1.jpg"),
    },
    {
      id: 2,
      name: "Fast Repel",
      price: "$29.99",
      image: require("./images/product2.png"),
    },
    {
      id: 3,
      name: "Paris Saint-Germain Jumpman",
      price: "$39.99",
      image: require("./images/product3.png"),
    },
    {
      id: 4,
      name: "Liverpool F.C. Strike Special Edition",
      price: "$49.99",
      image: require("./images/product4.png"),
    },
  ];

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
        {/* Welcome Message */}
        <div style={{ fontSize: "18px", fontWeight: "bold" }}>
          Welcome, {userName || "User"} !
        </div>

        {/* Buttons */}
        <div>
          
        <button
    onClick={() => navigate("/rank")} // Navigate to rank page
    style={{
      padding: "8px 16px",
      backgroundColor: "#007bff",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      marginRight: "10px",
    }}
  >
    Rank
  </button>
          
          <button
            onClick={() => navigate("/profile")}
            style={{
              padding: "8px 16px",
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              marginRight: "10px",
            }}
          >
            Profile
          </button>
          <button
            onClick={() => {
              auth.signOut();
              navigate("/login");
            }}
            style={{
              padding: "8px 16px",
              backgroundColor: "#ff4d4d",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Product Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          padding: "20px",
        }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              border: "1px solid #ccc",
              backgroundColor: "#edf2fa",
              borderRadius: "8px",
              padding: "10px",
              textAlign: "center",
              cursor: "pointer",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onClick={() => navigate(`/product-detail/${product.id}`)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <img
              src={product.image}
              alt={product.name}
              style={{ width: "100%", height: "400px", objectFit: "cover", borderRadius: "8px" }}
            />
            <h3 style={{ marginTop: "10px" }}>{product.name}</h3>
            <p>{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Product;