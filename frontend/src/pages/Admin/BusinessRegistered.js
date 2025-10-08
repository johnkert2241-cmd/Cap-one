import React, { useState } from "react";


function BusinessRegistered() {
  const [businesses] = useState([
    { id: "1", name: "Ansons", email: "Ansons@gmail.com", city: "Manila" },
    { id: "2", name: "Tech Solutions", email: "info@techsolutions.com", city: "Cebu" },
    { id: "3", name: "CoolAir Corp", email: "coolair@gmail.com", city: "Davao" },
    { id: "4", name: "FreshMart", email: "freshmart@gmail.com", city: "Quezon City" },
  ]);

  return (
    <div className="Registered-container">
      <h3 className="fw-bold text-start">Business Registered</h3>

        <table className="table-register">
          <thead>
            <tr>
              <th>ID</th>
              <th>Business Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {businesses.map((biz) => (
              <tr key={biz.id}>
                <td>{biz.id}</td>
                <td>{biz.name}</td>
                <td>{biz.email}</td>
                <td>{biz.city}</td>
                <td>
                  <button type="submit" class="btn-sub">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
 
    </div>
  );
}

export default BusinessRegistered;
