import React, { useState } from "react";


function Reports() {
    const [reports] = useState([
        {
            id: 1,
            name: "Juan Dela Cruz",
            message: "Issue with payment processing.",
            date: "2025-09-12",
        },
        {
            id: 2,
            name: "Maria Santos",
            message: "Unable to upload business documents.",
            date: "2025-09-13",
        },
        {
            id: 3,
            name: "Pedro Ramirez",
            message: "Bug in registration form.",
            date: "2025-09-14",
        },
    ]);

    return (
        <div className="reports-container">
            <h3 className="reports-title "> Reports</h3>

            <table className="reports-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th> Business Name</th>
                        <th>Message</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {reports.map((report, index) => (
                        <tr key={report.id}>
                            <td>{index + 1}</td>
                            <td>{report.name}</td>
                            <td>{report.message}</td>
                            <td>{report.date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Reports;
