import { Link } from "react-router-dom";
import {
  Scale,
  ArrowRight,
  User,
  Briefcase,
  Users,
  FileText,
  Clock,
  Sparkles,
  Check,
  Shield,
  TrendingUp,
  Calendar,
  MessageSquare,
  ChevronRight,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-green-600 text-white p-2 rounded-lg">
              <Scale size={24} />
            </div>
            <span className="text-xl font-bold text-white">LegoAce</span>
          </div>
          <Link
            to="/login"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-2">
            <Sparkles size={16} className="text-green-400" />
            <span className="text-sm font-medium text-green-400">AI-Powered Legal Management</span>
          </div>

          {/* Main Heading */}
          <div>
            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Your Complete Legal Workspace
              <span className="block bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                Simplified
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Manage cases, clients, and documents. Track deadlines. Conduct video consultations. Get AI-powered legal insights—all in one intuitive platform designed for modern lawyers.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-green-500/50"
            >
              Get Started <ArrowRight size={20} />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 px-8 py-4 rounded-xl font-semibold transition-colors"
            >
              <User size={20} /> Sign In
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-12 border-t border-gray-700">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">500+</div>
              <div className="text-gray-400 text-sm mt-1">Active Lawyers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">10K+</div>
              <div className="text-gray-400 text-sm mt-1">Cases Managed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">99.9%</div>
              <div className="text-gray-400 text-sm mt-1">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Powerful Features</h2>
          <p className="text-gray-400 text-lg">Everything you need to run your legal practice efficiently</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 hover:border-green-500/50 transition-all hover:bg-gray-800/70">
            <div className="bg-green-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Briefcase className="text-green-400" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Case Management</h3>
            <p className="text-gray-400">Track all your cases in one organized dashboard. Monitor status, priority, and deadlines at a glance.</p>
          </div>

          {/* Feature 2 */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 hover:border-green-500/50 transition-all hover:bg-gray-800/70">
            <div className="bg-green-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Users className="text-green-400" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Client Management</h3>
            <p className="text-gray-400">Maintain detailed client profiles with contact info, case history, and communication logs.</p>
          </div>

          {/* Feature 3 */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 hover:border-green-500/50 transition-all hover:bg-gray-800/70">
            <div className="bg-green-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <FileText className="text-green-400" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Document Hub</h3>
            <p className="text-gray-400">Upload, organize, and manage legal documents with AI-powered analysis and extraction.</p>
          </div>

          {/* Feature 4 */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 hover:border-green-500/50 transition-all hover:bg-gray-800/70">
            <div className="bg-green-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Calendar className="text-green-400" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Smart Calendar</h3>
            <p className="text-gray-400">Never miss a deadline. Schedule and track hearings, meetings, and important dates.</p>
          </div>

          {/* Feature 5 */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 hover:border-green-500/50 transition-all hover:bg-gray-800/70">
            <div className="bg-green-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <MessageSquare className="text-green-400" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">AI Legal Assistant</h3>
            <p className="text-gray-400">Get instant legal insights, research, and strategic recommendations powered by AI.</p>
          </div>

          {/* Feature 6 */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 hover:border-green-500/50 transition-all hover:bg-gray-800/70">
            <div className="bg-green-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="text-green-400" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Analytics & Insights</h3>
            <p className="text-gray-400">Track case outcomes, client metrics, and practice productivity with detailed dashboards.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-gray-400 text-lg">Get started in minutes</p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {[
            { step: 1, title: "Sign Up", desc: "Create your account in seconds" },
            { step: 2, title: "Add Cases", desc: "Create and organize your legal cases" },
            { step: 3, title: "Manage Data", desc: "Upload documents and client info" },
            { step: 4, title: "Collaborate", desc: "Use AI and analytics to work smarter" },
          ].map((item, idx) => (
            <div key={idx} className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                {item.step}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-2xl p-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-8">Why Choose LegoAce?</h2>
              <div className="space-y-4">
                {[
                  "Centralized case and client management",
                  "AI-powered legal insights and research",
                  "Secure document storage and analysis",
                  "Automated deadline and hearing reminders",
                  "Easy team collaboration and sharing",
                  "Beautiful, intuitive user interface",
                ].map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className="text-green-400 mt-1 flex-shrink-0" size={20} />
                    <p className="text-gray-200">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-500/30 to-emerald-500/30 rounded-xl p-8 border border-green-500/50">
              <div className="space-y-6 text-center">
                <div>
                  <div className="text-4xl font-bold text-green-400">⚖️</div>
                  <p className="text-gray-300 mt-3">"LegoAce transformed how I manage my practice. Saves me hours every week."</p>
                  <p className="text-gray-400 text-sm mt-2">— Sarah Johnson, Family Law Attorney</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Simple Pricing</h2>
          <p className="text-gray-400 text-lg">Transparent pricing for all practice sizes</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { name: "Solo", price: "$49", features: ["Up to 50 cases", "Basic documents", "Calendar & reminders", "Email support"] },
            { name: "Professional", price: "$99", features: ["Unlimited cases", "Advanced documents", "Full AI assistant", "Video consultations", "Priority support"], highlight: true },
            { name: "Enterprise", price: "Custom", features: ["Everything in Pro", "Team management", "Custom integrations", "Dedicated support", "SLA guaranteed"] },
          ].map((plan, idx) => (
            <div
              key={idx}
              className={`rounded-xl p-8 border transition-all ${
                plan.highlight
                  ? "bg-green-600/20 border-green-500 shadow-lg shadow-green-500/20"
                  : "bg-gray-800/50 border-gray-700"
              }`}
            >
              <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
              <p className="text-3xl font-bold text-green-400 mb-6">{plan.price}</p>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-300">
                    <Check size={16} className="text-green-400" /> {feature}
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-3 rounded-lg font-semibold transition-all ${
                  plan.highlight
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-gray-700 hover:bg-gray-600 text-white"
                }`}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-12 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Transform Your Legal Practice?</h2>
          <p className="text-green-50 text-lg mb-8">Join hundreds of lawyers using LegoAce to work smarter, faster, and more efficiently.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-green-50 transition-colors"
            >
              Start Free Trial <ArrowRight size={20} />
            </Link>
            <Link
              to="/auth"
              className="inline-flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white px-8 py-4 rounded-lg font-semibold transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Scale className="text-green-400" size={24} />
                <span className="text-white font-bold">LegoAce</span>
              </div>
              <p className="text-gray-400 text-sm">Modern legal practice management for individual lawyers.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2026 LegoAce. All rights reserved. Designed for modern legal practices.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
