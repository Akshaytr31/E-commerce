import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import HomePage from "./pages/HomePage/homepage";
import About from "./pages/aboutPage";
import Contact from "./pages/contactPage";
import Cart from "./pages/CartPage";
import ProductPage from "./pages/porductPage";
import ItemPage from "./pages/itemPage";
import { CartProvider } from "./context/CartContext";
import { UserProvider } from "./context/userContext";
import Footer from "./components/footer/footer";
import Favorite from "./pages/favorite";
import Signin from "./components/signin/signin";
import Login from "./components/login/login";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <UserProvider>
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
              <Route path="/signin" element={<Signin />} />
              <Route path="/login" element={<Login />} />
            </Routes>
            <Footer />
          </Router>
        </CartProvider>
      </UserProvider>
    </div>
  );
}

export default App;
