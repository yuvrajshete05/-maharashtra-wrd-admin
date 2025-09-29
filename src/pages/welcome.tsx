import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, User, Lock, LogIn, Mail, Phone } from 'lucide-react'
import toast from 'react-hot-toast'

// Simple Browser-Only Session Manager (No Global Control)
class BrowserSessionManager {
  private readonly NOMINEE_SESSION_KEY = 'nominee_active_session';
  private readonly ADMIN_SESSION_KEY = 'admin_active_session';
  private readonly SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  isSessionExpired(sessionData: any): boolean {
    if (!sessionData || !sessionData.timestamp) return true;
    const now = new Date().getTime();
    return (now - sessionData.timestamp) > this.SESSION_TIMEOUT;
  }

  canNomineeLogin(): { canLogin: boolean; activeSession: any } {
    const existingSession = localStorage.getItem(this.NOMINEE_SESSION_KEY);
    
    if (!existingSession) return { canLogin: true, activeSession: null };
    
    try {
      const sessionData = JSON.parse(existingSession);
      
      if (this.isSessionExpired(sessionData)) {
        this.clearNomineeSession();
        return { canLogin: true, activeSession: null };
      }
      
      return { canLogin: false, activeSession: sessionData };
    } catch (error) {
      this.clearNomineeSession();
      return { canLogin: true, activeSession: null };
    }
  }

  createNomineeSession(userData: any): string {
    const sessionId = this.generateSessionId();
    const sessionData = {
      sessionId,
      userId: userData.username,
      userType: 'nominee',
      name: userData.name,
      timestamp: new Date().getTime(),
      loginTime: new Date().toISOString()
    };

    localStorage.setItem(this.NOMINEE_SESSION_KEY, JSON.stringify(sessionData));
    localStorage.setItem('adminToken', userData.token);
    localStorage.setItem('adminData', JSON.stringify({
      username: userData.username,
      name: userData.name,
      userType: 'nominee',
      adminLevel: 'nominee',
      loginTime: sessionData.loginTime,
      sessionId: sessionId
    }));

    return sessionId;
  }

  clearNomineeSession(): void {
    localStorage.removeItem(this.NOMINEE_SESSION_KEY);
    
    const adminData = localStorage.getItem('adminData');
    if (adminData) {
      try {
        const data = JSON.parse(adminData);
        if (data.userType === 'nominee') {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminData');
        }
      } catch (error) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
      }
    }
  }

  forceLogoutNominee(): boolean {
    this.clearNomineeSession();
    return true;
  }
}

// SessionManager class for handling single session control
class SessionManager {
  private readonly NOMINEE_SESSION_KEY = 'nominee_active_session';
  private readonly ADMIN_SESSION_KEY = 'admin_active_session';
  private readonly SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  isSessionExpired(sessionData: any): boolean {
    if (!sessionData || !sessionData.timestamp) return true;
    const now = new Date().getTime();
    return (now - sessionData.timestamp) > this.SESSION_TIMEOUT;
  }

  canNomineeLogin(): { canLogin: boolean; activeSession: any } {
    const existingSession = localStorage.getItem(this.NOMINEE_SESSION_KEY);
    
    if (!existingSession) return { canLogin: true, activeSession: null };
    
    try {
      const sessionData = JSON.parse(existingSession);
      
      if (this.isSessionExpired(sessionData)) {
        this.clearNomineeSession();
        return { canLogin: true, activeSession: null };
      }
      
      return { canLogin: false, activeSession: sessionData };
    } catch (error) {
      this.clearNomineeSession();
      return { canLogin: true, activeSession: null };
    }
  }

  createNomineeSession(userData: any): string {
    const sessionId = this.generateSessionId();
    const sessionData = {
      sessionId,
      userId: userData.username,
      userType: 'nominee',
      name: userData.name,
      timestamp: new Date().getTime(),
      loginTime: new Date().toISOString()
    };

    localStorage.setItem(this.NOMINEE_SESSION_KEY, JSON.stringify(sessionData));
    localStorage.setItem('adminToken', userData.token);
    localStorage.setItem('adminData', JSON.stringify({
      username: userData.username,
      name: userData.name,
      userType: 'nominee',
      adminLevel: 'nominee',
      loginTime: sessionData.loginTime,
      sessionId: sessionId
    }));

    return sessionId;
  }

  clearNomineeSession(): void {
    localStorage.removeItem(this.NOMINEE_SESSION_KEY);
    
    const adminData = localStorage.getItem('adminData');
    if (adminData) {
      try {
        const data = JSON.parse(adminData);
        if (data.userType === 'nominee') {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminData');
        }
      } catch (error) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
      }
    }
  }

  forceLogoutNominee(): boolean {
    this.clearNomineeSession();
    return true;
  }
}

