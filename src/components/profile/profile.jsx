import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faTimes, faEdit } from "@fortawesome/free-solid-svg-icons";
import { faBagShopping } from "@fortawesome/free-solid-svg-icons";
import "./profile.css";
import { div } from "framer-motion/client";

function ProfilePage() {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const [user, setUser] = useState(storedUser);

  const [username, setUsername] = useState(user.username);
  const [phone, setPhone] = useState(user.phone || "");
  const [gender, setGender] = useState(user.gender || "");

  const [isSeller, setIsSeller] = useState(user.isSeller || false);
  const [isBlocked, setIsBlocked] = useState(user.isBlocked || false);
  const [requestStatus, setRequestStatus] = useState("");

  const [editMode, setEditMode] = useState(false);

  // Save updated user in localStorage
  const updateLocalUser = (updatedFields) => {
    const updatedUser = { ...user, ...updatedFields };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const updateProfile = async () => {
    const res = await fetch("http://localhost:8000/user/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user.email,
        username,
        phone,
        gender,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      updateLocalUser({ username, phone, gender });
    }
  };

  const toggleSeller = async () => {
    const res = await fetch("http://localhost:8000/user/seller", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email, isSeller: !isSeller }),
    });

    const data = await res.json();

    if (res.ok) {
      setIsSeller(!isSeller);
      updateLocalUser({ isSeller: !isSeller });
    }
  };

  useEffect(() => {
    async function getStatus() {
      const res = await fetch(
        `http://localhost:8000/seller/seller-status?email=${user.email}`
      );
      const data = await res.json();
      console.log("dtaaaaaaaaaaaaaaaaa", data.isSeller);
      setRequestStatus(data.isSeller);
    }
    getStatus();
  }, []);

  return (
    <div className="profile-container page-enter">
      {editMode && (
        <div className="edit-overlay">
          <div className="edit-modal">
            <div className="profile-box">
              <h2 className="profile-heading">My Profile</h2>
              <label>Name:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <label>Email:</label>
              <input type="text" value={user.email} disabled />

              <label>Phone:</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <label>Gender:</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>

              <button
                className="save-btn"
                onClick={() => {
                  updateProfile();
                  setEditMode(false);
                }}
              >
                Save Changes
              </button>
              <div className="profile-close">
                <FontAwesomeIcon
                  icon={faTimes}
                  size="x"
                  color="gray"
                  style={{ cursor: "pointer" }}
                  onClick={() => setEditMode(false)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="profile-user">
        <div>
          <div className="user-icon">
            <FontAwesomeIcon icon={faUser} size="2x" />
          </div>
        </div>
        <div>
          <div className="user-name">Hello, {user.username}</div>
          <div>{user.email}</div>
        </div>
        <div>{user.phone}</div>
        <div className="profile-edit" onClick={() => setEditMode(true)}>
          <FontAwesomeIcon
            icon={faEdit}
            size="x"
            style={{ cursor: "pointer" }}
          />
        </div>
      </div>

      <div>
        <div className="seller-box">
          <h3>Become a Seller</h3>
          <p>Sell products and manage your own shop.</p>
          <p>
            Join our seller community and showcase your products to customers
            across the platform. As a seller, you’ll gain access to powerful
            tools that help you manage your inventory, track orders, and grow
            your business efficiently. Begin your seller journey with confidence
            and unlock new opportunities.
          </p>

          {/* <button className="seller-btn" onClick={toggleSeller}>
            {isSeller ? "Disable Seller Mode" : "Enable Seller Mode"}
          </button> */}
          <div className="seller-sell">
            {isBlocked ? (
              // Blocked user
              <button >You are blocked!</button>
            ) : requestStatus === true ? (
              // Approved seller
              <Link to="/sellerDashboard">
                <button>
                  Let's sell your products here!
                  <FontAwesomeIcon icon={faBagShopping} size="2x" />
                </button>
              </Link>
            ) : requestStatus === "pending" ? (
              // Pending request
              <button disabled style={{ background: "gray" }}>
                Your request is pending...
                <FontAwesomeIcon icon={faBagShopping} size="2x" />
              </button>
            ) : (
              // Not a seller and not pending
              <Link to="/request">
                <button>
                  Request to Become a Seller
                  <FontAwesomeIcon icon={faBagShopping} size="xl" />
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
