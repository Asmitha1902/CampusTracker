import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  LineChart, Line, CartesianGrid, Legend
} from "recharts";
import "./Reports.css";

const Reports = () => {

  const [stats, setStats] = useState({});
  const [categoryData, setCategoryData] = useState([]);
  const [trendData, setTrendData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:9090/api/reports")
      .then(res => res.json())
      .then(data => {

        // 🔹 STATS
        setStats(data);

        // 🔹 CATEGORY → BAR
        const fixedCategories = [
  "Electronics",
  "Documents",
  "Clothing",
  "Accessories",
  "Keys",
  "Books",
  "Bags",
  "Others"
];

const cat = fixedCategories.map(catName => ({
  name: catName,
  count: data.categoryData?.[catName] || 0
}));

setCategoryData(cat);

        // 🔹 MONTH TREND → LINE
        const months = [
          "JANUARY","FEBRUARY","MARCH","APRIL",
          "MAY","JUNE","JULY","AUGUST",
          "SEPTEMBER","OCTOBER","NOVEMBER","DECEMBER"
        ];

        const trend = months.map(m => ({
          month: m.substring(0,3),
          lost: data.monthlyLost?.[m] || 0,
          matched: data.monthlyMatched?.[m] || 0
        }));

        setCategoryData(cat);
        setTrendData(trend);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="reports-container">
      <h2>Reports & Analytics</h2>

      {/* 🔹 TOP CARDS */}
      <div className="stats33-grid">
        <div className="card33 red">
          <h3>{stats.lost || 0}</h3>
          <p>Lost Items</p>
        </div>

        <div className="card33 green">
          <h3>{stats.found || 0}</h3>
          <p>Found Items</p>
        </div>

        <div className="card33 blue">
          <h3>{stats.matched || 0}</h3>
          <p>Matched</p>
        </div>
<div className="card33 purple"> 
  <h3>{stats.resolved || 0}</h3>
   <p>Resolved</p>
    </div>
        
      </div>

      {/* 🔥 CHART SECTION (LIKE YOUR IMAGE) */}
      <div className="charts11-grid">

        {/* 🔹 BAR CHART */}
        <div className="chart11-box">
          <h4>Items by Category</h4>
          <BarChart
  width={550}
  height={320}
  data={categoryData}
  layout="vertical"
  margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
>
  {/* 🔥 Gradient Color */}
  <defs>
    <linearGradient id="colorBar" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor="#f97316" />
      <stop offset="100%" stopColor="#fb923c" />
    </linearGradient>
  </defs>

  <XAxis type="number" hide />
  
  <YAxis
    type="category"
    dataKey="name"
    width={120}
    tick={{ fontSize: 13, fill: "#444" }}
  />

  <Tooltip
    contentStyle={{
      backgroundColor: "#fff",
      borderRadius: "10px",
      border: "none",
      boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
    }}
  />

  {/* 🔥 Smooth Animated Bars */}
  <Bar
    dataKey="count"
    fill="url(#colorBar)"
    radius={[0, 12, 12, 0]}
    barSize={18}
    animationDuration={800}
  />
</BarChart>
        </div>

        {/* 🔹 LINE GRAPH */}
        <div className="chart11-box">
          <h4>Recovery Trend</h4>
          <LineChart width={550} height={320} data={trendData}>
  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />

  <XAxis dataKey="month" />
  <YAxis />

  <Tooltip
    contentStyle={{
      backgroundColor: "#fff",
      borderRadius: "10px",
      border: "none",
      boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
    }}
  />

  <Legend />

  <Line
    type="monotone"
    dataKey="lost"
    stroke="#ef4444"
    strokeWidth={3}
    dot={{ r: 4 }}
    activeDot={{ r: 6 }}
  />

  <Line
    type="monotone"
    dataKey="matched"
    stroke="#3b82f6"
    strokeWidth={3}
    dot={{ r: 4 }}
    activeDot={{ r: 6 }}
  />
</LineChart>
        </div>

      </div>

      {/* 🔹 EXTRA STATS */}
      <div className="engagement-grid">
        <div className="eng-card">
          <h3>{(stats.lost || 0) + (stats.found || 0)}</h3>
          <p>Total Posts</p>
        </div>

        <div className="eng-card">
          <h3>{stats.matched || 0}</h3>
          <p>Total Matches</p>
        </div>
<div className="eng-card"> 
  <h3>{stats.resolved || 0}</h3>
   <p>Resolved Cases</p> 
   </div>
        

        <div className="eng-card">
          <h3>
            {stats.resolved
              ? ((stats.resolved / ((stats.lost || 0) + (stats.found || 0))) * 100).toFixed(1)
              : 0}
            %
          </h3>
          <p>Success Rate</p>
        </div>
      </div>
    </div>
  );
};

export default Reports;