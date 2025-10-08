import React from "react";
import { FaClipboardList } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi";
import { RiPassPendingFill } from "react-icons/ri";
import { TbReportSearch } from "react-icons/tb";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
  ResponsiveContainer
} from "recharts";

function Dashboard() {

  const bookings = [
    { client: "Emma Watson", date: "Mar 15, 2024", service: "AC Installation" },
    { client: "James Smith", date: "Mar 14, 2024", service: "Refrigerator Repair" },
    { client: "Sarah Johnson", date: "Mar 13, 2024", service: "AC Maintenance" },
    { client: "James Harden", date: "Mar 118, 2024", service: "AC Installation" },
    
  ];

  const revenue = [
    {
      "name": "January",
      "uv": 4000,
      "pv": 2400,
      "amt": 2400
    },
    {
      "name": "February",
      "uv": 3000,
      "pv": 1398,
      "amt": 2210
    },
    {
      "name": "March",
      "uv": 2000,
      "pv": 9800,
      "amt": 2290
    },
    {
      "name": "April",
      "uv": 2780,
      "pv": 3908,
      "amt": 2000
    },
    {
      "name": "May",
      "uv": 1890,
      "pv": 4800,
      "amt": 2181
    },
    {
      "name": "June",
      "uv": 2390,
      "pv": 3800,
      "amt": 2500
    },
    {
      "name": "July",
      "uv": 3490,
      "pv": 4300,
      "amt": 2100
    },
    {
      "name": "September",
      "uv": 5780,
      "pv": 4300,
      "amt": 2100
    },
    {
      "name": "November",
      "uv": 8450,
      "pv": 4300,
      "amt": 2100
    },
    {
      "name": "December",
      "uv": 3490,
      "pv": 4300,
      "amt": 2100
    }
  ]

  return (
    <div className="dashboard-container">
      {/* Header Card */}
      <div className="header-card mb-4">
        <h3 className="fw-bold text-dark">Dashboard</h3>
      </div>

      {/* Stats Cards */}
      <div className="stats-cards d-flex flex-wrap gap-3 mb-5">
        <div className="revenue stat-card request shadow-sm rounded p-3 flex-fill text-center">
          <FaClipboardList size={40} />
          <h4>Business Registered</h4>
          <h2>0</h2>
        </div>

        <div className=" clients stat-card approved shadow-sm rounded p-3 flex-fill text-center">
          <HiUserGroup size={40} />
          <h4>Clients</h4>
          <h2>0</h2>
        </div>

        <div className=" pending stat-card pending shadow-sm rounded p-3 flex-fill text-center">
          <RiPassPendingFill size={40} />
          <h4>Pending Request</h4>
          <h2>0</h2>
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
        <div className="col-lg-8 col-md-12 mb-4">
          <div className="chart-container bg-white shadow-sm rounded-3 p-4 h-100">
            <h5 className="fw-bold mb-3">Revenue</h5>

            <div style={{ width: "100%", height: "300px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={revenue}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
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
                  <XAxis dataKey="name" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="uv"
                    stroke="#8884d8"
                    fillOpacity={1}
                    fill="url(#colorUv)"
                  />
                  <Area
                    type="monotone"
                    dataKey="pv"
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
          <div className="recent-bookings bg-white shadow-sm rounded-3 p-4 h-100">
            <h5 className="fw-bold mb-3">Recent Bookings</h5>
            <div className="table-responsive">
              <table className="table-recent">
                <thead className="text-muted">
                  <tr>
                    <th>Client</th>
                    <th>Date</th>
                    <th>Service</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b, i) => (
                    <tr key={i}>
                      <td>{b.client}</td>
                      <td>{b.date}</td>
                      <td>{b.service}</td>
                    </tr>
                  ))}
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
