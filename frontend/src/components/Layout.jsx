import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import MobileTopbar from "./MobileTopbar";
import { useState } from "react";

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex">

      {/* 🔥 SIDEBAR (CONTROLLED) */}
      <Sidebar
        externalOpen={sidebarOpen}
        setExternalOpen={setSidebarOpen}
      />

      {/* 🔥 MAIN */}
      <div className="flex-1 min-h-screen bg-gradient-to-br from-gray-100 to-green-50">

        {/* ✅ DESKTOP NAVBAR */}
        <div className="hidden md:block">
          <Navbar />
        </div>

        {/* ✅ MOBILE TOPBAR */}
        <MobileTopbar onMenuClick={() => setSidebarOpen(prev => !prev)} />

        {/* ✅ CONTENT */}
        <div className="p-4 md:p-8 mt-14 md:mt-0">
          {children}
        </div>

      </div>
    </div>
  );
}

export default Layout;