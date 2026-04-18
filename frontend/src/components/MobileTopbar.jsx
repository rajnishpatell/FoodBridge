import { useState, useEffect, useRef } from "react";
import { FaBars, FaUserCircle, FaSignOutAlt } from "react-icons/fa";

function MobileTopbar({ onMenuClick }) {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  /* 🔐 Load user */
  useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem("user");
      if (storedUser && storedUser !== "undefined") {
        setUser(JSON.parse(storedUser));
      }
    } catch {
      sessionStorage.removeItem("user");
    }
  }, []);

  /* Close dropdown */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = "/login";
  };

  const displayName =
    user?.name || user?.email?.split("@")[0] || "User";

  return (
    <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow flex items-center justify-between px-4 py-3">

      {/* ☰ MENU */}
      <button onClick={onMenuClick}>
        <FaBars className="text-xl text-green-600" />
      </button>

      {/* LOGO */}
      <h1 className="font-semibold text-green-600">
        FoodBridge
      </h1>

      {/* 👤 USER */}
      <div ref={dropdownRef} className="relative">
        <div
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 cursor-pointer"
        >
          <FaUserCircle className="text-2xl text-gray-600" />
        </div>

        {open && (
          <div className="absolute right-0 top-10 w-44 bg-white rounded-xl shadow-lg border p-2">

            <div className="px-3 py-2 text-sm border-b">
              <p className="font-medium">{displayName}</p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
            >
              <FaSignOutAlt />
              Logout
            </button>

          </div>
        )}
      </div>
    </div>
  );
}

export default MobileTopbar;