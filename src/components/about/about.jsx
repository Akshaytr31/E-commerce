import React from "react";
import "./about.css";

function AboutPage() {
  return (
    <div className="about-page">
      <section className="about-hero">
        <h1>About Us</h1>
        <p>
          Welcome to <span>Gullies</span> — your one-stop destination for
          quality products at affordable prices.
        </p>
      </section>

      <section className="about-content">
        <div className="about-text">
          <h2>Our Story</h2>
          <p>
            Founded in 2025, Gullies began with a simple goal — to make
            shopping easier and more enjoyable for everyone. We bring together a
            curated collection of products from trusted brands across the world.
          </p>
        </div>

        <div className="about-text">
          <h2>What We Offer</h2>
          <p>
            From electronics and fashion to home essentials, we aim to provide
            high-quality items that fit your lifestyle. Our team continuously
            updates our catalog to ensure you always find something new and
            exciting.
          </p>
        </div>

        <div className="about-text">
          <h2>Our Mission</h2>
          <p>
            We strive to deliver a seamless shopping experience through modern
            technology, reliable delivery, and excellent customer service. Your
            satisfaction is our top priority.
          </p>
        </div>
      </section>

      <footer className="about-footer">
        <p>© {new Date().getFullYear()} Gullies. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default AboutPage;
