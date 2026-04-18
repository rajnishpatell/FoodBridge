import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaMapMarkerAlt,
  FaPlus,
  FaList,
  FaClipboardList,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useState, useEffect } from "react";

function Sidebar({ externalOpen, setExternalOpen }) {
  const [internalOpen, setInternalOpen] = useState(true);
  const [mobile, setMobile] = useState(false);
  const [user, setUser] = useState(null);

  const open = mobile ? (externalOpen ?? internalOpen) : internalOpen;
  const setOpen = mobile ? setExternalOpen || setInternalOpen : setInternalOpen;

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

  /* 📱 Detect mobile */
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      setMobile(isMobile);
      if (isMobile && externalOpen !== undefined) {
        setExternalOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* 🔥 OVERLAY */}
      {mobile && open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* 🔥 SIDEBAR */}
      <div
        className={`fixed md:static top-0 left-0 z-50 h-100% transition-all duration-300 transform
        ${mobile ? "w-64" : open ? "w-64" : "w-20"}
        ${mobile ? (open ? "translate-x-0" : "-translate-x-full") : "translate-x-0"}
        
        flex flex-col
        
        bg-white/80 backdrop-blur-xl border-r border-gray-200 shadow-2xl`}
      >

        {/* 🔝 TOP SECTION */}
        <div className="flex flex-col h-full">

          {/* HEADER */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            {open && (
              <h1 className="text-xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-400 bg-clip-text text-transparent">
                FoodBridge
              </h1>
            )}

            <button
              onClick={() => {
                if (mobile) setOpen(false);
                else setOpen(!open);
              }}
              className="text-gray-600 text-lg hover:scale-110 transition"
            >
              {mobile ? <FaTimes /> : <FaBars />}
            </button>
          </div>

          {/* NAV (KEY FIX ✅) */}
          <nav className="flex-1 overflow-y-auto flex flex-col gap-2 p-3">

            {/* DONOR */}
            {user?.role === "DONOR" && (
              <>
                <NavItem to="/donor" icon={<FaHome />} text="Dashboard" open={open} mobile={mobile} setOpen={setOpen} />
                <NavItem to="/donor/create" icon={<FaPlus />} text="Create Food" open={open} mobile={mobile} setOpen={setOpen} />
                <NavItem to="/donor/listings" icon={<FaList />} text="My Listings" open={open} mobile={mobile} setOpen={setOpen} />
              </>
            )}

            {/* NGO */}
            {user?.role === "NGO" && (
              <>
                <NavItem to="/ngo" icon={<FaHome />} text="Dashboard" open={open} mobile={mobile} setOpen={setOpen} />
                <NavItem to="/ngo/nearby" icon={<FaMapMarkerAlt />} text="Nearby Food" open={open} mobile={mobile} setOpen={setOpen} />
                <NavItem to="/ngo/claimed" icon={<FaClipboardList />} text="Claims" open={open} mobile={mobile} setOpen={setOpen} />
              </>
            )}

          </nav>

          {/* FOOTER (PERFECTLY STICKS ✅) */}
          {open && user && (
            <div className="p-4 border-t border-gray-200 bg-white/60 backdrop-blur-md">

              <div className="flex items-center gap-3">

                {/* Avatar */}
                <div className="w-11 h-11 rounded-full bg-gradient-to-r from-green-600 to-emerald-400 text-white flex items-center justify-center font-bold shadow-lg">
                  {user?.name?.[0] || "U"}
                </div>

                {/* Info */}
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {user?.name || user?.email?.split("@")[0]}
                  </p>
                  <p className="text-xs text-gray-500 truncate max-w-[140px]">
                    {user?.email}
                  </p>
                </div>

              </div>

            </div>
          )}

        </div>
      </div>
    </>
  );
}

/* 🔥 NAV ITEM */
function NavItem({ to, icon, text, open, mobile, setOpen }) {
  return (
    <NavLink
      to={to}
      end={to === "/ngo" || to === "/donor"}
      onClick={() => mobile && setOpen(false)}
      className={({ isActive }) =>
        `flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group
        ${
          isActive
            ? "bg-gradient-to-r from-green-100 to-green-50 text-green-700 shadow-md scale-[1.02]"
            : "text-gray-700 hover:bg-gray-100 hover:scale-[1.02]"
        }`
      }
    >
      <span className="text-lg group-hover:scale-110 transition">
        {icon}
      </span>

      {open && (
        <span className="text-sm font-medium tracking-wide">
          {text}
        </span>
      )}
    </NavLink>
  );
}

export default Sidebar;