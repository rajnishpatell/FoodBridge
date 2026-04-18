import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

// NGO
import NgoDashboard from "./pages/ngo/Dashboard";
import NearbyFood from "./pages/ngo/NearbyFood";
import ClaimedFood from "./pages/ngo/ClaimedFood";

// DONOR
import DonorDashboard from "./pages/donor/Dashboard";
import CreateFood from "./pages/donor/CreateFood";
import MyListings from "./pages/donor/MyListings";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🌐 Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 🔒 NGO (Protected) */}
        <Route
          path="/ngo"
          element={
            <ProtectedRoute role="NGO">
              <NgoDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ngo/nearby"
          element={
            <ProtectedRoute role="NGO">
              <NearbyFood />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ngo/claimed"
          element={
            <ProtectedRoute role="NGO">
              <ClaimedFood />
            </ProtectedRoute>
          }
        />

        {/* 🔒 DONOR (Protected) */}
        <Route
          path="/donor"
          element={
            <ProtectedRoute role="DONOR">
              <DonorDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/donor/create"
          element={
            <ProtectedRoute role="DONOR">
              <CreateFood />
            </ProtectedRoute>
          }
        />

        <Route
          path="/donor/listings"
          element={
            <ProtectedRoute role="DONOR">
              <MyListings />
            </ProtectedRoute>
          }
        />
      </Routes>

      <ToastContainer position="top-right" autoClose={1000} />
    </BrowserRouter>
  );
}

export default App;
