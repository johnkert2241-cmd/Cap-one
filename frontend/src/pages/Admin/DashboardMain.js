import React from "react";
import { FaUserEdit } from "react-icons/fa";
import { Link, Outlet } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { FaSignOutAlt, FaRegChartBar } from "react-icons/fa";
import { MdBusiness } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";
import Swal from "sweetalert2";

function DashboardMain() {
    return (
        <div className="d-flex flex-column flex-md-row">
            {/* ===== Sidebar for Desktop ===== */}
            <div className="sidemin p-3 position-relative d-none d-md-block">
                <div className="align-items-center d-flex flex-column mb-4">
                    <div className="profile-img rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                            width: "80px",
                            height: "80px",
                            backgroundColor: "#0A5875",
                            color: "white",
                            fontSize: "35px",
                            cursor: "pointer",
                            boxShadow: "0 4px 8px rgba(0,0,0,0.3)"
                        }}>
                        <FaUserEdit />
                    </div>
                    <h5 className="mt-3 mb-0">John Don</h5>
                    <small className="text-light">Johndon@company.com</small>
                </div>

                {/* Navigation */}
                <ul className="nav flex-column mt-4">
                    <li className="nav-item mb-2">
                        <Link to="/Admin" className="nav-link text-white">
                            <RxDashboard className="me-2" /> Dashboard
                        </Link>
                    </li>
                    <li className="nav-item mb-2">
                        <Link to="Request" className="nav-link text-white">
                            <RxDashboard className="me-2" /> Business Request
                        </Link>
                    </li>
                    <li className="nav-item mb-2">
                        <Link to="BusinessRegistered" className="nav-link text-white">
                            <MdBusiness className="me-2" /> Business Registered
                        </Link>
                    </li>
                    <li className="nav-item mb-2">
                        <Link to="Reports" className="nav-link text-white">
                            <FaRegChartBar className="me-2" /> Reports
                        </Link>
                    </li>
                    <li
                        className="nav-item mb-2"
                        style={{ cursor: "pointer" }}
                        onClick={(e) => {
                            e.preventDefault();
                            Swal.fire({
                                title: "Log out?",
                                text: "Are you sure you want to logout?",
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonText: "Logout",
                                cancelButtonText: "Cancel",
                                reverseButtons: true,
                                confirmButtonColor: "#d33",
                                cancelButtonColor: "#3085d6",
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    Swal.fire({
                                        title: "Logging out...",
                                        text: "Please wait a moment",
                                        allowOutsideClick: false,
                                        didOpen: () => {
                                            Swal.showLoading();
                                        },
                                    });

                                    setTimeout(() => {
                                        localStorage.removeItem("token");
                                        window.location.href = "/BusinessLogin";
                                    }, 1500);
                                }
                            });
                        }}
                    >
                        <span className="nav-link text-danger d-flex align-items-center">
                            <FaSignOutAlt className="me-2" />
                            Logout
                        </span>
                    </li>

                </ul>

            </div>


            {/* ===== Header + Hamburger for Mobile ===== */}
            <div className="d-md-none">
                <nav className="navbar navbar-dark bg-dark px-3">
                    <span className="navbar-brand fw-bold">ADMIN</span>

                    {/* Hamburger Dropdown */}
                    <div className="dropdown ms-auto">
                        <button
                            className="btn btn-dark"
                            type="button"
                            id="hamburgerMenu"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <GiHamburgerMenu size={26} />
                        </button>

                        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="hamburgerMenu">
                            <li>
                                <Link to="Admin" className="dropdown-item d-flex align-items-center">
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link to="BusinessRegistered" className="dropdown-item d-flex align-items-center">
                                    Registered Business
                                </Link>
                            </li>
                            <li>
                                <Link to="Reports" className="dropdown-item d-flex align-items-center">
                                    Reports
                                </Link>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>

            {/* ===== Main Content ===== */}
            <div className="dash-main flex-grow-1">
                <Outlet />
            </div>
        </div>
    );
}

export default DashboardMain;
