import { useState, useMemo, useEffect } from "react";
import { Search, MapPin, Calendar, SlidersHorizontal } from "lucide-react";
import "./BrowseItems.css";

export default function BrowseItems() {

  const [items, setItems] = useState([]);

  const [search, setSearch] = useState("");
  const [type, setType] = useState("All Types");
  const [category, setCategory] = useState("All Categories");
  const [location, setLocation] = useState("All Locations");
  const [status, setStatus] = useState("All Status");

  // ✅ FETCH ONLY APPROVED ITEMS
  useEffect(() => {
  fetch("http://localhost:9090/api/items/approved", {
    method: "GET",
    credentials: "include"   // 🔥 IMPORTANT
  })
    .then(async (res) => {
      if (!res.ok) {
        const text = await res.text();
        throw new Error("Error: " + res.status + " " + text);
      }
      return res.json();
    })
    .then(data => setItems(data))
    .catch(err => console.error("FETCH ERROR:", err));
}, []);

  // ✅ FILTER LOGIC (FIXED)
  const filtered = useMemo(() => {

    return items.filter((item) => {

      const matchSearch =
        item.itemName?.toLowerCase().includes(search.toLowerCase()) ||
        item.description?.toLowerCase().includes(search.toLowerCase());

      const matchType =
        type === "All Types" || item.type?.toLowerCase() === type.toLowerCase();

      const matchCategory =
        category === "All Categories" || item.category === category;

      const matchLocation =
        location === "All Locations" || item.location === location;

      // 🔥 FIX → use itemStatus (lowercase compare)
      const matchStatus =
        status === "All Status" ||
        item.itemStatus?.toLowerCase() === status.toLowerCase();

      return matchSearch && matchType && matchCategory && matchLocation && matchStatus;

    });

  }, [items, search, type, category, location, status]);

  return (

    <div className="min-h-screen bg-gray-50">

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* TITLE */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Browse Items</h1>
          <p className="text-gray-500">
            Search through lost and found items on campus
          </p>
        </div>

        {/* FILTER BAR */}
        <div className="bg-white border rounded-xl p-5 mb-8 shadow-sm">

          <div className="flex gap-3 items-center overflow-x-auto">

            {/* SEARCH */}
            <div className="relative flex-1 min-w-[280px]">

              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400"/>

              <input
                className="w-full border rounded-lg pl-10 h-11"
                placeholder="Search by name, description, or tags..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

            </div>

            {/* TYPE */}
            <select className="border rounded-lg px-3 h-11"
              onChange={(e)=>setType(e.target.value)}>
              <option>All Types</option>
              <option>Lost</option>
              <option>Found</option>
            </select>

            {/* CATEGORY */}
            <select className="border rounded-lg px-3 h-11"
              onChange={(e)=>setCategory(e.target.value)}>
              <option>All Categories</option>
              <option>Electronics</option>
              <option>Documents</option>
              <option>Clothing</option>
              <option>Accessories</option>
              <option>Keys</option>
              <option>Books</option>
              <option>Bags</option>
              <option>Others</option>
            </select>

            {/* LOCATION */}
            <select className="border rounded-lg px-3 h-11"
              onChange={(e)=>setLocation(e.target.value)}>
              <option>All Locations</option>
              <option>Main Library</option>
              <option>Science Building</option>
              <option>Engineering Block</option>
              <option>Student Center</option>
              <option>Cafeteria</option>
              <option>Gymnasium</option>
              <option>Auditorium</option>
              <option>Computer Lab</option>
              <option>Parking Lot A</option>
              <option>Parking Lot B</option>
              <option>Sports Complex</option>
              <option>Admin Building</option>
              <option>Hostel Block A</option>
              <option>Hostel Block B</option>
            </select>

            {/* 🔥 STATUS (same UI, fixed logic) */}
            <select className="border rounded-lg px-3 h-11"
              onChange={(e)=>setStatus(e.target.value)}>
              <option>All Status</option>
              <option>Active</option>
              <option>Matched</option>
              <option>Resolved</option>
            </select>

          </div>

        </div>

        {/* RESULT HEADER */}
        <div className="flex justify-between mb-6">

          <p className="text-sm text-gray-500">
            {filtered.length} items found
          </p>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <SlidersHorizontal size={16}/>
            Sorted by date
          </div>

        </div>

        {/* CARDS */}
        <div className="items-grid">

          {filtered.map((item) => (

            <div key={item.id} className="item-card">

              {/* BADGES */}
              <div className="card-header">

                <span className={`badge ${item.type === "lost" ? "lost" : "found"}`}>
                  {item.type?.toUpperCase()}
                </span>

                {/* 🔥 SHOW itemStatus */}
                <span className="status">
                  {item.itemStatus || "active"}
                </span>

              </div>

              {/* IMAGE */}
              {item.imagePath && (
                <img
                  src={`http://localhost:9090/uploads/${item.imagePath}`}
                  alt="item"
                  className="item-image"
                />
              )}

              <h3 className="item-title"> {item.itemName}</h3>

              <p className="desc">{item.description}</p>

              <div className="location">
                <MapPin size={14}/> {item.location}
              </div>

              <div className="date">
                📅 {item.date}
              </div>

<div className="tags">
  🏷️
  {item.tags && item.tags.trim().length > 0
    ? item.tags
        .split(",")
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)
        .map((tag, index) => (
          <span key={index} className="tag">{tag}</span>
        ))
    : "No tags"}
</div>

              <div className="phone-row">
                <span className="phone-number">
                  📞 {item.phone}
                </span>

                <a href={`tel:${item.phone}`} className="call-btn">
                  Call 
                </a>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  );
}