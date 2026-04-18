import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FaUtensils, FaHandsHelping } from "react-icons/fa";
import API from "../api/api";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

function Register() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const roleParam = params.get("role");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(roleParam || "DONOR");

  const handleRegister = async () => {
    try {
      await API.post("/auth/register", {
        name,
        email,
        password,
        role,
      });

      toast.success("Account created!");
      navigate("/login");
    } catch (error) {
      const backendError =
        error.response?.data?.errors?.[0]?.msg ||
        error.response?.data?.message ||
        "Registration failed";

      toast.error(backendError);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-500 to-emerald-700 relative overflow-hidden">
      {/* Decorative blobs */}

      <div className="absolute w-96 h-96 bg-white opacity-10 rounded-full blur-3xl top-10 left-10"></div>
      <div className="absolute w-96 h-96 bg-white opacity-10 rounded-full blur-3xl bottom-10 right-10"></div>

      {/* Main Container */}

      <div className="grid md:grid-cols-2 w-[900px] bg-white/20 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden">
        {/* Left Branding */}

        <div className="hidden md:flex flex-col justify-center p-12 text-white">
          <h1
            className="text-4xl font-bold mb-6 cursor-pointer hover:text-green-200 transition"
            onClick={() => navigate("/")}
          >
            FoodBridge
          </h1>

          <p className="text-lg leading-relaxed opacity-90">
            A smart platform connecting food donors with NGOs to reduce food
            waste and feed communities.
          </p>

          <p className="mt-6 text-sm opacity-70">
            Join the movement and make every meal count.
          </p>
        </div>

        {/* Register Form */}

        <div className="bg-white p-10">
          <h2 className="text-2xl font-bold text-center mb-6">
            Create Account
          </h2>

          {/* Role Selection */}

          <div className="grid grid-cols-2 gap-4 mb-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              onClick={() => setRole("DONOR")}
              className={`cursor-pointer border p-4 rounded-xl text-center transition ${
                role === "DONOR"
                  ? "border-green-600 bg-green-50"
                  : "border-gray-200"
              }`}
            >
              <FaUtensils className="mx-auto text-green-600 text-2xl mb-2" />

              <p className="font-semibold">Donor</p>

              <p className="text-xs text-gray-500">Donate surplus food</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              onClick={() => setRole("NGO")}
              className={`cursor-pointer border p-4 rounded-xl text-center transition ${
                role === "NGO"
                  ? "border-green-600 bg-green-50"
                  : "border-gray-200"
              }`}
            >
              <FaHandsHelping className="mx-auto text-green-600 text-2xl mb-2" />

              <p className="font-semibold">NGO</p>

              <p className="text-xs text-gray-500">Collect nearby food</p>
            </motion.div>
          </div>

          {/* Inputs */}

          <input
            placeholder="Full Name"
            className="border p-3 w-full mb-4 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            placeholder="Email Address"
            className="border p-3 w-full mb-4 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="border p-3 w-full mb-6 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Register Button */}

          <button
            onClick={handleRegister}
            className="bg-green-600 text-white w-full py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Create Account
          </button>

          <p className="text-sm text-center mt-4">
            Already have an account?{" "}
            <span
              className="text-green-600 cursor-pointer font-medium"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
