import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    Legend, ResponsiveContainer
} from "recharts";
import {
    FaBell, FaReceipt, FaTools, FaDollarSign,
} from "react-icons/fa";

function Dashboard() {


    const [recentOrders, setRecentOrders] = useState([]);
    const [recentServices, setRecentServices] = useState([]);


    const [ordersPage, setOrdersPage] = useState(1);
    const [servicesPage, setServicesPage] = useState(1);
    const itemsPerPage = 10;


    const paginatedOrders = recentOrders.slice(
        (ordersPage - 1) * itemsPerPage,
        ordersPage * itemsPerPage
    );

    const paginatedServices = recentServices.slice(
        (servicesPage - 1) * itemsPerPage,
        servicesPage * itemsPerPage
    );

    // ===== Fetch Data =====
    useEffect(() => {
        const fetchRecentOrders = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await axios.get(
                    "http://localhost:5000/orders",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setRecentOrders(res.data);
            } catch (error) {
                console.error("Error fetching recent orders:", error);
            }
        };

        const fetchRecentServices = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await axios.get(
                    "http://localhost:5000/servicesRequest",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setRecentServices(res.data);
            } catch (error) {
                console.error("Error fetching recent services:", error);
            }
        };

        fetchRecentOrders();
        fetchRecentServices();
    }, []);

    // ===== Bar Chart Data =====
    const getMonthlyPerformance = (orders, services) => {
        const months = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        const data = months.map(month => ({
            month,
            Orders: 0,
            Services: 0,
        }));

        orders.forEach(order => {
            const date = new Date(order.createdAt);
            const monthIndex = date.getMonth();
            data[monthIndex].Orders += 1;
        });

        services.forEach(service => {
            const date = new Date(service.createdAt);
            const monthIndex = date.getMonth();
            data[monthIndex].Services += 1;
        });

        return data;
    };

    const barData = getMonthlyPerformance(recentOrders, recentServices);

    const calculateTotalRevenue = (orders, services) => {
        const ordersTotal = orders.reduce((sum, o) => {
            return sum + (Number(o.price) || 0);
        }, 0);

        const servicesTotal = services.reduce((sum, s) => {
            return sum + (Number(s.price) || 0);
        }, 0);

        return ordersTotal + servicesTotal;
    };

    const totalRevenue = calculateTotalRevenue(recentOrders, recentServices);


    return (
        <>
            {/* ===== Dashboard Header ===== */}
            <div className="dashboard-header"
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: " #0A5875",
                    padding: "15px 25px",
                    borderRadius: "12px",
                    marginBottom: "25px"
                }}
            >
                <h2 style={{ color: "#fff", margin: 0 }}>Dashboard</h2>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <FaBell style={{ fontSize: "20px", color: "#fff", cursor: "pointer" }} />
                </div>
            </div>

            {/* ===== Cards ===== */}
            <div className="dashboard">
                <div className="cards-grid" >
                    <div className="card bghov">
                        <h4>Total Revenue</h4>
                        <h2>{totalRevenue.toLocaleString()}</h2>
                        <FaDollarSign className="card-icon" size={40} />
                    </div>


                    <div className="card bghov">
                        <h4>Orders</h4>
                        <h2>{recentOrders.length}</h2>
                        <FaReceipt className="card-icon" size={40} />
                    </div>

                    <div className="card bghov">
                        <h4>Services</h4>
                        <h2>{recentServices.length}</h2>
                        <FaTools className="card-icon" size={40} />
                    </div>
                </div>

                {/* ===== Monthly Performance Chart ===== */}
                <div
                    style={{
                        background: "#fff",
                        borderRadius: "16px",
                        boxShadow: "0 4px 12px rgba(102,177,252,0.2)",
                        padding: "20px",
                        marginTop: "30px",
                    }}
                >
                    <h4 style={{ color: "#306295", marginBottom: "20px" }}>Monthly Performance</h4>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={barData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis domain={[0, 100000]} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Orders" fill="#0A5875" barSize={35} radius={[8, 8, 0, 0]} />
                            <Bar dataKey="Services" fill="#306295" barSize={35} radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* ===== Tables ===== */}
                <div className="tables-container" style={{ display: "flex", gap: "20px", marginTop: "20px" }}>

                    {/* ===== Recent Orders ===== */}
                    <div className="card" style={{ flex: 1, background: "#fff", borderRadius: "16px", padding: "20px" }}>
                        <h4>Recent Orders</h4>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ backgroundColor: "#0A5875", textAlign: "left" }}>
                                    <th style={{ padding: "10px", color: "#fff" }}>Name</th>
                                    <th style={{ padding: "10px", color: "#fff" }}>Product</th>
                                    <th style={{ padding: "10px", color: "#fff" }}>Service</th>
                                    <th style={{ padding: "10px", color: "#fff" }}>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedOrders.length > 0 ? (
                                    paginatedOrders.map((order, index) => (
                                        <tr key={index}>
                                            <td style={{ padding: "10px", color: "#3b5998" }}>{order.customername}</td>
                                            <td style={{ padding: "10px", color: "#3b5998" }}>{order.product}</td>
                                            <td style={{ padding: "10px", color: "#3b5998" }}>{order.service}</td>
                                            <td style={{ padding: "10px", color: "#3b5998" }}>{new Date(order.date).toLocaleDateString()}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center text-muted">No orders yet</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        {recentOrders.length > itemsPerPage && (
                            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                                <button
                                    onClick={() => setOrdersPage(prev => Math.max(prev - 1, 1))}
                                    disabled={ordersPage === 1}
                                >
                                    Previous
                                </button>
                                <span>Page {ordersPage} of {Math.ceil(recentOrders.length / itemsPerPage)}</span>
                                <button
                                    onClick={() => setOrdersPage(prev => Math.min(prev + 1, Math.ceil(recentOrders.length / itemsPerPage)))}
                                    disabled={ordersPage === Math.ceil(recentOrders.length / itemsPerPage)}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>

                    {/* ===== Recent Services ===== */}
                    <div className="card" style={{ flex: 1, background: "#fff", borderRadius: "16px", padding: "20px" }}>
                        <h4>Recent Services</h4>
                        <table style={{ maxHeight: "400px", overflowY: "auto" }}>
                            <thead>
                                <tr style={{ backgroundColor: "#0A5875", textAlign: "left" }}>
                                    <th style={{ padding: "10px", color: "#fff" }}>Name</th>
                                    <th style={{ padding: "10px", color: "#fff" }}>Category</th>
                                    <th style={{ padding: "10px", color: "#fff" }}>Service</th>
                                    <th style={{ padding: "10px", color: "#fff" }}>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedServices.length > 0 ? (
                                    paginatedServices.map((service, index) => (
                                        <tr key={index}>
                                            <td style={{ padding: "10px", color: "#3b5998" }}>{service.customername}</td>
                                            <td style={{ padding: "10px", color: "#3b5998" }}>{service.choosecategory}</td>
                                            <td style={{ padding: "10px", color: "#3b5998" }}>{service.chooseservice}</td>
                                            <td style={{ padding: "10px", color: "#3b5998" }}>{new Date(service.servicedate).toLocaleDateString()}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center text-muted">No service requests yet</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        {recentServices.length > itemsPerPage && (
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginTop: "10px"
                                }}
                            >
                                {/* Left side */}
                                <span>
                                    Page {servicesPage} of {Math.ceil(recentServices.length / itemsPerPage)}
                                </span>

                                {/* Right side buttons */}
                                <div style={{ display: "flex", gap: "8px" }}>
                                    <button
                                        onClick={() => setServicesPage(prev => Math.max(prev - 1, 1))}
                                        disabled={servicesPage === 1}
                                    >
                                        Previous
                                    </button>

                                    <button
                                        onClick={() =>
                                            setServicesPage(prev =>
                                                Math.min(prev + 1, Math.ceil(recentServices.length / itemsPerPage))
                                            )
                                        }
                                        disabled={servicesPage === Math.ceil(recentServices.length / itemsPerPage)}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>

                        )}
                    </div>

                </div>
            </div>
        </>
    );
}

export default Dashboard;
