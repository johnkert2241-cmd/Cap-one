import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BsFacebook, BsInstagram, BsGoogle, BsArrowLeftCircle, BsArrowRightCircle } from "react-icons/bs";
import { Carousel } from "react-bootstrap";
import Swal from "sweetalert2";
import axios from "axios";

import Logo from "../assets/images/logormt.png";
import Header from "../components/Home/Header";
import Navmain from "../components/Home/Navmain";
import Faq from "../components/Home/Faq";
import Footer from "../components/Home/FooterContact";
import About from "../components/Home/AboutUs";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function Home() {

    const location = useLocation();
    const [query, setQuery] = useState("");
    const [user, setUser] = useState(null);
    const [products, setProducts] = useState([]);
    const [services, setServices] = useState([]);

    const navigate = useNavigate();

    // Load products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get(`${API_URL}/products/publish`);
                setProducts(res.data.filter((p) => p.published));
            } catch (err) {
                console.error(err);
            }
        };
        fetchProducts();
    }, []);

    // Load services
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await axios.get(`${API_URL}/services/publish/list`);
                setServices(res.data);
            } catch (err) {
                console.error("Error fetching services:", err);
            }
        };
        fetchServices();
    }, []);

    // Scroll to section
    useEffect(() => {
        if (location.hash) {
            const section = document.querySelector(location.hash);
            if (section) section.scrollIntoView({ behavior: "smooth" });
        }
    }, [location]);

    // Filter products
    const filteredProducts = products.filter((p) =>
        query
            ? [p.brand, p.category, p.type, p.details].some((field) =>
                field?.toLowerCase().includes(query.toLowerCase())
            )
            : true
    );

    // Handle purchase click
    const handlePurchaseClick = () => {
        if (!user) {
            Swal.fire({
                icon: "warning",
                title: "Please login first",
                text: "You need to login before purchasing.",
            }).then(() => navigate("/login"));
            return;
        }
        setUser();
    };

    const handleService = () => {
        if (!user) {
            Swal.fire({
                icon: "warning",
                title: "Please login first",
                text: "You need to login before purchasing.",
            }).then(() => navigate("/login"));
            return;
        }
        setUser();
    };

    return (

        <div className="home">
            <Header />
            <div className="home-page">
                <Navmain query={query} setQuery={setQuery} />
            </div>
            {/* PRODUCTS SECTION */}
            <div className="py-5 border-bottom bg-light">
                <div className="container">
                    <p className="text-center mb-4 fs-3 fw-bold" style={{ color: "#0a5875" }}>
                        Our Products
                    </p>
                    {filteredProducts.length > 0 ? (
                        filteredProducts.length >= 4 ? (
                            <Carousel
                                prevIcon={<BsArrowLeftCircle size={40} color="gray" style={{
                                    position: "absolute",
                                    left: "-60px",
                                }} />}
                                nextIcon={<BsArrowRightCircle size={40} color="gray" style={{
                                    position: "absolute",
                                    right: "-60px",
                                }} />}
                            >
                                {Array.from({ length: Math.ceil(filteredProducts.length / 3) }).map(
                                    (_, slideIndex) => (
                                        <Carousel.Item key={slideIndex}>
                                            <div className="row justify-content-center">
                                                {filteredProducts
                                                    .slice(slideIndex * 3, slideIndex * 3 + 3)
                                                    .map((product, index) => (
                                                        <div key={index} className="col-md-4 mb-4">
                                                            <div className="card h-100">
                                                                <img
                                                                    src={`data:${product.image.contentType};base64,${product.image.data}`}
                                                                    className="card-img-top card-img-fixed"
                                                                    alt={product.type}
                                                                />

                                                                <div className="card-body">
                                                                    <h3 className="fw-bold" style={{ color: "#0a5875" }}>
                                                                        {product.category}
                                                                    </h3>
                                                                    <p className="card-text fs-6 fw-bold text-uppercase">
                                                                        {product.brand}
                                                                    </p>
                                                                    <p className="card-title fw-bold text-secondary text-uppercase">
                                                                        {product.type}
                                                                    </p>
                                                                    <p className="card-details fw-bold text-secondary">
                                                                        {product.details}
                                                                    </p>
                                                                    <p className="card-details fs-5 fw-bold" style={{ color: "#0a5875" }}>
                                                                        ₱ {product.price.toLocaleString()}
                                                                    </p>
                                                                </div>
                                                                <button
                                                                    className="btn"
                                                                    style={{ color: "#ffffff", backgroundColor: "#0a5875" }}
                                                                    onClick={() => handlePurchaseClick(product)}
                                                                >
                                                                    Purchase
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        </Carousel.Item>
                                    )
                                )}
                            </Carousel>
                        ) : (
                            <div className="row justify-content-center">
                                {filteredProducts.map((product, index) => (
                                    <div key={index} className="col-md-4 mb-4">
                                        <div className="card h-100 shadow-sm">
                                            <img
                                                src={`data:${product.image.contentType};base64,${product.image.data}`}
                                                className="card-img-top card-img-fixed"
                                                alt={product.type}
                                            />
                                            <div className="card-body">
                                                <h3 className="fw-bold text-success">{product.category}</h3>
                                                <p className="card-text fs-6 fw-bold text-uppercase">
                                                    {product.brand}
                                                </p>
                                                <p className="card-title fw-bold text-secondary text-uppercase">{product.type}</p>
                                                <p className="card-details fw-bold text-secondary text-uppercase">
                                                    {product.details}
                                                </p>
                                                <p className="card-details fs-5 fw-bold text-success">
                                                    ₱ {product.price.toLocaleString()}
                                                </p>
                                            </div>
                                            <button
                                                className="btn btn-success text-light"
                                                onClick={() => handlePurchaseClick(product)}
                                            >
                                                Purchase
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    ) : (
                        <p className="text-center text-secondary">No products available</p>
                    )}
                </div>
            </div>

            {/* SERVICES SECTION */}
            <div className="bg-light py-5">
                <div className="container">
                    <p className="text-center fs-3 fw-bold" style={{ color: "#0a5875" }}>Our Services</p>

                    {services.length > 0 ? (
                        services.length >= 4 ? (
                            <Carousel
                                prevIcon={
                                    <BsArrowLeftCircle
                                        size={40}
                                        color="gray"
                                        style={{ position: "absolute", left: "-60px" }}
                                    />
                                }
                                nextIcon={
                                    <BsArrowRightCircle
                                        size={40}
                                        color="gray"
                                        style={{ position: "absolute", right: "-60px" }}
                                    />
                                }
                            >
                                {Array.from({ length: Math.ceil(services.length / 3) }).map(
                                    (_, slideIndex) => (
                                        <Carousel.Item key={slideIndex}>
                                            <div className="row justify-content-center">
                                                {services
                                                    .slice(slideIndex * 3, slideIndex * 3 + 3)
                                                    .map((svc, index) => (
                                                        <div key={index} className="col-md-4 mb-4">
                                                            <div className="shadow-sm">
                                                                <img
                                                                    src={
                                                                        svc.image?.startsWith("data:image")
                                                                            ? svc.image
                                                                            : svc.image
                                                                                ? `http://localhost:5000/${svc.image}`
                                                                                : "/no-image.png"
                                                                    }
                                                                    className="img-fluid"
                                                                    alt="..."
                                                                />

                                                                <div className="card-body">
                                                                    <h5 className="fw-bold text-uppercase"
                                                                        style={{ color: "#0a5875" }}
                                                                    >
                                                                        {svc.name}
                                                                    </h5>
                                                                    <p className="fw-bold text-uppercase">{svc.category}</p>
                                                                    <p className="fw-bold text-secondary">{svc.description}</p>
                                                                    <p className="fw-bold text-secondary">
                                                                        Open: {svc.duration}
                                                                    </p>
                                                                    <p className="fw-bold text-secondary">
                                                                        Schedule: {svc.availability}
                                                                    </p>

                                                                    <div className=" d-flex flex-wrap gap-2">
                                                                        {Array.isArray(svc.tags) &&
                                                                            svc.tags.length > 0 ? (
                                                                            svc.tags.map((tag, index) => (
                                                                                <span
                                                                                    key={index}
                                                                                    className="badge text-secondary fs-7 bg-light border text-uppercase"
                                                                                >
                                                                                    {tag}
                                                                                </span>
                                                                            ))
                                                                        ) : (
                                                                            <span></span>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                <button
                                                                    className="btn"
                                                                    style={{ color: "#ffffff", backgroundColor: "#0a5875" }}
                                                                    onClick={() => {
                                                                        handleService(svc);

                                                                    }}
                                                                >
                                                                    Service
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        </Carousel.Item>
                                    )
                                )}
                            </Carousel>
                        ) : (
                            <div className="row justify-content-center">
                                {services.map((svc, index) => (
                                    <div key={index} className="col-md-4 mb-4">
                                        <div className="card h-100 shadow-sm">
                                            <img
                                                src={
                                                    svc.image?.startsWith("data:image")
                                                        ? svc.image
                                                        : svc.image
                                                            ? `http://localhost:5000/${svc.image}`
                                                            : "/no-image.png"
                                                }
                                                alt={svc.name}
                                                className="card-img-top service-img"
                                            />
                                            <div className="card-body">
                                                <h5 className="fw-bold text-success text-uppercase">
                                                    {svc.name}
                                                </h5>
                                                <p className="fw-bold text-uppercase">{svc.category}</p>
                                                <p className="fw-bold text-secondary">{svc.description}</p>
                                                <p className="fw-bold text-secondary">
                                                    Open: {svc.duration}
                                                </p>
                                                <p className="fw-bold text-secondary">
                                                    Schedule: {svc.availability}
                                                </p>

                                                <div className="mt-2 d-flex flex-wrap gap-2">
                                                    {Array.isArray(svc.tags) && svc.tags.length > 0 ? (
                                                        svc.tags.map((tag, index) => (
                                                            <span
                                                                key={index}
                                                                className="badge text-secondary fs-7 bg-light border text-uppercase"
                                                            >
                                                                {tag}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span>Tags</span>
                                                    )}
                                                </div>

                                            </div>

                                            <button
                                                style={{ color: "#ffffff", backgroundColor: "#0a5875" }}
                                                onClick={() => {
                                                    handleService(svc);
                                                }}
                                            >
                                                Service
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    ) : (
                        <p className="text-center text-secondary">No services available</p>
                    )}
                </div>
            </div>

            <div id="About" className="about">
                <About />
            </div>
            <div id="faq" className="faq">
                <Faq />
            </div>
            <div id="Contact" className="footer">
                <Footer />
                <div className="text-center text-light mb-3">
                    <img
                        src={Logo}
                        alt="RMT Logo"
                        style={{
                            height: "80px",
                            width: "80px",
                            borderRadius: "50%",
                            objectFit: "cover",
                        }}
                    />
                </div>
                <p className="text-center text-light fs-4 fw-bold">
                    Follow us on social media
                </p>
                <div className="d-flex justify-content-center gap-4">
                    <a href="https://www.facebook.com/profile.php?id=61564405762931">
                        <BsFacebook color="#ffd700" size="30" />
                    </a>
                    <BsInstagram color="#ffd700" size="30" />
                    <a href="https://mail.google.com/mail/u/0/#inbox?compose=new">
                        <BsGoogle color="#ffd700" size="30" />
                    </a>
                </div>
            </div>
            <div className="copyright text-center p-3 bg-dark">
                <span className="text-light">
                    &copy; {new Date().getFullYear()} | Developed by RMT
                </span>
            </div>
        </div>

    );
}

export default Home;
