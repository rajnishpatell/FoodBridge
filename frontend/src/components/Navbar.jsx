import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom"; // ✅ Import Link
import { FaUserCircle, FaSignOutAlt, FaChevronDown } from "react-icons/fa";

function Navbar() {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef();

  /* 🔐 Load user (SAFE) */
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = sessionStorage.getItem("user");
        if (!storedUser || storedUser === "undefined") {
          setUser(null);
          return;
        }
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
      } catch {
        setUser(null);
        sessionStorage.removeItem("user");
      }
    };
    loadUser();
  }, []);

  /* 🔥 Scroll effect */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ❌ Close dropdown on outside click */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* 🚪 Logout */
  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = "/login";
  };

  /* 🧠 Safe display name */
  const displayName = user?.name || user?.email?.split("@")[0] || "User";

  return (
    <div
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md" : "bg-white/80 backdrop-blur-md"
      }`}
    >
      <div className="flex justify-between items-center px-4 md:px-6 py-3">
        
        {/* 🔥 LOGO (Now a Link to Home) */}
        <Link to="/" className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-green-600 hover:text-green-700 transition-colors">
            FoodBridge
          </h1>
        </Link>

        {/* 🔥 RIGHT SECTION */}
        <div className="flex items-center gap-3 md:gap-4 relative">
          
          {/* Role Badge */}
          {user && (
            <span
              className={`px-2 py-1 text-[10px] md:text-xs font-semibold rounded-full ${
                user.role === "NGO"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {user.role}
            </span>
          )}

          {/* 👤 USER DROPDOWN */}
          <div ref={dropdownRef} className="relative">
            <div
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-lg transition"
              onClick={() => setOpen(!open)}
            >
              <FaUserCircle className="text-2xl text-gray-600" />
              <span className="text-sm font-medium text-gray-700 hidden sm:block">
                {displayName}
              </span>
              <FaChevronDown className={`text-xs text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} />
            </div>

            {/* 🔥 DROPDOWN CONTENT */}
            {open && (
              <div className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-lg border p-2 animate-fadeIn">
                <div className="px-3 py-2 text-sm text-gray-600 border-b">
                  <p className="font-medium truncate">{displayName}</p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email}
                  </p>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full mt-1 flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;