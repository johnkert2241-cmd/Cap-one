import { useState } from "react";
import { Link } from "react-router-dom";

const faqs = [
    {
        question: "Q1. What is ArCooling PH?",
        answer: "ArCooling PH is an online platform in the Philippines that allows users to buy Aircon Conditioning and Refrigeration units and request repair or maintenance services from registered businesses.",
    },
    {
        question: "Q2. How can I register my business on ArCooling PH?",
        answer: <>
            Click on the <Link className="linktext" to="/SignupBusiness">Register your business Now!</Link> link on the page, fill out the registration form with your business details and wait for confirmation from our team.
        </>,
    },
    {
        question: "Q3. What services can I request on ArCooling PH?",
        answer: "You can request: Air conditioner installation and repair, maintenance, regular cleaning, and check-ups.",
    },
    {
        question: "Q4. Is ArCooling PH available nationwide?",
        answer: "Yes, we aim to connect customers and service providers across the Philippines. Availability may vary by city or region depending on registered businesses.",
    },
    {
        question: "Q5. How do I buy an aircon or refrigeration through ArCooling PH?",
        answer: "Browse the available products listed by registered sellers. Click on a product to view details and proceed with your purchase.",
    },
];

const FooterContact = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className="faq-background">
            <div className="faq-container p-5">
                <h2 className="faq-header">
                    Arcooling PH is an online platform for Aircon and Refrigeration services in the Philippines.
                    Register your business <Link className="linktext" to="/SignupBusiness">Now!</Link> or request a service.
                </h2>

                <div className="faq-list mt-5">
                    {faqs.map((faq, index) => (
                        <div key={index} className="faq-item">
                            <div
                                className={`faq-question ${activeIndex === index ? "active" : ""}`}
                                onClick={() => toggleFAQ(index)}
                            >
                                {faq.question}
                                <span className="faq-icon">{activeIndex === index ? "-" : "+"}</span>
                            </div>
                            {activeIndex === index && (
                                <div className="faq-answer">
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Floating bubbles */}
            {[...Array(15)].map((_, i) => (
                <div key={i} className={`bubble bubble-${i + 1}`}></div>
            ))}
        </div>
    );
};

export default FooterContact;
