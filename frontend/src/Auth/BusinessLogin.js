import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { toast, ToastContainer, Slide } from 'react-toastify';
import { FaEye, FaEyeSlash } from "react-icons/fa";

function LoginForm() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5000/business/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        
        localStorage.setItem("token", data.token);
        localStorage.setItem("contractor", JSON.stringify(data.contractor));
        toast.success("Login Successful!");
        setTimeout(() => {
          window.location.href = "/Contractor";
        }, 2200);
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Business Login</h2>
        <p className="login-subtitle">Sign in to manage your business dashboard</p>
        <p style={{ color: "red" }}>{message}</p>

        <div className="input-group">
          <input
            type="email"
            value={email}
            placeholder="Username"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password input with conditional eye icon */}
        <div className="input-group" style={{ position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            style={{ paddingRight: "35px" }}
          />

          {password && (
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#666"
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          )}
        </div>

        <button onClick={handleLogin} className="login-btn">Login</button>

        <div className="login-footer">
          <Link to="#">Forgot password?</Link>
        </div>
      </div>

      <ToastContainer
        position="top-center"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Slide}
      />
    </div>
  );
}

export default LoginForm;
