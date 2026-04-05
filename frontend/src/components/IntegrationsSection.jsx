import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Mail, 
  Cloud, 
  FileText, 
  Lock, 
  Database, 
  Smartphone, 
  Globe 
} from 'lucide-react';

const IntegrationsSection = () => {
  // Framer Motion variants for scroll animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };

  const integrations = [
    {
      title: "Google Calendar",
      description: "Sync hearings & deadlines",
      icon: Calendar,
      iconColor: "text-red-500",
      iconBg: "bg-red-50"
    },
    {
      title: "Outlook",
      description: "Email & calendar sync",
      icon: Mail,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-50"
    },
    {
      title: "Cloud Storage",
      description: "Google Drive & Dropbox",
      icon: Cloud,
      iconColor: "text-sky-500",
      iconBg: "bg-sky-50"
    },
    {
      title: "Court Filing",
      description: "E-filing integration",
      icon: FileText,
      iconColor: "text-emerald-500",
      iconBg: "bg-emerald-50"
    },
    {
      title: "OAuth 2.0",
      description: "Secure authentication",
      icon: Lock,
      iconColor: "text-amber-500",
      iconBg: "bg-amber-50"
    },
    {
      title: "PostgreSQL",
      description: "Enterprise database",
      icon: Database,
      iconColor: "text-indigo-500",
      iconBg: "bg-indigo-50"
    },
    {
      title: "Mobile Apps",
      description: "iOS & Android ready",
      icon: Smartphone,
      iconColor: "text-pink-500",
      iconBg: "bg-pink-50"
    },
    {
      title: "REST API",
      description: "Custom integrations",
      icon: Globe,
      iconColor: "text-purple-500",
      iconBg: "bg-purple-50"
    }
  ];

  return (
    <div className="w-full bg-white py-24 font-sans border-b border-gray-100">
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
            INTEGRATIONS
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            Works With Your Favorite Tools
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Seamlessly connect LegalFlow AI with the tools you already use for a unified workflow.
          </p>
        </motion.div>

        {/* Integrations Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          {integrations.map((integration, index) => {
            const Icon = integration.icon;
            return (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 flex flex-col items-center text-center group cursor-pointer"
              >
                {/* Icon Container with hover scale effect */}
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${integration.iconBg} ${integration.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-8 h-8" strokeWidth={1.5} />
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {integration.title}
                </h3>
                
                <p className="text-sm text-gray-500">
                  {integration.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </div>
  );
};

export default IntegrationsSection;