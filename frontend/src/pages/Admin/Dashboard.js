import React, { useEffect, useState } from "react";

import { FaClipboardList } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi";
import { RiPassPendingFill } from "react-icons/ri";
import { TbReportSearch } from "react-icons/tb";
import { XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area, ResponsiveContainer } from "recharts";

function Dashboard() {

  const [recentRequests, setRecentRequests] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [clientsCount, setClientsCount] = useState(0);


  const revenue = [
    {
      "name": "Jan",
      "Aircon": 4000,
      "Refrigeration": 2400,
      "amt": 2400
    },
    {
      "name": "Feb",
      "Aircon": 3000,
      "Refrigeration": 1398,
      "amt": 2210
    },
    {
      "name": "Mar",
      "Aircon": 2000,
      "Refrigeration": 9800,
      "amt": 2290
    },
    {
      "name": "Apr",
      "Aircon": 2780,
      "Refrigeration": 3908,
      "amt": 2000
    },
    {
      "name": "May",
      "Aircon": 1890,
      "Refrigeration": 4800,
      "amt": 2181
    },
    {
      "name": "Jun",
      "Aircon": 2390,
      "Refrigeration": 3800,
      "amt": 2500
    },
    {
      "name": "Jul",
      "Aircon": 3490,
      "Refrigeration": 4300,
      "amt": 2100
    },
    {
      "name": "Aug",
      "Aircon": 5780,
      "Refrigeration": 4300,
      "amt": 2100
    },
    {
      "name": "Sep",
      "Aircon": 5780,
      "Refrigeration": 4300,
      "amt": 2100
    },
    {
      "name": "Oct",
      "Aircon": 7450,
      "Refrigeration": 5300,
      "amt": 2100
    },
    {
      "name": "Nov",
      "Aircon": 9450,
      "Refrigeration": 4300,
      "amt": 2100
    },
    {
      "name": "Dec",
      "Aircon": 3490,
      "Refrigeration": 4300,
      "amt": 2100
    }]

  useEffect(() => {
    fetch("http://localhost:5000/admin/pending")
      .then((res) => res.json())
      .then((data) => {
        setRecentRequests(data.slice(0, 5)); // Recent Request 
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/admin/pending")
      .then((res) => res.json())
      .then((data) => {
        setPendingCount(data.length); // Pending Request
        setRecentRequests(data.slice(0, 5));
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/admin/approved")
      .then((res) => res.json())
      .then((data) => {
        setClientsCount(data.length); // for clients
      })
      .catch((err) => console.error(err));
  }, []);



  return (
    <div className="dashboard-container">
      {/* Header Card */}
      <div className="header-card mb-4">
        <h3 className="fw-bold" style={{ color: "#0A5875" }}>Dashboard</h3>
      </div>

      {/* Stats Cards */}
      <div className="stats-cards d-flex flex-wrap gap-3 mb-5">
        <div className="revenue stat-card request shadow-sm rounded p-3 flex-fill text-center">
          <FaClipboardList size={40} />
          <h4> Registered Business</h4>
          <h2>0</h2>
        </div>

        <div className=" clients stat-card approved shadow-sm rounded p-3 flex-fill text-center">
          <HiUserGroup size={40} />
          <h4>Clients</h4>
          <h2>{clientsCount}</h2>
        </div>

        <div className=" pending stat-card pending shadow-sm rounded p-3 flex-fill text-center">
          <RiPassPendingFill size={40} />
          <h4>Pending Request</h4>
          <h2>{pendingCount}</h2>
        </div>

        <div className=" reports stat-card reports shadow-sm rounded p-3 flex-fill text-center">
          <TbReportSearch size={40} />
          <h4>Reports</h4>
          <h2>0</h2>
        </div>
      </div>

      {/* Main Content: Chart + Recent Bookings */}
      <div className="row">
        {/* Chart */}
        <div className="col-lg-8 mb-4">
          <div className="chart-container shadow-sm rounded-3 p-4 h-100">
            <h5 className="fw-bold mb-3">Revenue</h5>

            <div style={{ width: "100%", height: "300px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={revenue}
                >
                  <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" tick={{ fill: "#ffffff" }} />
                  <YAxis tick={{ fill: "#ffffff" }} />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="Aircon"
                    stroke="#8884d8"
                    fillOpacity={1}
                    fill="url(#colorUv)"
                  />
                  <Area
                    type="monotone"
                    dataKey="Refrigeration"
                    stroke="#82ca9d"
                    fillOpacity={1}
                    fill="url(#colorPv)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="col-lg-4 col-md-12 mb-4">
          <div className="recent-bookings shadow-sm rounded-3 p-4 h-100">
            <h5 className="fw-bold mb-3">Recent Request</h5>
            <div className="table-responsive">
              <table className="table-recent">
                <thead className="text-muted">
                  <tr>
                    <th>Client</th>
                    <th>Address</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRequests.length > 0 ? (
                    recentRequests.map((item, index) => (
                      <tr key={item._id}>
                        <td>{item.businessName}</td>
                        <td>{item.address}</td>
                        <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center text-light">
                        No recent requests.
                      </td>
                    </tr>
                  )}
                </tbody>

              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
