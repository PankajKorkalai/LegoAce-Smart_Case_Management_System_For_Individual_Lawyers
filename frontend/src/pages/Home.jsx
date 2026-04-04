import { Link } from "react-router-dom";
import { Scale, ArrowRight, User, Check, Zap, Shield, Users, FileText, BarChart3, Clock, Star, Menu, X, ChevronRight, Play, Globe, Award, Headphones } from "lucide-react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { useState } from "react";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation - More Premium */}
      <nav className="top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-green-600 to-emerald-700 text-white p-2.5 rounded-xl shadow-lg">
              <Scale size={22} />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">LegoAce</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              Features
            </Link>
            <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              Pricing
            </Link>
            <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              Resources
            </Link>
            <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              Contact
            </Link>
            <Link
              to="/login"
              className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
            >
              Sign In
            </Link>
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-100">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4">
            <div className="flex flex-col gap-3">
              <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 font-medium py-2">Features</Link>
              <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 font-medium py-2">Pricing</Link>
              <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 font-medium py-2">Resources</Link>
              <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 font-medium py-2">Contact</Link>
              <Link to="/login" className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold text-center">Sign In</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section - More Dynamic with Better Overlay */}
      <section className="relative bg-gray-900">
        <Carousel
          autoPlay
          infiniteLoop
          showThumbs={false}
          showStatus={false}
          interval={5000}
          className="rounded-none overflow-hidden"
          renderArrowPrev={(clickHandler, hasPrev) => hasPrev && (
            <button onClick={clickHandler} className="absolute left-4 md:left-8 z-10 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 md:p-3 transition-all">
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white rotate-180" />
            </button>
          )}
          renderArrowNext={(clickHandler, hasNext) => hasNext && (
            <button onClick={clickHandler} className="absolute right-4 md:right-8 z-10 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 md:p-3 transition-all">
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </button>
          )}
        >
          {/* Slide 1 - Modern Law Office */}
          <div className="relative h-[600px] md:h-[700px] flex items-center justify-center">
            <img src="https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=2000&q=80" alt="Modern Law Office" className="object-cover w-full h-full" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 bg-green-500/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                    <Zap className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-sm font-medium">AI-Powered Legal Platform</span>
                  </div>
                  <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">Your Complete Legal Workspace</h1>
                  <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-xl">AI-powered, secure, and beautifully simple. Manage cases, clients, and documents in one place.</p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link to="/dashboard" className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5">
                      Start Free Trial <ArrowRight size={20} />
                    </Link>
                    <Link to="/login" className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-8 py-4 rounded-xl font-semibold transition-all border border-white/20">
                      <Play size={20} /> Watch Demo
                    </Link>
                  </div>
                  <div className="flex items-center gap-6 mt-8">
                    <div className="flex -space-x-2">
                      {[1,2,3,4].map((i) => (
                        <img key={i} src={`https://randomuser.me/api/portraits/${i%2===0?'women':'men'}/${20+i}.jpg`} className="w-10 h-10 rounded-full border-2 border-white" alt="User" />
                      ))}
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                      </div>
                      <p className="text-white/80 text-sm">Trusted by 500+ law firms</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Slide 2 - AI Legal Assistant */}
          <div className="relative h-[600px] md:h-[700px] flex items-center justify-center">
            <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=2000&q=80" alt="AI Legal Technology" className="object-cover w-full h-full" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 bg-purple-500/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                    <Zap className="w-4 h-4 text-purple-400" />
                    <span className="text-purple-400 text-sm font-medium">AI Legal Assistant</span>
                  </div>
                  <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">Intelligent Legal Insights</h1>
                  <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-xl">Instant research, document analysis, and smart recommendations for every case.</p>
                </div>
              </div>
            </div>
          </div>
        </Carousel>
      </section>

      {/* Trust Bar - Enhanced */}
      <section className="bg-white py-8 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm uppercase tracking-wider mb-6">Trusted by leading law firms worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            <img src="https://www.rentomojo.com/blog/wp-content/uploads/2024/06/LAW-FIRM-PHOTO-660x660.webp" alt="Partner" className="h-16 opacity-60 hover:opacity-100 transition-opacity" />
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2lSavD2p8jda340tXWxR9ujk7pR3Pn9CrDg&s" alt="Partner" className="h-16 opacity-60 hover:opacity-100 transition-opacity" />
            <img src="https://www.bmu.edu.in/wp-content/uploads/2022/11/law-firms.webp" alt="Partner" className="h-16 opacity-60 hover:opacity-100 transition-opacity" />
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ67nEB0HAz8jjJlQ-x33cQHFWLBZdSEi7mAQ&s" alt="Partner" className="h-16 opacity-60 hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </section>

      {/* Stats Bar - More Visual */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="backdrop-blur-sm bg-white/10 rounded-2xl p-6">
              <div className="text-5xl font-bold text-white mb-2">500+</div>
              <div className="text-green-100 text-sm font-medium">Active Law Firms</div>
            </div>
            <div className="backdrop-blur-sm bg-white/10 rounded-2xl p-6">
              <div className="text-5xl font-bold text-white mb-2">10K+</div>
              <div className="text-green-100 text-sm font-medium">Cases Managed</div>
            </div>
            <div className="backdrop-blur-sm bg-white/10 rounded-2xl p-6">
              <div className="text-5xl font-bold text-white mb-2">99.9%</div>
              <div className="text-green-100 text-sm font-medium">Uptime SLA</div>
            </div>
            <div className="backdrop-blur-sm bg-white/10 rounded-2xl p-6">
              <div className="text-5xl font-bold text-white mb-2">24/7</div>
              <div className="text-green-100 text-sm font-medium">Priority Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - More Premium Cards */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-green-100 rounded-full px-4 py-2 mb-4">
              <Zap className="w-4 h-4 text-green-600" />
              <span className="text-green-700 text-sm font-medium">Powerful Features</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Everything You Need to Succeed</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Comprehensive tools designed specifically for modern legal professionals</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 - Case Management */}
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
              <div className="relative h-56 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80" alt="Case Management" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Case Management</h3>
                <p className="text-gray-600 leading-relaxed mb-4">Track all your cases in one organized hub. Monitor status, priority, and deadlines at a glance with smart filtering and real-time updates.</p>
                <Link to="/dashboard" className="inline-flex items-center gap-2 text-green-600 font-semibold hover:gap-3 transition-all">
                  Learn More <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Feature 2 - Client Portal */}
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
              <div className="relative h-56 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?auto=format&fit=crop&w=600&q=80" alt="Client Portal" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Client Portal</h3>
                <p className="text-gray-600 leading-relaxed mb-4">Maintain complete client profiles with contact info, case history, documents, and communication logs all in one secure place.</p>
                <Link to="/dashboard" className="inline-flex items-center gap-2 text-green-600 font-semibold hover:gap-3 transition-all">
                  Learn More <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Feature 3 - Document Hub */}
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
              <div className="relative h-56 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1465101178521-c1a9136a3b41?auto=format&fit=crop&w=600&q=80" alt="Document Hub" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Document Hub</h3>
                <p className="text-gray-600 leading-relaxed mb-4">Upload, organize, and manage legal documents with AI-powered analysis, extraction, and smart categorization for quick retrieval.</p>
                <Link to="/dashboard" className="inline-flex items-center gap-2 text-green-600 font-semibold hover:gap-3 transition-all">
                  Learn More <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - With Steps */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 rounded-full px-4 py-2 mb-4">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700 text-sm font-medium">Simple Setup</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Get Started in 4 Easy Steps</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">From sign-up to full deployment in less than 10 minutes</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Connecting line - hidden on mobile */}
            <div className="hidden md:block absolute top-20 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-green-200 via-green-400 to-green-200"></div>
            
            <div className="flex flex-col items-center relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg transform hover:scale-110 transition-transform">
                <span className="text-3xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Create Account</h3>
              <p className="text-gray-500 text-center">Sign up with email and get instant access</p>
            </div>
            
            <div className="flex flex-col items-center relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg transform hover:scale-110 transition-transform">
                <span className="text-3xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Add Your Team</h3>
              <p className="text-gray-500 text-center">Invite colleagues and set permissions</p>
            </div>
            
            <div className="flex flex-col items-center relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg transform hover:scale-110 transition-transform">
                <span className="text-3xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Import Cases</h3>
              <p className="text-gray-500 text-center">Upload documents and create case files</p>
            </div>
            
            <div className="flex flex-col items-center relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg transform hover:scale-110 transition-transform">
                <span className="text-3xl font-bold text-white">4</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Start Working</h3>
              <p className="text-gray-500 text-center">Leverage AI and manage your practice</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials - Enhanced */}
      <section className="py-24 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-yellow-500/20 rounded-full px-4 py-2 mb-4">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 text-sm font-medium">Testimonials</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Loved by Legal Professionals</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">See what our customers are saying about LegoAce</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/15 transition-all">
              <div className="flex items-center gap-4 mb-6">
                <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Sarah Johnson" className="w-16 h-16 rounded-full object-cover border-2 border-green-400" />
                <div>
                  <p className="font-bold text-white text-lg">Sarah Johnson</p>
                  <p className="text-gray-300 text-sm">Family Law Attorney</p>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                  </div>
                </div>
              </div>
              <p className="text-gray-200 text-lg leading-relaxed">"LegoAce completely transformed how I manage my practice. The AI assistant alone saves me 10+ hours per week on legal research. The case management system is intuitive, and the calendar reminders have never missed a deadline."</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/15 transition-all">
              <div className="flex items-center gap-4 mb-6">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Michael Lee" className="w-16 h-16 rounded-full object-cover border-2 border-green-400" />
                <div>
                  <p className="font-bold text-white text-lg">Michael Lee</p>
                  <p className="text-gray-300 text-sm">Criminal Defense</p>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                  </div>
                </div>
              </div>
              <p className="text-gray-200 text-lg leading-relaxed">"The client portal is a game changer for my solo practice. My clients love the transparency and easy access to their documents. I love the peace of mind and the time I save every week."</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/15 transition-all">
              <div className="flex items-center gap-4 mb-6">
                <img src="https://randomuser.me/api/portraits/women/65.jpg" alt="Priya Sharma" className="w-16 h-16 rounded-full object-cover border-2 border-green-400" />
                <div>
                  <p className="font-bold text-white text-lg">Priya Sharma</p>
                  <p className="text-gray-300 text-sm">Corporate Law</p>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                  </div>
                </div>
              </div>
              <p className="text-gray-200 text-lg leading-relaxed">"The analytics dashboard helps me grow my business. I can see trends, track outcomes, and make better decisions for my clients and my firm. Highly recommended!"</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Strong Call to Action */}
      <section className="py-24 bg-gradient-to-r from-green-600 to-emerald-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Transform Your Legal Practice?</h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">Join thousands of legal professionals who trust LegoAce to manage their cases, clients, and documents efficiently.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard" className="inline-flex items-center gap-2 bg-white text-green-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5">
              Start Free Trial <ArrowRight size={20} />
            </Link>
            <Link to="/login" className="inline-flex items-center gap-2 bg-green-700 text-white px-8 py-4 rounded-xl font-semibold hover:bg-green-800 transition-all border border-green-500">
              Schedule Demo <Clock size={20} />
            </Link>
          </div>
          <p className="text-green-100 text-sm mt-6">No credit card required • Free 14-day trial • Cancel anytime</p>
        </div>
      </section>

      {/* Footer - Modern and Clean */}
      <footer className="bg-gray-900 text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-5 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-green-600 to-emerald-700 text-white p-2 rounded-xl">
                  <Scale size={22} />
                </div>
                <span className="text-2xl font-bold text-white">LegoAce</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">The complete legal practice management platform for modern law firms. AI-powered, secure, and beautifully simple.</p>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0021.68-11.542c0-.214-.005-.425-.015-.636A10.01 10.01 0 0024 4.59z"/></svg>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/></svg>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link to="/dashboard" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link to="/dashboard" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link to="/dashboard" className="hover:text-white transition-colors">Security</Link></li>
                <li><Link to="/dashboard" className="hover:text-white transition-colors">Integrations</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link to="/dashboard" className="hover:text-white transition-colors">About</Link></li>
                <li><Link to="/dashboard" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link to="/dashboard" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link to="/dashboard" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link to="/dashboard" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link to="/dashboard" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link to="/dashboard" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/dashboard" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-500">
            <p>&copy; 2024 LegoAce. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}