import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Icons
import { ImFacebook2 } from "react-icons/im";
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
        } else if (formData.fullname.length < 6 || formData.fullname.length > 10) {
            newErrors.fullname = "Full name must be 6–10 characters";
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
                    setErrors({ email: data.message }); // para red border sa email
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
        <div className="formmain pt-5">
            <div className="formbox text-center justify-content-center align-items-center">
                <div className="box pt-5">
                    <p className="fonttext fs-1 pt-3">Sign up</p>
                    <p className="signtext">Sign up for ARCooling PH</p>
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
                            <div className="p-4">
                                <span className="textDisabled pb-2 border-bottom">Or login with</span>
                                <div className="socialIcon pt-4">
                                    <Link to="#">
                                        <span><ImFacebook2 size='25' color={'#385898'} /> Facebook</span>
                                    </Link>
                                    <Link to="#">
                                        <span><SiGmail size='25' color={'#EA4335'} /> Gmail</span>
                                    </Link>
                                </div>
                            </div>

                            <div className="signupbutton">
                                <p className="p-3">Already have an account? <Link to="/login">Log in</Link></p>
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
