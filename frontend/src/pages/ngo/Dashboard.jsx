import Layout from "../../components/Layout";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import API from "../../api/api";
import FoodMap from "../../components/FoodMap";
import socket from "../../socket";
import { toast } from "react-toastify";
import { getNgoTrust } from "../../utils/trustHelpers";

import {
  FaMapMarkerAlt,
  FaUtensils,
  FaRoute,
  FaArrowRight,
  FaBolt,
  FaClipboardList,
} from "react-icons/fa";

function NgoDashboard() {
  const [foods, setFoods] = useState([]);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  /* 📍 Get Location */
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => toast.error("Location permission required"),
    );
  }, []);

  /* 🍲 Fetch Food */
  const fetchFood = async (lat, lng) => {
    try {
      const res = await API.get(
        `/food/nearby?latitude=${lat}&longitude=${lng}`,
      );
      setFoods(res.data.results);
    } catch {
      toast.error("Failed to fetch nearby food");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location) fetchFood(location.lat, location.lng);
  }, [location]);

  /* 🔔 Real-time */
  useEffect(() => {
    socket.on("newFood", (data) => {
      toast.info(`🍲 New food: ${data.title}`);
      if (location) fetchFood(location.lat, location.lng);
    });

    return () => socket.off("newFood");
  }, [location]);

  /* 📊 Derived stats */
  const total = foods.length;
  const closest = foods[0]?.distanceKm || "N/A";
  const urgent = foods.filter((f) => f.riskScore > 0.7).length;
  const trust = getNgoTrust(foods);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
        {/* 🔥 HERO */}
        <motion.div
          className="relative overflow-hidden bg-gradient-to-br from-blue-700 to-indigo-600 text-white p-6 sm:p-10 rounded-3xl shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold mb-2">Rescue Food Faster ⚡</h1>

            <p className="text-sm opacity-90 mb-4">
              Discover, claim, and deliver food efficiently in your area.
            </p>

            <div className="flex gap-3 flex-wrap">
              <a
                href="/ngo/nearby"
                className="bg-white text-blue-700 px-5 py-2 rounded-lg font-semibold flex items-center gap-2 hover:scale-105 transition"
              >
                Explore <FaArrowRight />
              </a>

              <a
                href="/ngo/claimed"
                className="border border-white px-5 py-2 rounded-lg hover:bg-white hover:text-blue-700 transition"
              >
                My Claims
              </a>
            </div>
          </div>

          {/* Mini stats inside hero */}
          <div className="flex gap-6 text-center">
            <div>
              <p className="text-2xl font-bold">{total}</p>
              <p className="text-xs opacity-80">Nearby</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{closest}</p>
              <p className="text-xs opacity-80">Closest km</p>
            </div>
          </div>
        </motion.div>

        {/* 📊 STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<FaUtensils />}
            title="Available Food"
            value={total}
            color="green"
          />

          <StatCard
            icon={<FaBolt />}
            title="Urgent Food"
            value={urgent}
            color="red"
          />

          <StatCard
            icon={<FaRoute />}
            title="Closest Distance"
            value={`${closest} km`}
            color="blue"
          />

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white p-6 rounded-xl shadow"
          >
            <FaBolt className="text-purple-600 text-xl mb-2" />

            <p className="text-3xl font-bold text-purple-600">
              {trust.efficiency}%
            </p>

            <p className="text-gray-500 text-sm mb-1">Efficiency Score</p>

            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
              {trust.badge}
            </span>
          </motion.div>
        </div>

        {/* ⚡ QUICK ACTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ActionCard
            icon={<FaMapMarkerAlt />}
            title="Explore Nearby"
            desc="View all food listings near you"
            link="/ngo/nearby"
          />

          <ActionCard
            icon={<FaClipboardList />}
            title="My Claims"
            desc="Manage claimed food"
            link="/ngo/claimed"
          />
        </div>

        {/* 🗺️ MAP */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-4">Live Food Map</h2>

          {loading ? (
            <p className="text-gray-500">Loading map...</p>
          ) : (
            <FoodMap foods={foods} center={location} />
          )}
        </div>

        {/* 🍲 CLOSEST FOOD HIGHLIGHT */}
        {foods.length > 0 && (
          <div className="bg-white p-6 rounded-2xl shadow flex justify-between items-center">
            <div>
              <h2 className="font-semibold">Closest Food</h2>
              <p className="text-sm text-gray-500">
                {foods[0].title} • {foods[0].distanceKm} km
              </p>
            </div>

            <a
              href="/ngo/nearby"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              View
            </a>
          </div>
        )}

        {/* 🔔 ACTIVITY */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-4">Recent Listings</h2>

          {foods.length === 0 ? (
            <p className="text-gray-500">No activity</p>
          ) : (
            <div className="space-y-3">
              {foods.slice(0, 5).map((food) => (
                <div
                  key={food._id}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div>
                    <p className="text-sm font-medium">{food.title}</p>
                    <p className="text-xs text-gray-500">
                      {food.distanceKm} km away
                    </p>
                  </div>

                  <span className="text-xs bg-green-100 text-green-600 px-3 py-1 rounded-full">
                    AVAILABLE
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

/* 🔹 STAT */
function StatCard({ icon, title, value, color }) {
  const colorMap = {
    green: "text-green-600",
    blue: "text-blue-600",
    red: "text-red-600",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white p-6 rounded-xl shadow"
    >
      <div className={`${colorMap[color]} text-xl mb-2`}>{icon}</div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-gray-500 text-sm">{title}</p>
    </motion.div>
  );
}

/* 🔹 ACTION */
function ActionCard({ icon, title, desc, link }) {
  return (
    <a href={link}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="bg-white p-6 rounded-xl shadow flex gap-4 items-center cursor-pointer"
      >
        <div className="text-blue-600 text-xl">{icon}</div>
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-gray-500">{desc}</p>
        </div>
      </motion.div>
    </a>
  );
}

export default NgoDashboard;
