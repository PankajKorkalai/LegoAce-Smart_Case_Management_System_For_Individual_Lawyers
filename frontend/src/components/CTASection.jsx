import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const CTASection = () => {
  // Framer Motion variants for staggered entry
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const guarantees = [
    "No credit card required",
    "14-day free trial",
    "Cancel anytime",
    "24/7 support"
  ];

  return (
    <div className="relative w-full bg-white py-24 lg:py-32 overflow-hidden font-sans border-b border-gray-100">
      
      {/* Subtle Background Glow */}
      <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
        <div className="w-[800px] h-[400px] bg-emerald-50/60 rounded-[100%] blur-[100px]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          {/* Main Heading */}
          <motion.h2 
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight leading-tight"
          >
            Ready to Transform <br className="hidden sm:block" />
            Your Legal Practice?
          </motion.h2>

          {/* Subheading text */}
          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Join thousands of legal professionals who trust LegalFlow AI to manage their cases efficiently and never miss a deadline.
          </motion.p>

          {/* Action Buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#047857] text-white font-semibold hover:bg-emerald-800 transition-all duration-200 shadow-md hover:shadow-lg">
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-gray-900 font-semibold border border-gray-200 hover:bg-gray-50 transition-all duration-200 shadow-sm">
              Schedule a Demo
            </button>
          </motion.div>

          {/* Guarantees List */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4"
          >
            {guarantees.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" strokeWidth={2} />
                <span className="text-sm font-medium text-gray-600">{item}</span>
              </div>
            ))}
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
};

export default CTASection;