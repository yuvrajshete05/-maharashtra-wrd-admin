import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { ArrowLeft, Save, Send, LogOut, Building, TrendingUp, DollarSign, Users, FileCheck, CheckCircle } from 'lucide-react'

// Browser-Only Session Manager
class BrowserSessionManager {
  static forceLogoutAdmin(): boolean {
    localStorage.removeItem('admin_active_session');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    return true;
  }
}

// Corporation Committee Evaluation Form Data (Exact as per specifications - 5 Modules, 30 Marks)
interface CorporationEvaluationData {
  // Application Details
  applicationId: string
  wuaName: string
  applicantName: string
  district: string
  circleCommitteeScore: number
  
  // Module 1: Strategic Planning and Vision (6 marks)
  strategicPlanningScore: number
  strategicPlanningRemarks: string
  
  // Module 2: Water Use Efficiency/Innovation (6 marks)  
  waterEfficiencyScore: number
  waterEfficiencyRemarks: string
  
  // Module 3: Financial Sustainability Model (6 marks)
  financialSustainabilityScore: number
  financialSustainabilityRemarks: string
  
  // Module 4: Community Impact and Social Equity (6 marks)
  communityImpactScore: number
  communityImpactRemarks: string
  
  // Module 5: Compliance and Reporting Quality (6 marks)
  complianceQualityScore: number
  complianceQualityRemarks: string
  
  // Summary
  totalCorporationScore: number // Sum of all 5 modules (max 30)
  finalRecommendation: 'recommended' | 'not_recommended'
  overallRemarks: string
  
  // Committee Details
  evaluatedBy: string
  evaluationDate: string
  committeeSignature: string
}

