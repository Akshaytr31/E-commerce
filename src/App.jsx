import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import HomePage from "./pages/HomePage/homepage";
import About from "./pages/aboutPage";
import Contact from "./pages/contactPage";
import Cart from "./pages/CartPage";
import ProductPage from "./pages/porductPage";
import ItemPage from "./pages/ItemPageWraper";
import { CartProvider } from "./context/CartContext";
import { UserProvider } from "./context/userContext";
import Footer from "./components/footer/footer";
import Favorite from "./pages/favorite";
import Signin from "./components/signin/signin";
import Login from "./components/login/login";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import SellerDashboard from "./pages/SellerDashboardPage";
import ProfilePage from "./pages/profile";
import Request from "./pages/RequestPage";
import { AuthProvider } from "./context/authContext";
import BuyPage from "./pages/buyPage/BuyPage";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <AuthProvider>
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
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/sellerDashboard" element={<SellerDashboard />} />
                <Route path="/request" element={<Request />}></Route>
                <Route path="/buy" element={<BuyPage/>}></Route>
              </Routes>
              <Footer />
            </Router>
          </CartProvider>
        </UserProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
