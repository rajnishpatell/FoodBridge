import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import API from "../../api/api";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import SkeletonCard from "../../components/SkeletonCard";

function MyListings() {

  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyFoods = async () => {
    try {
      const res = await API.get("/food/my");
      setFoods(res.data);
    } catch {
      toast.error("Failed to load listings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyFoods();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this listing?")) return;

    try {
      await API.delete(`/food/${id}`);
      toast.success("Deleted successfully");

      setFoods((prev) => prev.filter((f) => f._id !== id));
    } catch {
      toast.error("Failed to delete");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-green-100 text-green-700";
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
          My Food Listings
        </h1>

        {/* 🔥 SKELETON */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <SkeletonCard key={i} />
            ))}
          </div>

        ) : foods.length === 0 ? (

          <div className="bg-white p-10 rounded-xl shadow text-center">
            <h2 className="text-lg font-semibold mb-2">
              No Listings Yet
            </h2>
            <p className="text-gray-500">
              Start by creating your first food listing 🚀
            </p>
          </div>

        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

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

                  <p className="text-sm text-gray-500 mb-3">
                    {food.quantity} meals
                  </p>

                  <div className="border-t pt-3 flex justify-between items-center">

                    <span className="text-xs text-gray-400">
                      {new Date(food.createdAt).toLocaleString()}
                    </span>

                    <button
                      onClick={() => handleDelete(food._id)}
                      className="text-red-500 text-sm font-medium hover:text-red-600"
                    >
                      Delete
                    </button>

                  </div>

                </div>

              </motion.div>

            ))}

          </div>

        )}

      </div>

    </Layout>
  );
}

export default MyListings;