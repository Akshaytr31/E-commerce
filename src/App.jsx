import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import HomePage from "./pages/HomePage/homepage";
import About from "./pages/aboutPage";
import Contact from "./pages/contactPage";
import Cart from "./pages/CartPage";
import ProductPage from "./pages/porductPage";
import ItemPage from "./pages/itemPage";
import { CartProvider } from "./context/CartContext";
import Footer from "./components/footer/footer";
import Favorite from "./pages/favorite";
import './App.css'

function App() {
  return (
    <div className="app-container">

    <CartProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/products/:id" element={<ItemPage />} />
          <Route path="/favorites" element={<Favorite />} />
        </Routes>
        <Footer/>
      </Router>
    </CartProvider>
    </div>
  );
}

export default App;
