import { motion } from "framer-motion";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useState } from "react";
import { getAIScore } from "../utils/aiHelpers";
import { getAIExplanation } from "../utils/aiExplain";

function FoodCard({ food, onClaim, isNearest, aiMode }) {
  const [claiming, setClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);

  const ai = getAIScore(food.riskScore || 0);
  const reasons = getAIExplanation(food);

  const handleClaim = async () => {
    if (claiming || claimed) return;

    try {
      setClaiming(true);
      await onClaim(food._id);
      setClaimed(true);
    } catch {
      setClaiming(false);
    }
  };

  /* 🎨 AI Color */
  const getAIColor = () => {
    if (ai.color === "green") return "bg-green-100 text-green-700";
    if (ai.color === "yellow") return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      className={`bg-white rounded-2xl shadow-md overflow-hidden transition relative group
        ${isNearest ? "border-2 border-green-600 shadow-xl" : ""}
        ${aiMode ? "ring-2 ring-purple-400/40" : ""}
      `}
    >
      {/* ⭐ Nearest */}
      {isNearest && !aiMode && (
        <span className="absolute top-3 right-3 bg-green-600 text-white text-xs px-2 py-1 rounded-full z-10">
          ⭐ Nearest
        </span>
      )}

      {/* 🧠 Smart Pick */}
      {aiMode && (
        <span className="absolute top-3 right-3 bg-purple-600 text-white text-xs px-2 py-1 rounded-full z-10 shadow">
          🧠 Smart Pick
        </span>
      )}

      {/* 🔥 IMAGE */}
      <div className="relative">
        <img
          src={food.image || "https://via.placeholder.com/300"}
          className="w-full h-44 object-cover group-hover:scale-105 transition duration-300"
        />

        {/* AI SCORE */}
        <div
          className={`absolute top-3 left-3 px-2 py-1 text-xs font-semibold rounded-full shadow ${getAIColor()}`}
        >
          AI {ai.score}
        </div>
      </div>

      {/* 🔥 CONTENT */}
      <div className="p-4 flex flex-col gap-2">

        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-800">
          {food.title}
        </h2>

        {/* Description */}
        <p className="text-sm text-gray-500 line-clamp-2">
          {food.description || "Fresh food available"}
        </p>

        {/* Distance */}
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <FaMapMarkerAlt />
          {food.distanceKm ? `${food.distanceKm} km away` : "Nearby"}
        </p>

        {/* 🧠 AI INSIGHT */}
        <div className="text-xs mt-1">
          <span
            className={`inline-block px-2 py-0.5 rounded ${getAIColor()} font-medium`}
          >
            {ai.label}
          </span>
          <p className="text-gray-500 mt-1">{ai.advice}</p>
        </div>

        {/* 🧠 AI EXPLANATION (NEW 🔥) */}
        {aiMode && reasons.length > 0 && (
          <div className="mt-2 bg-purple-50 border border-purple-200 rounded-lg p-2 text-[11px]">
            <p className="font-semibold text-purple-700 mb-1">
              Why recommended:
            </p>

            <ul className="text-gray-600 space-y-0.5">
              {reasons.map((reason, i) => (
                <li key={i}>✔ {reason}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center mt-3">

          <span className="text-green-600 font-semibold">
            {food.quantity} meals
          </span>

          {/* CLAIM */}
          <button
            onClick={handleClaim}
            disabled={claiming || claimed}
            className={`px-4 py-2 rounded-lg text-sm text-white flex items-center gap-2 transition
              ${
                claimed
                  ? "bg-gray-400 cursor-not-allowed"
                  : claiming
                  ? "bg-green-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 active:scale-95"
              }
            `}
          >
            {claiming ? (
              <>
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                Claiming...
              </>
            ) : claimed ? (
              "Claimed ✅"
            ) : (
              "Claim"
            )}
          </button>

        </div>
      </div>
    </motion.div>
  );
}

export default FoodCard;