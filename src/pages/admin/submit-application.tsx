import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { ArrowLeft, Send } from 'lucide-react'

// Simplified form interface for testing
interface SimpleFormData {
  applicantName: string
  mobileNumber: string
  wuaName: string
  applicationYear: number
  category: 'MAJOR' | 'MINOR'
}

export default function SubmitApplication() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [userToken, setUserToken] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<SimpleFormData>()

  // Authentication check
  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    const userData = localStorage.getItem('adminData')

    if (!token || !userData) {
      toast.error('Please login first')
      router.push('/admin/login')
      return
    }

    try {
      const parsedData = JSON.parse(userData)
      if (parsedData.userType !== 'nominee') {
        toast.error('Access denied. Only nominees can submit applications.')
        router.push('/admin/dashboard')
        return
      }
      setUserToken(token)
    } catch (error) {
      console.error('Auth error:', error)
      toast.error('Invalid session')
      router.push('/admin/login')
    }
  }, [router])

  // Form submission handler
  const onSubmit = async (data: SimpleFormData) => {
    if (!userToken) {
      toast.error('Authentication required')
      return
    }

    setIsLoading(true)

    try {
      // Simulate API delay for testing
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Map simple form to API structure
      const nominationData = {
        wuaId: `WUA/MH/${data.applicationYear}/TEST`,
        applicationYear: data.applicationYear,
        category: data.category,
        // Direct fields from simple form
        applicantName: data.applicantName,
        mobileNumber: data.mobileNumber,
        // Basic info mapped from simple form
        wuaName: data.wuaName,
        wuaNameMarathi: data.wuaName, // Using same for testing
        district: 'Test District',
        taluka: 'Test Taluka',
        village: 'Test Village',
        contactInfo: {
          chairmanName: data.applicantName,
          chairmanMobile: data.mobileNumber,
          chairmanEmail: 'test@example.com',
          secretaryName: 'Test Secretary',
          secretaryMobile: '9876543210'
        },
        wuaDetails: {
          registrationDate: new Date().toISOString().split('T')[0],
          totalMembers: 100,
          maleMembers: 60,
          femaleMembers: 40,
          irrigationArea: 1500
        },
        projectInfo: {
          projectName: 'Test Irrigation Project',
          projectDescription: 'Test project for award application',
          completionYear: 2023
        },
        selfAssessment: {
          governanceScore: 8,
          waterManagementScore: 8,
          financialManagementScore: 8,
          maintenanceScore: 8,
          documentationScore: 8,
          totalScore: 40
        }
      }

      const response = await fetch('/api/nominations/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify(nominationData)
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Application submitted successfully!')
        reset() // Clear form
        setTimeout(() => {
          router.push('/admin/dashboard')
        }, 2000)
      } else {
        toast.error(result.message || 'Failed to submit application')
      }
    } catch (error) {
      console.error('Submission error:', error)
      toast.error('Failed to submit application. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Loading state
  if (!userToken) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Submit Application - Maharashtra WRD</title>
        <meta name="description" content="Submit WUA nomination for Punyashlok Ahilyabai Holkar Award" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">

        {/* Header */}
        <div className="bg-white/10 backdrop-blur-md border-b border-white/20">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="flex items-center text-white/80 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Dashboard
              </button>
            </div>

            <div className="text-right">
              <h1 className="text-lg font-semibold text-white">Submit New Application</h1>
              <p className="text-sm text-white/70">Punyashlok Ahilyabai Holkar Award</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="government-card p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Simple Application Form
                </h2>
                <p className="text-gray-600">For testing purposes - Basic information only</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Applicant Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Applicant Name *
                  </label>
                  <input
                    type="text"
                    {...register('applicantName', { 
                      required: 'Applicant name is required' 
                    })}
                    className="government-input"
                    placeholder="Enter your full name"
                  />
                  {errors.applicantName && (
                    <p className="mt-1 text-sm text-red-600">{errors.applicantName.message}</p>
                  )}
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    {...register('mobileNumber', {
                      required: 'Mobile number is required',
                      pattern: {
                        value: /^[6-9]\d{9}$/,
                        message: 'Enter valid 10-digit mobile number'
                      }
                    })}
                    className="government-input"
                    placeholder="9876543210"
                  />
                  {errors.mobileNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.mobileNumber.message}</p>
                  )}
                </div>

                {/* WUA Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    WUA Name *
                  </label>
                  <input
                    type="text"
                    {...register('wuaName', { 
                      required: 'WUA name is required' 
                    })}
                    className="government-input"
                    placeholder="Enter WUA name"
                  />
                  {errors.wuaName && (
                    <p className="mt-1 text-sm text-red-600">{errors.wuaName.message}</p>
                  )}
                </div>

                {/* Application Year */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Application Year *
                  </label>
                  <select
                    {...register('applicationYear', {
                      required: 'Application year is required',
                      valueAsNumber: true
                    })}
                    className="government-input"
                  >
                    <option value="">Select Year</option>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                  </select>
                  {errors.applicationYear && (
                    <p className="mt-1 text-sm text-red-600">{errors.applicationYear.message}</p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Project Category *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-orange-50 hover:border-orange-300 transition-colors">
                      <input
                        type="radio"
                        {...register('category', { required: 'Category is required' })}
                        value="MAJOR"
                        className="mr-3 text-orange-600"
                      />
                      <div>
                        <div className="font-medium text-gray-900">Major Project</div>
                        <div className="text-sm text-gray-600">Area &gt; 2000 hectares</div>
                      </div>
                    </label>

                    <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-orange-50 hover:border-orange-300 transition-colors">
                      <input
                        type="radio"
                        {...register('category', { required: 'Category is required' })}
                        value="MINOR"
                        className="mr-3 text-orange-600"
                      />
                      <div>
                        <div className="font-medium text-gray-900">Minor Project</div>
                        <div className="text-sm text-gray-600">Area ≤ 2000 hectares</div>
                      </div>
                    </label>
                  </div>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="government-button w-full flex items-center justify-center space-x-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Submit Application</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
