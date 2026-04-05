import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

// Sub-component for individual FAQ items
const AccordionItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="border border-gray-200 rounded-2xl bg-white overflow-hidden transition-all duration-200 hover:border-emerald-200">
      <button
        className="w-full text-left px-6 py-6 flex items-center justify-between focus:outline-none"
        onClick={onClick}
      >
        <span className="font-bold text-gray-900 pr-8">{question}</span>
        
        {/* Toggle Icon */}
        <div 
          className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
            isOpen 
              ? 'bg-emerald-700 text-white' 
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        </div>
      </button>

      {/* Animated Answer Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-6 pb-6 text-gray-600 leading-relaxed text-sm md:text-base">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQSection = () => {
  // We keep track of which accordion item is currently open. 
  // Initializing with '0' so the first item is open by default.
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "What is LegalFlow AI and how can it help my law firm?",
      answer: "LegalFlow AI is an intelligent legal case management system that uses AI to help lawyers manage cases, documents, deadlines, and client communications. It features NLP-powered document analysis, predictive deadline alerts, AI chatbot, voice agent for appointments, and video consultations - all in one platform."
    },
    {
      question: "Is my data secure on LegalFlow AI?",
      answer: "Yes, absolute security is our priority. We use bank-grade AES-256 encryption, maintain SOC 2 compliance, and provide end-to-end encryption for all video consultations and document storage to ensure your sensitive legal data is fully protected."
    },
    {
      question: "How does the AI document analysis work?",
      answer: "Our advanced NLP (Natural Language Processing) models trained specifically on legal texts scan your uploaded documents. They automatically extract key clauses, entities, and dates, generating comprehensive summaries and highlighting potential risks to save you hours of manual review."
    },
    {
      question: "Can I integrate LegalFlow AI with my existing tools?",
      answer: "Absolutely. LegalFlow AI offers seamless integrations with the tools you already use, including Google Calendar, Outlook, Google Drive, Dropbox, and specific e-filing systems. We also provide a secure REST API for custom integrations."
    },
    {
      question: "What kind of support do you offer?",
      answer: "We provide 24/7 email and chat support for all standard users. Professional and Enterprise plans include priority response times, and Enterprise users get access to a dedicated account manager and premium phone support."
    },
    {
      question: "Is there a free trial available?",
      answer: "Yes, all of our paid plans come with a 14-day free trial so you can experience the full power of the platform. We also offer a 30-day money-back guarantee, no questions asked."
    }
  ];

  // Framer Motion variants for staggered entry of the list items
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div className="w-full bg-white py-24 font-sans">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={headerVariants}
        >
          <span className="text-emerald-700 font-semibold text-sm tracking-wider uppercase mb-4 block">
            FAQ
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600">
            Got questions? We have answers. If you don't find what you're looking for, contact our support team.
          </p>
        </motion.div>

        {/* FAQ Accordion List */}
        <motion.div 
          className="space-y-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          {faqs.map((faq, index) => (
            <motion.div key={index} variants={itemVariants}>
              <AccordionItem
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
              />
            </motion.div>
          ))}
        </motion.div>

      </div>
    </div>
  );
};

export default FAQSection;