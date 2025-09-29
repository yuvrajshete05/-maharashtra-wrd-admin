import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import Head from 'next/head'
import toast from 'react-hot-toast'
import { User, Phone, MapPin, Calendar, Building2, Send, ArrowLeft, ArrowRight, LogOut, FileText, Award, CheckCircle } from 'lucide-react'

interface NominationFormData {
  // Step 1: WUA Basic Information
  wuaName: string
  wuaRegistrationNumber: string
  establishmentYear: string
  wuaAddress: string
  district: string
  taluka: string
  village: string
  pincode: string
  wuaArea: number
  totalMembers: number
  
  // Step 2: Contact Information
  presidentName: string
  presidentMobile: string
  presidentEmail?: string
  secretaryName: string
  secretaryMobile: string
  secretaryEmail?: string
  
  // Step 3: Water Management Details
  waterSource: string
  irrigationType: string
  commandArea: number
  cropPattern: string
  
  // Step 4: Self Assessment Questionnaire (150 marks total)
  regularWaterRequests: string // yes/no
  regularWaterTax: string // yes/no
  regularElection: string // yes/no
  regularLogReporting: string // yes/no
  budgetPlanning: string
  financialTransparency: string
  maintenanceQuality: string
  conflictResolution: string
  memberParticipation: string
  recordKeeping: string
  
  // Step 5: Supporting Documents & Additional Info
  previousAwards?: string
  majorAchievements?: string
  innovationAdopted?: string
  communityImpact?: string
  
  // Step 6: Declaration & Submit
  declaration1: boolean
  declaration2: boolean
  declaration3: boolean
  presidentSignatureDate: string
  secretarySignatureDate: string
}

// 6-Step WUA Excellence in Governance Award Nomination Form
const FORM_SECTIONS = [
  { id: 1, title: 'WUA Basic Info', icon: Building2, description: 'Organization Details' },
  { id: 2, title: 'Contact Information', icon: User, description: 'Key Personnel' },
  { id: 3, title: 'Water Management', icon: MapPin, description: 'Irrigation Details' },
  { id: 4, title: 'Self Assessment', icon: CheckCircle, description: 'Performance Evaluation (150 marks)' },
  { id: 5, title: 'Additional Information', icon: Award, description: 'Achievements & Documents' },
  { id: 6, title: 'Declaration & Submit', icon: Send, description: 'Final Submission' }
]

