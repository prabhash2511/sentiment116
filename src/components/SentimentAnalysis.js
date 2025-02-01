import React, { useEffect, useRef } from "react";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js"; // Import Chart.js components
import { useLocation } from "react-router-dom";

// Register Chart.js components
Chart.register(ArcElement, Tooltip, Legend);

const SentimentAnalysis = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null); // Store the chart instance
  const location = useLocation();
  const { totalPositive, totalNegative, totalNeutral } = location.state || {
    totalPositive: 0,
    totalNegative: 0,
    totalNeutral: 0,
  };

  // Create the pie chart
  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");

      // Destroy the previous chart instance if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      // Create a new chart instance
      chartInstance.current = new Chart(ctx, {
        type: "pie", // Use "pie" chart type
        data: {
          labels: ["Positive", "Negative", "Neutral"],
          datasets: [
            {
              data: [totalPositive, totalNegative, totalNeutral],
              backgroundColor: ["green", "red", "gray"],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            tooltip: {
              enabled: true,
            },
          },
        },
      });
    }

    // Cleanup function to destroy the chart instance
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [totalPositive, totalNegative, totalNeutral]);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Sentiment Analysis</h2>
      <div style={{ width: "400px", margin: "0 auto" }}>
        <canvas ref={chartRef}></canvas>
      </div>
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
        Back to Product
      </button>
    </div>
  );
};

export default SentimentAnalysis;