import React from 'react';
import { motion } from 'framer-motion';
import { FileSearch, Mic, Video, Clock, BarChart2 } from 'lucide-react';

const CapabilitiesSection = () => {
  // Intro animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };

  return (
    <div className="w-full bg-gray-50 py-24 font-sans border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={headerVariants}
        >
          <span className="text-emerald-700 font-semibold text-sm tracking-wider uppercase mb-4 block">
            CAPABILITIES
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            Powered by Advanced AI Technology
          </h2>
        </motion.div>

        {/* Main Grid Layout (3 Columns) */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          
          {/* --- ROW 1 --- */}

          {/* Top Left: NLP Intelligence (Spans 2 cols) */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-2 bg-[#F4FCF8] p-8 md:p-12 rounded-[2rem] border border-emerald-100 flex flex-col justify-between h-full min-h-[400px]"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-8">
                <FileSearch className="w-7 h-7" />
              </div>
              
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                NLP Document Intelligence
              </h3>
              
              <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
                Our advanced Natural Language Processing models analyze complex 
                legal documents, extract key information, and generate 
                comprehensive summaries. Trained on legal text using Legal-BERT for 
                maximum accuracy.
              </p>
            </div>

            {/* Anchored Loader Box */}
            <div className="mt-12 bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
              <div className="flex items-center gap-2.5 mb-4">
                <motion.div 
                  className="w-2 h-2 rounded-full bg-emerald-500"
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                />
                <span className="text-sm font-medium text-gray-600">Analyzing document...</span>
              </div>
              <div className="space-y-2.5">
                <motion.div 
                  className="h-2 bg-emerald-100 rounded-full w-full"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                />
                <motion.div 
                  className="h-2 bg-emerald-100 rounded-full w-full"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: 0.3 }}
                />
                <motion.div 
                  className="h-2 bg-emerald-100 rounded-full w-2/3"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: 0.6 }}
                />
              </div>
            </div>
          </motion.div>

          {/* Top Right: Stacked Cards (Spans 1 col) */}
          <div className="flex flex-col gap-6 lg:col-span-1">
            {/* Voice Agent */}
            <motion.div 
              variants={itemVariants}
              className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-[0_2px_15px_rgb(0,0,0,0.03)] flex flex-col justify-between h-full"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center mb-6">
                  <Mic className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  AI Voice Agent
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-8">
                  Handle client queries and appointment bookings through natural voice interaction.
                </p>
              </div>

              {/* Animated Sound Waveform */}
              <div className="flex items-end justify-center gap-1.5 h-8 mt-auto">
                {[1, 2, 3, 4, 5].map((i) => (
                  <motion.div 
                    key={i}
                    className="w-1.5 bg-blue-500 rounded-full"
                    animate={{ height: ["40%", "100%", "40%"] }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut", delay: i * 0.15 }}
                  />
                ))}
              </div>
            </motion.div>

            {/* Video Consultations */}
            <motion.div 
              variants={itemVariants}
              className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-[0_2px_15px_rgb(0,0,0,0.03)] flex flex-col justify-between h-full"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-500 flex items-center justify-center mb-6">
                  <Video className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Video Consultations
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-6">
                  Secure, scheduled video calls with automatic reminders for lawyer-client meetings.
                </p>
              </div>

              {/* Video Placeholder Area with Icon */}
              <div className="w-full bg-gray-50 rounded-2xl h-32 mt-auto flex items-center justify-center border border-gray-100">
                <Video className="w-6 h-6 text-pink-400" />
              </div>
            </motion.div>
          </div>

          {/* --- ROW 2 --- */}

          {/* Bottom Left: Predictive Deadlines (Spans 1 col) */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-1 bg-white p-8 rounded-[2rem] border border-gray-100 shadow-[0_2px_15px_rgb(0,0,0,0.03)] flex flex-col justify-start"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mb-6">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Predictive Deadlines
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              ML algorithms analyze patterns to predict deadline risks and provide early warnings.
            </p>
          </motion.div>

          {/* Bottom Right: Analytics Dashboard (Spans 2 cols) */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-2 bg-white p-8 md:p-10 rounded-[2rem] border border-gray-100 shadow-[0_2px_15px_rgb(0,0,0,0.03)] flex flex-col md:flex-row justify-between items-center gap-8"
          >
            <div className="max-w-md">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center mb-6">
                <BarChart2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Real-time Analytics Dashboard
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Comprehensive case analytics, status reports, and actionable insights to make informed decisions.
              </p>
            </div>

            {/* Animated Bar Chart Graphic */}
            <div className="flex items-end gap-2 h-24 w-full md:w-auto justify-center md:justify-end flex-shrink-0 mt-6 md:mt-0">
              {[40, 70, 45, 90, 60, 85, 100].map((height, i) => (
                <motion.div 
                  key={i}
                  className="w-4 sm:w-6 bg-purple-200 rounded-t-md"
                  initial={{ height: "20%" }}
                  animate={{ height: `${height}%` }}
                  transition={{ 
                    duration: 1.5, 
                    ease: "easeOut",
                    delay: 0.5 + (i * 0.1) // Staggered entrance
                  }}
                />
              ))}
            </div>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
};

export default CapabilitiesSection;