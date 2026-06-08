import { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import API from "../../api/api";
import { toast } from "react-toastify";
import { FaUpload, FaMapMarkerAlt } from "react-icons/fa";
import { motion } from "framer-motion";

function CreateFood() {
  const [title, setTitle] = useState("");
  const [quantity, setQuantity] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [foodType, setFoodType] = useState("");
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  /* 📍 Get Location */
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },

      () => {
        toast.error("Location permission required");
      },
    );
  }, []);

  /* 📸 Image Upload */
  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  /* 🚀 Submit */
  const handleSubmit = async () => {
    if (!title || !quantity || !foodType) {
      toast.error("Please fill all fields");
      return;
    }

    if (!location) {
      toast.error("Fetching location...");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("title", title);
      formData.append("quantity", quantity);
      formData.append("image", image);
      formData.append("foodType", foodType);
      formData.append("preparedAt", new Date());

      formData.append("latitude", location.lat);
      formData.append("longitude", location.lng);

      await API.post("/food", formData);

      toast.success("Food listing created!");

      setTitle("");
      setQuantity("");
      setFoodType("");
      setImage(null);
      setPreview(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create listing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-bold mb-8">Create Food Listing</h1>

        <div className="grid md:grid-cols-2 gap-10">
          {/* FORM */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-8 rounded-2xl shadow-lg"
          >
            <h2 className="text-xl font-semibold mb-6">Food Details</h2>

            {/* Title */}
            <input
              placeholder="Food Title (e.g. Veg Biryani)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border p-3 w-full mb-4 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            />

            {/* Quantity */}
            <input
              placeholder="Quantity (meals)"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="border p-3 w-full mb-4 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            />

            <select
              value={foodType}
              onChange={(e) => setFoodType(e.target.value)}
              className="border p-3 w-full mb-4 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option value="">Select Food Type</option>
              <option value="VEG">Vegetarian</option>
              <option value="NON_VEG">Non-Vegetarian</option>
              <option value="RAW">Raw Food</option>
              <option value="DRY">Dry Food</option>
            </select>


            {/* Location */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <FaMapMarkerAlt />
              {location ? "Location detected" : "Detecting location..."}
            </div>

            {/* Upload */}
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-6 rounded-xl cursor-pointer hover:border-green-500 transition mb-4">
              <FaUpload className="text-2xl text-gray-400 mb-2" />

              <p className="text-sm text-gray-500">
                Click to upload food image
              </p>

              <input type="file" hidden onChange={handleImage} />
            </label>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading || !location}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              {loading ? "Creating..." : "Create Listing"}
            </button>
          </motion.div>

          {/* PREVIEW */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-8 rounded-2xl shadow-lg flex items-center justify-center"
          >
            {preview ? (
              <img src={preview} className="rounded-xl max-h-80 object-cover" />
            ) : (
              <p className="text-gray-400">Image preview will appear here</p>
            )}
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}

export default CreateFood;
