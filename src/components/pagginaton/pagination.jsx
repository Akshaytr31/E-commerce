import React, { useEffect, useState } from "react";
import "./pagination.css";

function Pagination() {
  const images = [
    "src/assets/pagination/balancing-1868051.jpg",
    "src/assets/pagination/technology-6801334.jpg",
    "src/assets/pagination/woman-2593366.jpg",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const duration = 5000; // time per slide (ms)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
      setProgress(0);
    }, duration);

    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 2.5 : 100));
    }, duration / 40); // smooth progress bar

    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, [images.length]);

  const nextImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
    setProgress(0);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
    setProgress(0);
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
          &#10094;
        </button>
        <button className="arrow right" onClick={nextImage}>
          &#10095;
        </button>

        {/* Loading Line */}
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    </div>
  );
}

export default Pagination;