interface LoginFormData {
  email: string
  password: string
}

export default function Login() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [sessionManager] = useState(() => new BrowserSessionManager())
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<LoginFormData>()

  // Check existing session on component mount
  useEffect(() => {
    const adminData = localStorage.getItem('adminData');
    if (adminData) {
      try {
        const data = JSON.parse(adminData);
        if (data.userType === 'nominee') {
          // Already logged in as nominee, redirect to dashboard
          router.push('/admin/dashboard');
        }
      } catch (error) {
        // Invalid data, clear it
        localStorage.clear();
      }
    }
  }, [router]);

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    
    try {
      // Check if nominee can login (browser-only session control)
      const sessionCheck = sessionManager.canNomineeLogin();
      
      if (!sessionCheck.canLogin) {
        const activeSession = sessionCheck.activeSession;
        const shouldForceLogin = confirm(
          `🖥️ BROWSER SESSION CONFLICT\n\n` +
          `Another nominee (${activeSession.name || activeSession.userId}) is already logged in this browser.\n\n` +
          `Login Time: ${new Date(activeSession.timestamp).toLocaleString()}\n\n` +
          `💡 Note: Different computers/browsers can have separate sessions.\n\n` +
          `Do you want to force logout the existing session in this browser?`
        );
        
        if (!shouldForceLogin) {
          toast.error('Login cancelled. Only one nominee per browser allowed.');
          setIsLoading(false);
          return;
        }
        
        // Force logout existing session
        sessionManager.forceLogoutNominee();
        toast.success('Previous nominee session logged out from this browser.');
      }
      // First try to login with existing credentials
      let response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      })

      let result = await response.json()

      // If login fails, try to register as a new nominee
      if (!result.success) {
        console.log('Login failed, attempting to register as new nominee...')
        
        response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: data.email,
            password: data.password,
            username: data.email.split('@')[0], // Use email prefix as username
            fullName: `User ${data.email.split('@')[0]}`, // Generate a default name
            userType: 'nominee',
            mobile: ''
          }),
        })

        result = await response.json()

        if (result.success) {
          toast.success(`Welcome! New nominee account created for ${data.email}`)
        } else {
          toast.error(result.message || 'Registration failed. Please try again.')
          setIsLoading(false)
          return
        }
      } else {
        // Check if existing user is appropriate for nominee login
        if (result.data.user.userType !== 'nominee') {
          toast.error('This login is for nominees only. Committee members please use admin login.')
          setIsLoading(false)
          return
        }
        
        toast.success(`Welcome back! ${result.data.user.fullName || result.data.user.email}`)
      }

      // Create simple browser session (no global control)
      const sessionId = sessionManager.createNomineeSession({
        username: result.data.user.email,
        name: result.data.user.fullName || result.data.user.email,
        token: result.data.token
      });

      console.log(`✅ Browser nominee session created: ${sessionId}`);
      
      // Redirect to dashboard
      setTimeout(() => {
        router.push('/admin/dashboard')
      }, 1000);

    } catch (error) {
      console.error('Login/Registration error:', error)
      toast.error('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToHomepage = () => {
    router.push('/')
  }

  return (
    <>
      <Head>
        <title>Nominee Login - Maharashtra Water Resources Department</title>
        <meta name="description" content="Nominee login portal for Maharashtra Water Resources Department" />
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
              <h2 className="text-xl font-bold text-gray-900 mb-2">Nominee Login</h2>
              <p className="text-gray-600 text-xs">For Water User Association (WUA) Nominees</p>
              <p className="text-gray-500 text-xs mt-1">New user? Just enter email & password to register!</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Please enter a valid email address'
                      }
                    })}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Enter your email address"
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
                    placeholder="Enter your password"
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

            {/* Back to Homepage Link and Admin Login Link */}
            <div className="mt-4 text-center space-y-2">
              <button
                onClick={handleBackToHomepage}
                className="text-sm text-teal-600 hover:text-teal-500 transition-colors underline block"
                disabled={isLoading}
              >
                Back To Homepage
              </button>
            </div>
          </div>

          {/* Footer Text */}
          <div className="text-center mt-6 text-white/70 text-sm">
            {/* <p>© 2025 Maharashtra Water Resources Department. All rights reserved.</p>
            <p className="marathi-text mt-1">महाराष्ट्र शासन | Government of Maharashtra</p> */}
          </div>
        </div>
        </main>
      </div>
    </>
  )
}