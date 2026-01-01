import { FaFacebook } from "react-icons/fa";

import technicianImg from "../../assets/images/office.png"; 

const AboutUs = () => {
    return (
        <section className="about-section">
            <div className="about-container">
                <div className="about-text">
                    <h1>About Us</h1>
                    <p>
                        Welcome to ARcoolingpH, your trusted partner for air conditioning and refrigeration needs.
                        We specialize in selling high-quality air conditioners and refrigerators that bring comfort
                        and convenience to your home or business.
                    </p>
                    <p>
                        Aside from sales, we also provide reliable repair and maintenance services
                        to keep your appliances running smoothly. With our commitment to quality service
                        and customer satisfaction, we make sure you get the best value for your investment.
                    </p>
                    <p>
                        At ARcoolingPH, we don’t just sell—we care, repair, and ensure your comfort all year round.
                    </p>

                    <a
                        href="https://www.facebook.com/share/1Z44LmxPSs/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="facebook-btn"
                    >
                        <FaFacebook className="fb-icon" />
                        Follow us on Facebook
                    </a>
                </div>

                <div className="about-image">
                    <img src={technicianImg} alt="Technician working on fridge" />
                </div>
            </div>
        </section>
    );
};

export default AboutUs;
