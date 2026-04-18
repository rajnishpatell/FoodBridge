import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import {
  FaUtensils,
  FaHandsHelping,
  FaChartLine,
  FaDonate,
  FaMapMarkerAlt
} from "react-icons/fa";

import Reveal from "../components/Reveal";
import DashboardPreview from "../components/DashboardPreview";

function Home() {

  const { ref, inView } = useInView({
    triggerOnce: true
  });

  return (

    <div className="relative bg-slate-50 text-gray-800 overflow-hidden">

      {/* Background blobs */}

      <div className="absolute top-[-120px] left-[-120px] w-96 h-96 bg-green-300 rounded-full blur-3xl opacity-30"></div>

      <div className="absolute bottom-[-120px] right-[-120px] w-96 h-96 bg-green-500 rounded-full blur-3xl opacity-20"></div>


      {/* Navbar */}

      <div className="flex justify-between items-center px-10 py-6 bg-white shadow-sm relative z-10">

        <h1 className="text-2xl font-bold text-green-600">
          FoodBridge
        </h1>

        <div className="flex gap-6 items-center">

          <Link to="/login" className="hover:text-green-600">
            Login
          </Link>

          <Link
            to="/register"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Get Started
          </Link>

        </div>

      </div>


      {/* Hero Section */}

      <motion.div
        initial={{ opacity:0,y:40 }}
        animate={{ opacity:1,y:0 }}
        transition={{ duration:1 }}
        className="flex items-center justify-between max-w-6xl mx-auto py-28 px-6"
      >

        <div className="max-w-xl">

          <h1 className="text-6xl font-bold mb-6 leading-tight">

            Save Food.
            <br/>
            Feed Communities.

          </h1>

          <p className="text-lg text-gray-600 mb-10">

            FoodBridge connects restaurants, individuals,
            and NGOs to redistribute surplus food and
            reduce food waste.

          </p>

          <div className="flex gap-6">

            <Link
              to="/register?role=DONOR"
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:scale-105 transition"
            >
              Start Donating
            </Link>

            <Link
              to="/register?role=NGO"
              className="border border-green-600 text-green-600 px-6 py-3 rounded-lg hover:bg-green-600 hover:text-white transition"
            >
              Find Food
            </Link>

          </div>

        </div>


        <div className="hidden md:block">

          <DashboardPreview/>

        </div>

      </motion.div>


      {/* Role Selection Section */}

      <Reveal>

      <div className="py-20 bg-white">

        <h2 className="text-3xl font-bold text-center mb-12">
          How would you like to help?
        </h2>

        <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto px-6">


          {/* Donor Card */}

          <motion.div
            whileHover={{ scale:1.05 }}
            className="bg-green-50 p-10 rounded-xl shadow"
          >

            <FaDonate className="text-green-600 text-4xl mb-4"/>

            <h3 className="text-xl font-bold mb-3">
              Food Donor
            </h3>

            <p className="text-gray-600 mb-6">

              Restaurants, events, and individuals
              can donate surplus food so it reaches
              people who need it most.

            </p>

            <Link
              to="/register?role=DONOR"
              className="bg-green-600 text-white px-5 py-3 rounded-lg"
            >
              Donate Food
            </Link>

          </motion.div>


          {/* NGO Card */}

          <motion.div
            whileHover={{ scale:1.05 }}
            className="bg-blue-50 p-10 rounded-xl shadow"
          >

            <FaMapMarkerAlt className="text-blue-600 text-4xl mb-4"/>

            <h3 className="text-xl font-bold mb-3">
              NGO / Volunteer
            </h3>

            <p className="text-gray-600 mb-6">

              NGOs can discover nearby food donations
              and distribute meals efficiently
              to communities in need.

            </p>

            <Link
              to="/register?role=NGO"
              className="bg-blue-600 text-white px-5 py-3 rounded-lg"
            >
              Find Food
            </Link>

          </motion.div>

        </div>

      </div>

      </Reveal>



      {/* Impact Section */}

      <Reveal>

      <div
        ref={ref}
        className="py-24 grid grid-cols-3 text-center gap-10"
      >

        <div>

          <h2 className="text-4xl font-bold text-green-600">
            {inView && <CountUp end={12500} duration={2}/>}
          </h2>

          <p className="text-gray-500">
            Meals Saved
          </p>

        </div>


        <div>

          <h2 className="text-4xl font-bold text-green-600">
            {inView && <CountUp end={600} duration={2}/>}
          </h2>

          <p className="text-gray-500">
            Active Donors
          </p>

        </div>


        <div>

          <h2 className="text-4xl font-bold text-green-600">
            {inView && <CountUp end={250} duration={2}/>}
          </h2>

          <p className="text-gray-500">
            Partner NGOs
          </p>

        </div>

      </div>

      </Reveal>



      {/* Features */}

      <Reveal>

      <div className="bg-white py-20 px-16">

        <h2 className="text-3xl font-bold text-center mb-14">
          Why FoodBridge?
        </h2>

        <div className="grid grid-cols-3 gap-10">


          <motion.div whileHover={{scale:1.05}} className="bg-slate-50 p-8 rounded-xl shadow">

            <FaUtensils className="text-green-600 text-3xl mb-4"/>

            <h3 className="font-semibold text-lg mb-2">
              Smart Food Matching
            </h3>

            <p className="text-gray-500">
              AI prioritizes food listings based on freshness
              and distance.
            </p>

          </motion.div>


          <motion.div whileHover={{scale:1.05}} className="bg-slate-50 p-8 rounded-xl shadow">

            <FaHandsHelping className="text-green-600 text-3xl mb-4"/>

            <h3 className="font-semibold text-lg mb-2">
              NGO Network
            </h3>

            <p className="text-gray-500">
              Connect donors with NGOs that can
              distribute food quickly.
            </p>

          </motion.div>


          <motion.div whileHover={{scale:1.05}} className="bg-slate-50 p-8 rounded-xl shadow">

            <FaChartLine className="text-green-600 text-3xl mb-4"/>

            <h3 className="font-semibold text-lg mb-2">
              Impact Analytics
            </h3>

            <p className="text-gray-500">
              Track the impact of food donations
              and reduce waste.
            </p>

          </motion.div>

        </div>

      </div>

      </Reveal>



      {/* CTA */}

      <div className="bg-green-600 text-white text-center py-20">

        <h2 className="text-3xl font-bold mb-6">
          Join the Food Rescue Movement
        </h2>

        <Link
          to="/register"
          className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:scale-105 transition"
        >
          Create Account
        </Link>

      </div>



      {/* Footer */}

      <div className="text-center py-6 bg-gray-900 text-gray-400">

        © 2026 FoodBridge — Reducing food waste together.

      </div>

    </div>

  );

}

export default Home;
