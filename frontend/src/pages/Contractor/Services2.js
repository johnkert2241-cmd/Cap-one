import React, { useState } from "react";

function Products() {
    const [price, setPrice] = useState(null);

    const handleServiceChange = (event) => {
        const selectedService = event.target.value;
        let servicePrice = 0;

        switch (selectedService) {
            case "Cleaning":
                servicePrice = 300;
                break;
            case "Repair":
                servicePrice = 250;
                break;
            case "Maintenance":
                servicePrice = 300;
                break;
            case "Checkup":
                servicePrice = 300;
                break;
            default:
                servicePrice = null;
        }

        setPrice(servicePrice);
    };

    return (
        <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold text-primary">Services</h2>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold">Select what your service</h4>
            </div>
            <form>
                <div className="mb-3">
                    <select id="service1" className="form-select" onChange={handleServiceChange}>
                        <option disabled>Select Service</option>
                        <option value="Cleaning">Cleaning</option>
                        <option value="Repair">Repair</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Checkup">Checkup</option>
                    </select>
                </div>

                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <button type="submit" className="btn btn-primary">Publish</button>
                    </div>
                    <div>
                        {price !== null && (
                            <h5 className="fw-bold text-success">Price: ₱{price}</h5>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
}

export default Products;