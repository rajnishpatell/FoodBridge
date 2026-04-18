import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "react-leaflet-cluster/dist/assets/MarkerCluster.css";
import "react-leaflet-cluster/dist/assets/MarkerCluster.Default.css";
import { getAIScore } from "../utils/aiHelpers";

// Fix default marker issue
delete L.Icon.Default.prototype._getIconUrl;

// Normal marker
const normalIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
});

// Nearest marker
const nearestIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
  iconSize: [35, 35],
});

function FoodMap({ foods, center, onClaim }) {
  if (!center) return null;

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={14}
      className="h-[420px] w-full rounded-2xl shadow"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <MarkerClusterGroup
        chunkedLoading
        spiderfyOnMaxZoom={true}
        showCoverageOnHover={false}
        zoomToBoundsOnClick={true}
        maxClusterRadius={40}
      >
        {foods.map((food, index) => {
          if (
            !food.location ||
            !food.location.coordinates ||
            food.location.coordinates.length !== 2
          )
            return null;

          const [lng, lat] = food.location.coordinates;

          return (
            <Marker
              key={food._id}
              position={[lat, lng]}
              icon={index === 0 ? nearestIcon : normalIcon}
            >
              <Popup maxWidth={280}>
                <div className="w-64 rounded-xl overflow-hidden bg-white shadow-xl border">
                  {/* 🔥 IMAGE + OVERLAY */}
                  <div className="relative">
                    {food.image ? (
                      <img
                        src={food.image}
                        className="w-full h-28 object-cover"
                      />
                    ) : (
                      <div className="w-full h-28 bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                        No Image
                      </div>
                    )}

                    {/* 🧠 AI BADGE */}
                    {(() => {
                      const ai = getAIScore(food.riskScore || 0);

                      const color =
                        ai.color === "green"
                          ? "bg-green-600"
                          : ai.color === "yellow"
                            ? "bg-yellow-500"
                            : "bg-red-600";

                      return (
                        <div
                          className={`${color} absolute top-2 left-2 text-white text-[10px] px-2 py-1 rounded shadow`}
                        >
                          AI {ai.score}
                        </div>
                      );
                    })()}

                    {/* Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                    {/* Title */}
                    <h3 className="absolute bottom-2 left-3 text-white text-sm font-semibold">
                      {food.title}
                    </h3>
                  </div>

                  {/* 🔥 CONTENT */}
                  <div className="p-3 space-y-2">
                    {/* Badges */}
                    <div className="flex justify-between items-center text-xs">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        {food.quantity} meals
                      </span>

                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        📍 {food.distanceKm || "Nearby"} km
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {food.description || "Fresh food available"}
                    </p>

                    {/* 🧠 AI INSIGHT */}
                    {(() => {
                      const ai = getAIScore(food.riskScore || 0);

                      const colorText =
                        ai.color === "green"
                          ? "text-green-600"
                          : ai.color === "yellow"
                            ? "text-yellow-600"
                            : "text-red-600";

                      return (
                        <div className="text-[11px]">
                          <span className={`font-semibold ${colorText}`}>
                            {ai.label}
                          </span>
                          <p className="text-gray-500 leading-tight">
                            {ai.advice}
                          </p>
                        </div>
                      );
                    })()}

                    {/* 🔥 ACTION BUTTONS */}
                    <div className="flex gap-2 pt-2">
                      {/* Claim */}
                      <button
                        onClick={() => onClaim && onClaim(food._id)}
                        className="flex-1 bg-green-600 text-white py-1.5 rounded-lg text-xs font-semibold hover:bg-green-700 transition active:scale-95"
                      >
                        Claim
                      </button>

                      {/* Navigate */}
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white py-1.5 rounded-lg text-xs text-center font-semibold hover:from-blue-700 hover:to-blue-600 transition active:scale-95 shadow-md"
                      >
                        Navigate 🚗
                      </a>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MarkerClusterGroup>
    </MapContainer>
  );
}

export default FoodMap;
