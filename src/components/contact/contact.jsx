import "./contact.css";
import { FaInstagram, FaTwitter, FaFacebook } from "react-icons/fa";

function ContactPage() {
  return (
    <div className="contact-page">
      <h2>Contact Us</h2>

      <div className="contact-container">
        <div className="contact-left">
          <h3>Get in Touch</h3>
          <p>
            We'd love to hear from you!  
            Whether it's a question, suggestion, or support – feel free to reach out.
          </p>

          <div className="contact-details">
            <p><strong>Email:</strong> support@gullies.com</p>
            <p><strong>Phone:</strong> +91 98765 43210</p>
            <p><strong>Address:</strong> Sulthan Bathery, Kerala</p>
          </div>

          <div className="social-icons">
            <FaInstagram size={28} />
            <FaTwitter size={28} />
            <FaFacebook size={28} />
          </div>
        </div>

        <div className="contact-right">
          <form>
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <textarea placeholder="Your Message" rows="5" required></textarea>
            <button type="submit">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
