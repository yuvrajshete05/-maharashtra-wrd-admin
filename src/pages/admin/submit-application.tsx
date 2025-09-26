import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { 
  ArrowLeft, 
  Save, 
  Send, 
  FileText, 
  Users, 
  MapPin, 
  Calendar,
  Upload,
  CheckCircle2
} from 'lucide-react'
import toast from 'react-hot-toast'

interface WUAFormData {
  // Basic WUA Information
  wuaName: string
  wuaNameMarathi: string
  wuaId: string  // Changed from registrationNumber to match API
  registrationDate: string
  applicationYear: number  // Added required field for API
  district: string
  taluka: string
  village: string
  
  // Contact Information
  chairmanName: string
  chairmanMobile: string
  chairmanEmail: string
  secretaryName: string
  secretaryMobile: string
  
  // WUA Details
  totalMembers: number
  maleMembers: number
  femaleMembers: number
  category: 'MAJOR' | 'MINOR'
  irrigationArea: number
  
  // Project Information
  projectName: string
  projectDescription: string
  completionYear: number
  
  // Self Assessment (Basic)
  governanceScore: number
  waterManagementScore: number
  financialManagementScore: number
  maintenanceScore: number
  documentationScore: number
}

export default function SubmitApplication() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [userToken, setUserToken] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 4

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<WUAFormData>()

  useEffect(() => {
    // Check authentication
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
      toast.error('Invalid session')
      router.push('/admin/login')
    }
  }, [router])

  const onSubmit = async (data: WUAFormData) => {
    if (!userToken) {
      toast.error('Authentication required')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/nominations/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({
          wuaId: data.wuaId,
          applicationYear: data.applicationYear,
          category: data.category,
          // Additional form data for the nomination
          wuaName: data.wuaName,
          wuaNameMarathi: data.wuaNameMarathi,
          district: data.district,
          taluka: data.taluka,
          village: data.village,
          contactInfo: {
            chairmanName: data.chairmanName,
            chairmanMobile: data.chairmanMobile,
            chairmanEmail: data.chairmanEmail,
            secretaryName: data.secretaryName,
            secretaryMobile: data.secretaryMobile
          },
          wuaDetails: {
            registrationDate: data.registrationDate,
            totalMembers: data.totalMembers,
            maleMembers: data.maleMembers,
            femaleMembers: data.femaleMembers,
            irrigationArea: data.irrigationArea
          },
          projectInfo: {
            projectName: data.projectName,
            projectDescription: data.projectDescription,
            completionYear: data.completionYear
          },
          selfAssessment: {
            governanceScore: data.governanceScore,
            waterManagementScore: data.waterManagementScore,
            financialManagementScore: data.financialManagementScore,
            maintenanceScore: data.maintenanceScore,
            documentationScore: data.documentationScore,
            totalScore: data.governanceScore + data.waterManagementScore + data.financialManagementScore + data.maintenanceScore + data.documentationScore
          }
        })
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Application submitted successfully!')
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

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">WUA Basic Information</h3>
            
            {/* WUA Names */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  WUA Name (English) *
                </label>
                <input
                  type="text"
                  {...register('wuaName', { required: 'WUA name is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Enter WUA name in English"
                />
                {errors.wuaName && (
                  <p className="mt-1 text-sm text-red-600">{errors.wuaName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  WUA Name (Marathi) *
                </label>
                <input
                  type="text"
                  {...register('wuaNameMarathi', { required: 'Marathi name is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 marathi-text"
                  placeholder="मराठीत WUA नाव"
                />
                {errors.wuaNameMarathi && (
                  <p className="mt-1 text-sm text-red-600">{errors.wuaNameMarathi.message}</p>
                )}
              </div>
            </div>

            {/* Registration Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  WUA ID *
                </label>
                <input
                  type="text"
                  {...register('wuaId', { required: 'WUA ID is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="WUA/MH/2024/001234"
                />
                {errors.wuaId && (
                  <p className="mt-1 text-sm text-red-600">{errors.wuaId.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Registration Date *
                </label>
                <input
                  type="date"
                  {...register('registrationDate', { required: 'Registration date is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                {errors.registrationDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.registrationDate.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Application Year *
                </label>
                <select
                  {...register('applicationYear', { 
                    required: 'Application year is required',
                    valueAsNumber: true 
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
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
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  District *
                </label>
                <select
                  {...register('district', { required: 'District is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Select District</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Pune">Pune</option>
                  <option value="Nashik">Nashik</option>
                  <option value="Aurangabad">Aurangabad</option>
                  <option value="Solapur">Solapur</option>
                  <option value="Kolhapur">Kolhapur</option>
                  <option value="Sangli">Sangli</option>
                  <option value="Satara">Satara</option>
                </select>
                {errors.district && (
                  <p className="mt-1 text-sm text-red-600">{errors.district.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Taluka *
                </label>
                <input
                  type="text"
                  {...register('taluka', { required: 'Taluka is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Enter Taluka"
                />
                {errors.taluka && (
                  <p className="mt-1 text-sm text-red-600">{errors.taluka.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Village *
                </label>
                <input
                  type="text"
                  {...register('village', { required: 'Village is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Enter Village"
                />
                {errors.village && (
                  <p className="mt-1 text-sm text-red-600">{errors.village.message}</p>
                )}
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Category *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center p-4 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    {...register('category', { required: 'Category is required' })}
                    value="MAJOR"
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium">Major Project</div>
                    <div className="text-sm text-gray-600">Irrigation area &gt; 2000 hectares</div>
                  </div>
                </label>
                <label className="flex items-center p-4 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    {...register('category', { required: 'Category is required' })}
                    value="MINOR"
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium">Minor Project</div>
                    <div className="text-sm text-gray-600">Irrigation area ≤ 2000 hectares</div>
                  </div>
                </label>
              </div>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            
            {/* Chairman Details */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-4">Chairman Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chairman Name *
                  </label>
                  <input
                    type="text"
                    {...register('chairmanName', { required: 'Chairman name is required' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Enter full name"
                  />
                  {errors.chairmanName && (
                    <p className="mt-1 text-sm text-red-600">{errors.chairmanName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    {...register('chairmanMobile', { 
                      required: 'Mobile number is required',
                      pattern: {
                        value: /^[6-9]\d{9}$/,
                        message: 'Enter valid 10-digit mobile number'
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="9876543210"
                  />
                  {errors.chairmanMobile && (
                    <p className="mt-1 text-sm text-red-600">{errors.chairmanMobile.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    {...register('chairmanEmail')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="chairman@example.com"
                  />
                </div>
              </div>
            </div>

            {/* Secretary Details */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-4">Secretary Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Secretary Name *
                  </label>
                  <input
                    type="text"
                    {...register('secretaryName', { required: 'Secretary name is required' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Enter full name"
                  />
                  {errors.secretaryName && (
                    <p className="mt-1 text-sm text-red-600">{errors.secretaryName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    {...register('secretaryMobile', { 
                      required: 'Mobile number is required',
                      pattern: {
                        value: /^[6-9]\d{9}$/,
                        message: 'Enter valid 10-digit mobile number'
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="9876543210"
                  />
                  {errors.secretaryMobile && (
                    <p className="mt-1 text-sm text-red-600">{errors.secretaryMobile.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Member Details */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-4">Membership Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Members *
                  </label>
                  <input
                    type="number"
                    {...register('totalMembers', { 
                      required: 'Total members is required',
                      min: { value: 1, message: 'Must be at least 1' }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="100"
                  />
                  {errors.totalMembers && (
                    <p className="mt-1 text-sm text-red-600">{errors.totalMembers.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Male Members *
                  </label>
                  <input
                    type="number"
                    {...register('maleMembers', { 
                      required: 'Male members count is required',
                      min: { value: 0, message: 'Cannot be negative' }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="60"
                  />
                  {errors.maleMembers && (
                    <p className="mt-1 text-sm text-red-600">{errors.maleMembers.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Female Members *
                  </label>
                  <input
                    type="number"
                    {...register('femaleMembers', { 
                      required: 'Female members count is required',
                      min: { value: 0, message: 'Cannot be negative' }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="40"
                  />
                  {errors.femaleMembers && (
                    <p className="mt-1 text-sm text-red-600">{errors.femaleMembers.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Irrigation Area (Ha) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    {...register('irrigationArea', { 
                      required: 'Irrigation area is required',
                      min: { value: 0.1, message: 'Must be greater than 0' }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="1500.5"
                  />
                  {errors.irrigationArea && (
                    <p className="mt-1 text-sm text-red-600">{errors.irrigationArea.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  {...register('projectName', { required: 'Project name is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Enter project name"
                />
                {errors.projectName && (
                  <p className="mt-1 text-sm text-red-600">{errors.projectName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Description *
                </label>
                <textarea
                  {...register('projectDescription', { required: 'Project description is required' })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Describe the irrigation project, its benefits, and impact on the community..."
                />
                {errors.projectDescription && (
                  <p className="mt-1 text-sm text-red-600">{errors.projectDescription.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Completion Year *
                </label>
                <input
                  type="number"
                  {...register('completionYear', { 
                    required: 'Completion year is required',
                    min: { value: 2000, message: 'Year must be 2000 or later' },
                    max: { value: new Date().getFullYear(), message: 'Year cannot be in future' }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="2023"
                />
                {errors.completionYear && (
                  <p className="mt-1 text-sm text-red-600">{errors.completionYear.message}</p>
                )}
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Self-Assessment</h3>
            <p className="text-gray-600 mb-6">Rate your WUA's performance in each area (1-10 scale, where 10 is excellent)</p>
            
            <div className="space-y-4">
              {[
                { field: 'governanceScore', label: 'Governance & Administration', description: 'Leadership, decision making, transparency' },
                { field: 'waterManagementScore', label: 'Water Management', description: 'Water distribution, conservation, efficiency' },
                { field: 'financialManagementScore', label: 'Financial Management', description: 'Budget planning, revenue collection, accounting' },
                { field: 'maintenanceScore', label: 'Maintenance & Repairs', description: 'Infrastructure upkeep, preventive maintenance' },
                { field: 'documentationScore', label: 'Documentation & Records', description: 'Record keeping, compliance, reporting' }
              ].map(({ field, label, description }) => (
                <div key={field} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {label} *
                      </label>
                      <p className="text-xs text-gray-600">{description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        {...register(field as keyof WUAFormData, { 
                          required: `${label} score is required`,
                          min: { value: 1, message: 'Score must be between 1-10' },
                          max: { value: 10, message: 'Score must be between 1-10' }
                        })}
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-teal-500"
                        min="1"
                        max="10"
                        placeholder="8"
                      />
                      <span className="text-sm text-gray-600">/10</span>
                    </div>
                  </div>
                  {errors[field as keyof WUAFormData] && (
                    <p className="mt-1 text-sm text-red-600">{errors[field as keyof WUAFormData]?.message}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-teal-50 p-4 rounded-lg">
              <h4 className="font-medium text-teal-800 mb-2">Assessment Guidelines</h4>
              <ul className="text-sm text-teal-700 space-y-1">
                <li>• Rate honestly based on current performance</li>
                <li>• Consider improvements made in the last 2 years</li>
                <li>• Include supporting documents where possible</li>
                <li>• Scores will be verified during evaluation process</li>
              </ul>
            </div>
          </div>
        )

      default:
        return null
    }
  }

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
        <meta name="description" content="Submit WUA application for Punyashlok Ahilyabai Holkar Award" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.push('/admin/dashboard')}
                  className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Dashboard
                </button>
              </div>
              
              <div className="text-right">
                <h1 className="text-lg font-semibold text-gray-900">Submit New Application</h1>
                <p className="text-sm text-gray-600">Punyashlok Ahilyabai Holkar Award</p>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">WUA Application Form</h2>
              <span className="text-sm text-gray-600">Step {currentStep} of {totalSteps}</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
            
            <div className="flex justify-between mt-2">
              {['Basic Info', 'Contacts', 'Project', 'Assessment'].map((step, index) => (
                <span 
                  key={index}
                  className={`text-xs ${index + 1 <= currentStep ? 'text-teal-600 font-medium' : 'text-gray-400'}`}
                >
                  {step}
                </span>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <form onSubmit={handleSubmit(onSubmit)}>
              {renderStepContent()}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="px-6 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>

                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700 transition-colors"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-8 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Application</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}