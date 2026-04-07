import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { FileQuestion, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-lg bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-10 text-center relative z-10"
      >
        <motion.div 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="mx-auto w-24 h-24 bg-green-100 text-green-700 rounded-full flex items-center justify-center mb-8 shadow-inner"
        >
          <FileQuestion size={48} strokeWidth={1.5} />
        </motion.div>

        <h1 className="text-8xl font-black text-gray-900 mb-4 tracking-tighter">
          4<span className="text-green-600">0</span>4
        </h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          Page Not Found
        </h2>
        <p className="text-gray-500 mb-10 leading-relaxed max-w-sm mx-auto">
          The legal document or page you're looking for seems to have been misplaced in our archives.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-medium flex items-center justify-center gap-2 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 active:scale-95"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
          <Link 
            to="/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-green-600 border-2 border-green-600 text-white font-medium flex items-center justify-center gap-2 hover:bg-green-700 hover:border-green-700 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
          >
            <Home size={18} />
            Return Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