export default function CorporationCommitteeEvaluationNew() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [userToken, setUserToken] = useState<string | null>(null)
  const [userData, setUserData] = useState<any>(null)
  const [currentModule, setCurrentModule] = useState(0)
  const [nominations, setNominations] = useState<any[]>([])
  const [selectedNomination, setSelectedNomination] = useState<any>(null)
  const [isLoadingData, setIsLoadingData] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset
  } = useForm<CorporationEvaluationData>()

  // Watch form values for real-time calculation
  const watchedValues = watch()

  // Calculate total score
  const calculateTotalScore = () => {
    const values = watchedValues
    return (
      (Number(values.strategicPlanningScore) || 0) +
      (Number(values.waterEfficiencyScore) || 0) +
      (Number(values.financialSustainabilityScore) || 0) +
      (Number(values.communityImpactScore) || 0) +
      (Number(values.complianceQualityScore) || 0)
    )
  }

  // Authentication check
  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    const adminData = localStorage.getItem('adminData')

    if (!token || !adminData) {
      toast.error('Please login first')
      router.push('/admin/login')
      return
    }

    try {
      const parsedData = JSON.parse(adminData)
      // Check if user is authorized for corporation committee evaluation
      if (!['admin', 'super-admin', 'corporation-committee'].includes(parsedData.userType || parsedData.adminLevel)) {
        toast.error('Access denied. Corporation Committee members only.')
        router.push('/admin/dashboard')
        return
      }
      setUserToken(token)
      setUserData(parsedData)
      
      // Load nominations for evaluation
      loadNominations(token, parsedData)
    } catch (error) {
      console.error('Auth error:', error)
      toast.error('Invalid session')
      router.push('/admin/login')
    }
  }, [router])

  // Load nominations from MongoDB (only circle-approved)
  const loadNominations = async (token: string, adminData: any) => {
    setIsLoadingData(true)
    try {
      const response = await fetch('/api/nominations/get-for-evaluation?stage=corporation', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const result = await response.json()
      if (result.success) {
        setNominations(result.nominations)
        console.log(`✅ Loaded ${result.nominations.length} nominations for corporation evaluation`)
        
        // Auto-select first nomination if available
        if (result.nominations.length > 0) {
          selectNominationForEvaluation(result.nominations[0])
        }
      } else {
        toast.error('Failed to load nominations')
      }
    } catch (error) {
      console.error('Error loading nominations:', error)
      toast.error('Network error loading nominations')
    } finally {
      setIsLoadingData(false)
    }
  }

  // Select nomination for evaluation
  const selectNominationForEvaluation = (nomination: any) => {
    setSelectedNomination(nomination)
    
    // Pre-fill form with nomination data
    setValue('applicationId', nomination.wuaId)
    setValue('wuaName', nomination.wuaName)
    setValue('applicantName', nomination.chairmanName)
    setValue('district', nomination.district)
    setValue('circleCommitteeScore', nomination.scores?.circleCommittee || 0)
    setValue('evaluationDate', new Date().toISOString().split('T')[0])
    setValue('evaluatedBy', userData?.name || userData?.adminName || '')
    
    toast.success(`Selected: ${nomination.wuaName} for evaluation`)
  }

  // Logout handler
  const handleLogout = () => {
    BrowserSessionManager.forceLogoutAdmin();
    toast.success('Logged out successfully');
    router.push('/admin/login');
  }

  // Form submission
  const onSubmit = async (data: CorporationEvaluationData) => {
    if (!userToken) {
      toast.error('Authentication required')
      return
    }

    // Calculate total score
    const totalScore = calculateTotalScore()
    data.totalCorporationScore = totalScore

    setIsLoading(true)

    try {
      // Simulate API call to save evaluation
      await new Promise(resolve => setTimeout(resolve, 2000))

      console.log('Corporation Committee Evaluation Data:', data)
      toast.success(`Evaluation submitted! Total Score: ${totalScore}/30 marks`)
      
      // Reset form after successful submission
      reset()
      setCurrentModule(0)
      
      // Redirect to dashboard
      setTimeout(() => {
        router.push('/admin/dashboard')
      }, 2000)
      
    } catch (error) {
      console.error('Submission error:', error)
      toast.error('Failed to submit evaluation. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const modules = [
    {
      id: 1,
      title: 'Strategic Planning & Vision',
      icon: TrendingUp,
      maxMarks: 6,
      description: 'WUA की अगले 5 साल की योजना',
      questionText: 'Q1 (Module 1): Strategic Planning and Vision - Evaluate the WUA\'s 5-year strategic plan and future vision for water management and organizational development.'
    },
    {
      id: 2,
      title: 'Water Use Efficiency/Innovation',
      icon: Building,
      maxMarks: 6,
      description: 'जल उपयोग में सुधार के लिए नवाचार',
      questionText: 'Q2 (Module 2): Water Use Efficiency/Innovation - Assess what new measures the WUA has implemented for improving water use efficiency and innovative practices.'
    },
    {
      id: 3,
      title: 'Financial Sustainability Model',
      icon: DollarSign,
      maxMarks: 6,
      description: 'आत्मनिर्भरता और राजस्व सृजन',
      questionText: 'Q3 (Module 3): Financial Sustainability Model - Evaluate the WUA\'s self-reliance strategies and revenue generation mechanisms for long-term sustainability.'
    },
    {
      id: 4,
      title: 'Community Impact & Social Equity',
      icon: Users,
      maxMarks: 6,
      description: 'सभी किसानों तक पानी पहुंचाना',
      questionText: 'Q4 (Module 4): Community Impact and Social Equity - Assess how effectively the WUA ensures water access to all farmers and promotes social equity.'
    },
    {
      id: 5,
      title: 'Compliance & Reporting Quality',
      icon: FileCheck,
      maxMarks: 6,
      description: 'सरकारी नियम और रिपोर्ट की गुणवत्ता',
      questionText: 'Q5 (Module 5): Compliance and Reporting Quality - Evaluate the quality of government compliance and reporting practices maintained by the WUA.'
    }
  ]

  const currentTotalScore = calculateTotalScore()

  if (!userToken || isLoadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading nominations for corporation evaluation...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Corporation Committee Evaluation - Maharashtra WRD</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%219C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>

        {/* Header */}
        <div className="relative z-10">
          <div className="bg-white/10 backdrop-blur-md border-b border-white/20">
            <div className="container mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => router.push('/admin/dashboard')}
                    className="flex items-center text-white/80 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Dashboard
                  </button>
                  <div className="h-6 w-px bg-white/20"></div>
                  <Building className="text-purple-400" size={24} />
                  <div>
                    <h1 className="text-xl font-bold text-white">Corporation Committee Evaluation</h1>
                    <p className="text-white/60 text-sm">निगम समिति मूल्यांकन - Max 30 Marks (5 Modules × 6 Each)</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-white text-sm">
                    Current Score: <span className="font-bold text-lg text-purple-300">{currentTotalScore}/30</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="container mx-auto px-6 py-8">
            {/* Module Progress */}
            <div className="government-card p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                {modules.map((module, index) => (
                  <div key={index} className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                      currentModule >= index ? 'bg-purple-500 text-white' : 'bg-gray-300 text-gray-600'
                    }`}>
                      {module.id}
                    </div>
                    <div className="ml-3 text-left">
                      <div className={`text-sm font-medium ${
                        currentModule >= index ? 'text-purple-600' : 'text-gray-500'
                      }`}>
                        {module.title}
                      </div>
                      <div className="text-xs text-gray-500">{module.maxMarks} marks</div>
                    </div>
                    {index < modules.length - 1 && (
                      <div className={`w-12 h-1 mx-4 ${
                        currentModule > index ? 'bg-purple-500' : 'bg-gray-300'
                      }`}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Nomination Selection */}
            {nominations.length > 0 && (
              <div className="government-card p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Select Circle-Approved Nomination for Evaluation
                  <span className="text-sm font-normal text-gray-600 ml-2">
                    (Only nominations recommended by Circle Committee)
                  </span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {nominations.map((nomination) => (
                    <div
                      key={nomination.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedNomination?.id === nomination.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                      onClick={() => selectNominationForEvaluation(nomination)}
                    >
                      <h3 className="font-bold text-gray-800">{nomination.wuaName}</h3>
                      <p className="text-sm text-gray-600">ID: {nomination.wuaId}</p>
                      <p className="text-sm text-gray-600">District: {nomination.district}</p>
                      <p className="text-sm text-gray-600">Chairman: {nomination.chairmanName}</p>
                      <div className="mt-2">
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          Circle Approved
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Evaluation Form */}
            {selectedNomination && (
              <form onSubmit={handleSubmit(onSubmit)} className="government-card p-8">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Corporation Committee Assessment</h2>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800">
                      <strong>Previous Score:</strong> Circle Committee Recommendation - 
                      <span className="font-bold ml-1">{selectedNomination?.scores?.circleCommittee || 'Approved'}</span>
                    </p>
                  </div>
                </div>

                {/* Current Module */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 mb-6">
                    {React.createElement(modules[currentModule].icon, { className: "text-purple-500", size: 24 })}
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{modules[currentModule].title}</h3>
                      <p className="text-gray-600 text-sm">{modules[currentModule].description}</p>
                      <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium inline-block mt-2">
                        Max {modules[currentModule].maxMarks} Marks
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <h4 className="font-bold text-gray-800 mb-4">Question:</h4>
                    <p className="text-gray-700 mb-6">{modules[currentModule].questionText}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Score (अंक) - Out of {modules[currentModule].maxMarks}
                        </label>
                        <input
                          type="number"
                          min="0"
                          max={modules[currentModule].maxMarks}
                          {...register(
                            currentModule === 0 ? 'strategicPlanningScore' :
                            currentModule === 1 ? 'waterEfficiencyScore' :
                            currentModule === 2 ? 'financialSustainabilityScore' :
                            currentModule === 3 ? 'communityImpactScore' :
                            'complianceQualityScore',
                            { 
                              required: 'Score is required',
                              min: { value: 0, message: `Minimum 0 marks` },
                              max: { value: modules[currentModule].maxMarks, message: `Maximum ${modules[currentModule].maxMarks} marks` }
                            }
                          )}
                          className="government-input"
                          placeholder={`Enter score out of ${modules[currentModule].maxMarks}...`}
                        />
                        {errors[
                          currentModule === 0 ? 'strategicPlanningScore' :
                          currentModule === 1 ? 'waterEfficiencyScore' :
                          currentModule === 2 ? 'financialSustainabilityScore' :
                          currentModule === 3 ? 'communityImpactScore' :
                          'complianceQualityScore'
                        ] && (
                          <p className="text-red-600 text-sm mt-1">
                            {errors[
                              currentModule === 0 ? 'strategicPlanningScore' :
                              currentModule === 1 ? 'waterEfficiencyScore' :
                              currentModule === 2 ? 'financialSustainabilityScore' :
                              currentModule === 3 ? 'communityImpactScore' :
                              'complianceQualityScore'
                            ]?.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Detailed Remarks (विस्तृत टिप्पणी)
                        </label>
                        <textarea
                          {...register(
                            currentModule === 0 ? 'strategicPlanningRemarks' :
                            currentModule === 1 ? 'waterEfficiencyRemarks' :
                            currentModule === 2 ? 'financialSustainabilityRemarks' :
                            currentModule === 3 ? 'communityImpactRemarks' :
                            'complianceQualityRemarks',
                            { required: 'Remarks are required' }
                          )}
                          rows={4}
                          className="government-input"
                          placeholder="Provide detailed assessment and justification for the score given..."
                        />
                        {errors[
                          currentModule === 0 ? 'strategicPlanningRemarks' :
                          currentModule === 1 ? 'waterEfficiencyRemarks' :
                          currentModule === 2 ? 'financialSustainabilityRemarks' :
                          currentModule === 3 ? 'communityImpactRemarks' :
                          'complianceQualityRemarks'
                        ] && (
                          <p className="text-red-600 text-sm mt-1">
                            {errors[
                              currentModule === 0 ? 'strategicPlanningRemarks' :
                              currentModule === 1 ? 'waterEfficiencyRemarks' :
                              currentModule === 2 ? 'financialSustainabilityRemarks' :
                              currentModule === 3 ? 'communityImpactRemarks' :
                              'complianceQualityRemarks'
                            ]?.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Final Recommendation (shown only on last module) */}
                  {currentModule === modules.length - 1 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-8">
                      <h4 className="font-bold text-green-800 mb-4">Final Corporation Committee Decision</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Final Recommendation (अंतिम सिफारिश)
                          </label>
                          <select
                            {...register('finalRecommendation', { required: 'Final recommendation is required' })}
                            className="government-input"
                          >
                            <option value="">Select...</option>
                            <option value="recommended">Recommended for State Committee (राज्य समिति के लिए सिफारिश)</option>
                            <option value="not_recommended">Not Recommended (सिफारिश नहीं)</option>
                          </select>
                          {errors.finalRecommendation && (
                            <p className="text-red-600 text-sm mt-1">{errors.finalRecommendation.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Committee Signature (समिति हस्ताक्षर)
                          </label>
                          <input
                            type="text"
                            {...register('committeeSignature', { required: 'Signature is required' })}
                            className="government-input"
                            placeholder="Digital signature or authorized name..."
                          />
                          {errors.committeeSignature && (
                            <p className="text-red-600 text-sm mt-1">{errors.committeeSignature.message}</p>
                          )}
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Overall Assessment Remarks (समग्र मूल्यांकन टिप्पणी)
                        </label>
                        <textarea
                          {...register('overallRemarks', { required: 'Overall remarks are required' })}
                          rows={4}
                          className="government-input"
                          placeholder="Provide overall assessment summary and recommendations for State Committee..."
                        />
                        {errors.overallRemarks && (
                          <p className="text-red-600 text-sm mt-1">{errors.overallRemarks.message}</p>
                        )}
                      </div>

                      <div className="mt-4 p-4 bg-white border border-green-300 rounded-lg">
                        <h5 className="font-bold text-gray-800 mb-2">Score Summary:</h5>
                        <div className="text-sm space-y-1">
                          <p>Strategic Planning: <span className="font-bold">{watchedValues.strategicPlanningScore || 0}/6</span></p>
                          <p>Water Efficiency: <span className="font-bold">{watchedValues.waterEfficiencyScore || 0}/6</span></p>
                          <p>Financial Sustainability: <span className="font-bold">{watchedValues.financialSustainabilityScore || 0}/6</span></p>
                          <p>Community Impact: <span className="font-bold">{watchedValues.communityImpactScore || 0}/6</span></p>
                          <p>Compliance Quality: <span className="font-bold">{watchedValues.complianceQualityScore || 0}/6</span></p>
                          <hr className="my-2" />
                          <p className="text-lg font-bold text-green-800">
                            Total Corporation Score: <span className="text-2xl">{currentTotalScore}/30</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setCurrentModule(Math.max(0, currentModule - 1))}
                    disabled={currentModule === 0}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                      currentModule === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-500 text-white hover:bg-gray-600'
                    }`}
                  >
                    Previous Module
                  </button>

                  <div className="text-sm text-gray-600">
                    Module {currentModule + 1} of {modules.length} | Score: {currentTotalScore}/30
                  </div>

                  {currentModule < modules.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentModule(Math.min(modules.length - 1, currentModule + 1))}
                      className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
                    >
                      Next Module
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                        isLoading
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'government-button'
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          <span>Submit Evaluation</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  )
}