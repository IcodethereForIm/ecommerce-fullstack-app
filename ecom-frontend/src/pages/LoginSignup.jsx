import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
//import { FaUserAlt } from "react-icons/fa"; // profile icon
import Profile from "./Profile";

function LoginSignup() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const token = localStorage.getItem("auth_token")

  if(token){
    return <Profile/>
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/magic-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: input }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Something went wrong!");
        setLoading(false);
        return;
      }

      // Store token
      if (data.token) localStorage.setItem("auth_token", data.token);

      alert(data.message);

      // Redirect to profile page
      //navigate("/profile");
    } catch (err) {
      console.error(err);
      alert("Backend error, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-dark">
      <div
        className="p-5 rounded-4 shadow-lg text-center"
        style={{ backgroundColor: "#111", width: "360px", color: "#fff" }}
      >
        <div className="mb-4">
          <span style={{ fontSize: "50px", color: "#0d6efd" }}>👤</span>
        </div>
        <h2 className="mb-4">Welcome Back</h2>
        <p className="mb-3 text-secondary">
          Enter your email or phone to continue
        </p>
        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          <input
            type="text"
            placeholder="Email or Phone"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="form-control rounded-pill px-3 py-2"
            required
          />
          <button
            type="submit"
            className="btn btn-primary rounded-pill mt-2"
            disabled={loading}
          >
            {loading ? "Processing..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginSignup;