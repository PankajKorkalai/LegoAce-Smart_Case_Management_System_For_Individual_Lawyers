import React, { useState } from 'react';
import { 
  FiMenu, 
  FiX, 
  FiChevronDown, 
  FiCheck, 
  FiArrowRight, 
  FiZap, 
  FiSmartphone, 
  FiSearch, 
  FiActivity,      // Fixed: Replaced FiGauge with FiActivity
  FiBarChart2, 
  FiGlobe,
  FiStar,
  FiTwitter,
  FiLinkedin,
  FiGithub
} from 'react-icons/fi';
import { MdDragHandle } from 'react-icons/md';
import HeroSection from '../components/HeroSection';
import StatsAndTrust from '../components/StatsAndTrust';
import FeaturesSection from '../components/FeaturesSection';
import HowItWorksSection from '../components/HowItWorksSection';
import CapabilitiesSection from '../components/CapabilitiesSectio';
import IntegrationsSection from '../components/IntegrationsSection';
import TestimonialsSection from '../components/TestimonialsSection';
import PricingSection from '../components/PricingSection';

const Home = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const features = [
    { 
      icon: MdDragHandle, 
      title: "Drag & Drop Builder", 
      description: "Build your perfect layout with an intuitive visual editor. No coding required." 
    },
    { 
      icon: FiSmartphone, 
      title: "Responsive Design", 
      description: "Your homepage looks stunning on any device, from mobile to desktop." 
    },
    { 
      icon: FiSearch, 
      title: "SEO Optimized", 
      description: "Built-in SEO tools help you rank higher and attract more visitors." 
    },
    { 
      icon: FiActivity,      // Fixed icon
      title: "Lightning Fast", 
      description: "Optimized performance ensures your page loads in an instant." 
    },
    { 
      icon: FiBarChart2, 
      title: "Analytics Ready", 
      description: "Connect with Google Analytics and track your visitor behavior." 
    },
    { 
      icon: FiGlobe, 
      title: "Custom Domains", 
      description: "Use your own domain name for a professional, branded experience." 
    }
  ];

  const templates = [
    { 
      name: "Business", 
      image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", 
      description: "Corporate & professional" 
    },
    { 
      name: "Portfolio", 
      image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", 
      description: "Showcase your work" 
    },
    { 
      name: "Landing Page", 
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", 
      description: "High conversion design" 
    },
    { 
      name: "Coming Soon", 
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80", 
      description: "Build anticipation" 
    }
  ];

  const pricing = [
    { 
      name: "Basic", 
      price: "$0", 
      description: "Perfect for getting started", 
      features: ["1 homepage", "Basic components", "Responsive design", "Community support"], 
      cta: "Start Free", 
      popular: false 
    },
    { 
      name: "Pro", 
      price: "$29", 
      description: "For professionals and teams", 
      features: ["Unlimited homepages", "All components", "Custom domains", "Analytics integration", "Priority support"], 
      cta: "Start Free Trial", 
      popular: true 
    },
    { 
      name: "Enterprise", 
      price: "Custom", 
      description: "For large organizations", 
      features: ["Everything in Pro", "SLA guarantee", "Custom development", "Dedicated support", "Team management"], 
      cta: "Contact Sales", 
      popular: false 
    }
  ];

  const testimonials = [
    { 
      name: "Sarah Johnson", 
      role: "Marketing Director", 
      content: "This platform transformed how we create landing pages. We've seen a 40% increase in conversions since switching.", 
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" 
    },
    { 
      name: "David Chen", 
      role: "Startup Founder", 
      content: "The drag-and-drop builder is incredibly intuitive. I built our entire homepage in under an hour without any code.", 
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" 
    },
    { 
      name: "Emily Rodriguez", 
      role: "Freelance Designer", 
      content: "Best tool for creating client homepages. The templates are gorgeous and the customization options are endless.", 
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" 
    }
  ];

  const faqs = [
    { 
      question: "How does the builder work?", 
      answer: "Our drag-and-drop builder lets you add, remove, and arrange elements visually. Just click, drag, and drop components onto your page. No coding knowledge required." 
    },
    { 
      question: "Can I use my own domain?", 
      answer: "Yes! All Pro and Enterprise plans include custom domain support. You can easily connect your domain through our simple DNS configuration guide." 
    },
    { 
      question: "Do you offer customer support?", 
      answer: "Absolutely. We provide 24/7 email support for all plans, with priority phone and chat support for Enterprise customers." 
    },
    { 
      question: "What is your refund policy?", 
      answer: "We offer a 30-day money-back guarantee on all paid plans. If you're not satisfied, contact us for a full refund." 
    }
  ];

  return (
    <>
      <HeroSection/>
      <StatsAndTrust/>
      <FeaturesSection/>
      <HowItWorksSection/>
      <CapabilitiesSection/>
      <IntegrationsSection/>
      <TestimonialsSection/>
      <PricingSection/>
    </>
  );
};

export default Home;