export default function SubmitApplication() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<string | null>(null)
  const [adminData, setAdminData] = useState<any>(null)
  const [selfAssessmentScore, setSelfAssessmentScore] = useState(0)
  
  const { register, handleSubmit, formState: { errors }, watch, trigger, setValue } = useForm<NominationFormData>()

  const getFieldsForStep = (step: number): (keyof NominationFormData)[] => {
    switch (step) {
      case 1: return ['wuaName', 'wuaRegistrationNumber', 'establishmentYear', 'wuaAddress', 'district', 'taluka', 'village', 'pincode', 'wuaArea', 'totalMembers']
      case 2: return ['presidentName', 'presidentMobile', 'secretaryName', 'secretaryMobile']
      case 3: return ['waterSource', 'irrigationType', 'commandArea', 'cropPattern']
      case 4: return ['regularWaterRequests', 'regularWaterTax', 'regularElection', 'regularLogReporting', 'budgetPlanning', 'financialTransparency', 'maintenanceQuality', 'conflictResolution', 'memberParticipation', 'recordKeeping']
      case 5: return []
      case 6: return ['declaration1', 'declaration2', 'declaration3', 'presidentSignatureDate', 'secretarySignatureDate']
      default: return []
    }
  }

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep)
    const isStepValid = await trigger(fieldsToValidate)
    
    if (isStepValid && currentStep < FORM_SECTIONS.length) {
      // Auto-save current step data before moving to next
      const currentFormData = watch()
      saveFormData(currentFormData, true)
      
      if (currentStep === 4) {
        // Calculate self-assessment score after step 4
        calculateSelfAssessmentScore()
      }
      setCurrentStep(currentStep + 1)
      toast.success(`Progress saved! Moving to Step ${currentStep + 1}`)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      // Auto-save current step data before moving to previous
      const currentFormData = watch()
      saveFormData(currentFormData, false)
      
      setCurrentStep(currentStep - 1)
    }
  }

  const calculateSelfAssessmentScore = () => {
    const formValues = watch()
    let score = 0
    
    // Core compliance parameters (50 marks - 10 each)
    if (formValues.regularWaterRequests === 'yes') score += 10
    if (formValues.regularWaterTax === 'yes') score += 10
    if (formValues.regularElection === 'yes') score += 10
    if (formValues.regularLogReporting === 'yes') score += 10
    
    // Performance indicators (100 marks - 10 each)
    const performanceFields = [
      formValues.budgetPlanning,
      formValues.financialTransparency,
      formValues.maintenanceQuality,
      formValues.conflictResolution,
      formValues.memberParticipation,
      formValues.recordKeeping
    ]
    
    performanceFields.forEach(value => {
      if (value === 'excellent') score += 10
      else if (value === 'good') score += 8
      else if (value === 'average') score += 6
      else if (value === 'poor') score += 3
    })
    
    setSelfAssessmentScore(score)
    if (score >= 100) {
      toast.success(`Great! Your self-assessment score: ${score}/150. You qualify for the next round!`)
    } else {
      toast(`Your self-assessment score: ${score}/150. Consider improving performance before submitting.`, {
        icon: 'ℹ️',
      })
    }
  }

  // Form persistence key
  const FORM_DATA_KEY = 'wua_nomination_form_draft'
  const FORM_STEP_KEY = 'wua_nomination_current_step'

  // Auto-save form data to localStorage
  const saveFormData = (data: Partial<NominationFormData>, showToast = false) => {
    try {
      setIsSaving(true)
      const currentData = localStorage.getItem(FORM_DATA_KEY)
      const existingData = currentData ? JSON.parse(currentData) : {}
      const updatedData = { ...existingData, ...data }
      localStorage.setItem(FORM_DATA_KEY, JSON.stringify(updatedData))
      localStorage.setItem(FORM_STEP_KEY, currentStep.toString())
      
      const now = new Date().toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      })
      setLastSaved(now)
      
      if (showToast) {
        toast.success(`Form data saved at ${now}`)
      }
    } catch (error) {
      console.error('Error saving form data:', error)
      if (showToast) {
        toast.error('Failed to save form data')
      }
    } finally {
      setTimeout(() => setIsSaving(false), 500) // Brief loading state
    }
  }

  // Load saved form data from localStorage
  const loadSavedFormData = () => {
    try {
      const savedData = localStorage.getItem(FORM_DATA_KEY)
      const savedStep = localStorage.getItem(FORM_STEP_KEY)
      
      if (savedData) {
        const parsedData = JSON.parse(savedData)
        // Reset form with saved data using setValue
        Object.keys(parsedData).forEach(key => {
          if (parsedData[key] !== undefined && parsedData[key] !== '') {
            setValue(key as keyof NominationFormData, parsedData[key])
          }
        })
        
        // Restore current step
        if (savedStep) {
          const step = parseInt(savedStep)
          if (step >= 1 && step <= FORM_SECTIONS.length) {
            setCurrentStep(step)
            toast.success(`Form restored! Continuing from Step ${step}: ${FORM_SECTIONS[step - 1].title}`)
          }
        }
        
        return parsedData
      }
    } catch (error) {
      console.error('Error loading saved form data:', error)
    }
    return null
  }

  // Clear saved form data after successful submission
  const clearSavedFormData = () => {
    localStorage.removeItem(FORM_DATA_KEY)
    localStorage.removeItem(FORM_STEP_KEY)
  }

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
      
      // Load saved form data after authentication
      setTimeout(() => {
        loadSavedFormData()
      }, 500) // Small delay to ensure form is ready
      
    } catch (error) {
      console.error('Auth error:', error)
      toast.error('Invalid session')
      router.push('/welcome')
    }
  }, [router])

  // Auto-save form data every 30 seconds when user is typing
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      const formData = watch()
      const hasFormData = Object.values(formData).some(value => 
        value !== undefined && value !== '' && value !== false
      )
      
      if (hasFormData) {
        saveFormData(formData)
      }
    }, 30000) // Auto-save every 30 seconds

    return () => clearInterval(autoSaveInterval)
  }, [watch])

  const handleLogout = () => {
    // Ask user if they want to save form progress
    const formData = watch()
    const hasFormData = Object.values(formData).some(value => 
      value !== undefined && value !== '' && value !== false
    )
    
    if (hasFormData) {
      const shouldSave = confirm(
        'You have unsaved form data. Do you want to save your progress?\n\n' +
        'Click "OK" to save and continue later\n' +
        'Click "Cancel" to discard changes and logout'
      )
      
      if (shouldSave) {
        saveFormData(formData, true)
        toast.success('Form progress saved! You can continue later.')
      } else {
        clearSavedFormData()
      }
    }
    
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminData')
    toast.success('Logged out successfully')
    router.push('/welcome')
  }

  const onSubmit = async (data: NominationFormData) => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const applicationData = {
        applicationId: `WUA-${Date.now()}`,
        awardName: 'WUA Excellence in Governance Award',
        ...data,
        selfAssessmentMarks: selfAssessmentScore,
        totalMarks: 200, // 150 (self-assessment) + 50 (committee evaluation)
        submittedAt: new Date().toISOString(),
        status: 'submitted',
        applicationYear: '2025',
        qualifiesForNextRound: selfAssessmentScore >= 100
      }

      console.log('WUA Excellence Award Nomination submitted:', applicationData)
      
      // Clear saved form data on successful submission
      clearSavedFormData()
      
      toast.success(`Application submitted successfully! Application ID: ${applicationData.applicationId}. Self-Assessment Score: ${selfAssessmentScore}/150`)
      
      // Show download option for application PDF
      toast.success('You can now download your complete application PDF from the dashboard!')
      
      setTimeout(() => {
        router.push('/admin/dashboard')
      }, 3000)
    } catch (error) {
      console.error('Submission error:', error)
      toast.error('Failed to submit nomination. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!adminData) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F0F0F0' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>WUA Excellence in Governance Award - Maharashtra WRD</title>
        <meta name="description" content="WUA Excellence in Governance Award Nomination Form" />
      </Head>

      <div 
        className="min-h-screen"
        style={{
          backgroundColor: '#F0F0F0',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23004B87' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      >
        {/* Header */}
        <div className="bg-white shadow-md border-b-2 border-teal-500">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.push('/admin/dashboard')}
                  className="text-teal-500 hover:text-teal-600 transition-colors"
                >
                  <ArrowLeft className="h-6 w-6" />
                </button>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">WUA Excellence in Governance Award</h1>
                  <p className="text-gray-600 text-sm">Water User Association Nomination Form - Step {currentStep} of {FORM_SECTIONS.length}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {/* Save Status Indicator */}
                <div className="text-center">
                  <div className="flex items-center space-x-2">
                    {isSaving ? (
                      <>
                        <div className="w-3 h-3 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-xs text-teal-600">Saving...</span>
                      </>
                    ) : lastSaved ? (
                      <>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-green-600">Saved at {lastSaved}</span>
                      </>
                    ) : (
                      <>
                        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                        <span className="text-xs text-gray-500">Not saved</span>
                      </>
                    )}
                  </div>
                </div>
                
                {selfAssessmentScore > 0 && (
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Self-Assessment Score</p>
                    <p className={`font-bold ${selfAssessmentScore >= 100 ? 'text-green-600' : 'text-orange-600'}`}>
                      {selfAssessmentScore}/150
                    </p>
                  </div>
                )}
                
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4 overflow-x-auto">
              {FORM_SECTIONS.map((step, index) => {
                const isActive = step.id === currentStep
                const isCompleted = step.id < currentStep
                const StepIcon = step.icon
                
                return (
                  <div key={step.id} className="flex items-center min-w-max">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors ${
                      isActive 
                        ? 'bg-teal-500 border-teal-500 text-white shadow-lg' 
                        : isCompleted 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : 'bg-white border-gray-300 text-gray-400'
                    }`}>
                      <StepIcon className="h-6 w-6" />
                    </div>
                    <div className="ml-3 hidden lg:block">
                      <div className={`text-sm font-medium ${isActive ? 'text-teal-500' : isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
                        {step.title}
                      </div>
                      <div className="text-xs text-gray-500">{step.description}</div>
                    </div>
                    {index < FORM_SECTIONS.length - 1 && (
                      <div className={`h-1 w-12 mx-4 transition-colors ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                    )}
                  </div>
                )
              })}
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-teal-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / FORM_SECTIONS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 md:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {renderStepContent()}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                    currentStep === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  style={currentStep === 1 ? {} : { backgroundColor: '#E0E0E0' }}
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Previous</span>
                </button>

                {currentStep === FORM_SECTIONS.length ? (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-8 py-3 bg-teal-500 text-white rounded-lg font-medium hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 shadow-sm"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Submit Nomination</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-3 bg-teal-500 text-white rounded-lg font-medium hover:bg-teal-600 transition-colors flex items-center space-x-2 shadow-sm"
                  >
                    <span>Next</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )

  function renderStepContent() {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Building2 className="h-16 w-16 text-teal-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">WUA Basic Information</h2>
              <p className="text-gray-600">Water User Association Organization Details</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">WUA Name *</label>
                <input
                  type="text"
                  {...register('wuaName', { required: 'WUA Name is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ backgroundColor: '#F0F0F0' }}
                  placeholder="Enter WUA Name"
                />
                {errors.wuaName && <p className="text-red-500 text-sm mt-1">{errors.wuaName.message}</p>}
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">Registration Number *</label>
                <input
                  type="text"
                  {...register('wuaRegistrationNumber', { required: 'Registration number is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ backgroundColor: '#F0F0F0' }}
                  placeholder="WUA Registration Number"
                />
                {errors.wuaRegistrationNumber && <p className="text-red-500 text-sm mt-1">{errors.wuaRegistrationNumber.message}</p>}
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">Establishment Year *</label>
                <select
                  {...register('establishmentYear', { required: 'Establishment year is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ backgroundColor: '#F0F0F0' }}
                >
                  <option value="">Select Year</option>
                  {Array.from({length: 50}, (_, i) => 2025 - i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                {errors.establishmentYear && <p className="text-red-500 text-sm mt-1">{errors.establishmentYear.message}</p>}
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">District *</label>
                <select
                  {...register('district', { required: 'District is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ backgroundColor: '#F0F0F0' }}
                >
                  <option value="">Select District</option>
                  <option value="Pune">Pune</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Nashik">Nashik</option>
                  <option value="Nagpur">Nagpur</option>
                  <option value="Aurangabad">Aurangabad</option>
                  <option value="Solapur">Solapur</option>
                  <option value="Kolhapur">Kolhapur</option>
                  <option value="Satara">Satara</option>
                  <option value="Sangli">Sangli</option>
                  <option value="Ahmednagar">Ahmednagar</option>
                </select>
                {errors.district && <p className="text-red-500 text-sm mt-1">{errors.district.message}</p>}
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">Taluka *</label>
                <input
                  type="text"
                  {...register('taluka', { required: 'Taluka is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ backgroundColor: '#F0F0F0' }}
                  placeholder="Enter Taluka"
                />
                {errors.taluka && <p className="text-red-500 text-sm mt-1">{errors.taluka.message}</p>}
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">Village *</label>
                <input
                  type="text"
                  {...register('village', { required: 'Village is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ backgroundColor: '#F0F0F0' }}
                  placeholder="Enter Village"
                />
                {errors.village && <p className="text-red-500 text-sm mt-1">{errors.village.message}</p>}
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">Pincode *</label>
                <input
                  type="text"
                  {...register('pincode', { 
                    required: 'Pincode is required',
                    pattern: { value: /^[0-9]{6}$/, message: 'Pincode must be 6 digits' }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ backgroundColor: '#F0F0F0' }}
                  placeholder="Enter Pincode"
                  maxLength={6}
                />
                {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode.message}</p>}
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">WUA Area (Hectares) *</label>
                <input
                  type="number"
                  {...register('wuaArea', { required: 'WUA area is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ backgroundColor: '#F0F0F0' }}
                  placeholder="Enter area in hectares"
                  min="0"
                />
                {errors.wuaArea && <p className="text-red-500 text-sm mt-1">{errors.wuaArea.message}</p>}
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">Total Members *</label>
                <input
                  type="number"
                  {...register('totalMembers', { required: 'Total members is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ backgroundColor: '#F0F0F0' }}
                  placeholder="Number of members"
                  min="1"
                />
                {errors.totalMembers && <p className="text-red-500 text-sm mt-1">{errors.totalMembers.message}</p>}
              </div>
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">WUA Address *</label>
              <textarea
                {...register('wuaAddress', { required: 'Address is required' })}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ backgroundColor: '#F0F0F0' }}
                placeholder="Enter complete address"
              />
              {errors.wuaAddress && <p className="text-red-500 text-sm mt-1">{errors.wuaAddress.message}</p>}
            </div>
          </div>
        )

      case 2:
        return renderStep2()

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <MapPin className="h-16 w-16 text-teal-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Water Management Details</h2>
              <p className="text-gray-600">Irrigation and Water Resources Information</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Water Source *</label>
                <select
                  {...register('waterSource', { required: 'Water source is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ backgroundColor: '#F0F0F0' }}
                >
                  <option value="">Select Water Source</option>
                  <option value="Canal">Canal</option>
                  <option value="Tank">Tank</option>
                  <option value="Well">Well</option>
                  <option value="River">River</option>
                  <option value="Reservoir">Reservoir</option>
                </select>
                {errors.waterSource && <p className="text-red-500 text-sm mt-1">{errors.waterSource.message}</p>}
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">Irrigation Type *</label>
                <select
                  {...register('irrigationType', { required: 'Irrigation type is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ backgroundColor: '#F0F0F0' }}
                >
                  <option value="">Select Type</option>
                  <option value="Major">Major Irrigation</option>
                  <option value="Medium">Medium Irrigation</option>
                  <option value="Minor">Minor Irrigation</option>
                  <option value="Lift">Lift Irrigation</option>
                </select>
                {errors.irrigationType && <p className="text-red-500 text-sm mt-1">{errors.irrigationType.message}</p>}
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">Command Area (Hectares) *</label>
                <input
                  type="number"
                  {...register('commandArea', { required: 'Command area is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ backgroundColor: '#F0F0F0' }}
                  placeholder="Enter command area in hectares"
                  min="0"
                />
                {errors.commandArea && <p className="text-red-500 text-sm mt-1">{errors.commandArea.message}</p>}
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">Crop Pattern *</label>
                <input
                  type="text"
                  {...register('cropPattern', { required: 'Crop pattern is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ backgroundColor: '#F0F0F0' }}
                  placeholder="e.g., Rice, Wheat, Sugarcane"
                />
                {errors.cropPattern && <p className="text-red-500 text-sm mt-1">{errors.cropPattern.message}</p>}
              </div>
            </div>
          </div>
        )

      case 4:
        return renderStep4()

      case 5:
        return renderStep5()

      case 6:
        return renderStep6()

      default:
        return <div className="text-center py-8 text-gray-600">Step content will be added here</div>
    }
  }

  function renderStep2() {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <User className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact Information</h2>
          <p className="text-gray-600">Key Personnel Details</p>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">President Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">President Name *</label>
              <input
                type="text"
                {...register('presidentName', { required: 'President name is required' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ backgroundColor: '#F0F0F0' }}
                placeholder="Enter President Name"
              />
              {errors.presidentName && <p className="text-red-500 text-sm mt-1">{errors.presidentName.message}</p>}
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">President Mobile *</label>
              <input
                type="tel"
                {...register('presidentMobile', { 
                  required: 'Mobile is required',
                  pattern: { value: /^[0-9]{10}$/, message: 'Mobile must be 10 digits' }
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ backgroundColor: '#F0F0F0' }}
                placeholder="Enter Mobile Number"
                maxLength={10}
              />
              {errors.presidentMobile && <p className="text-red-500 text-sm mt-1">{errors.presidentMobile.message}</p>}
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">President Email</label>
              <input
                type="email"
                {...register('presidentEmail')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ backgroundColor: '#F0F0F0' }}
                placeholder="Enter Email Address"
              />
            </div>
          </div>
        </div>
        
        <div style={{ backgroundColor: '#E0E0E0' }} className="p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Secretary Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Secretary Name *</label>
              <input
                type="text"
                {...register('secretaryName', { required: 'Secretary name is required' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ backgroundColor: '#F0F0F0' }}
                placeholder="Enter Secretary Name"
              />
              {errors.secretaryName && <p className="text-red-500 text-sm mt-1">{errors.secretaryName.message}</p>}
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">Secretary Mobile *</label>
              <input
                type="tel"
                {...register('secretaryMobile', { 
                  required: 'Mobile is required',
                  pattern: { value: /^[0-9]{10}$/, message: 'Mobile must be 10 digits' }
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ backgroundColor: '#F0F0F0' }}
                placeholder="Enter Mobile Number"
                maxLength={10}
              />
              {errors.secretaryMobile && <p className="text-red-500 text-sm mt-1">{errors.secretaryMobile.message}</p>}
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">Secretary Email</label>
              <input
                type="email"
                {...register('secretaryEmail')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ backgroundColor: '#F0F0F0' }}
                placeholder="Enter Email Address"
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  function renderStep4() {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Self Assessment Questionnaire</h2>
          <p className="text-gray-600">Performance Evaluation for Last 2 Years (150 Marks Total)</p>
        </div>
        
        {/* Core Compliance Parameters - 50 marks */}
        <div style={{ backgroundColor: '#E0E0E0' }} className="p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Core Compliance Parameters (50 marks)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Regular Water Requests *</label>
              <select
                {...register('regularWaterRequests', { required: 'This field is required' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ backgroundColor: '#F0F0F0' }}
              >
                <option value="">Select Option</option>
                <option value="yes">Yes (10 marks)</option>
                <option value="no">No (0 marks)</option>
              </select>
              {errors.regularWaterRequests && <p className="text-red-500 text-sm mt-1">{errors.regularWaterRequests.message}</p>}
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">Regular Water Tax Collection *</label>
              <select
                {...register('regularWaterTax', { required: 'This field is required' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ backgroundColor: '#F0F0F0' }}
              >
                <option value="">Select Option</option>
                <option value="yes">Yes (10 marks)</option>
                <option value="no">No (0 marks)</option>
              </select>
              {errors.regularWaterTax && <p className="text-red-500 text-sm mt-1">{errors.regularWaterTax.message}</p>}
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">Regular Elections *</label>
              <select
                {...register('regularElection', { required: 'This field is required' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ backgroundColor: '#F0F0F0' }}
              >
                <option value="">Select Option</option>
                <option value="yes">Yes (10 marks)</option>
                <option value="no">No (0 marks)</option>
              </select>
              {errors.regularElection && <p className="text-red-500 text-sm mt-1">{errors.regularElection.message}</p>}
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">Regular Log Reporting *</label>
              <select
                {...register('regularLogReporting', { required: 'This field is required' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ backgroundColor: '#F0F0F0' }}
              >
                <option value="">Select Option</option>
                <option value="yes">Yes (10 marks)</option>
                <option value="no">No (0 marks)</option>
              </select>
              {errors.regularLogReporting && <p className="text-red-500 text-sm mt-1">{errors.regularLogReporting.message}</p>}
            </div>
          </div>
        </div>

        {/* Performance Indicators - 100 marks */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Indicators (100 marks)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Budget Planning & Financial Management *</label>
              <select
                {...register('budgetPlanning', { required: 'This field is required' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ backgroundColor: '#F0F0F0' }}
              >
                <option value="">Select Performance Level</option>
                <option value="excellent">Excellent (10 marks)</option>
                <option value="good">Good (8 marks)</option>
                <option value="average">Average (6 marks)</option>
                <option value="poor">Poor (3 marks)</option>
              </select>
              {errors.budgetPlanning && <p className="text-red-500 text-sm mt-1">{errors.budgetPlanning.message}</p>}
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">Financial Transparency *</label>
              <select
                {...register('financialTransparency', { required: 'This field is required' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ backgroundColor: '#F0F0F0' }}
              >
                <option value="">Select Performance Level</option>
                <option value="excellent">Excellent (10 marks)</option>
                <option value="good">Good (8 marks)</option>
                <option value="average">Average (6 marks)</option>
                <option value="poor">Poor (3 marks)</option>
              </select>
              {errors.financialTransparency && <p className="text-red-500 text-sm mt-1">{errors.financialTransparency.message}</p>}
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">Infrastructure Maintenance Quality *</label>
              <select
                {...register('maintenanceQuality', { required: 'This field is required' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ backgroundColor: '#F0F0F0' }}
              >
                <option value="">Select Performance Level</option>
                <option value="excellent">Excellent (10 marks)</option>
                <option value="good">Good (8 marks)</option>
                <option value="average">Average (6 marks)</option>
                <option value="poor">Poor (3 marks)</option>
              </select>
              {errors.maintenanceQuality && <p className="text-red-500 text-sm mt-1">{errors.maintenanceQuality.message}</p>}
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">Conflict Resolution *</label>
              <select
                {...register('conflictResolution', { required: 'This field is required' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ backgroundColor: '#F0F0F0' }}
              >
                <option value="">Select Performance Level</option>
                <option value="excellent">Excellent (10 marks)</option>
                <option value="good">Good (8 marks)</option>
                <option value="average">Average (6 marks)</option>
                <option value="poor">Poor (3 marks)</option>
              </select>
              {errors.conflictResolution && <p className="text-red-500 text-sm mt-1">{errors.conflictResolution.message}</p>}
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">Member Participation *</label>
              <select
                {...register('memberParticipation', { required: 'This field is required' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ backgroundColor: '#F0F0F0' }}
              >
                <option value="">Select Performance Level</option>
                <option value="excellent">Excellent (10 marks)</option>
                <option value="good">Good (8 marks)</option>
                <option value="average">Average (6 marks)</option>
                <option value="poor">Poor (3 marks)</option>
              </select>
              {errors.memberParticipation && <p className="text-red-500 text-sm mt-1">{errors.memberParticipation.message}</p>}
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">Record Keeping & Documentation *</label>
              <select
                {...register('recordKeeping', { required: 'This field is required' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ backgroundColor: '#F0F0F0' }}
              >
                <option value="">Select Performance Level</option>
                <option value="excellent">Excellent (10 marks)</option>
                <option value="good">Good (8 marks)</option>
                <option value="average">Average (6 marks)</option>
                <option value="poor">Poor (3 marks)</option>
              </select>
              {errors.recordKeeping && <p className="text-red-500 text-sm mt-1">{errors.recordKeeping.message}</p>}
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Your self-assessment score will be calculated automatically. 
            A minimum of 100 marks out of 150 is required to qualify for the next evaluation round.
          </p>
        </div>
      </div>
    )
  }

  function renderStep5() {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <Award className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Additional Information</h2>
          <p className="text-gray-600">Awards, Achievements & Supporting Documents</p>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Previous Awards/Recognition</label>
            <textarea
              {...register('previousAwards')}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{ backgroundColor: '#F0F0F0' }}
              placeholder="List any previous awards or recognition received by your WUA"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">Major Achievements</label>
            <textarea
              {...register('majorAchievements')}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{ backgroundColor: '#F0F0F0' }}
              placeholder="Describe major achievements and milestones of your WUA"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">Innovation & Technology Adopted</label>
            <textarea
              {...register('innovationAdopted')}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{ backgroundColor: '#F0F0F0' }}
              placeholder="Describe any innovative practices or technology adopted by your WUA"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">Community Impact</label>
            <textarea
              {...register('communityImpact')}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{ backgroundColor: '#F0F0F0' }}
              placeholder="Describe the positive impact your WUA has had on the local community and farmers"
            />
          </div>
        </div>

        <div style={{ backgroundColor: '#E0E0E0' }} className="p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Supporting Documents</h3>
          <div className="text-sm text-gray-600 mb-4">
            Please prepare the following documents for submission (you can upload them after completing this form):
          </div>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-2">
            <li>WUA Registration Certificate</li>
            <li>Latest Audit Reports (2 years)</li>
            <li>Meeting Minutes and Records</li>
            <li>Financial Statements</li>
            <li>Water Tax Collection Records</li>
            <li>Election Records</li>
            <li>Infrastructure Maintenance Records</li>
            <li>Any Award/Recognition Certificates</li>
          </ul>
        </div>
      </div>
    )
  }

  function renderStep6() {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <Send className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Declaration & Submit</h2>
          <p className="text-gray-600">Review and Submit Your WUA Excellence Award Nomination</p>
        </div>
        
        {/* Application Summary */}
        <div style={{ backgroundColor: '#E0E0E0' }} className="p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Application Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">WUA Name:</span>
              <p className="font-medium text-gray-800">{watch('wuaName') || 'Not provided'}</p>
            </div>
            <div>
              <span className="text-gray-600">District:</span>
              <p className="font-medium text-gray-800">{watch('district') || 'Not provided'}</p>
            </div>
            <div>
              <span className="text-gray-600">President:</span>
              <p className="font-medium text-gray-800">{watch('presidentName') || 'Not provided'}</p>
            </div>
            <div>
              <span className="text-gray-600">Total Members:</span>
              <p className="font-medium text-gray-800">{watch('totalMembers') || 'Not provided'}</p>
            </div>
            <div>
              <span className="text-gray-600">Command Area:</span>
              <p className="font-medium text-gray-800">{watch('commandArea') ? `${watch('commandArea')} hectares` : 'Not provided'}</p>
            </div>
            <div>
              <span className="text-gray-600">Self-Assessment Score:</span>
              <p className={`font-bold ${selfAssessmentScore >= 100 ? 'text-green-600' : 'text-orange-600'}`}>
                {selfAssessmentScore}/150 marks
              </p>
            </div>
          </div>
        </div>
        
        {/* Declaration */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Declaration</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                {...register('declaration1', { required: 'This declaration is required' })}
                className="mt-1"
              />
              <label className="text-gray-700 text-sm">
                I hereby declare that all the information provided in this nomination form is true and correct to the best of my knowledge.
              </label>
            </div>
            {errors.declaration1 && <p className="text-red-500 text-sm">{errors.declaration1.message}</p>}
            
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                {...register('declaration2', { required: 'This declaration is required' })}
                className="mt-1"
              />
              <label className="text-gray-700 text-sm">
                I understand that any false information may lead to disqualification from the WUA Excellence Award competition.
              </label>
            </div>
            {errors.declaration2 && <p className="text-red-500 text-sm">{errors.declaration2.message}</p>}
            
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                {...register('declaration3', { required: 'This declaration is required' })}
                className="mt-1"
              />
              <label className="text-gray-700 text-sm">
                I authorize the evaluation committee to verify the information provided and conduct field visits if required.
              </label>
            </div>
            {errors.declaration3 && <p className="text-red-500 text-sm">{errors.declaration3.message}</p>}
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">President Signature Date *</label>
              <input
                type="date"
                {...register('presidentSignatureDate', { required: 'Date is required' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ backgroundColor: '#F0F0F0' }}
              />
              {errors.presidentSignatureDate && <p className="text-red-500 text-sm mt-1">{errors.presidentSignatureDate.message}</p>}
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">Secretary Signature Date *</label>
              <input
                type="date"
                {...register('secretarySignatureDate', { required: 'Date is required' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ backgroundColor: '#F0F0F0' }}
              />
              {errors.secretarySignatureDate && <p className="text-red-500 text-sm mt-1">{errors.secretarySignatureDate.message}</p>}
            </div>
          </div>
        </div>

        {selfAssessmentScore > 0 && (
          <div className={`p-4 rounded-lg ${selfAssessmentScore >= 100 ? 'bg-green-50 text-green-800' : 'bg-orange-50 text-orange-800'}`}>
            <p className="font-medium">
              {selfAssessmentScore >= 100 
                ? `🎉 Congratulations! Your WUA qualifies for the next evaluation round with ${selfAssessmentScore}/150 marks.`
                : `⚠️ Your current score is ${selfAssessmentScore}/150. Consider reviewing your responses to improve your score before submission.`
              }
            </p>
          </div>
        )}
      </div>
    )
  }
}
