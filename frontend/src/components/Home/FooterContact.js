import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";


const Footer = () => {
    return (
        <footer className="footer p-5">
            <div className="footer-container">

                {/* Email Section */}
                <div className="footer-box">
                    <FaEnvelope className="footer-icon" />
                    <div>
                        <h5>Email Us</h5>
                        <p>RamontejanoJr@gmail.com</p>
                    </div>
                </div>

                {/* Call Section */}
                <div className="footer-box">
                    <FaPhoneAlt className="footer-icon" />
                    <div>
                        <h5>Call Us</h5>
                        <p>SMART: 0932-316-9713</p>
                        <p>DITO: 0991-925-7948</p>
                        
                    </div>
                </div>

                {/* Address Section */}
                <div className="footer-box">
                    <FaMapMarkerAlt className="footer-icon" />
                    <div>
                        <h5>Address</h5>
                        <p>Bantan Street Bunawan, Davao City</p>
                    </div>
                </div>       
            </div>
        </footer>
    );
};

export default Footer;
