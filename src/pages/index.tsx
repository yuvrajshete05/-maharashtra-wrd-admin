import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Head from 'next/head'

export default function Home() {
  const [activeSection, setActiveSection] = useState('home')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      title: "Punyashlok Ahilyabai Holkar Award",
      subtitle: "Excellence in Water Management",
      description: "Recognizing outstanding Water Users Associations across Maharashtra"
    },
    {
      title: "Sustainable Water Governance",
      subtitle: "Community-Led Innovation",
      description: "Empowering communities through effective water resource management"
    },
    {
      title: "Maharashtra Leading the Way",
      subtitle: "Water Conservation Excellence",
      description: "Setting benchmarks in participatory irrigation management"
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [slides.length])

  const handleSectionClick = (section: string) => {
    setActiveSection(section)
    setIsMenuOpen(false)
  }

  return (
    <>
      <Head>
        <title>Punyashlok Ahilyabai Holkar Award - Maharashtra WRD</title>
        <meta name="description" content="Water Users Association Management Competition - Maharashtra Water Resources Department" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        {/* Header */}
        <header className="bg-slate-800/95 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-white">Maharashtra Government</h1>
                  <p className="text-xs text-slate-300">Water Resources Department</p>
                </div>
              </div>
              
              <nav className="hidden md:flex items-center space-x-8">
                {['home', 'about', 'apply', 'status', 'results', 'contact'].map((section) => (
                  <button
                    key={section}
                    onClick={() => handleSectionClick(section)}
                    className={`capitalize font-medium transition-colors ${
                      activeSection === section 
                        ? 'text-blue-400' 
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {section}
                  </button>
                ))}
              </nav>

              <div className="flex items-center space-x-4">
                <Link href="/welcome">
                  <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg">
                    Login/Register
                  </button>
                </Link>
                <select className="bg-slate-700/50 border border-slate-600 rounded px-3 py-2 text-white text-sm backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option className="text-gray-900">MR</option>
                  <option className="text-gray-900">EN</option>
                </select>
                
                <Link href="/admin/login">
                  <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg">
                    Admin
                  </button>
                </Link>
                
                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="md:hidden text-white p-2 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                    <div className={`w-full h-0.5 bg-white transition-transform ${isMenuOpen ? 'rotate-45 translate-y-1' : ''}`}></div>
                    <div className={`w-full h-0.5 bg-white transition-opacity ${isMenuOpen ? 'opacity-0' : ''}`}></div>
                    <div className={`w-full h-0.5 bg-white transition-transform ${isMenuOpen ? '-rotate-45 -translate-y-1' : ''}`}></div>
                  </div>
                </button>
              </div>
            </div>
            
            {/* Mobile Menu */}
            {isMenuOpen && (
              <div className="md:hidden bg-slate-800/95 backdrop-blur-md border-t border-slate-700/50">
                <div className="px-4 py-4 space-y-2">
                  {['home', 'about', 'apply', 'status', 'results', 'contact'].map((section) => (
                    <button
                      key={section}
                      onClick={() => handleSectionClick(section)}
                      className={`block w-full text-left capitalize py-3 px-4 rounded-lg transition-colors ${
                        activeSection === section 
                          ? 'text-blue-400 bg-slate-700/50' 
                          : 'text-slate-300 hover:text-white hover:bg-slate-700/30'
                      }`}
                    >
                      {section}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Hero Section with Professional Design */}
        <section className="relative py-24 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-slate-900/20"></div>
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-600/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex items-center px-4 py-2 bg-blue-600/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium mb-8">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                  Government of Maharashtra Initiative
                </div>
                
                <div className="transition-all duration-1000 ease-in-out">
                  <h1 className="text-5xl lg:text-7xl font-bold text-white mb-8 leading-tight">
                    Punyashlok
                    <span className="block text-blue-400">Ahilyabai</span>
                    <span className="block text-slate-300">Holkar Award</span>
                  </h1>
                  <h2 className="text-2xl lg:text-3xl font-semibold text-slate-300 mb-6">
                    Water Users Association Management Excellence
                  </h2>
                  <p className="text-xl text-slate-400 mb-10 leading-relaxed max-w-2xl">
                    Recognizing outstanding achievements in sustainable water management through community participation and innovative governance practices across Maharashtra.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-6 mb-10">
                  <Link href="/welcome">
                    <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-xl hover:shadow-blue-500/25">
                      Apply Now
                    </button>
                  </Link>
                  <button className="border-2 border-slate-600 text-slate-300 hover:text-white hover:border-slate-500 px-8 py-4 rounded-xl font-semibold backdrop-blur-sm transition-all transform hover:scale-105">
                    Learn More
                  </button>
                </div>
              </div>
              
              <div className="relative">
                <div className="bg-gradient-to-br from-slate-800/50 to-blue-900/30 rounded-3xl p-12 backdrop-blur-sm border border-slate-700/50 shadow-2xl">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl mx-auto mb-8 flex items-center justify-center shadow-2xl">
                      <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                        <path d="M2 17L12 22L22 17" />
                        <path d="M2 12L12 17L22 12" />
                      </svg>
                    </div>
                    {/* <h3 className="text-2xl font-bold text-white mb-4">Excellence in Governance</h3>
                    <p className="text-slate-300">Promoting transparent and effective water resource management across Maharashtra</p> */}
                  </div>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-500/10 rounded-2xl animate-pulse"></div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-indigo-500/10 rounded-2xl animate-pulse"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Professional Sidebar */}
            <div className="lg:col-span-1 space-y-8">
              
              {/* Latest Updates - Professional */}
              <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-700/50 transition-all">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-3 animate-pulse"></div>
                  Latest Updates
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-colors cursor-pointer border border-slate-600/30">
                    <p className="text-blue-400 font-semibold text-sm mb-1">Sept 19, 2025</p>
                    <p className="text-slate-200 text-sm">Application Portal Opens</p>
                    <p className="text-slate-300 text-xs">Online application system is now available for submissions</p>
                  </div>
                  <div className="p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-colors cursor-pointer border border-slate-600/30">
                    <p className="text-blue-400 font-semibold text-sm mb-1">Sept 15, 2025</p>
                    <p className="text-slate-200 text-sm">Guidelines Updated</p>
                    <p className="text-slate-300 text-xs">New guidelines and self-assessment forms released</p>
                  </div>
                </div>
              </div>

              {/* Quick Links - Professional */}
              <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-700/50 transition-all">
                <h3 className="text-xl font-semibold text-white mb-6">Quick Links</h3>
                <div className="space-y-3">
                  <a href="#" className="flex items-center text-slate-300 hover:text-blue-400 p-3 rounded-xl hover:bg-slate-700/30 transition-all group">
                    <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-600/30">
                      <span className="text-blue-400">📄</span>
                    </div>
                    <span className="font-medium">Application Form</span>
                  </a>
                  <a href="#" className="flex items-center text-slate-300 hover:text-blue-400 p-3 rounded-xl hover:bg-slate-700/30 transition-all group">
                    <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-600/30">
                      <span className="text-blue-400">📋</span>
                    </div>
                    <span className="font-medium">Guidelines</span>
                  </a>
                  <a href="#" className="flex items-center text-slate-300 hover:text-blue-400 p-3 rounded-xl hover:bg-slate-700/30 transition-all group">
                    <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-600/30">
                      <span className="text-blue-400">⭐</span>
                    </div>
                    <span className="font-medium">Evaluation Criteria</span>
                  </a>
                  <a href="#" className="flex items-center text-slate-300 hover:text-blue-400 p-3 rounded-xl hover:bg-slate-700/30 transition-all group">
                    <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-600/30">
                      <span className="text-blue-400">🏆</span>
                    </div>
                    <span className="font-medium">Previous Winners</span>
                  </a>
                </div>
              </div>

              {/* Important Dates - Updated to match wireframe */}
              <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-700/50 transition-all">
                <h3 className="text-xl font-semibold text-white mb-6">Important Dates</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 rounded-xl bg-green-600/10 border border-green-500/20">
                    <span className="text-slate-300 font-medium text-sm">Announcement:</span>
                    <span className="text-green-400 font-semibold">April 2025</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-blue-600/10 border border-blue-500/20">
                    <span className="text-slate-300 font-medium text-sm">Applications Open:</span>
                    <span className="text-blue-400 font-semibold">July-August 2025</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-indigo-600/10 border border-indigo-500/20">
                    <span className="text-slate-300 font-medium text-sm">Results:</span>
                    <span className="text-indigo-400 font-semibold">January 2026</span>
                  </div>
                </div>
              </div>

              {/* Downloads - Professional */}
              <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-700/50 transition-all">
                <h3 className="text-xl font-semibold text-white mb-6">Downloads</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center text-slate-300 hover:text-blue-400 p-3 rounded-xl hover:bg-slate-700/30 transition-all group">
                    <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-600/30">
                      <span className="text-blue-400 group-hover:animate-bounce">📥</span>
                    </div>
                    <span className="font-medium">Application Form PDF</span>
                  </button>
                  <button className="w-full flex items-center text-slate-300 hover:text-blue-400 p-3 rounded-xl hover:bg-slate-700/30 transition-all group">
                    <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-600/30">
                      <span className="text-blue-400 group-hover:animate-bounce">📥</span>
                    </div>
                    <span className="font-medium">Guidelines Document</span>
                  </button>
                  <button className="w-full flex items-center text-slate-300 hover:text-blue-400 p-3 rounded-xl hover:bg-slate-700/30 transition-all group">
                    <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-600/30">
                      <span className="text-blue-400 group-hover:animate-bounce">📥</span>
                    </div>
                    <span className="font-medium">Evaluation Matrix</span>
                  </button>
                </div>
              </div>

              {/* Help & Support - New section matching wireframe */}
              <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-700/50 transition-all">
                <h3 className="text-xl font-semibold text-white mb-6">Help & Support</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center text-slate-300 hover:text-blue-400 p-3 rounded-xl hover:bg-slate-700/30 transition-all group">
                    <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-600/30">
                      <span className="text-blue-400">�️</span>
                    </div>
                    <span className="font-medium">Technical Support</span>
                  </button>
                  <button className="w-full flex items-center text-slate-300 hover:text-blue-400 p-3 rounded-xl hover:bg-slate-700/30 transition-all group">
                    <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-600/30">
                      <span className="text-blue-400">�</span>
                    </div>
                    <span className="font-medium">User Manual</span>
                  </button>
                  <button className="w-full flex items-center text-slate-300 hover:text-blue-400 p-3 rounded-xl hover:bg-slate-700/30 transition-all group">
                    <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-600/30">
                      <span className="text-blue-400">�</span>
                    </div>
                    <span className="font-medium">Contact Us</span>
                  </button>
                </div>
              </div>

              {/* Professional FAQ */}
              <ProfessionalFAQ />

              {/* Contact Information - Professional */}
              <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-700/50 transition-all">
                <h3 className="text-xl font-semibold text-white mb-6">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center p-3 rounded-xl hover:bg-slate-700/30 transition-all cursor-pointer group">
                    <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-600/30">
                      <span className="text-blue-400">📧</span>
                    </div>
                    <span className="text-slate-300 text-sm">info@maharashtrawrd.gov.in</span>
                  </div>
                  <div className="flex items-center p-3 rounded-xl hover:bg-slate-700/30 transition-all cursor-pointer group">
                    <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-600/30">
                      <span className="text-blue-400">📞</span>
                    </div>
                    <span className="text-slate-300 text-sm">+91-22-2345-6789</span>
                  </div>
                  <div className="flex items-start p-3 rounded-xl hover:bg-slate-700/30 transition-all cursor-pointer group">
                    <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center mr-3 mt-0.5 group-hover:bg-blue-600/30">
                      <span className="text-blue-400">Office Hours</span>
                    </div>
                    <span className="text-slate-300 text-sm">10:00 AM - 6:00 PM</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content - Professional */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Competition Overview - Updated to match wireframe */}
              <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-8 hover:bg-slate-700/50 transition-all" style={{width: '160%'}}>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent mb-6">
                  Competition Overview
                </h2>
                <div className="space-y-6 text-slate-200">
                  <p className="text-lg leading-relaxed">
                    The Punyashlok Ahilyabai Holkar Award recognizes excellence in Water Users Association management across Maharashtra. This 
                    prestigious competition evaluates associations based on governance, water management, financial practices, and overall performance.
                  </p>
                </div>
              </div>

              {/* Eligibility Criteria - Updated to match wireframe */}
              <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-8 hover:bg-slate-700/50 transition-all" style={{width: '160%'}}>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <span className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-blue-400">✓</span>
                  </span>
                  Eligibility Criteria
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-slate-700/30 border border-slate-600/30 rounded-xl p-6 hover:bg-slate-700/50 transition-all">
                    <h3 className="text-lg font-semibold text-blue-400 mb-4 flex items-center">
                      <span className="w-6 h-6 bg-blue-600/20 rounded-lg flex items-center justify-center mr-3 text-sm">🏭</span>
                      Major/Medium Projects
                    </h3>
                    <p className="text-slate-300 text-sm">
                      Water Users Associations managing major and medium irrigation projects
                    </p>
                  </div>
                  <div className="bg-slate-700/30 border border-slate-600/30 rounded-xl p-6 hover:bg-slate-700/50 transition-all">
                    <h3 className="text-lg font-semibold text-blue-400 mb-4 flex items-center">
                      <span className="w-6 h-6 bg-blue-600/20 rounded-lg flex items-center justify-center mr-3 text-sm">🌾</span>
                      Minor Projects
                    </h3>
                    <p className="text-slate-300 text-sm">
                      Associations managing minor projects, LI lifts, and storage tanks
                    </p>
                  </div>
                </div>
              </div>

              {/* Application Process - Updated to match wireframe */}
              <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-8 hover:bg-slate-700/50 transition-all" style={{width: '160%'}}>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <span className="w-8 h-8 bg-indigo-600/20 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-indigo-400">📋</span>
                  </span>
                  Application Process
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4 p-4 bg-slate-700/30 border border-slate-600/30 rounded-xl hover:bg-slate-700/50 transition-all group">
                    <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600/30">
                      <span className="text-blue-400 font-bold text-sm">1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-2">Registration</h3>
                      <p className="text-slate-300 text-sm">Complete user registration and OTP verification</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 p-4 bg-slate-700/30 border border-slate-600/30 rounded-xl hover:bg-slate-700/50 transition-all group">
                    <div className="w-8 h-8 bg-indigo-600/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-600/30">
                      <span className="text-indigo-400 font-bold text-sm">2</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-2">Category Selection</h3>
                      <p className="text-slate-300 text-sm">Choose appropriate project category</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 p-4 bg-slate-700/30 border border-slate-600/30 rounded-xl hover:bg-slate-700/50 transition-all group">
                    <div className="w-8 h-8 bg-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-purple-600/30">
                      <span className="text-purple-400 font-bold text-sm">3</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-2">Form Submission</h3>
                      <p className="text-slate-300 text-sm">Complete application and self-assessment forms</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Evaluation Modules - New section matching wireframe */}
              <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-8 hover:bg-slate-700/50 transition-all" style={{width: '160%'}}>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <span className="w-8 h-8 bg-purple-600/20 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-purple-400">⭐</span>
                  </span>
                  Evaluation Modules
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-blue-600/10 border border-blue-500/20 rounded-xl p-5 hover:bg-blue-600/15 transition-all">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-semibold text-blue-400 flex items-center">
                          <span className="w-6 h-6 bg-blue-600/20 rounded-lg flex items-center justify-center mr-3 text-sm">🏛️</span>
                          Governance
                        </h3>
                        <span className="text-2xl font-bold text-blue-400">35</span>
                      </div>
                      <p className="text-slate-400 text-xs">marks</p>
                    </div>
                    <div className="bg-green-600/10 border border-green-500/20 rounded-xl p-5 hover:bg-green-600/15 transition-all">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-semibold text-green-400 flex items-center">
                          <span className="w-6 h-6 bg-green-600/20 rounded-lg flex items-center justify-center mr-3 text-sm">💧</span>
                          Water Management
                        </h3>
                        <span className="text-2xl font-bold text-green-400">35</span>
                      </div>
                      <p className="text-slate-400 text-xs">marks</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-yellow-600/10 border border-yellow-500/20 rounded-xl p-5 hover:bg-yellow-600/15 transition-all">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-semibold text-yellow-400 flex items-center">
                          <span className="w-6 h-6 bg-yellow-600/20 rounded-lg flex items-center justify-center mr-3 text-sm">💰</span>
                          Financial Management
                        </h3>
                        <span className="text-2xl font-bold text-yellow-400">30</span>
                      </div>
                      <p className="text-slate-400 text-xs">marks</p>
                    </div>
                    <div className="bg-purple-600/10 border border-purple-500/20 rounded-xl p-5 hover:bg-purple-600/15 transition-all">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-semibold text-purple-400 flex items-center">
                          <span className="w-6 h-6 bg-purple-600/20 rounded-lg flex items-center justify-center mr-3 text-sm">🔧</span>
                          Maintenance & Repairs
                        </h3>
                        <span className="text-2xl font-bold text-purple-400">25</span>
                      </div>
                      <p className="text-slate-400 text-xs">marks</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <div className="bg-red-600/10 border border-red-500/20 rounded-xl p-5 hover:bg-red-600/15 transition-all">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-lg font-semibold text-red-400 flex items-center">
                        <span className="w-6 h-6 bg-red-600/20 rounded-lg flex items-center justify-center mr-3 text-sm">📊</span>
                        Documentation & Data
                      </h3>
                      <span className="text-2xl font-bold text-red-400">25</span>
                    </div>
                    <p className="text-slate-400 text-xs">marks</p>
                  </div>
                </div>
              </div>

              {/* Timeline Section */}
              <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-8 hover:bg-slate-700/50 transition-all" style={{width: '160%'}}>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <span className="w-8 h-8 bg-indigo-600/20 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-indigo-400">📅</span>
                  </span>
                  Timeline
                </h2>
                <div className="space-y-6">
                  {/* April */}
                  <div className="flex items-start space-x-4 p-4 bg-slate-700/30 border border-slate-600/30 rounded-xl hover:bg-slate-700/50 transition-all group">
                    <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600/30">
                      <span className="text-blue-400 font-bold text-sm">Apr</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">Competition Announcement</h3>
                      <p className="text-slate-300 text-sm">Official announcement of the award competition</p>
                    </div>
                  </div>

                  {/* May-June */}
                  <div className="flex items-start space-x-4 p-4 bg-slate-700/30 border border-slate-600/30 rounded-xl hover:bg-slate-700/50 transition-all group">
                    <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-green-600/30">
                      <span className="text-green-400 font-bold text-xs">May-Jun</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">Awareness Campaign</h3>
                      <p className="text-slate-300 text-sm">Information dissemination and promotion activities</p>
                    </div>
                  </div>

                  {/* July-August */}
                  <div className="flex items-start space-x-4 p-4 bg-slate-700/30 border border-slate-600/30 rounded-xl hover:bg-slate-700/50 transition-all group">
                    <div className="w-12 h-12 bg-yellow-600/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-yellow-600/30">
                      <span className="text-yellow-400 font-bold text-xs">Jul-Aug</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">Nomination Period</h3>
                      <p className="text-slate-300 text-sm">Application submission window open</p>
                    </div>
                  </div>

                  {/* Sep-Dec */}
                  <div className="flex items-start space-x-4 p-4 bg-slate-700/30 border border-slate-600/30 rounded-xl hover:bg-slate-700/50 transition-all group">
                    <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-purple-600/30">
                      <span className="text-purple-400 font-bold text-xs">Sep-Dec</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">Evaluation Process</h3>
                      <p className="text-slate-300 text-sm">Review and assessment of all applications</p>
                    </div>
                  </div>

                  {/* January */}
                  <div className="flex items-start space-x-4 p-4 bg-slate-700/30 border border-slate-600/30 rounded-xl hover:bg-slate-700/50 transition-all group">
                    <div className="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-red-600/30">
                      <span className="text-red-400 font-bold text-sm">Jan</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">Results Declaration</h3>
                      <p className="text-slate-300 text-sm">Announcement of award winners</p>
                    </div>
                  </div>

                  {/* February */}
                  <div className="flex items-start space-x-4 p-4 bg-slate-700/30 border border-slate-600/30 rounded-xl hover:bg-slate-700/50 transition-all group">
                    <div className="w-12 h-12 bg-indigo-600/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-600/30">
                      <span className="text-indigo-400 font-bold text-sm">Feb</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">Award Ceremony</h3>
                      <p className="text-slate-300 text-sm">Felicitation of winners and recognition event</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Footer */}
        <footer className="bg-slate-900/80 backdrop-blur-md border-t border-slate-700/50 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="hover:bg-slate-800/30 p-6 rounded-xl transition-all">
                <h3 className="text-lg font-semibold mb-4 text-blue-400">Government Links</h3>
                <div className="space-y-3">
                  <a href="#" className="flex items-center text-slate-300 hover:text-blue-400 transition-colors group">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 group-hover:animate-pulse"></span>
                    Maharashtra Government
                  </a>
                  <a href="#" className="flex items-center text-slate-300 hover:text-blue-400 transition-colors group">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 group-hover:animate-pulse"></span>
                    Water Resources Department
                  </a>
                  <a href="#" className="flex items-center text-slate-300 hover:text-blue-400 transition-colors group">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 group-hover:animate-pulse"></span>
                    National Portal of India
                  </a>
                </div>
              </div>
              <div className="hover:bg-slate-800/30 p-6 rounded-xl transition-all">
                <h3 className="text-lg font-semibold mb-4 text-blue-400">Policies</h3>
                <div className="space-y-3">
                  <a href="#" className="flex items-center text-slate-300 hover:text-blue-400 transition-colors group">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3 group-hover:animate-pulse"></span>
                    Privacy Policy
                  </a>
                  <a href="#" className="flex items-center text-slate-300 hover:text-blue-400 transition-colors group">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3 group-hover:animate-pulse"></span>
                    Terms & Conditions
                  </a>
                  <a href="#" className="flex items-center text-slate-300 hover:text-blue-400 transition-colors group">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3 group-hover:animate-pulse"></span>
                    Accessibility
                  </a>
                 </div>
              </div>
              <div className="hover:bg-slate-800/30 p-6 rounded-xl transition-all">
                <h3 className="text-lg font-semibold mb-4 text-blue-400">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 group cursor-pointer">
                    <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center mt-0.5 group-hover:bg-blue-600/30">
                      <span className="text-blue-400 text-sm">🏢</span>
                    </div>
                    <div>
                      <p className="text-slate-300 text-sm leading-relaxed group-hover:text-white transition-colors">
                        Water Resources Department<br />
                        Government of Maharashtra<br />
                        Mumbai - 400001
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 group cursor-pointer">
                    <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center group-hover:bg-blue-600/30">
                      <span className="text-blue-400 text-sm">📧</span>
                    </div>
                    <p className="text-slate-300 text-sm group-hover:text-white transition-colors">info@maharashtrawrd.gov.in</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-slate-700/50 mt-8 pt-8 text-center">
              <p className="text-slate-400 text-sm">
                © 2024 Government of Maharashtra. All rights reserved. | 
                <span className="text-blue-400 hover:text-blue-300 cursor-pointer ml-1">Privacy Policy</span> | 
                <span className="text-blue-400 hover:text-blue-300 cursor-pointer ml-1">Terms of Service</span>
              </p>
              <div className="mt-4 flex justify-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

// Professional FAQ Component
function ProfessionalFAQ() {
  return (
    <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-700/50 transition-all">
      <h3 className="text-xl font-semibold text-white mb-6">FAQs</h3>
      <div className="space-y-4">
        <div className="bg-slate-700/30 border border-slate-600/30 rounded-xl p-4">
          <h4 className="font-medium text-slate-200 text-sm mb-2">How to apply for the award?</h4>
          <p className="text-slate-400 text-sm">Complete online registration and submit required documents.</p>
        </div>
        <div className="bg-slate-700/30 border border-slate-600/30 rounded-xl p-4">
          <h4 className="font-medium text-slate-200 text-sm mb-2">What are the eligibility criteria?</h4>
          <p className="text-slate-400 text-sm">Active Water Users Associations in Maharashtra are eligible.</p>
        </div>
      </div>
    </div>
  );
}

// Interactive FAQ Component
function InteractiveFAQ() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)
  
  const faqs = [
    { q: "How to apply for the award?", a: "Complete the online application form and submit required documents." },
    { q: "What are the eligibility criteria?", a: "Registered Water Users Association with active management for 2+ years." },
    { q: "What is the evaluation process?", a: "Evaluation includes desk review, field visits, and final scoring based on 5 modules." },
    { q: "When will results be announced?", a: "Final results will be announced in May 2024 with award ceremony in January 2025." }
  ]

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6 hover:bg-white/15 transition-all">
      <h3 className="text-lg font-semibold text-white mb-4">FAQs</h3>
      <div className="space-y-2">
        {faqs.map((faq, index) => (
          <div key={index} className="border border-white/10 rounded-lg">
            <button
              onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
              className="w-full text-left p-3 hover:bg-white/5 transition-all flex items-center justify-between"
            >
              <span className="text-sm font-medium text-white">{faq.q}</span>
              <span className={`text-orange-400 transition-transform ${openFAQ === index ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
            {openFAQ === index && (
              <div className="px-3 pb-3">
                <p className="text-xs text-white/70">{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Count Up Animation Component
function CountUpAnimation({ target, suffix }: { target: number, suffix: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const duration = 2000
    const increment = target / (duration / 16)
    let current = 0
    
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, 16)
    
    return () => clearInterval(timer)
  }, [target])

  return <span>{count}{suffix}</span>
}