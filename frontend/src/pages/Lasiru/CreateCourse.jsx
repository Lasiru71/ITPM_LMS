import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateCourse() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const navigate = useNavigate();

  const handlePublish = () => {
    if (!title || !price) {
      alert("Please fill all fields");
      return;
    }

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
        onChange={(e) => setTitle(e.target.value)}
        style={{ padding: "8px", width: "300px" }}
      />
      <br /><br />

      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        style={{ padding: "8px", width: "300px" }}
      />
      <br /><br />

      <button onClick={handlePublish}>Publish Course</button>
    </div>
  );
}