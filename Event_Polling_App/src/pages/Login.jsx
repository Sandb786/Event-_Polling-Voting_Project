import { useState } from "react";
import api from "../api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Login() 
{
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => 
  {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => 
  {

      e.preventDefault();

      api.post("/auth/login", form)
      .then((res) => 
      {
          localStorage.setItem("token", res.data.token);
          toast.success("Login successful!");
          navigate("/");
      })
      .catch((err) => 
      {
          toast.error(err.response?.data?.error || "Login failed");
      });

  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
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
        <button className="w-full bg-blue-500 text-white p-2 rounded">Login</button>
      </form>
    </div>
  );
}
