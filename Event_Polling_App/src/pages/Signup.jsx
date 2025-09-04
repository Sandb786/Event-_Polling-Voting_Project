import { useState } from "react";
import api from "../api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Signup() 
{
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => 
  {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => 
 {
    e.preventDefault();

       api.post("/auth/signup", form)
      .then((res) => 
      {
        // Save token immediately after signup
        localStorage.setItem("token", res.data.token);

        toast.success("Signup successful");

        navigate("/"); // redirect to home (or dashboard)
        
      })   
      .catch((err) => 
      {
        toast.error(err.response?.data?.error || "Signup failed");
      });
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4 text-center">Signup</h2>
        <input
          name="username"
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-3"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-3"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-3"
        />
        <button className="w-full bg-blue-500 text-white p-2 rounded">Signup</button>
      </form>
    </div>
  );
}
