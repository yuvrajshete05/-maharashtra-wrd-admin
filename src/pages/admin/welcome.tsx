import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { CheckCircle, User, Clock, Shield, LogOut } from 'lucide-react'
import toast from 'react-hot-toast'

interface AdminData {
  username: string
  adminLevel: string
  name: string
  loginTime: string
}

export default function WelcomePage() {
  const router = useRouter()
  const [adminData, setAdminData] = useState<AdminData | null>(null)

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('adminToken')
    const userData = localStorage.getItem('adminData')
    
    if (!token || !userData) {
      toast.error('Please login first')
      router.push('/admin/login')
      return
    }

    try {
      const parsedData = JSON.parse(userData)
      setAdminData(parsedData)
      // Redirect to dashboard immediately
      router.push('/admin/dashboard')
    } catch (error) {
      toast.error('Invalid session data')
      router.push('/admin/login')
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminData')
    toast.success('Logged out successfully')
    router.push('/admin/login')
  }

  const formatLoginTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  if (!adminData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Welcome - Maharashtra Water Resources Department</title>
        <meta name="description" content="Admin welcome page for Maharashtra Water Resources Department" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23475569' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        {/* Header */}
        <div className="relative z-10">
          <div className="bg-slate-800/80 backdrop-blur-md border-b border-slate-700/50">
            <div className="container mx-auto px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                    <path d="M2 17L12 22L22 17" />
                    <path d="M2 12L12 17L22 12" />
                  </svg>
                </div>
                <div className="text-white">
                  <h1 className="font-semibold text-lg">Maharashtra Water Resources Department</h1>
                  <p className="text-slate-300 text-sm marathi-text">महाराष्ट्र जल संसाधन विभाग</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-slate-200 text-sm">Welcome, {adminData.name}</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm hover:text-white transition-colors border border-slate-600 rounded-lg hover:bg-slate-700 text-slate-300 flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
          <div className="w-full max-w-2xl">
            {/* Welcome Card */}
            <div className="bg-slate-800/90 backdrop-blur-md border border-slate-700/50 rounded-xl p-8 text-center shadow-2xl">
              {/* Success Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
              </div>

              {/* Welcome Message */}
              <h1 className="text-3xl font-bold text-white mb-4">
                Welcome to Admin Dashboard!
              </h1>
              <p className="text-slate-300 mb-8 text-lg">
                Punyashlok Ahilyabai Holkar Award Management System
              </p>

              {/* User Info Cards */}
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="bg-slate-700/50 border border-slate-600/50 rounded-lg p-4">
                  <div className="flex items-center justify-center mb-2">
                    <User className="w-6 h-6 text-orange-400" />
                  </div>
                  <h3 className="font-semibold text-slate-200 text-sm">Username</h3>
                  <p className="text-white text-lg font-medium">{adminData.username}</p>
                </div>

                <div className="bg-slate-700/50 border border-slate-600/50 rounded-lg p-4">
                  <div className="flex items-center justify-center mb-2">
                    <Shield className="w-6 h-6 text-orange-400" />
                  </div>
                  <h3 className="font-semibold text-slate-200 text-sm">Admin Level</h3>
                  <p className="text-white text-lg font-medium capitalize">{adminData.adminLevel}</p>
                </div>

                <div className="bg-slate-700/50 border border-slate-600/50 rounded-lg p-4">
                  <div className="flex items-center justify-center mb-2">
                    <Clock className="w-6 h-6 text-orange-400" />
                  </div>
                  <h3 className="font-semibold text-slate-200 text-sm">Login Time</h3>
                  <p className="text-white text-sm font-medium">{formatLoginTime(adminData.loginTime)}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => toast('Dashboard functionality will be implemented here', { icon: 'ℹ️' })}
                  className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors font-medium shadow-lg"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={() => toast('Profile management functionality will be implemented here', { icon: 'ℹ️' })}
                  className="px-6 py-3 border border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors font-medium"
                >
                  Manage Profile
                </button>
              </div>

              {/* Quick Stats */}
              <div className="mt-8 pt-6 border-t border-slate-600/50">
                <p className="text-sm text-slate-400 mb-4">System Status</p>
                <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm">
                  <span className="flex items-center text-green-400">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    System Online
                  </span>
                  <span className="flex items-center text-blue-400">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    Database Connected
                  </span>
                  <span className="flex items-center text-orange-400">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                    Services Active
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-6 text-slate-400 text-sm">
              <p>© 2025 Maharashtra Water Resources Department. All rights reserved.</p>
              <p className="marathi-text mt-1">महाराष्ट्र शासन | Government of Maharashtra</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}