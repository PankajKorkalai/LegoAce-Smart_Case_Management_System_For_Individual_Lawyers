import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Rocket, Building2, Check, Sparkles } from 'lucide-react';

const PricingSection = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };

  const plans = [
    {
      name: "Starter",
      target: "Perfect for solo practitioners",
      price: "Free",
      period: "forever",
      icon: Zap,
      color: "emerald",
      badge: null,
      features: [
        "Up to 10 active cases",
        "Basic document storage (1GB)",
        "Email notifications",
        "Standard support",
        "Single user access"
      ],
      buttonText: "Get Started",
      isPopular: false
    },
    {
      name: "Professional",
      target: "Ideal for small law firms",
      price: "₹2,999",
      period: "/month",
      icon: Rocket,
      color: "blue",
      badge: "Most Popular",
      features: [
        "Unlimited active cases",
        "Document storage (50GB)",
        "AI document analysis",
        "Hearing reminders & calendar sync",
        "Video consultations",
        "Priority support",
        "Up to 5 users"
      ],
      buttonText: "Start Free Trial",
      isPopular: true
    },
    {
      name: "Enterprise",
      target: "For large firms & organizations",
      price: "Custom",
      period: "pricing",
      icon: Building2,
      color: "purple",
      badge: null,
      features: [
        "Everything in Professional",
        "Unlimited document storage",
        "Advanced AI analytics",
        "Custom integrations",
        "Dedicated account manager",
        "24/7 premium support",
        "Unlimited users",
        "On-premise deployment option"
      ],
      buttonText: "Contact Sales",
      isPopular: false
    }
  ];

  // Helper function to map color names to Tailwind classes
  const getColorClasses = (color, isPopular) => {
    const maps = {
      emerald: {
        wrapper: "border-emerald-200 bg-emerald-50/30",
        iconBg: "bg-emerald-100 text-emerald-600",
        checkBg: "bg-emerald-100 text-emerald-600",
      },
      blue: {
        wrapper: "border-blue-300 bg-blue-50/30 shadow-[0_8px_30px_rgb(37,99,235,0.1)] relative scale-105 z-10",
        iconBg: "bg-blue-100 text-blue-600",
        checkBg: "bg-blue-100 text-blue-600",
      },
      purple: {
        wrapper: "border-purple-200 bg-purple-50/30",
        iconBg: "bg-purple-100 text-purple-600",
        checkBg: "bg-purple-100 text-purple-600",
      }
    };
    return maps[color];
  };

  return (
    <div className="w-full bg-gray-50 py-24 font-sans border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div 
          className="text-center mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={headerVariants}
        >
          <span className="text-emerald-700 font-semibold text-sm tracking-wider uppercase mb-4 block">
            PRICING
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the plan that fits your practice. All plans include a 14-day free trial.
          </p>
        </motion.div>

        {/* Pricing Cards Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            const colors = getColorClasses(plan.color, plan.isPopular);
            
            return (
              <motion.div 
                key={index}
                variants={itemVariants}
                className={`flex flex-col h-full rounded-[2rem] border p-8 md:p-10 ${colors.wrapper}`}
              >
                {/* Most Popular Badge */}
                {plan.isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#2563EB] text-white px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 shadow-md">
                    <Sparkles className="w-4 h-4" />
                    {plan.badge}
                  </div>
                )}

                {/* Plan Header */}
                <div className="mb-8">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${colors.iconBg}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-sm text-gray-500">{plan.target}</p>
                </div>

                {/* Price */}
                <div className="mb-8 flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-gray-900 tracking-tight">
                    {plan.price}
                  </span>
                  <span className="text-gray-500 font-medium">
                    {plan.period}
                  </span>
                </div>

                {/* Features List */}
                <ul className="space-y-4 mb-10 flex-grow">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${colors.checkBg}`}>
                        <Check className="w-3.5 h-3.5" strokeWidth={3} />
                      </div>
                      <span className="text-gray-600 text-sm leading-tight pt-0.5">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Call to Action Button */}
                <button 
                  className={`w-full py-4 px-6 rounded-2xl font-bold text-sm transition-all duration-200 ${
                    plan.isPopular 
                      ? "bg-[#2563EB] text-white hover:bg-blue-700 shadow-md hover:shadow-lg" 
                      : "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                  }`}
                >
                  {plan.buttonText}
                </button>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Footer Guarantee */}
        <motion.p 
          className="text-center text-sm text-gray-500 mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          All paid plans come with a 30-day money-back guarantee. No questions asked.
        </motion.p>

      </div>
    </div>
  );
};

export default PricingSection;