import React from 'react';
import { 
  Shield, 
  Lock, 
  FileCheck, 
  Clock, 
  Users, 
  Award,
  Briefcase,
  FileText
} from 'lucide-react';

const StatsAndTrust = () => {
  // Data for the top Stats section
  const stats = [
    {
      value: "$5.9B",
      highlight: "Projected Market Size by 2033",
      description: "Legal case management software market growth"
    },
    {
      value: "12%",
      highlight: "Annual Growth Rate",
      description: "CAGR driven by AI adoption in law firms"
    },
    {
      value: "300%",
      highlight: "Efficiency Increase",
      description: "With AI-powered document analysis"
    },
    {
      value: "Zero",
      highlight: "Missed Deadlines",
      description: "With automated reminder system"
    }
  ];

  // Data for the Trust & Secure section
  const trustFeatures = [
    {
      icon: Shield,
      title: "SOC 2 Compliant",
      subtitle: "Enterprise security",
      iconColor: "text-emerald-500",
      bgColor: "bg-emerald-50"
    },
    {
      icon: Lock,
      title: "AES-256 Encryption",
      subtitle: "Bank-grade security",
      iconColor: "text-blue-500",
      bgColor: "bg-blue-50"
    },
    {
      icon: FileCheck,
      title: "GDPR Ready",
      subtitle: "Data protection",
      iconColor: "text-purple-500",
      bgColor: "bg-purple-50"
    },
    {
      icon: Clock,
      title: "99.9% Uptime",
      subtitle: "Always available",
      iconColor: "text-amber-500",
      bgColor: "bg-amber-50"
    },
    {
      icon: Users,
      title: "5000+ Users",
      subtitle: "Trusted globally",
      iconColor: "text-pink-500",
      bgColor: "bg-pink-50"
    },
    {
      icon: Award,
      title: "Award Winning",
      subtitle: "LegalTech 2024",
      iconColor: "text-indigo-500",
      bgColor: "bg-indigo-50"
    }
  ];

  // NEW: Data for the Dashboard section
  const dashboardStats = [
    {
      title: "Active Cases",
      value: "24",
      subtext: "+3 from last month",
      subtextColor: "text-emerald-500",
      icon: Briefcase,
      iconColor: "text-emerald-500",
      iconBg: "bg-emerald-100"
    },
    {
      title: "Total Clients",
      value: "156",
      subtext: "+12 new clients",
      subtextColor: "text-blue-500",
      icon: Users,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-100"
    },
    {
      title: "Documents",
      value: "1247",
      subtext: "89 pending review",
      subtextColor: "text-gray-500",
      icon: FileText,
      iconColor: "text-amber-500",
      iconBg: "bg-amber-100"
    },
    {
      title: "Upcoming Hearings",
      value: "8",
      subtext: "2 this week",
      subtextColor: "text-gray-500",
      icon: Clock,
      iconColor: "text-pink-500",
      iconBg: "bg-pink-100"
    }
  ];

  return (
    <div className="w-full font-sans">
      
      {/* 1. Top Section: Stats */}
      <div className="bg-white py-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className={`flex flex-col ${
                  index !== 0 ? 'lg:border-l lg:border-gray-200 lg:pl-8' : 'lg:pr-8'
                }`}
              >
                <span className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">
                  {stat.value}
                </span>
                <span className="text-sm font-medium text-emerald-700 mb-1">
                  {stat.highlight}
                </span>
                <span className="text-sm text-gray-500">
                  {stat.description}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Middle Section: Trusted & Secure Platform */}
      <div className="bg-gray-50 py-16 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-bold text-center text-gray-900 mb-12">
            Trusted & Secure Platform
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-8 gap-y-10">
            {trustFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex flex-col items-center text-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${feature.bgColor} ${feature.iconColor}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {feature.subtitle}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. NEW Bottom Section: Dashboard Practice at a Glance */}
      <div className="bg-white py-24 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Section Headers */}
          <h3 className="text-emerald-700 font-semibold text-sm tracking-wider uppercase mb-4">
            Dashboard
          </h3>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            Your Legal Practice at a Glance
          </h2>
          <p className="text-lg text-gray-600 mb-16 max-w-2xl mx-auto">
            Get real-time insights into your caseload, clients, and upcoming deadlines.
          </p>

          {/* Dashboard Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {dashboardStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={index} 
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow duration-300"
                >
                  <div className="flex justify-between items-start mb-6">
                    <h4 className="text-gray-600 text-sm font-medium">{stat.title}</h4>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stat.iconBg} ${stat.iconColor}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-3">
                    {stat.value}
                  </div>
                  <div className={`text-sm ${stat.subtextColor}`}>
                    {stat.subtext}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>

    </div>
  );
};

export default StatsAndTrust;