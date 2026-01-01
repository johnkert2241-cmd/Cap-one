import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, Outlet } from "react-router-dom";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";


function ContractorDashboard() {

    const [contractor, setContractor] = useState(null);
    const [isCustomerOpen, setIsCustomerOpen] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token"); 
                const res = await axios.get("http://localhost:5000/business/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setContractor(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchProfile();
    }, []);

    if (!contractor)
        return (
            <div className="text-center py-5">
                    <span className="text-secondary fs-2">No data found Please try again...</span>
            </div>
        );

    const toggleCustomerMenu = () => {
        setIsCustomerOpen(!isCustomerOpen);
    };

    return (
        <div className="container-fluid">

            <div className="row vh-100 overflow-hidden">

                {/* SIDEBAR for desktop */}
                <div className="sidebar col-md-3 col-lg-2 d-none d-md-block">
                    <div className="mb-4 text-center border-bottom">
                        <label className="py-4 fw-bold fs-6">{contractor.businessName}</label>
                    </div>

                    <ul className="nav flex-column">
                        <li className="nav-item">
                            <Link className="nav-link" to="/Contractor">
                                Dashboard
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="Profile">
                                Profile
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="Products">
                                Products
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="Services">
                                Services
                            </Link>
                        </li>

                        <li className="nav-item">
                            <button
                                className="btn d-flex align-items-center justify-content-between text-white w-100"
                                onClick={toggleCustomerMenu}
                                style={{
                                    background: "transparent",
                                    border: "none",
                                    fontWeight: "500",
                                }}
                            >
                                <span>Customers</span>
                                {isCustomerOpen ? <FaChevronDown /> : <FaChevronRight />}
                            </button>

                            <div
                                className={`consubmenu ${isCustomerOpen ? "open" : ""}`}
                                style={{ marginLeft: "1rem" }}
                            >
                                <ul className="list-unstyled">
                                    <li>
                                        <Link className="nav-link text-white" to="Orders">
                                            -  Orders
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="nav-link text-white" to="ServicesRequest">
                                            -  Services
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                </div>

                {/* HEADER for mobile */}
                <nav className="navbar navbar-dark bg-dark d-md-none">
                    <div className="container-fluid">
                        <span className="navbar-brand mb-0 h4">Contractor</span>
                        <button
                            className="navbar-toggler"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#mobileMenu"
                            aria-controls="mobileMenu"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>
                    </div>

                    {/* DROPDOWN LIST inside hamburger */}
                    <div className="collapse bg-dark" id="mobileMenu">
                        <ul className="navbar-nav p-2">
                            <li className="nav-item">
                                <Link className="nav-link text-light" to="/Contractor">
                                    Dashboard
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link text-light" to="Profile">
                                    Profile
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link text-light" to="Products">
                                    Products
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link text-light" to="Orders">
                                    Orders
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link text-light" to="Services">
                                    Services
                                </Link>
                            </li>
                        </ul>
                    </div>
                </nav>

                {/* MAIN CONTENT */}
                <div className="col-md-5 col-lg-9 py-4 main-contentuser overflow-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default ContractorDashboard;
