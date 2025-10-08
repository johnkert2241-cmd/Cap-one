import React, { useEffect, useState } from "react";

const BusinessRequest = () => {

    const [requests, setRequests] = useState([]);

    // Fetch pending businesses
    useEffect(() => {
        fetch("http://localhost:5000/admin/pending")
            .then((res) => res.json())
            .then((data) => setRequests(data))
            .catch((err) => console.error(err));
    }, []);

    // Approve request
    const handleApprove = async (id) => {
        try {
            const res = await fetch(`http://localhost:5000/admin/approve/${id}`, {
                method: "PUT",
            });
            const data = await res.json();
            alert(data.message);

            // remove from table
            setRequests((prev) => prev.filter((r) => r._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    // Reject request
    const handleReject = async (id) => {
        try {
            const res = await fetch(`http://localhost:5000/admin/reject/${id}`, {
                method: "DELETE",
            });
            const data = await res.json();
            alert(data.message);

            // remove from table
            setRequests((prev) => prev.filter((r) => r._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="business-container">
            <h3 className="fw-bold">Business Request</h3>

            <table className="table-request">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Business Name</th>
                        <th>Email</th>
                        <th>Date</th>
                        <th>Actions</th>
                        <th>View</th>
                    </tr>
                </thead>
                <tbody className="Admin-data">
                    {requests.map((item, index) => (
                        <tr key={item._id}>
                            <td>{index + 1}</td>
                            <td>{item.businessName}</td>
                            <td>{item.email}</td>
                            <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                            <td>
                                <button
                                    className="btn-approve bg-success text-light"
                                    onClick={() => handleApprove(item._id)}
                                >
                                    Approve
                                </button>
                                <button
                                    className="btn-reject bg-danger text-light"
                                    onClick={() => handleReject(item._id)}
                                >
                                    Reject
                                </button>
                            </td>
                            <td className="text-center">
                                <button className="btn-view">View</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
};

export default BusinessRequest;
