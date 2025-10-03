import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import Head from 'next/head'
import toast from 'react-hot-toast'
import { User, Send, LogOut, ArrowLeft } from 'lucide-react'

interface SimpleFeedbackForm {
  name: string
  feedback: string
}

export default function SubmitApplication() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [adminData, setAdminData] = useState<any>(null)
  
  const { register, handleSubmit, formState: { errors } } = useForm<SimpleFeedbackForm>()

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    const userData = localStorage.getItem('adminData')
    
    if (!token || !userData) {
      toast.error('Please login first')
      router.push('/welcome')
      return
    }

    try {
      const parsedData = JSON.parse(userData)
      setAdminData(parsedData)
    } catch (error) {
      console.error('Error parsing admin data:', error)
      toast.error('Invalid session data. Please login again.')
      router.push('/welcome')
    }
  }, [router])

  const handleLogout = () => {
    if (adminData?.userType === 'nominee') {
      localStorage.removeItem('nominee_active_session')
      localStorage.removeItem('adminToken')
      localStorage.removeItem('adminData')
      toast.success('Logged out successfully')
      router.push('/welcome')
    } else {
      localStorage.clear()
      toast.success('Logged out successfully')
      router.push('/admin/login')
    }
  }

  const onSubmit = async (data: SimpleFeedbackForm) => {
    setIsLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Generate application data from form submission
      const currentDate = new Date()
      const applicationId = `WUA${String(Date.now()).slice(-3)}`
      
      const newApplication = {
        id: applicationId,
        wuaName: data.name, // Using name as WUA name
        district: 'Pune', // Default district
        status: 'Submitted' as const,
        submissionDate: currentDate.toLocaleDateString('en-GB', { 
          day: '2-digit', 
          month: 'short', 
          year: 'numeric' 
        }),
        category: 'MINOR' as const,
        feedback: data.feedback,
        submittedBy: adminData?.name || 'Unknown',
        userType: adminData?.userType || 'nominee',
        // Workflow tracking
        workflowStage: 'user-submitted',
        circleStatus: 'pending',
        corporationStatus: 'pending',
        stateStatus: 'pending',
        finalStatus: 'pending',
        // Remarks at each stage
        circleRemarks: '',
        corporationRemarks: '',
        stateRemarks: '',
        // Action dates
        circleActionDate: null,
        corporationActionDate: null,
        stateActionDate: null,
        finalActionDate: null
      }
      
      // Save to localStorage for this user
      const existingApplications = JSON.parse(localStorage.getItem('nominee_applications') || '[]')
      existingApplications.push(newApplication)
      localStorage.setItem('nominee_applications', JSON.stringify(existingApplications))
      
      console.log('Form submitted:', data)
      console.log('Application created:', newApplication)
      toast.success('Feedback submitted successfully!')
      
      setTimeout(() => {
        router.push('/admin/dashboard')
      }, 1000)
    } catch (error) {
      console.error('Submission error:', error)
      toast.error('Failed to submit feedback. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!adminData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Submit Feedback - Maharashtra Water Resources Department</title>
        <meta name="description" content="Submit your feedback" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gray-200">
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Dashboard</span>
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">मह</span>
                </div>
                <div>
                  <h1 className="font-semibold text-lg text-gray-900">
                    Maharashtra Water Resources Department
                  </h1>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{adminData.name}</p>
                <p className="text-xs text-gray-600">{adminData.userType || adminData.adminLevel}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 px-3 py-2 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </header>

        <main className="p-6">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Submit Feedback</h2>
              <p className="text-gray-600">Share your thoughts and suggestions</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="inline w-4 h-4 mr-2" />
                    Your Name
                  </label>
                  <input
                    type="text"
                    {...register('name', {
                      required: 'Name is required',
                      minLength: { value: 2, message: 'Name must be at least 2 characters' }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Enter your full name"
                    disabled={isLoading}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Feedback
                  </label>
                  <textarea
                    {...register('feedback', {
                      required: 'Feedback is required',
                      minLength: { value: 10, message: 'Feedback must be at least 10 characters' }
                    })}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 resize-vertical"
                    placeholder="Please share your feedback, suggestions, or comments..."
                    disabled={isLoading}
                  />
                  {errors.feedback && (
                    <p className="mt-1 text-sm text-red-600">{errors.feedback.message}</p>
                  )}
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 px-6 rounded-md font-medium flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Submit Feedback</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
