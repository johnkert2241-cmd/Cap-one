import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import 'react-toastify/dist/ReactToastify.css';
import logo from "../assets/images/logomain.png";



function Login() {

    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [serverError, setServerError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
        setError({ ...error, [e.target.id]: "" });
    };

    // Validate fields
    const loginvalidate = () => {

        let newErrors = {};

        if (!formData.email) newErrors.email = "Email is required";
        if (!formData.password) newErrors.password = "Password is required";
        return newErrors;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const loginErrors = loginvalidate();
        if (Object.keys(loginErrors).length > 0) {
            setError(loginErrors);
            return;
        }

        setLoading(true);
        setServerError("");

        try {
            const res = await fetch("http://localhost:5000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                setTimeout(() => {
                    setServerError(data.message || "Failed to login");
                    setLoading(false);
                }, 1000);
                return;
            }

            // Save to localStorage
            setTimeout(() => {
                localStorage.setItem("user", JSON.stringify(data.user));
                localStorage.setItem("token", data.token);
                setLoading(false);
                navigate("/CusProfile");
            }, 1000);

        } catch (err) {
            setTimeout(() => {
                setServerError("Something went wrong. Please try again later.");
                setLoading(false);
            }, 1000);
        }
    };

    return (

        <div className="formmain py-5">
            <div className="formbox text-center py-5">
                <img src={logo} alt="ARCoolingPh" className="mb-3" style={{ width: "150px" }} />
                <p className="fs-5 " style={{ color: "#13abb9" }}>Please log in your account</p>
                <div className="formloginInput">
                    <form onSubmit={handleLogin}>
                        {serverError && <p style={{ color: "red", marginTop: "10px" }}>{serverError}</p>}
                        <div className="error">
                            <input
                                type="email"
                                className={error.email ? "input-error" : ""}
                                id="email"
                                placeholder='Email'
                                onChange={handleChange}
                            />
                            {error.email && <p className="text-start text-danger m-0">{error.email}</p>}
                            <input
                                type="password"
                                className={error.password ? "input-error" : ""}
                                id="password"
                                placeholder='Password'
                                onChange={handleChange}
                            />
                            {error.password && <p className="text-start text-danger m-0">{error.password}</p>}
                            {loading ? (
                                <button
                                    className="formbutton"
                                    type="button"
                                    disabled
                                >
                                    <span
                                        className="spinner-border spinner-border-sm me-2"
                                        role="status"
                                        aria-hidden="true"
                                    ></span>
                                    Logging in...
                                </button>
                            ) : (
                                <button type="submit" className="formbutton">
                                    Log in
                                </button>
                            )}
                        </div>
                    </form>
                    <div className="SocialLogin pt-4">
                        <Link to="#">Forgot password?</Link>
                        <div className="signupbutton">
                            <p className="p-3">Don't have an account?<Link to="/Signup">Sign up</Link></p>
                        </div>
                    </div>
                </div>

            </div>
        </div>

    )
}

export default Login;