import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUtensils, FaHandsHelping } from "react-icons/fa";
import { motion } from "framer-motion";
import API from "../api/api";
import { toast } from "react-toastify";
import { getUser } from "../utils/auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("DONOR");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  /* 🔐 Redirect if already logged in */
  useEffect(() => {
    const user = getUser();
    if (user) {
      if (user.role === "NGO") navigate("/ngo");
      else navigate("/donor");
    }
  }, []);

  /* 🔥 LOGIN */
  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/login", {
        email,
        password,
        role, // optional (backend dependent)
      });

      

      const { token, ...user } = res.data;

      if (!user || !token) {
        toast.error("Invalid server response");
        return;
      }

      /* ✅ STORE AUTH */
      sessionStorage.setItem("user", JSON.stringify(user));
      sessionStorage.setItem("token", token);

      toast.success("Login successful!");

      /* 🔄 REDIRECT */
      if (user.role === "NGO") {
        navigate("/ngo");
      } else {
        navigate("/donor");
      }
    } catch (error) {
      console.error("Full Error Object:", error);
      const message =
        error.response?.data?.message || // backend message
        error.response?.data || // fallback
        "Login failed. Try again.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-500 to-emerald-700 relative overflow-hidden">
      {/* 🔥 BACKGROUND BLOBS */}
      <div className="absolute w-96 h-96 bg-white opacity-10 rounded-full blur-3xl top-10 left-10"></div>
      <div className="absolute w-96 h-96 bg-white opacity-10 rounded-full blur-3xl bottom-10 right-10"></div>

      {/* 🔥 MAIN CONTAINER */}
      <div className="grid md:grid-cols-2 w-[95%] max-w-[900px] bg-white/20 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden">
        {/* LEFT SIDE */}
        <div className="hidden md:flex flex-col justify-center p-12 text-white">
          <h1 
            className="text-4xl font-bold mb-6 cursor-pointer hover:text-green-200 transition"
            onClick={() => navigate("/")}
          >
            FoodBridge
          </h1>
          <h1 className="text-4xl font-bold mb-6">Welcome Back</h1>

          <p className="text-lg opacity-90">
            Continue reducing food waste and helping communities.
          </p>

          <p className="mt-6 text-sm opacity-70">Every meal matters 🍲</p>
        </div>

        {/* RIGHT SIDE */}
        <div className="bg-white p-6 sm:p-10">
          <h2 className="text-2xl font-bold text-center mb-6">
            Login to FoodBridge
          </h2>

          {/* 🔥 ROLE SELECT */}
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
              <p className="text-xs text-gray-500">Donate food</p>
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
              <p className="text-xs text-gray-500">Claim food</p>
            </motion.div>
          </div>

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email Address"
            className="border p-3 w-full mb-4 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* PASSWORD */}
          <input
            type="password"
            placeholder="Password"
            className="border p-3 w-full mb-6 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* LOGIN BUTTON */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold transition text-white
              ${
                loading
                  ? "bg-green-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 active:scale-95"
              }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* REGISTER */}
          <p className="text-sm text-center mt-4">
            Don't have an account?{" "}
            <span
              className="text-green-600 cursor-pointer font-medium"
              onClick={() => navigate("/register")}
            >
              Register
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
