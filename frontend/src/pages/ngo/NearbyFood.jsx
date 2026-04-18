import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import FoodCard from "../../components/FoodCard";
import FoodMap from "../../components/FoodMap";
import API from "../../api/api";
import socket from "../../socket";
import { toast } from "react-toastify";
import SkeletonCard from "../../components/SkeletonCard";
import { FaSearch } from "react-icons/fa";

function NearbyFood() {
  const [foods, setFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFood, setSelectedFood] = useState(null);

  /* 🔍 Filters */
  const [search, setSearch] = useState("");
  const [maxDistance, setMaxDistance] = useState(50);
  const [foodType, setFoodType] = useState("ALL");

  /* 🧠 AI MODE */
  const [aiMode, setAiMode] = useState(false);

  /* 📍 Location */
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => toast.error("Location required")
    );
  }, []);

  /* 🍲 Fetch */
  const fetchFood = async (lat, lng) => {
    try {
      const res = await API.get(
        `/food/nearby?latitude=${lat}&longitude=${lng}`
      );
      setFoods(res.data.results);
    } catch {
      toast.error("Failed to fetch food");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location) fetchFood(location.lat, location.lng);
  }, [location]);

  /* 🔔 Realtime */
  useEffect(() => {
    socket.on("newFood", () => {
      if (location) fetchFood(location.lat, location.lng);
    });
    return () => socket.off("newFood");
  }, [location]);

  /* 🔥 FILTER + AI SORT */
  useEffect(() => {
    let temp = [...foods];

    // 🔍 Search
    if (search) {
      temp = temp.filter((f) =>
        f.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    // 📍 Distance filter
    temp = temp.filter(
      (f) => parseFloat(f.distanceKm) <= maxDistance
    );

    // 🍲 Food type
    if (foodType !== "ALL") {
      temp = temp.filter((f) => f.foodType === foodType);
    }

    // 🧠 AI SORT
    if (aiMode) {
      temp.sort((a, b) => {
        const scoreA =
          0.6 * (1 - a.riskScore) +
          0.4 * (1 / (parseFloat(a.distanceKm) + 1));

        const scoreB =
          0.6 * (1 - b.riskScore) +
          0.4 * (1 / (parseFloat(b.distanceKm) + 1));

        return scoreB - scoreA;
      });
    } else {
      // default distance sort
      temp.sort((a, b) => a.distanceKm - b.distanceKm);
    }

    setFilteredFoods(temp);
  }, [foods, search, maxDistance, foodType, aiMode]);

  /* 🟢 Claim */
  const claimFood = async (id) => {
    try {
      await API.put(`/food/claim/${id}`);
      toast.success("Food claimed!");
      setFoods((prev) => prev.filter((f) => f._id !== id));
    } catch {
      toast.error("Failed to claim");
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">

        <h1 className="text-3xl font-bold">Nearby Food</h1>

        {/* 🔥 FILTER PANEL */}
        <div className="bg-white p-5 rounded-2xl shadow flex flex-col md:flex-row gap-4 items-center">

          {/* Search */}
          <div className="flex items-center gap-2 border px-3 py-2 rounded-lg w-full md:w-1/3">
            <FaSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Search food..."
              className="outline-none w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Distance */}
          <div className="flex flex-col w-full md:w-1/4">
            <label className="text-xs text-gray-500">
              Distance: {maxDistance} km
            </label>
            <input
              type="range"
              min="1"
              max="50"
              value={maxDistance}
              onChange={(e) => setMaxDistance(e.target.value)}
            />
          </div>

          {/* Food Type */}
          <select
            value={foodType}
            onChange={(e) => setFoodType(e.target.value)}
            className="border px-3 py-2 rounded-lg"
          >
            <option value="ALL">All</option>
            <option value="VEG">Veg</option>
            <option value="NON_VEG">Non-Veg</option>
            <option value="DRY">Dry</option>
          </select>

          {/* 🧠 AI TOGGLE */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAiMode(false)}
              className={`px-3 py-1 rounded-lg text-sm ${
                !aiMode ? "bg-green-600 text-white" : "bg-gray-200"
              }`}
            >
              Distance
            </button>

            <button
              onClick={() => setAiMode(true)}
              className={`px-3 py-1 rounded-lg text-sm ${
                aiMode ? "bg-purple-600 text-white" : "bg-gray-200"
              }`}
            >
              🧠 AI Smart
            </button>
          </div>

        </div>

        {/* 🗺️ MAP */}
        <div className="bg-white p-6 rounded-2xl shadow">
          {loading ? (
            <p>Loading map...</p>
          ) : (
            <FoodMap
              foods={filteredFoods}
              center={location}
              onClaim={claimFood}
            />
          )}
        </div>

        {/* 🍲 LIST */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? [1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)
            : filteredFoods.map((food, index) => (
                <FoodCard
                  key={food._id}
                  food={food}
                  onClaim={claimFood}
                  isNearest={!aiMode && index === 0}
                  aiMode={aiMode}
                  isSelected={selectedFood === food._id}
                  onHover={() => setSelectedFood(food._id)}
                />
              ))}
        </div>

      </div>
    </Layout>
  );
}

export default NearbyFood;