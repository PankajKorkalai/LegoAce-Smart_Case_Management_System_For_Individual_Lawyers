import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const TestimonialsSection = () => {
  // Framer Motion variants for scroll animations
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

  const testimonials = [
    {
      quote: "LegalFlow AI has completely transformed how we manage our caseload. The AI document analysis saves us hours every week.",
      name: "Priya Sharma",
      title: "Senior Partner, Sharma & Associates",
      initials: "PS"
    },
    {
      quote: "The predictive deadline feature is a game-changer. We have not missed a single court date since implementing this system.",
      name: "Rajesh Kumar",
      title: "Legal Counsel, Tech Corp India",
      initials: "RK"
    },
    {
      quote: "My clients love the video consultation feature. It makes remote meetings seamless and professional.",
      name: "Anjali Mehta",
      title: "Family Law Attorney, Mehta Legal Services",
      initials: "AM"
    },
    {
      quote: "The AI chatbot handles routine client queries efficiently, freeing up our team to focus on complex legal work.",
      name: "Vikram Singh",
      title: "Managing Partner, Singh Law Firm",
      initials: "VS"
    },
    {
      quote: "Outstanding document management and the NLP summaries are incredibly accurate. Highly recommended for any law firm.",
      name: "Neha Patel",
      title: "Corporate Lawyer, Patel & Partners",
      initials: "NP"
    },
    {
      quote: "The dashboard insights help us make data-driven decisions about case prioritization. Truly innovative platform.",
      name: "Arjun Reddy",
      title: "Litigation Head, Reddy Legal Associates",
      initials: "AR"
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
          <span className="text-emerald-700 font-semibold text-sm tracking-wider uppercase mb-4 block">
            TESTIMONIALS
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            Trusted by Legal Professionals
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See what lawyers and law firms are saying about LegalFlow AI.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-shadow duration-300 flex flex-col h-full"
            >
              {/* Quote Icon */}
              <Quote className="w-10 h-10 text-emerald-100 fill-emerald-50 mb-6" strokeWidth={1} />
              
              {/* Star Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              
              {/* Review Text */}
              <p className="text-gray-700 leading-relaxed mb-8 flex-grow">
                "{testimonial.quote}"
              </p>
              
              {/* User Info Profile */}
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700 font-bold text-sm shrink-0">
                  {testimonial.initials}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{testimonial.name}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{testimonial.title}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </div>
  );
};

export default TestimonialsSection;