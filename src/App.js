import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Product from "./components/Product";
import ProductDetail1 from "./components/ProductDetail1";
import ProductDetail2 from "./components/ProductDetail2";
import ProductDetail3 from "./components/ProductDetail3";
import ProductDetail4 from "./components/ProductDetail4";
import Profile from "./components/Profile"; // Import the Profile component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/product" element={<Product />} />
        <Route path="/product-detail/1" element={<ProductDetail1 />} />
        <Route path="/product-detail/2" element={<ProductDetail2 />} />
        <Route path="/product-detail/3" element={<ProductDetail3 />} />
        <Route path="/product-detail/4" element={<ProductDetail4 />} />
        <Route path="/profile" element={<Profile />} /> {/* Add this route */}
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;