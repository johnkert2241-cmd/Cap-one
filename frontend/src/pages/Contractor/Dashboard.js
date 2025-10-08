import React from "react";
import {
    PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    Legend, ResponsiveContainer, ComposedChart, Line, Area, DefaultLegendContent,
} from 'recharts';
import {
    FaBell, FaReceipt, FaTools, FaDollarSign,
    FaMoneyBillWave, FaUserFriends
} from "react-icons/fa";


function dashboard() {

    const renderTooltipWithoutRange = ({ payload, content, ...rest }) => {
        const newPayload = payload.filter((x) => x.dataKey !== "a");
        return <Tooltip payload={newPayload} {...rest} />;
    }

    const renderLegendWithoutRange = ({ payload, content, ...rest }) => {
        const newPayload = payload.filter((x) => x.dataKey !== "a");
        return <DefaultLegendContent payload={newPayload} {...rest} />;
    }

    const data = [
        {
            name: 'Page A',
            Aircon: 4000,
            Refrigeration: 2400,
            amt: 2400,
        },
        {
            name: 'Page B',
            Aircon: 3000,
            Refrigeration: 1398,
            amt: 2210,
        },
        {
            name: 'Page C',
            Aircon: 2000,
            Refrigeration: 9800,
            amt: 2290,
        },
        {
            name: 'Page D',
            Aircon: 2780,
            Refrigeration: 3908,
            amt: 2000,
        },
        {
            name: 'Page E',
            Aircon: 1890,
            Refrigeration: 4800,
            amt: 2181,
        },
        {
            name: 'Page F',
            Aircon: 2390,
            Refrigeration: 3800,
            amt: 2500,
        },
        {
            name: 'Page G',
            Aircon: 3490,
            Refrigeration: 4300,
            amt: 2100,
        },
    ];

    const line = [
        {
            name: "Page A",
            a: [0, 0],
            Customer: 0,
        },
        {
            name: "Page B",
            a: [50, 300],
            Customer: 106,
        },
        {
            name: "Page C",
            a: [150, 423],
        },
        {
            name: "Page D",
            Customer: 312,
        },
        {
            name: "Page E",
            a: [367, 678],
            Customer: 451,
        },
        {
            name: "Page F",
            a: [305, 821],
            Customer: 623,
        },
    ];

    const data01 = [
        {
            "name": "Group A",
            "value": 400
        },
        {
            "name": "Group B",
            "value": 300
        },
        {
            "name": "Group C",
            "value": 300
        },
        {
            "name": "Group D",
            "value": 200
        },
        {
            "name": "Group E",
            "value": 278
        },
        {
            "name": "Group F",
            "value": 189
        }
    ];
    const data02 = [
        {
            "name": "Group A",
            "value": 2400
        },
        {
            "name": "Group B",
            "value": 4567
        },
        {
            "name": "Group C",
            "value": 1398
        },
        {
            "name": "Group D",
            "value": 9800
        },
        {
            "name": "Group E",
            "value": 3908
        },
        {
            "name": "Group F",
            "value": 4800
        }
    ];

    const recentOrders = [
        { name: "Juan Dela Cruz", product: "Aircon Unit", date: "Oct 5, 2025" },
        { name: "Maria Santos", product: "Refrigerator", date: "Oct 4, 2025" },
        { name: "Pedro Reyes", product: "Compressor", date: "Oct 3, 2025" },
    ];

    const recentServices = [
        { name: "Anna Lopez", service: "Aircon Cleaning", date: "Oct 6, 2025" },
        { name: "Mark Garcia", service: "Refrigeration Repair", date: "Oct 4, 2025" },
        { name: "Rico Tan", service: "Installation", date: "Oct 2, 2025" },
    ];


    return (
        <>
            <div className="dashboard-header"
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "#66B1FC",
                    padding: "15px 25px",
                    borderRadius: "12px",
                    boxShadow: "5px 0px 2px #66B1FC",
                    marginBottom: "25px"
                }}
            >
                {/* Title */}
                <h2 style={{
                    color: "#fff",
                    margin: 0
                }}>
                    Dashboard
                </h2>

                {/* Right Side: Bell + Hi, Contractor */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    {/* Bell Icon */}
                    <FaBell
                        style={{
                            fontSize: "20px",
                            color: "#2c3e50",
                            cursor: "pointer",
                        }}
                    />

                    {/* Text */}
                    <span style={{ color: "#fff", fontWeight: "500" }}>
                        Hi, <strong>Contractor</strong>
                    </span>
                </div>
            </div>
            <div className="dashboard">

                <div className="cards-grid">
                    {/* Total Revenue */}
                    <div className="card bghov d-flex">
                        <h4>Total Revenue</h4>
                        <h2>0</h2>
                        <FaDollarSign
                            size={40}
                            color="#007bff"
                        />
                    </div>

                    <div className="card bghov">
                        <h4>Orders</h4>
                        <h2>0</h2>
                        <FaReceipt
                            color="#007bff"
                            size={40}
                        />
                    </div>

                    <div className="card bghov">
                        <h4>Services</h4>
                        <h2>0</h2>
                        <FaTools
                            color="#007bff"
                            size={40}
                        />
                    </div>

                    <div className="card bghov">
                        <h4>Products Cost</h4>
                        <h2>0</h2>
                        <FaMoneyBillWave
                            color="#007bff"
                            size={40}
                        />
                    </div>

                    <div className="card bghov">
                        <h4>New Customers</h4>
                        <h2>0</h2>
                        <FaUserFriends
                            color="#007bff"
                            size={40}
                        />
                    </div>

                    {/* Service Requests */}
                    <div className="card wide bghov">
                        <h4>Service Requests</h4>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                width={500}
                                height={300}
                                data={data}
                                margin={{
                                    top: 20,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                                <Tooltip />
                                <Legend />
                                <Bar yAxisId="left" dataKey="Aircon" fill="#007bff" />
                                <Bar yAxisId="right" dataKey="Refrigeration" fill="#16a34a" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="card wide bghov">
                        <h4>Service Requests</h4>
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart
                                width={500}
                                height={400}
                                data={line}
                                margin={{
                                    top: 10,
                                    right: 30,
                                    left: 0,
                                    bottom: 0,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip content={renderTooltipWithoutRange} />
                                <Area
                                    type="monotone"
                                    dataKey="a"
                                    stroke="none"
                                    fill=" #338efc"
                                    connectNulls
                                    dot={false}
                                    activeDot={false}
                                />
                                <Line type="natural" dataKey="Customer" stroke="#16a34a" connectNulls />
                                <Legend content={renderLegendWithoutRange} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="card piechart-container shadow-sm p-4 text-center rounded-3 bghov">
                        <h4 className="fw-bold mb-4">Expenses</h4>
                        <div className="d-flex justify-content-center">
                            <PieChart className="piechart" width={250} height={250}>
                                <Pie
                                    data={data01}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={50}
                                    fill="#16a34a"
                                />
                                <Pie
                                    data={data02}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#1e90ff"
                                    label
                                />
                            </PieChart>
                        </div>
                    </div>
                </div>


                <div className="tables-container" style={{ display: "flex", gap: "20px", marginTop: "20px" }}>

                    {/* Recent Orders Table */}
                    <div className="card table-card" style={{ flex: 1, background: "#fff", borderRadius: "16px", boxShadow: "0 4px 12px rgba(102,177,252,0.2)", padding: "20px" }}>
                        <h4>Recent Orders</h4>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ backgroundColor: "#66B1FC", textAlign: "left" }}>
                                    <th style={{ padding: "10px" }}>Name</th>
                                    <th style={{ padding: "10px" }}>Product</th>
                                    <th style={{ padding: "10px" }}>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((order, index) => (
                                    <tr key={index} style={{ borderBottom: "1px solid #E6F2FF" }}>
                                        <td style={{ padding: "10px", color: "#3b5998" }}>{order.name}</td>
                                        <td style={{ padding: "10px", color: "#3b5998" }}>{order.product}</td>
                                        <td style={{ padding: "10px", color: "#5B7FA5" }}>{order.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Recent Services Table */}
                    <div className="card table-card" style={{ flex: 1, background: "#fff", borderRadius: "16px", boxShadow: "0 4px 12px rgba(102,177,252,0.2)", padding: "20px" }}>
                        <h4>Recent Services</h4>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ backgroundColor: "#66B1FC", textAlign: "left" }}>
                                    <th style={{ padding: "10px" }}>Name</th>
                                    <th style={{ padding: "10px" }}>Service</th>
                                    <th style={{ padding: "10px" }}>Date</th>
                                </tr>
                            </thead>
                            <tbody className="">
                                {recentServices.map((service, index) => (
                                    <tr key={index} style={{ borderBottom: "1px solid #E6F2FF" }}>
                                        <td style={{ padding: "10px", color: "#3b5998" }}>{service.name}</td>
                                        <td style={{ padding: "10px", color: "#3b5998" }}>{service.service}</td>
                                        <td style={{ padding: "10px", color: "#3b5998" }}>{service.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

export default dashboard;
