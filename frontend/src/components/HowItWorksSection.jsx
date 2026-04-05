import React from 'react';
import { motion } from 'framer-motion';
import { 
  UserPlus, 
  FolderOpen, 
  Brain, 
  Bell, 
  LayoutDashboard 
} from 'lucide-react';

const HowItWorksSection = () => {
  // Framer Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: "easeOut" } 
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.7, ease: "easeOut" } 
    },
  };

  const steps = [
    {
      number: "01",
      title: "Register & Login",
      description: "Create your account securely and access the platform based on your assigned role.",
      icon: UserPlus,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-100",
    },
    {
      number: "02",
      title: "Manage Cases",
      description: "Track cases, tasks, and court deadlines. Upload and organize legal documents effortlessly.",
      icon: FolderOpen,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
    },
    {
      number: "03",
      title: "AI Analysis",
      description: "Our AI predicts deadline risks, prioritizes tasks, and NLP summarizes documents automatically.",
      icon: Brain,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-100",
    },
    {
      number: "04",
      title: "Smart Alerts",
      description: "Receive intelligent notifications for upcoming deadlines, hearings, and important updates.",
      icon: Bell,
      iconColor: "text-amber-600",
      iconBg: "bg-amber-100",
    },
    {
      number: "05",
      title: "Dashboard Insights",
      description: "View comprehensive case analytics, status reports, and actionable insights all in one place.",
      icon: LayoutDashboard,
      iconColor: "text-pink-600",
      iconBg: "bg-pink-100",
    }
  ];

  return (
    <div className="relative w-full bg-white py-24 overflow-hidden font-sans border-b border-gray-100">
      
      {/* Subtle Background Grid Pattern */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.02]" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm39 39V1H1v38h38z' fill='%23000' fill-rule='evenodd'/%3E%3C/svg%3E")`
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div 
          className="text-center mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={headerVariants}
        >
          <span className="text-emerald-700 font-semibold text-sm tracking-wider uppercase mb-4 block">
            HOW IT WORKS
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            Simple Steps to Transform Your Practice
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get started in minutes and experience the power of AI-driven legal case management.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-10 lg:gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div 
                key={index} 
                variants={itemVariants}
                className="flex flex-col items-center text-center group"
              >
                {/* Icon Container with Overlapping Badge */}
                <div className="relative mb-8">
                  <div className={`w-20 h-20 rounded-3xl flex items-center justify-center ${step.iconBg} ${step.iconColor} group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                    <Icon className="w-8 h-8" strokeWidth={2} />
                  </div>
                  
                  {/* The numbered circle badge */}
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-emerald-800 text-white text-xs font-bold flex items-center justify-center shadow-md border-2 border-white">
                    {step.number}
                  </div>
                </div>

                {/* Text Content */}
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed px-2">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </div>
  );
};

export default HowItWorksSection;