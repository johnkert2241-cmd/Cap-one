import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from "../assets/images/logomain.png";
import { SiGmail } from "react-icons/si";


function Register() {
    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        password: "",
        address: "",
        age: "",
        phone: ""
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
        setErrors({ ...errors, [e.target.id]: "" }); // clear error kapag may type ulit
    };

    // Validate fields
    const validateForm = () => {
        let newErrors = {};

        if (!formData.fullname) {
            newErrors.fullname = "Full name is required";
        }

        if (!formData.email) newErrors.email = "Email is required";

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6 || formData.password.length > 10) {
            newErrors.password = "Password must be 6–10 characters";
        }

        if (!formData.address) newErrors.address = "Address is required";

        if (!formData.age) {
            newErrors.age = "Age is required";
        } else if (isNaN(formData.age)) {
            newErrors.age = "Enter a valid age";
        } else if (Number(formData.age) < 18) {
            newErrors.age = "Age must be 18 or above";
        }

        if (!formData.phone) {
            newErrors.phone = "Phone number is required";
        } else if (!/^[0-9]{11}$/.test(formData.phone)) {
            newErrors.phone = "Phone must be 11 digits";
        }

        return newErrors;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            Object.values(validationErrors).forEach(err =>
                toast.error(err, { position: "top-center" })
            );
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (!res.ok) {
                // Special check kapag email duplicate
                if (data.message && data.message.includes("Email already registered")) {
                    setErrors({ email: data.message });
                }
                throw new Error(data.message || "Failed to register");
            }

            toast.success("Registered Successfully!", { position: "top-center" });

            setTimeout(() => {
                navigate("/login");
            }, 2000);

        } catch (err) {
            toast.error(err.message, { position: "top-center" });
        }
    };

    return (
        <div className="formmain py-5">
            <div className="formbox text-center ">
                <div className="py-4">
                    <img src={logo} alt="ARCoolingPh" className="mb-3" style={{ width: "150px" }} />
                    <h4 className="py-2" style={{ color: "#13abb9" }}>Sign up for ARCooling PH</h4>
                    <div className="formloginInput">
                        <form onSubmit={handleRegister}>
                            <input
                                type="text"
                                id="fullname"
                                placeholder='Full Name'
                                onChange={handleChange}
                                className={`uppercase ${errors.fullname ? "input-error" : ""}`}
                            />
                            <input
                                type="email"
                                id="email"
                                placeholder='Email'
                                onChange={handleChange}
                                className={errors.email ? "input-error" : ""}
                            />
                            <input
                                type="password"
                                id="password"
                                placeholder='Password'
                                onChange={handleChange}
                                className={errors.password ? "input-error" : ""}
                            />
                            <input
                                type="text"
                                id="address"
                                placeholder='Address'
                                onChange={handleChange}
                                className={errors.address ? "input-error" : ""}
                            />
                            <input
                                type="number"
                                id="age"
                                placeholder='Age'
                                onChange={handleChange}
                                className={errors.age ? "input-error" : ""}
                            />
                            <input
                                type="text"
                                id="phone"
                                placeholder='Phone Number'
                                onChange={handleChange}
                                className={errors.phone ? "input-error" : ""}
                            />
                            <button type="submit" className="formbutton">Signup</button>

                        </form>

                        {/* Social Login */}
                        <div className="SocialLogin pt-3">
                            <span className="textDisabled pb-2 border-bottom">Or login with</span>
                            <div className="py-3 align-items-center">
                                <button className="btn btn-light shadow-md">
                                    <SiGmail size={20} color="#DB4437" />
                                    <span className="ms-2">Sign in with Google</span>
                                </button>
                            </div>
                            <div className="signupbutton">
                                <p>Already have an account? <Link to="/Login">Log in</Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer
                position="top-center"
                autoClose={1500}
                hideProgressBar
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
                transition={Bounce} />
        </div>
    )
}

export default Register;
