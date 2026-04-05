import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Play, 
  Star, 
  FileText, 
  Scale, 
  Users, 
  Calendar, 
  TrendingUp, 
  Bell 
} from 'lucide-react';

const HeroSection = () => {
  // Animation variants for the left column (staggered entry)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: "easeOut" } 
    },
  };

  return (
    <div className="relative min-h-screen bg-white overflow-hidden font-sans">
      {/* Background Grid Pattern */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03]" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm39 39V1H1v38h38z' fill='%23000' fill-rule='evenodd'/%3E%3C/svg%3E")`
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 relative z-10">
        <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
          
          {/* Left Column: Text Content */}
          <motion.div 
            className="lg:col-span-6 text-left"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Top Badge */}
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 font-medium text-sm mb-8">
              <Sparkles className="w-4 h-4" />
              AI-Powered Legal Management
            </motion.div>

            {/* Main Heading */}
            <motion.h1 variants={itemVariants} className="text-5xl lg:text-7xl font-bold text-gray-900 tracking-tight leading-[1.1] mb-6">
              The Future of <br className="hidden lg:block" />
              <span className="text-emerald-700">Legal Practice</span> <br className="hidden lg:block" />
              is Here
            </motion.h1>

            {/* Subheading */}
            <motion.p variants={itemVariants} className="text-lg lg:text-xl text-gray-600 mb-8 max-w-2xl leading-relaxed">
              Streamline case management, automate document analysis, 
              and never miss a deadline. LegalFlow AI empowers lawyers 
              with cutting-edge technology.
            </motion.p>

            {/* Feature Tags */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-3 mb-10">
              {['AI Document Analysis', 'Smart Scheduling', 'Voice Assistant', 'Predictive Insights'].map((feature) => (
                <div key={feature} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 text-gray-600 text-sm border border-gray-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  {feature}
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mb-12">
              <button className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-emerald-700 text-white font-semibold hover:bg-emerald-800 transition-colors">
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-gray-900 font-semibold border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm">
                <Play className="w-5 h-5 fill-current" />
                Watch Demo
              </button>
            </motion.div>

            {/* Social Proof */}
            <motion.div variants={itemVariants} className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {['A', 'B', 'C', 'D', 'E'].map((letter, i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                    {letter}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  Trusted by 10,000+ legal professionals
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Floating Widgets */}
          <div className="lg:col-span-6 relative mt-16 lg:mt-0 h-[600px] hidden md:block">
            
            {/* Green Badge (Top Leftish) */}
            <motion.div 
              className="absolute top-10 left-10 z-20"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <motion.div 
                className="bg-emerald-500 text-white px-4 py-2 rounded-full font-medium flex items-center gap-2 shadow-lg shadow-emerald-500/20"
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              >
                <CheckCircle2 className="w-4 h-4" />
                Document analyzed!
              </motion.div>
            </motion.div>

            {/* AI Analysis Card (Top Right) */}
            <motion.div 
              className="absolute top-0 right-0 z-20 w-64"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <motion.div 
                className="bg-white p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100"
                animate={{ y: [0, -12, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.5 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">AI Analysis</h4>
                    <p className="text-xs text-gray-500">Contract Review</p>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>
                <p className="text-xs text-gray-500 text-right">78% Complete</p>
              </motion.div>
            </motion.div>

            {/* Main Center Card (Case Overview) */}
            <motion.div 
              className="absolute top-1/4 right-20 z-10 w-80"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <motion.div 
                className="bg-white p-6 rounded-3xl shadow-[0_20px_50px_rgb(0,0,0,0.1)] border border-gray-100"
                animate={{ y: [0, -15, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-semibold text-gray-900 text-lg">Case Overview</h3>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-600 text-xs font-medium rounded-full">Live</span>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <Scale className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Active Cases</p>
                        <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full font-medium">+3 this week</span>
                      </div>
                    </div>
                    <span className="text-2xl font-bold text-gray-900">24</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Total Clients</p>
                        <p className="text-xs text-gray-500">+12 new</p>
                      </div>
                    </div>
                    <span className="text-2xl font-bold text-gray-900">156</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Next Hearing Card (Bottom Leftish) */}
            <motion.div 
              className="absolute bottom-20 left-4 z-20 w-64"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <motion.div 
                className="bg-white p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100"
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 1 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-500">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <h4 className="font-semibold text-gray-900 text-sm">Next Hearing</h4>
                </div>
                <p className="text-sm text-gray-600 mb-2">Smith vs. Johnson Corp</p>
                <div className="flex items-center gap-1.5 text-rose-500 text-xs font-medium">
                  <Bell className="w-3.5 h-3.5" />
                  Tomorrow, 9:00 AM
                </div>
              </motion.div>
            </motion.div>

            {/* Efficiency Chart Card (Bottom Right) */}
            <motion.div 
              className="absolute bottom-5 right-0 z-20 w-56"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <motion.div 
                className="bg-white p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100"
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut", delay: 0.2 }}
              >
                <div className="flex items-center gap-2 mb-4 text-emerald-500 text-sm font-medium">
                  <TrendingUp className="w-4 h-4" />
                  +23% efficiency
                </div>
                {/* Mock Bar Chart */}
                <div className="flex items-end justify-between gap-2 h-16">
                  {[40, 60, 45, 80, 50, 75, 90, 65, 85].map((height, i) => (
                    <motion.div 
                      key={i} 
                      className="w-full bg-emerald-500 rounded-t-sm" 
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ duration: 0.8, delay: 0.8 + (i * 0.1) }}
                    ></motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;