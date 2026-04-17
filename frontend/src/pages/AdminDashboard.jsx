import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  LineChart, Line, CartesianGrid, Legend,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import {
  Package, Link2, CheckCircle, Users,
  Check, XCircle, RefreshCcw, ShieldCheck,
  User
} from "lucide-react";
import "./AdminDashboard.css";

const COLORS = ["#3b82f6", "#22c55e", "#8b5cf6", "#f59e0b"];

const AdminDashboard = () => {

  const [data, setData] = useState({});
  const [categoryData, setCategoryData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {

    // ✅ REPORT API
    fetch("http://localhost:9090/api/reports", {
      credentials: "include"
    })
      .then(res => res.json())
      .then(res => {
console.log("REPORT DATA 👉", res);
        setData(res);

        // ✅ CATEGORY FIX
        const categories = [
          "Electronics","Documents","Keys",
          "Clothing","Bags","Books","Accessories","Others"
        ];

        const catData = categories.map(c => ({
          name: c,
          count: res.categoryData?.[c] || 0
        }));

        setCategoryData(catData);

        // ✅ TREND (LOST + MATCHED)
        const months = [
          "JANUARY","FEBRUARY","MARCH","APRIL",
          "MAY","JUNE","JULY","AUGUST",
          "SEPTEMBER","OCTOBER","NOVEMBER","DECEMBER"
        ];

       const trend = months.map(m => ({
  month: m.substring(0,3),
  lost: res.monthlyLost?.[m] || 0,
  matched: res.monthlyMatched?.[m] || 0,
  found: res.monthlyFound?.[m] || 0
}));

        setTrendData(trend);
      });

    // ✅ USERS API
    fetch("http://localhost:9090/api/admin/users", {
      credentials: "include"
    })
      .then(res => res.json())
      .then(setUsers);

  }, []);

  // ✅ TOTAL
  const total = (data.lost || 0) + (data.found || 0);

  // ✅ SUCCESS RATE
  const successRate = total
    ? ((data.resolved / total) * 100).toFixed(1)
    : 0;

  // ✅ ACTIVE USERS
  const activeUsers = users.filter(u => u.emailVerified).length;

  // ✅ TOP USERS (FIXED)
  const topUsers = [...users]
    .sort((a, b) => (b.postCount || 0) - (a.postCount || 0))
    .slice(0, 5);

  // ✅ PIE DATA
  const pieData = [
    { name: "Total", value: total },
    { name: "Matched", value: data.matched || 0 },
    { name: "Resolved", value: data.resolved || 0 },
    { name: "Pending", value: data.pending || 0 }
  ];

  return (
    <div className="dashboard">

      <h2>Dashboard Overview</h2>

      {/* 🔹 TOP CARDS */}
      <div className="cards44">
  <Card title="Total Items" value={total} icon={<Package size={22} />} />
  <Card title="Matched" value={data.matched || 0} icon={<Link2 size={22} />} />
  <Card title="Resolved" value={data.resolved || 0} icon={<CheckCircle size={22} />} />
  <Card title="Active Users" value={activeUsers} icon={<Users size={22} />} />
</div>

      {/* 🔹 QUICK ACTIONS (REAL DATA) */}
      <div className="quick-actions">
  <ActionCard title="Approve Items" value={data.pending || 0} icon={<Check size={20} />} />
  <ActionCard title="Reject Items" value={data.flagged || 0} icon={<XCircle size={20} />} />
  <ActionCard title="Mark Matched" value={data.matched || 0} icon={<RefreshCcw size={20} />} />
  <ActionCard title="Mark Resolved" value={data.resolved || 0} icon={<ShieldCheck size={20} />} />
</div>

      {/* 🔹 CHARTS */}
      <div className="charts44">

        {/* CATEGORY */}
        <div className="chart44-box">
          <h4>Items by Category</h4>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart layout="vertical" data={categoryData} margin={{ left: 40 }}>
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={130}   padding={{ left: 20 }} />
              <Tooltip />
              <Bar
  dataKey="count"
  fill="#f97316"
  radius={[0, 20, 20, 0]}  // 🔥 curved corners
/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* TREND */}
       <div className="chart44-box">
  <h4>Recovery Trend</h4>

  <ResponsiveContainer width="100%" height={320}>
    <LineChart
      data={trendData}
      margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
    >
      <CartesianGrid strokeDasharray="3 3" />

      <XAxis dataKey="month" />
      <YAxis allowDecimals={false} />

      <Tooltip />
      <Legend />

      {/* 🔴 LOST */}
     <Line
  type="monotone"
  dataKey="lost"
  stroke="#ef4444"
  strokeWidth={3}
  dot={false}
  strokeLinecap="round"
/>

<Line
  type="monotone"
  dataKey="found"
  stroke="#22c55e"
  strokeWidth={3}
  dot={false}
  strokeLinecap="round"
/>

<Line
  type="monotone"
  dataKey="matched"
  stroke="#3b82f6"
  strokeWidth={3}
  dot={false}
  strokeLinecap="round"
/>

    </LineChart>
  </ResponsiveContainer>
</div>

      </div>

      {/* 🔹 EXTRA */}
      <div className="extra44-grid">

        {/* TOP CATEGORIES */}
        <div className="box44">
          <h4>Top Categories</h4>
          {[...categoryData]
            .sort((a, b) => b.count - a.count)
            .slice(0, 5)
            .map((c, i) => (
              <div key={i} className="progress-row">
                <span>{c.name}</span>
                <div className="progress-bar">
                  <div style={{ width: `${c.count * 5}%` }}></div>
                </div>
                <span>{c.count}</span>
              </div>
          ))}
        </div>

        {/* USERS */}
<div className="box44">
  <h4>Most Active Users</h4>

  <ul className="user11-list">
    {topUsers.map((u, i) => (
      <li key={i} className="user11-row">
        {/* 🔹 AVATAR */}
        <div className="avatar">
          {u.fullName?.charAt(0).toUpperCase()}
        </div>

        {/* 🔹 USER INFO */}
        <div className="user11-info">
          <h5>{u.fullName}</h5>
          <p>{u.postCount || 0} posts</p>
        </div>
      </li>
    ))}
  </ul>
</div>

      </div>

      {/* 🔹 PIE */}
     <div className="success-box">

  {/* LEFT DONUT */}
  <div className="success-left">
    <ResponsiveContainer width={140} height={140}>
      <PieChart>
        <Pie
          data={pieData}
          dataKey="value"
          innerRadius={45}
          outerRadius={60}
        >
          {pieData.map((entry, index) => (
            <Cell key={index} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>

    {/* CENTER TEXT */}
    <div className="success-center">
      <h2>{successRate}%</h2>
      <p>SUCCESS</p>
    </div>
  </div>

  {/* RIGHT SIDE */}
  <div className="success-right">
    <h4>Match Success Rate</h4>

    <p className="desc">
      Overall platform effectiveness in connecting lost items with owners
    </p>

    <div className="stats44">
      <div><span className="dot blue"></span> Total Post<b>{total}</b></div>
      <div><span className="dot green"></span> Matched <b>{data.matched}</b></div>
      <div><span className="dot purple"></span> Resolved <b>{data.resolved}</b></div>
      <div><span className="dot orange"></span> Pending <b>{data.pending}</b></div>
    </div>
  </div>

</div>

    </div>
  );
};

// 🔹 CARD
const Card = ({ title, value, icon }) => (
  <div className="card44">

    {/* 🔥 TOP ROW */}
    <div className="card44-top">
      <div className="card44-icon">{icon}</div>
      <h2>{value}</h2>
    </div>

    {/* 🔹 TITLE BELOW */}
    <p>{title}</p>

  </div>
);

/* 🔹 ACTION CARD */
const ActionCard = ({ title, value, icon }) => (
  <div className="action-card44">
    <div className="action44-icon">{icon}</div>
    <h4>{title}</h4>
    <p>{value}</p>
  </div>
);

export default AdminDashboard;