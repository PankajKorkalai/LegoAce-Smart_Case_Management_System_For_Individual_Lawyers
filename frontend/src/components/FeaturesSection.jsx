import React from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  Brain, 
  FileText, 
  MessageSquare, 
  Video, 
  Bell, 
  Calendar, 
  Shield 
} from 'lucide-react';

const FeaturesSection = () => {
  // Framer Motion variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Time between each card animating in
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
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

  const features = [
    {
      title: "Smart Case Management",
      description: "Centralized dashboard for all your cases with intelligent organization and quick access to critical information.",
      icon: Briefcase,
      iconColor: "text-emerald-500",
      iconBg: "bg-emerald-100"
    },
    {
      title: "AI-Powered Analytics",
      description: "Predictive insights and case outcome analysis powered by advanced machine learning algorithms.",
      icon: Brain,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-100"
    },
    {
      title: "Document Analysis",
      description: "NLP-powered document summarization and key information extraction for faster review.",
      icon: FileText,
      iconColor: "text-amber-500",
      iconBg: "bg-amber-100"
    },
    {
      title: "AI Legal Assistant",
      description: "24/7 chatbot support for legal queries, research assistance, and case information retrieval.",
      icon: MessageSquare,
      iconColor: "text-purple-500",
      iconBg: "bg-purple-100"
    },
    {
      title: "Video Consultations",
      description: "Built-in video calling for seamless client consultations and remote court appearances.",
      icon: Video,
      iconColor: "text-pink-500",
      iconBg: "bg-pink-100"
    },
    {
      title: "Smart Reminders",
      description: "Never miss a deadline with automated hearing reminders and case milestone notifications.",
      icon: Bell,
      iconColor: "text-rose-500",
      iconBg: "bg-rose-100"
    },
    {
      title: "Court Calendar Sync",
      description: "Automatic synchronization with court calendars and hearing schedules across jurisdictions.",
      icon: Calendar,
      iconColor: "text-indigo-500",
      iconBg: "bg-indigo-100"
    },
    {
      title: "Bank-Grade Security",
      description: "End-to-end encryption and compliance with legal industry data protection standards.",
      icon: Shield,
      iconColor: "text-slate-600",
      iconBg: "bg-slate-100"
    }
  ];

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
          <span className="text-emerald-600 font-semibold text-sm tracking-wider uppercase mb-4 block">
            FEATURES
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            Everything You Need to Manage Legal Cases
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            From case tracking to AI-powered insights, our platform provides all the tools
            modern legal professionals need to work smarter.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div 
                key={index} 
                variants={itemVariants}
                className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 group"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${feature.iconBg} ${feature.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </div>
  );
};

export default FeaturesSection;