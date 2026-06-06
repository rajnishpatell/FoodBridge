import Layout from "../../components/Layout";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import API from "../../api/api";
import { FaPlus, FaChartLine, FaBoxOpen } from "react-icons/fa";
import { getDonorTrust } from "../../utils/trustHelpers";

function DonorDashboard() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyFoods = async () => {
    try {
      const res = await API.get("/food/my");
      setFoods(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyFoods();
  }, []);

  // 📊 Derived stats
  const totalMeals = foods.reduce((sum, f) => sum + (f.quantity || 0), 0);
  const activeListings = foods.filter((f) => f.status === "AVAILABLE").length;
  const collected = foods.filter((f) => f.status === "COLLECTED").length;
  const trust = getDonorTrust(foods);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
        {/* 🔥 HERO SECTION */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-600 to-emerald-500 text-white p-6 sm:p-8 rounded-2xl shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome Back 👋</h1>
            <p className="text-sm opacity-90">
              You're making a real impact by reducing food waste and helping
              communities.
            </p>
          </div>

          <a
            href="/donor/create"
            className="bg-white text-green-600 px-6 py-3 rounded-xl font-semibold hover:scale-105 transition"
          >
            + Create Listing
          </a>
        </motion.div>

        {/* 📊 STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Meals Donated" value={totalMeals} color="green" />
          <StatCard
            title="Active Listings"
            value={activeListings}
            color="yellow"
          />
          <StatCard title="Food Collected" value={collected} color="blue" />
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white p-6 rounded-xl shadow"
          >
            <h3 className="text-gray-500 text-sm">Trust Score</h3>

            <p className="text-3xl font-bold text-purple-600">{trust.score}</p>

            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
              {trust.badge}
            </span>
          </motion.div>
        </div>

        {/* ⚡ QUICK ACTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ActionCard
            icon={<FaPlus />}
            title="Create Listing"
            desc="Add new food for donation"
            link="/donor/create"
          />

          <ActionCard
            icon={<FaBoxOpen />}
            title="My Listings"
            desc="Manage your food"
            link="/donor/listings"
          />

          {/* <ActionCard
            icon={<FaChartLine />}
            title="Analytics"
            desc="View your impact"
            link="/analytics"
          /> */}
        </div>

        {/* 🔥 RECENT ACTIVITY */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>

          {foods.length === 0 ? (
            <p className="text-gray-500 text-sm">No activity yet</p>
          ) : (
            <div className="space-y-3">
              {foods.slice(0, 5).map((food) => (
                <div
                  key={food._id}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div>
                    <p className="font-medium text-sm">{food.title}</p>
                    <p className="text-xs text-gray-500">
                      {food.quantity} meals
                    </p>
                  </div>

                  <span
                    className={`text-xs px-3 py-1 rounded-full
                    ${
                      food.status === "AVAILABLE"
                        ? "bg-green-100 text-green-600"
                        : food.status === "CLAIMED"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-blue-100 text-blue-600"
                    }
                  `}
                  >
                    {food.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

/* 🔹 STAT CARD */
function StatCard({ title, value, color }) {
  const colorMap = {
    green: "text-green-600",
    yellow: "text-yellow-600",
    blue: "text-blue-600",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white p-6 rounded-xl shadow"
    >
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p className={`text-3xl font-bold ${colorMap[color]}`}>{value}</p>
    </motion.div>
  );
}

/* 🔹 ACTION CARD */
function ActionCard({ icon, title, desc, link }) {
  return (
    <a href={link}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="bg-white p-6 rounded-xl shadow flex flex-col gap-3 cursor-pointer"
      >
        <div className="text-green-600 text-xl">{icon}</div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-gray-500">{desc}</p>
      </motion.div>
    </a>
  );
}

export default DonorDashboard;
