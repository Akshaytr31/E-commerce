import React, { useEffect, useState } from "react";
import "./pagination.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

function Pagination() {
  const images = [
    "src/assets/pagination/Gemini_Generated_Image_avqmq4avqmq4avqm.png",
    "src/assets/pagination/WhatsApp Image 2025-11-12 at 4.32.03 PM.jpeg",
    "src/assets/pagination/Gemini_Generated_Image_nwz42ynwz42ynwz4.png",
    "src/assets/pagination/Gemini_Generated_Image_6oak6o6oak6o6oak.png",
    "src/assets/pagination/Gemini_Generated_Image_xj9rsvxj9rsvxj9r.png",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const duration = 4000;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, duration);

    return () => clearInterval(interval);
  }, [images.length]);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="carousel-container">
      <div className="carousel-image-wrapper">
        <img
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          className="carousel-image"
        />

        {/* Arrow Buttons */}
        <button className="arrow left" onClick={prevImage}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>

        <button className="arrow right" onClick={nextImage}>
          <FontAwesomeIcon icon={faChevronRight} />
        </button>

        {/* Dots with loading */}
        <div className="carousel-dots">
          {images.map((_, index) => (
            <div
              key={index}
              className={`carousel-dot ${
                currentIndex === index ? "active" : ""
              }`}
            >
              {currentIndex === index && (
                <span
                  className="carousel-dot-loader"
                  style={{ animationDuration: "4s" }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Pagination;
