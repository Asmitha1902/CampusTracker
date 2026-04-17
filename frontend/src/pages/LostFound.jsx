import React, { useState } from "react";
import "./LostFound.css";
import { Search, MapPin, Upload, X } from "lucide-react";

const LostFound = () => {

  const [type, setType] = useState("lost");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [form, setForm] = useState({
    itemName: "",
    description: "",
    category: "",
    location: "",
    date: "",
    tags: "",
    phone: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // select file
  const handleFile = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // drag drop
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];

    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // remove photo
  const removePhoto = () => {
    setImage(null);
    setPreview(null);
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();

  formData.append("type", type);
  formData.append("itemName", form.itemName);
  formData.append("description", form.description);
  formData.append("category", form.category);
  formData.append("location", form.location);
  formData.append("date", form.date);
  formData.append("tags", form.tags);
  formData.append("phone", form.phone);


  if (image) formData.append("image", image);
  
 try {
      // ✅ Send request without userId, backend attaches logged-in user automatically
    const res = await fetch("http://localhost:9090/api/items/report", {
  method: "POST",
  body: formData,
  credentials: "include"
});

console.log("Response status:", res.status);

if (!res.ok) {
  const msg = await res.text();
  console.log("Error response:", msg);
  throw new Error(msg || "Server error");
}

    // 🔥 Dynamic message based on type
    if (type === "lost") {
      alert("Lost item submitted successfully!");
    } else if (type === "found") {
      alert("Found item submitted successfully!");
    }

    // Reset form
    setForm({
      itemName: "",
      description: "",
      category: "",
      location: "",
      date: "",
      tags: "",
      phone: ""
    });
    removePhoto();
    setType("lost");

  } catch (err) {
    console.error(err);
    alert("Error submitting item. Make sure all fields are filled correctly.");
  }
};

  return (

    <div className="report-container">

      <h2>Report an Item</h2>
      <p className="subtitle">
        Fill in the details to report a lost or found item on campus
      </p>

      <div className="report-card">

        <div className="type-buttons">

          <button
            type="button"
            className={type === "lost" ? "active" : ""}
            onClick={() => setType("lost")}
          >
            <Search size={16} /> I Lost Something
          </button>

          <button
            type="button"
            className={type === "found" ? "active" : ""}
            onClick={() => setType("found")}
          >
            <MapPin size={16} /> I Found Something
          </button>

        </div>

        <form onSubmit={handleSubmit}>

          <label>Item Name *</label>
          <input
            name="itemName"
            value={form.itemName}
            placeholder="e.g., Blue Backpack, iPhone 14"
            onChange={handleChange}
            required
          />

          <label>Description *</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
          ></textarea>

          <div className="row">

            <div>
              <label>Category *</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
              >
                <option value="">Select category</option>
                <option>Electronics</option>
                <option>Documents</option>
                <option>Clothing</option>
                <option>Accessories</option>
                <option>Keys</option>
                <option>Books</option>
                <option>Bags</option>
                <option>Others</option>
              </select>
            </div>

            <div>
              <label>Location *</label>
              <select
                name="location"
                value={form.location}
                onChange={handleChange}
                required
              >
                <option value="">Where was it?</option>
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
            </div>

          </div>

          <div className="row">

            <div>
              <label>Date *</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
              />
            </div>

<div>
  <label>Tags</label>
  <input
    type="text"
    name="tags"
    value={form.tags} // controlled input
    placeholder="e.g., blue, leather, nike"
    onChange={(e) => setForm({ ...form, tags: e.target.value })}
  />
  
</div>

          </div>

          <label>Phone Number *</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            placeholder="Enter your phone number"
            onChange={handleChange}
            required
          />

          <label>Photos</label>

          <div
            className="photo-upload"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >

            {preview ? (
              <>
                <img src={preview} alt="preview" className="preview-image" />

                <button
                  type="button"
                  className="remove-photo"
                  onClick={removePhoto}
                >
                  <X size={14} />
                </button>
              </>
            ) : (
              <>
                <Upload size={22} />
                <span className="upload-text">
                  Drag & Drop or Upload Image
                </span>
              </>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
            />

          </div>

          <div className="buttons">

            <button type="submit" className="submit-btn">
              Submit Report
            </button>

            <button
              type="button"
              className="cancel-btn"
              onClick={() => window.location.reload()}
            >
              Cancel
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default LostFound;