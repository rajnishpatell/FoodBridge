import { motion } from "framer-motion";

function DashboardPreview() {

  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="bg-white rounded-2xl shadow-xl p-6 w-[420px]"
    >

      {/* Header */}
      <div className="flex justify-between mb-4">

        <div className="font-bold text-gray-700">
          NGO Dashboard
        </div>

        <div className="text-green-600 text-sm">
          Live
        </div>

      </div>


      {/* Mock Food Cards */}

      <div className="space-y-3">

        <div className="bg-slate-50 p-3 rounded-lg flex justify-between">

          <span>Veg Biryani</span>
          <span className="text-green-600">20 meals</span>

        </div>

        <div className="bg-slate-50 p-3 rounded-lg flex justify-between">

          <span>Rice & Curry</span>
          <span className="text-green-600">15 meals</span>

        </div>

        <div className="bg-slate-50 p-3 rounded-lg flex justify-between">

          <span>Bread & Soup</span>
          <span className="text-green-600">10 meals</span>

        </div>

      </div>

    </motion.div>
  );
}

export default DashboardPreview;