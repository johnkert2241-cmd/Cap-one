import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import { ImFacebook2 } from "react-icons/im";
import { SiGmail } from "react-icons/si";


function Login() {

    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [serverError, setServerError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
        setError({ ...error, [e.target.id]: "" });
    };

    // Validate fields
    const loginvalidate = () => {

        let newErrors = {};
        // Email required
        if (!formData.email) newErrors.email = "Email is required";
        // Password required
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

        try {
            const res = await fetch("http://localhost:5000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (!res.ok) {
                setServerError(data.message || "Failed to login");
                return;
            }

            // Save to localStorage
            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("token", data.token);

            toast.success("login Successfully!", { position: "top-center" });
            setTimeout(() => {
                navigate("/Home");
            }, 2000);

        } catch (err) {
            setServerError("Something went wrong. Please try again later.");
        }
    };

    return (

        <div className="formmain">
            <div className="formbox text-center justify-content-center align-items-center">
                <div className="box pt-5">
                    <p className="fonttext fs-1 pt-3">LOGIN</p>
                    <p className="signtext">Please log in your account</p>
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
                                <button type="submit" className="formbutton" >Log in</button>
                            </div>
                        </form>
                        <div className="SocialLogin pt-4">
                            <Link to="#">Forgot password?</Link>
                            <div className="p-4">
                                <span className="textDisabled pb-2 border-bottom" disabled>Or login with</span>
                                <div className="socialIcon pt-4">
                                    <Link to="#">
                                        <span><ImFacebook2 size='25' color={'#385898'} /> Facebook </span>
                                    </Link>

                                    <Link to="#">
                                        <span><SiGmail size='25' color={'#EA4335'} /> Gmail </span>
                                    </Link>
                                </div>
                            </div>
                            <div className="signupbutton">
                                <p className="p-3">Don't have an account?<Link to="/Signup">Sign up</Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>

    )
}

export default Login;