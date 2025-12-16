import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [view, setView] = useState("");
  const [tableData, setTableData] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    async function getStats() {
      try {
        setStatsLoading(true);
        const res = await fetch("http://localhost:8000/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setStatsLoading(false);
      }
    }
    getStats();
  }, [token]);

  const loadData = async (type) => {
    setView(type);
    setTableLoading(true);

    try {
      let url =
        type === "users"
          ? "/users"
          : type === "sellers"
          ? "/sellers"
          : "/stats";

      const res = await fetch(`http://localhost:8000/admin${url}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setTableData(type === "pending" ? data.pendingRequests : data);
    } catch {
      alert("Failed to load data");
    } finally {
      setTableLoading(false);
    }
  };

  const handleRequest = async (email, action) => {
    try {
      setTableLoading(true);
      await fetch(`http://localhost:8000/admin/seller/${action}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });
      loadData("pending");
    } finally {
      setTableLoading(false);
    }
  };

  const blockAction = async (email, action) => {
    try {
      setTableLoading(true);
      await fetch(`http://localhost:8000/admin/user/${action}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });
      loadData(view);
    } finally {
      setTableLoading(false);
    }
  };

  const openModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setShowModal(false);
  };

  return (
    <div className="admin-container">
      <h2>Admin Dashboard</h2>

      {statsLoading ? (
        <p>Loading statistics...</p>
      ) : (
        stats && (
          <div className="stats-box">
            <div className="stat-card" onClick={() => loadData("users")}>
              <h3>Total Users</h3>
              <p>{stats.totalUsers}</p>
            </div>

            <div className="stat-card" onClick={() => loadData("sellers")}>
              <h3>Total Sellers</h3>
              <p>{stats.totalSellers}</p>
            </div>

            <div
              className="stat-card pending"
              onClick={() => loadData("pending")}
            >
              <h3>Seller Requests</h3>
              <p>{stats.pendingRequests?.length || 0}</p>
            </div>
          </div>
        )
      )}

      {view && (
        <div className="table-wrapper">
          <h3>{view.toUpperCase()}</h3>

          {tableLoading ? (
            <p>Loading...</p>
          ) : (
            <table className="request-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>GST</th>
                  {view !== "pending" && <th>Status</th>}
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {tableData.map((u, i) => (
                  <tr
                    key={i}
                    className="clickable-row"
                    onClick={() => openModal(u)}
                  >
                    <td>{u.email}</td>
                    <td>{u.gst || "-"}</td>

                    {view !== "pending" && (
                      <td>
                        <FontAwesomeIcon
                          icon={u.isBlocked ? faCircleXmark : faCircleCheck}
                          className={
                            u.isBlocked ? "blocked-icon" : "active-icon"
                          }
                        />
                      </td>
                    )}

                    <td onClick={(e) => e.stopPropagation()}>
                      {view === "pending" ? (
                        <>
                          <button
                            className="approve"
                            onClick={() =>
                              handleRequest(u.email, "approve")
                            }
                          >
                            Approve
                          </button>
                          <button
                            className="reject"
                            onClick={() =>
                              handleRequest(u.email, "reject")
                            }
                          >
                            Reject
                          </button>
                        </>
                      ) : u.isBlocked ? (
                        <button
                          className="approve"
                          onClick={() =>
                            blockAction(u.email, "unblock")
                          }
                        >
                          Unblock
                        </button>
                      ) : (
                        <button
                          className="reject"
                          onClick={() =>
                            blockAction(u.email, "block")
                          }
                        >
                          Block
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* MODAL */}
      {showModal && selectedUser && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>Details</h3>

            <p><b>Email:</b> {selectedUser.email}</p>
            <p><b>Shop Name:</b> {selectedUser.shopName || "-"}</p>
            <p><b>GST:</b> {selectedUser.gst || "-"}</p>
            <p><b>Address:</b> {selectedUser.address || "-"}</p>
            <p>
              <b>Requested At:</b>{" "}
              {selectedUser.sellerRequestedAt
                ? new Date(
                    selectedUser.sellerRequestedAt
                  ).toLocaleString()
                : "-"}
            </p>

            <button className="close-btn" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
