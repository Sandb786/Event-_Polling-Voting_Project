import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/event/Dashboard";
import CreatePoll from "./pages/polling/CreatePoll";
import Poll from "./pages/polling/Poll";

function App() {
  const token = localStorage.getItem("token"); // check once here

  return (
    <Router>
      <Navbar />
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/createPoll" element={<CreatePoll />} />
        <Route path="/poll" element={<Poll />} />

        {/* Protected route check directly here */}
        <Route
          path="/dashboard"
          element={token ? <Dashboard /> : <Navigate to="/login" replace />}
        />
      </Routes>
      
    </Router>
  );
}

export default App;
