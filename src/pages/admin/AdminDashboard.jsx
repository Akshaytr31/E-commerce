import { useEffect, useState } from "react";

function AdminDashboard() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/admin/dashboard", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("adminToken")
      }
    })
      .then(res => res.json())
      .then(data => setMessage(data.message));
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>{message}</p>
    </div>
  );
}

export default AdminDashboard;
