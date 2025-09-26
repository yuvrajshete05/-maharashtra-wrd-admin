import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, User, Lock, LogIn } from 'lucide-react'
import toast from 'react-hot-toast'

interface LoginFormData {
  email: string
  password: string
}

export default function AdminLogin() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<LoginFormData>()

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    
    try {
      // Call our real login API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success(`Login successful! Welcome ${result.data.user.name}`)
        
        // Store user data in localStorage
        localStorage.setItem('adminToken', result.data.token)
        localStorage.setItem('adminData', JSON.stringify({
          username: result.data.user.email,
          adminLevel: result.data.user.userType,
          userType: result.data.user.userType,
          name: result.data.user.name,
          loginTime: new Date().toISOString()
        }))
        
        // Redirect to dashboard
        setTimeout(() => {
          router.push('/admin/dashboard')
        }, 1000)
      } else {
        toast.error(result.message || 'Login failed. Please try again.')
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Admin Login - Maharashtra Water Resources Department</title>
        <meta name="description" content="Admin login portal for Maharashtra Water Resources Department" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-200 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-12 h-12 sm:w-16 sm:h-12 bg-teal-500 rounded-lg flex items-center justify-center flex-shrink-0 px-2 py-1">
                  <span className="text-white font-bold text-xs sm:text-sm marathi-text">महाराष्ट्र</span>
                </div>
                <div className="text-gray-800 min-w-0">
                  <h1 className="font-semibold text-xs sm:text-sm md:text-lg leading-tight">Maharashtra Water Resources Department</h1>
                  <p className="text-gray-600 text-xs marathi-text hidden sm:block">Government of Maharashtra</p>
                </div>
              </div>
              <div className="flex items-center text-gray-700 flex-shrink-0">
                <button className="px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm text-white transition-colors border border-green-900 rounded-lg bg-green-900 hover:bg-green-950">
                  English
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center p-4 bg-gray-200">
          <div className="w-full max-w-sm">
            {/* Login Card */}
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            {/* Logo Section */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Admin Login</h2>
              <p className="text-gray-600 text-xs">Punyashlok Ahilyabai Holkar Award Management System</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Enter Email"
                    disabled={isLoading}
                    style={{ backgroundColor: '#F0F0F0' }}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 6, message: 'Password must be at least 6 characters' }
                    })}
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Enter Password"
                    disabled={isLoading}
                    style={{ backgroundColor: '#F0F0F0' }}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 rounded-md font-medium transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    <span>Login</span>
                  </>
                )}
              </button>
            </form>

            {/* Back to Homepage Link */}
            <div className="mt-4 text-center">
              <a
                href="#"
                className="text-sm text-teal-600 hover:text-teal-500 transition-colors"
                onClick={(e) => {
                  e.preventDefault()
                  toast('Back to homepage functionality would be implemented here', { icon: 'ℹ️' })
                }}
              >
                Back To homepage
              </a>
            </div>
          </div>
        </div>
        </main>
      </div>
    </>
  )
}