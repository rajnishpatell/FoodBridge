import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import API from "../../api/api";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import SkeletonCard from "../../components/SkeletonCard";

function ClaimedFood() {

  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchClaimed = async () => {
    try {
      const res = await API.get("/food/claimed");
      setFoods(res.data);
    } catch {
      toast.error("Failed to load claimed food");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaimed();
  }, []);

  const markCollected = async (id) => {
    try {
      await API.put(`/food/collect/${id}`);
      toast.success("Marked as collected");

      setFoods((prev) =>
        prev.map((f) =>
          f._id === id ? { ...f, status: "COLLECTED" } : f
        )
      );

    } catch {
      toast.error("Failed to update");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "CLAIMED":
        return "bg-yellow-100 text-yellow-700";
      case "COLLECTED":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <Layout>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        <h1 className="text-3xl font-bold mb-8">
          My Claimed Food
        </h1>

        {/* 🔥 SKELETON */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <SkeletonCard key={i} />
            ))}
          </div>

        ) : foods.length === 0 ? (

          <div className="bg-white p-10 rounded-xl shadow text-center">
            <h2 className="text-lg font-semibold mb-2">
              No Claimed Food
            </h2>
            <p className="text-gray-500">
              Claim food from nearby listings 🍲
            </p>
          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

            {foods.map((food) => (

              <motion.div
                key={food._id}
                whileHover={{ scale: 1.04 }}
                className="bg-white rounded-2xl shadow-md overflow-hidden group transition"
              >

                <div className="relative">

                  <img
                    src={food.image || "https://via.placeholder.com/300"}
                    className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
                  />

                  <span className={`absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-full ${getStatusStyle(food.status)}`}>
                    {food.status}
                  </span>

                </div>

                <div className="p-4">

                  <h3 className="font-semibold text-lg mb-1">
                    {food.title}
                  </h3>

                  <p className="text-sm text-gray-500 mb-2">
                    {food.quantity} meals
                  </p>

                  <p className="text-xs text-gray-400 mb-3">
                    Donor: {food.donor?.name || "Unknown"}
                  </p>

                  {food.status === "CLAIMED" && (
                    <button
                      onClick={() => markCollected(food._id)}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700 transition active:scale-95"
                    >
                      Mark as Collected
                    </button>
                  )}

                </div>

              </motion.div>

            ))}

          </div>

        )}

      </div>

    </Layout>
  );
}

export default ClaimedFood;