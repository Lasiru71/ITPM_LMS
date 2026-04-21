import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateCourse() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handlePublish = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = "Course title is required.";
    } else if (title.trim().length < 3) {
      newErrors.title = "Course title must be at least 3 characters long.";
    }

    if (!price) {
      newErrors.price = "Price is required.";
    } else if (isNaN(price) || Number(price) <= 0) {
      newErrors.price = "Price must be a valid positive number.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const existing = JSON.parse(localStorage.getItem("courses")) || [];

    const newCourse = {
      id: Date.now(),
      title,
      price,
    };

    localStorage.setItem("courses", JSON.stringify([...existing, newCourse]));

    // redirect + refresh
    navigate("/lecturer-dashboard");
    setTimeout(() => window.location.reload(), 100);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create Course</h2>

      <input
        type="text"
        placeholder="Course Title"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          if (errors.title) setErrors({ ...errors, title: "" });
        }}
        style={{ padding: "8px", width: "300px", borderColor: errors.title ? "red" : undefined }}
      />
      {errors.title && <div style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>{errors.title}</div>}
      <br /><br />

      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => {
          setPrice(e.target.value);
          if (errors.price) setErrors({ ...errors, price: "" });
        }}
        style={{ padding: "8px", width: "300px", borderColor: errors.price ? "red" : undefined }}
      />
      {errors.price && <div style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>{errors.price}</div>}
      <br /><br />

      <button onClick={handlePublish} style={{ padding: "10px 15px", cursor: "pointer" }}>Publish Course</button>
    </div>
  );
}