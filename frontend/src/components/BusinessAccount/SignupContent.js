import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { FaCheckSquare } from "react-icons/fa";
import { toast, ToastContainer, Bounce } from "react-toastify";


function SigupHeader() {

    const navigate = useNavigate();

    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        businessName: "",
        address: "",
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        let newErrors = {};
        Object.keys(formData).forEach((key) => {
            if (!formData[key]) newErrors[key] = true;
        });

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        try {
            const data = new FormData();
            data.append("businessName", formData.businessName);
            data.append("address", formData.address);
            data.append("fullname", formData.fullname);
            data.append("email", formData.email);
            data.append("phone", formData.phone);
            data.append("password", formData.password);
            data.append("businessPermit", formData.businessPermit);

            const res = await fetch("http://localhost:5000/business", {
                method: "POST",
                body: data,
            });

            const responseData = await res.json();
            if (res.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Sign up Confirmation",
                    text: "Thank you for submitting the form! We will notify your email for the confirmation.",
                    confirmButtonColor: "#3085d6",
                }).then(() => navigate("/"));
            } else {
                toast.error(responseData.message || "Something went wrong");
            }
        } catch (err) {
            console.error(err);
            toast.error("Error connecting to server");
        }
    };


    return (

        <div className="SignformBusiness container">
            <h1 className="Signtext pb-3 text-light">Sign up for ARCoolingPH for Business</h1>
            <p className="text-light">Want to establish Aircon and Refrigeration Business and Repair? You're in the right place!</p>
            <div className="iconText pt-3">
                <span className="icon pb-2 text-light d-block">
                    <FaCheckSquare size={20} color="" /> Take 1 minutes to fill out our form
                </span>
                <span className="text-light">
                    <FaCheckSquare size={20} color="#ffffff" /> Get response within 1-2 Business day
                </span>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="formField col-8 mx-auto shadow-lg p-4">
                    <div className="formInput row ">
                        <h3 className="text-start mb-2 py-3 fw-bold " style={{ color: "#0d5297" }}>
                            Business Registration
                        </h3>
                        <div className="col-6">
                            <div className="form-floating">
                                <input
                                    type="text"
                                    className={`form-control ${errors.businessName ? "is-invalid" : ""}`}
                                    id="businessName"
                                    placeholder="Business Name"
                                    value={formData.businessName}
                                    onChange={handleChange}
                                />
                                <label htmlFor="businessName">Business Name</label>
                            </div>
                        </div>

                        <div className="col-6">
                            <div className="form-floating">
                                <input
                                    type="text"
                                    className={`form-control ${errors.address ? "is-invalid" : ""}`}
                                    id="address"
                                    placeholder="Address"
                                    value={formData.address}
                                    onChange={handleChange}
                                />
                                <label htmlFor="address">Address</label>
                            </div>
                        </div>
                    </div>

                    <div className="formInput text-center row mt-3">
                        <div className="col-6">
                            <div className="form-floating">
                                <input
                                    type="text"
                                    className={`form-control ${errors.fullname ? "is-invalid" : ""}`}
                                    id="fullname"
                                    placeholder="Full Name"
                                    value={formData.fullname}
                                    onChange={handleChange}
                                />
                                <label htmlFor="fullname">Full Name</label>
                            </div>
                        </div>

                        <div className="col-6">
                            <div className="form-floating">
                                <input
                                    type="email"
                                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                                    id="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                                <label htmlFor="email">Email</label>
                            </div>
                        </div>

                        <div className="col-6 mt-3">
                            <div className="form-floating">
                                <input
                                    type="phone"
                                    className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                                    id="phone"
                                    placeholder="Phone Number"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                                <label htmlFor="phone">Phone Number</label>
                            </div>
                        </div>

                        <div className="col-6 mt-3">
                            <div className="form-floating">
                                <input
                                    type="password"
                                    className={`form-control ${errors.password ? "is-invalid" : ""}`}
                                    id="password"
                                    placeholder="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <label htmlFor="email">Password</label>
                            </div>
                        </div>

                        <div className="col-12 mt-3">
                            <label htmlFor="businessPermit" className="form-label text-secondary float-start">
                                Upload Business Permit (Clear photo)
                            </label>
                            <input
                                type="file"
                                className="form-control"
                                id="businessPermit"
                                onChange={(e) => setFormData({ ...formData, businessPermit: e.target.files[0] })}
                            />
                        </div>

                    </div>
                    <button className="ButtonSign text-light mt-4" type="submit">
                        Submit
                    </button>

                    <div className="fw-bold pt-3">
                        <p className="text-secondary">Already have an Business Account?
                            <span style={{ cursor: "pointer", color: "#0d5297", }} className="ms-1"
                                onClick={() => navigate("/BusinessLogin")}>
                                Login here
                            </span>

                        </p>
                    </div>
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
