import React from 'react'
import { Link, useNavigate, } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";
import { FaRegUser } from "react-icons/fa";
import { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function Navmain({ query, setQuery }) {

    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) setUser(JSON.parse(savedUser));
    }, []);

    const handleProfile = () => {
        navigate("/CusProfile");
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
        navigate("/login");
    };



    return (
        <>
            <div className="pt-5 m-0">
                <div className="container-fluid Navmain">
                    <div className="inputFind">
                        <div className="forminput">
                            <input
                                type="search"
                                className="inputAddress"
                                id="textAddress"
                                placeholder="Enter Products or Services"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault(); // optional, prevent page reload
                                    }
                                }}
                            />
                            <button
                                type="button"
                                className="findButton"
                                onClick={() => {
                                    if (!query) return;
                                    // optional: you could trigger some animation or fetch
                                }}
                            >
                                Find
                            </button>
                        </div>

                        <p className="spantext pt-2 text-light">
                            Find your nearest and many more !
                        </p>
                    </div>

                    <div className="Navlink">
                        <ul className="Navlinkbutton">
                            <li className="linkLogin">
                                {user && user.fullname ? (
                                    <div className="dropdown">
                                        {/* IMAGE OR DEFAULT ICON BUTTON */}
                                        <button
                                            className="dropbtn-image"
                                            onClick={() => setOpen(!open)}
                                        >
                                            {user?.profileImage ? (
                                                <img
                                                    src={`${API_URL}${user.profileImage}`}
                                                    alt="Profile"
                                                    className="userprofile"
                                                />
                                            ) : (
                                                <FaRegUser size={40} className="default-user-icon" />
                                            )}
                                        </button>

                                        {open && (
                                            <div className="dropdown-content">
                                                <button onClick={handleProfile} className="buttonProfile">
                                                    <FaRegUser size={20} /> Profile
                                                </button>
                                                <button onClick={handleLogout} className="logout-btn text-light">
                                                    <IoIosLogOut size={20} /> Logout
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <Link to="/Signup">Sign in</Link>
                                )}
                            </li>
                            <li className="linkbutton">
                                <a href="#Contact" className="text-light">Contact</a>
                            </li>
                            <li className="linkbutton">
                                <a href="#About" className="text-light">About</a>
                            </li>
                        </ul>
                    </div>

                </div>

                <div className="mainpage text-center p-5">
                    <h1 className="pb-5">
                        Reliable Aircon and Refrigeration<br />
                        Repair, Delivered to Your Doorstep!
                    </h1>
                    <h5>It's the service you need, When you need it most.</h5>
                </div>
            </div>

        </>
    );
};

export default Navmain;
