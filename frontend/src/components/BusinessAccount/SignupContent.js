import React, { useState } from "react";
import { FaCheckSquare } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer, Bounce } from "react-toastify";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";

function SigupHeader() {

    const navigate = useNavigate();

    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        businessName: "",
        address: "",
        postalcode: "",
        fullname: "",
        email: "",
        phone: "",
        password: ""
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });

        if (value.trim() !== "") {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[id];
                return newErrors;
            });
        }
    };

    const fieldLabels = {
        businessName: "Business Name",
        address: "Address",
        fullname: "Full Name",
        postalcode: "Postal Code",
        email: "Email",
        phone: "Phone Number",
        password: "Password",
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let newErrors = {};
        Object.keys(formData).forEach((key) => {
            if (!formData[key]) {
                newErrors[key] = true;
            }
        });

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            if (Object.keys(newErrors).length === Object.keys(formData).length) {
                toast.error("All fields are required",);
            } else {
                Object.keys(newErrors).forEach((field) => {
                    toast.error(`${fieldLabels[field]} is required`);
                });
            }
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/business", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Sign up Confirmation",
                    text: "Thank you for submitting the form! We will notify your email for the confirmation.",
                    confirmButtonColor: "#3085d6", //
                }).then(() => {
                    // reset errors
                    setErrors({});
                    // redirect to login
                    navigate("/");
                });
            } else {
                toast.error(data.message || "Something went wrong");

                if (data.message === "Email already registered") {
                    setErrors((prev) => ({ ...prev, email: true }));
                }
            }
        } catch (err) {
            console.error(err);
            toast.error("Error connecting to server",);
        }
    };

    return (
        <div className="SignformBusiness">
            <h1 className="Signtext pb-3">Sign up for ARCoolingPH for Business</h1>
            <p>Want to establish Aircon and Refrigeration Business and Repair? You're in the right place!</p>
            <div className="iconText pt-4">
                <span className="icon d-block">
                    <FaCheckSquare size={20} color="#13abb9" /> Take 5 minutes to fill out our form
                </span>
                <span>
                    <FaCheckSquare size={20} color="#13abb9" /> Get response within 1-2 Business day
                </span>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="formField container">
                    <div className="formInput col-lg bg-secondary.bg-gradient p-3 border text-center py-3">
                        <p className="fs-3 ">Business Name</p>
                        <div>
                            <input
                                className={`BusinessInput ${errors.businessName ? "error" : ""}`}
                                type="text"
                                placeholder="Business Name"
                                value={formData.businessName}
                                id="businessName"
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <input
                                className={`BusinessInput ${errors.address ? "error" : ""}`}
                                type="text"
                                placeholder="Address"
                                value={formData.address}
                                id="address"
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <input
                                className={`BusinessInput ${errors.postalcode ? "error" : ""}`}
                                type="number"
                                placeholder="Postal Code"
                                value={formData.postalcode}
                                id="postalcode"
                                maxLength="4"
                                onChange={(e) => {
                                    if (/^\d{0,4}$/.test(e.target.value)) {
                                        handleChange(e);
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <div className="formInput col-lg offset-md-0 bg-secondary.bg-gradient p-3 border text-center my-3">
                        <p className="fs-3">Your Details</p>
                        <div>
                            <input
                                className={`BusinessInput ${errors.fullname ? "error" : ""}`}
                                type="text"
                                placeholder="Full name"
                                value={formData.fullname}
                                id="fullname"
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <input
                                className={`BusinessInput ${errors.email ? "error" : ""}`}
                                type="email"
                                placeholder="Email"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <di>
                            <input
                                className={`BusinessInput ${errors.phone ? "error" : ""}`}
                                type="text"
                                placeholder="Phone number"
                                value={formData.phone}
                                id="phone"
                                onChange={handleChange}
                            />
                        </di>
                        <div>
                            <input
                                className={`BusinessInput ${errors.password ? "error" : ""}`}
                                type="password"
                                placeholder="Password"
                                value={formData.password}
                                id="password"
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <button className="ButtonSign text-light my-3" type="submit">Sign up</button>
                </div>

            </form>
            <ToastContainer
                position="top-center"
                autoClose={1500}
                hideProgressBar
                newestOnTop
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
                transition={Bounce}
            />
        </div>
    );
}

export default SigupHeader;
