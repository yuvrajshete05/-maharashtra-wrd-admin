import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { ArrowLeft, Save, Send, LogOut, Award, Star, Users, TrendingUp, Presentation, Building2, CheckCircle } from 'lucide-react'

// Browser-Only Session Manager
class BrowserSessionManager {
  static forceLogoutAdmin(): boolean {
    localStorage.removeItem('admin_active_session');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    return true;
  }
}

// State Committee Evaluation Form Data (Exact as per specifications - 5 Questions, 20 Marks)
interface StateEvaluationData {
  // Application Details
  applicationId: string
  wuaName: string
  applicantName: string
  district: string
  corporationCommitteeScore: number
  
  // Question 1: Best Practice/Success Story (4 marks)
  bestPracticeScore: number
  bestPracticeRemarks: string
  
  // Question 2: Inter-Departmental Coordination (4 marks)  
  coordinationScore: number
  coordinationRemarks: string
  
  // Question 3: Long-Term Sustainability (4 marks)
  sustainabilityScore: number
  sustainabilityRemarks: string
  
  // Question 4: Leadership Quality and Vision (4 marks)
  leadershipScore: number
  leadershipRemarks: string
  
  // Question 5: Overall Presentation/Interview (4 marks)
  presentationScore: number
  presentationRemarks: string
  
  // Final Award Decision
  totalStateScore: number // Sum of all 5 questions (max 20)
  grandTotalScore: number // Self-assessment(150) + Corporation(30) + State(20) = 200
  awardCategory: '1st_tier' | '2nd_tier' | '3rd_tier' | '4th_tier' | '5th_tier' | 'no_award'
  awardJustification: string
  
  // Committee Details
  evaluatedBy: string
  evaluationDate: string
  committeeSignature: string
}

export default function StateCommitteeEvaluationNew() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [userToken, setUserToken] = useState<string | null>(null)
  const [userData, setUserData] = useState<any>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
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
  } = useForm<StateEvaluationData>()

  // Watch form values for real-time calculation
  const watchedValues = watch()

  // Calculate total scores
  const calculateStateScore = () => {
    const values = watchedValues
    return (
      (Number(values.bestPracticeScore) || 0) +
      (Number(values.coordinationScore) || 0) +
      (Number(values.sustainabilityScore) || 0) +
      (Number(values.leadershipScore) || 0) +
      (Number(values.presentationScore) || 0)
    )
  }

  const calculateGrandTotal = () => {
    const selfAssessment = selectedNomination?.scores?.selfAssessment || 0
    const corporation = selectedNomination?.scores?.corporationCommittee || 0
    const state = calculateStateScore()
    return selfAssessment + corporation + state
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
      // Check if user is authorized for state committee evaluation
      if (!['admin', 'super-admin', 'state-committee'].includes(parsedData.userType || parsedData.adminLevel)) {
        toast.error('Access denied. State Committee members only.')
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

  // Load nominations from MongoDB (only corporation-approved)
  const loadNominations = async (token: string, adminData: any) => {
    setIsLoadingData(true)
    try {
      const response = await fetch('/api/nominations/get-for-evaluation?stage=state', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const result = await response.json()
      if (result.success) {
        setNominations(result.nominations)
        console.log(`✅ Loaded ${result.nominations.length} nominations for state evaluation`)
        
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
    setValue('corporationCommitteeScore', nomination.scores?.corporationCommittee || 0)
    setValue('evaluationDate', new Date().toISOString().split('T')[0])
    setValue('evaluatedBy', userData?.name || userData?.adminName || '')
    
    toast.success(`Selected: ${nomination.wuaName} for final evaluation`)
  }

  // Logout handler
  const handleLogout = () => {
    BrowserSessionManager.forceLogoutAdmin();
    toast.success('Logged out successfully');
    router.push('/admin/login');
  }

  // Form submission
  const onSubmit = async (data: StateEvaluationData) => {
    if (!userToken) {
      toast.error('Authentication required')
      return
    }

    // Calculate final scores
    const stateScore = calculateStateScore()
    const grandTotal = calculateGrandTotal()
    
    data.totalStateScore = stateScore
    data.grandTotalScore = grandTotal

    setIsLoading(true)

    try {
      // Simulate API call to save evaluation
      await new Promise(resolve => setTimeout(resolve, 2000))

      console.log('State Committee Evaluation Data:', data)
      toast.success(`Final evaluation completed! Grand Total: ${grandTotal}/200 marks, Award: ${data.awardCategory}`)
      
      // Reset form after successful submission
      reset()
      setCurrentQuestion(0)
      
      // Redirect to dashboard
      setTimeout(() => {
        router.push('/admin/dashboard')
      }, 3000)
      
    } catch (error) {
      console.error('Submission error:', error)
      toast.error('Failed to submit evaluation. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const questions = [
    {
      id: 1,
      title: 'Best Practice/Success Story',
      icon: Star,
      maxMarks: 4,
      description: 'WUA की सबसे बड़ी सफलता',
      questionText: 'Q1: Best Practice/Success Story - What is the biggest success story or best practice of this WUA that can serve as a model for other WUAs?'
    },
    {
      id: 2,
      title: 'Inter-Departmental Coordination',
      icon: Building2,
      maxMarks: 4,
      description: 'दूसरे सरकारी विभागों के साथ तालमेल',
      questionText: 'Q2: Inter-Departmental Coordination - How effectively does the WUA coordinate with other government departments and agencies for integrated water management?'
    },
    {
      id: 3,
      title: 'Long-Term Sustainability',
      icon: TrendingUp,
      maxMarks: 4,
      description: 'लंबे समय तक WUA की सफलता',
      questionText: 'Q3: Long-Term Sustainability - What are the strategies and measures in place to ensure the WUA\'s success and functionality in the long term?'
    },
    {
      id: 4,
      title: 'Leadership Quality and Vision',
      icon: Users,
      maxMarks: 4,
      description: 'अध्यक्ष/टीम की नेतृत्व क्षमता',
      questionText: 'Q4: Leadership Quality and Vision - Evaluate the leadership capabilities, vision, and decision-making quality of the WUA chairman and management team.'
    },
    {
      id: 5,
      title: 'Overall Presentation/Interview',
      icon: Presentation,
      maxMarks: 4,
      description: 'फाइनल प्रेजेंटेशन और प्रश्न-उत्तर',
      questionText: 'Q5: Overall Presentation/Interview - Assess the quality of the final presentation and the WUA team\'s ability to answer questions and demonstrate their achievements.'
    }
  ]

  const awardTiers = [
    { value: '1st_tier', label: '1st Tier Award (उत्कृष्ट पुरस्कार)', minScore: 180, color: 'gold' },
    { value: '2nd_tier', label: '2nd Tier Award (श्रेष्ठ पुरस्कार)', minScore: 160, color: 'silver' },
    { value: '3rd_tier', label: '3rd Tier Award (अच्छा पुरस्कार)', minScore: 140, color: 'bronze' },
    { value: '4th_tier', label: '4th Tier Award (संतोषजनक पुरस्कार)', minScore: 120, color: 'blue' },
    { value: '5th_tier', label: '5th Tier Award (प्रोत्साहन पुरस्कार)', minScore: 100, color: 'green' },
    { value: 'no_award', label: 'No Award (कोई पुरस्कार नहीं)', minScore: 0, color: 'gray' }
  ]

  const currentStateScore = calculateStateScore()
  const currentGrandTotal = calculateGrandTotal()

  if (!userToken || isLoadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading nominations for state committee evaluation...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>State Committee Final Evaluation - Maharashtra WRD</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
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
                  <Award className="text-yellow-400" size={24} />
                  <div>
                    <h1 className="text-xl font-bold text-white">State Committee Final Evaluation</h1>
                    <p className="text-white/60 text-sm">राज्य समिति अंतिम मूल्यांकन - Max 20 Marks (5 Questions × 4 Each)</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-white text-sm">
                    <div>State Score: <span className="font-bold text-lg text-yellow-300">{currentStateScore}/20</span></div>
                    <div>Grand Total: <span className="font-bold text-xl text-yellow-300">{currentGrandTotal}/200</span></div>
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
            {/* Question Progress */}
            <div className="government-card p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                {questions.map((question, index) => (
                  <div key={index} className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                      currentQuestion >= index ? 'bg-yellow-500 text-white' : 'bg-gray-300 text-gray-600'
                    }`}>
                      {question.id}
                    </div>
                    <div className="ml-3 text-left">
                      <div className={`text-sm font-medium ${
                        currentQuestion >= index ? 'text-yellow-600' : 'text-gray-500'
                      }`}>
                        {question.title}
                      </div>
                      <div className="text-xs text-gray-500">{question.maxMarks} marks</div>
                    </div>
                    {index < questions.length - 1 && (
                      <div className={`w-12 h-1 mx-4 ${
                        currentQuestion > index ? 'bg-yellow-500' : 'bg-gray-300'
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
                  Select Corporation-Approved Nomination for Final Evaluation
                  <span className="text-sm font-normal text-gray-600 ml-2">
                    (Only nominations recommended by Corporation Committee)
                  </span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {nominations.map((nomination) => (
                    <div
                      key={nomination.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedNomination?.id === nomination.id
                          ? 'border-yellow-500 bg-yellow-50'
                          : 'border-gray-200 hover:border-yellow-300'
                      }`}
                      onClick={() => selectNominationForEvaluation(nomination)}
                    >
                      <h3 className="font-bold text-gray-800">{nomination.wuaName}</h3>
                      <p className="text-sm text-gray-600">ID: {nomination.wuaId}</p>
                      <p className="text-sm text-gray-600">District: {nomination.district}</p>
                      <p className="text-sm text-gray-600">Chairman: {nomination.chairmanName}</p>
                      <div className="mt-2 space-x-2">
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          Circle Approved
                        </span>
                        <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                          Corporation Approved
                        </span>
                      </div>
                      <div className="mt-2">
                        <p className="text-xs text-gray-500">
                          Scores: Self({nomination.scores?.selfAssessment || 0}) + Corp({nomination.scores?.corporationCommittee || 0}) = {(nomination.scores?.selfAssessment || 0) + (nomination.scores?.corporationCommittee || 0)}/180
                        </p>
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
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">State Committee Final Assessment</h2>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="grid grid-cols-3 gap-4 text-blue-800">
                      <p><strong>Self-Assessment:</strong> {selectedNomination?.scores?.selfAssessment || 0}/150</p>
                      <p><strong>Corporation Score:</strong> {selectedNomination?.scores?.corporationCommittee || 0}/30</p>
                      <p><strong>Current Total:</strong> {(selectedNomination?.scores?.selfAssessment || 0) + (selectedNomination?.scores?.corporationCommittee || 0)}/180</p>
                    </div>
                  </div>
                </div>

                {/* Current Question */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 mb-6">
                    {React.createElement(questions[currentQuestion].icon, { className: "text-yellow-500", size: 24 })}
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{questions[currentQuestion].title}</h3>
                      <p className="text-gray-600 text-sm">{questions[currentQuestion].description}</p>
                      <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium inline-block mt-2">
                        Max {questions[currentQuestion].maxMarks} Marks
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <h4 className="font-bold text-gray-800 mb-4">Question:</h4>
                    <p className="text-gray-700 mb-6">{questions[currentQuestion].questionText}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Score (अंक) - Out of {questions[currentQuestion].maxMarks}
                        </label>
                        <input
                          type="number"
                          min="0"
                          max={questions[currentQuestion].maxMarks}
                          step="0.5"
                          {...register(
                            currentQuestion === 0 ? 'bestPracticeScore' :
                            currentQuestion === 1 ? 'coordinationScore' :
                            currentQuestion === 2 ? 'sustainabilityScore' :
                            currentQuestion === 3 ? 'leadershipScore' :
                            'presentationScore',
                            { 
                              required: 'Score is required',
                              min: { value: 0, message: `Minimum 0 marks` },
                              max: { value: questions[currentQuestion].maxMarks, message: `Maximum ${questions[currentQuestion].maxMarks} marks` }
                            }
                          )}
                          className="government-input"
                          placeholder={`Enter score out of ${questions[currentQuestion].maxMarks}...`}
                        />
                        {errors[
                          currentQuestion === 0 ? 'bestPracticeScore' :
                          currentQuestion === 1 ? 'coordinationScore' :
                          currentQuestion === 2 ? 'sustainabilityScore' :
                          currentQuestion === 3 ? 'leadershipScore' :
                          'presentationScore'
                        ] && (
                          <p className="text-red-600 text-sm mt-1">
                            {errors[
                              currentQuestion === 0 ? 'bestPracticeScore' :
                              currentQuestion === 1 ? 'coordinationScore' :
                              currentQuestion === 2 ? 'sustainabilityScore' :
                              currentQuestion === 3 ? 'leadershipScore' :
                              'presentationScore'
                            ]?.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Detailed Assessment (विस्तृत मूल्यांकन)
                        </label>
                        <textarea
                          {...register(
                            currentQuestion === 0 ? 'bestPracticeRemarks' :
                            currentQuestion === 1 ? 'coordinationRemarks' :
                            currentQuestion === 2 ? 'sustainabilityRemarks' :
                            currentQuestion === 3 ? 'leadershipRemarks' :
                            'presentationRemarks',
                            { required: 'Assessment remarks are required' }
                          )}
                          rows={4}
                          className="government-input"
                          placeholder="Provide detailed assessment and justification for the score given..."
                        />
                        {errors[
                          currentQuestion === 0 ? 'bestPracticeRemarks' :
                          currentQuestion === 1 ? 'coordinationRemarks' :
                          currentQuestion === 2 ? 'sustainabilityRemarks' :
                          currentQuestion === 3 ? 'leadershipRemarks' :
                          'presentationRemarks'
                        ] && (
                          <p className="text-red-600 text-sm mt-1">
                            {errors[
                              currentQuestion === 0 ? 'bestPracticeRemarks' :
                              currentQuestion === 1 ? 'coordinationRemarks' :
                              currentQuestion === 2 ? 'sustainabilityRemarks' :
                              currentQuestion === 3 ? 'leadershipRemarks' :
                              'presentationRemarks'
                            ]?.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Final Award Decision (shown only on last question) */}
                  {currentQuestion === questions.length - 1 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-8">
                      <h4 className="font-bold text-yellow-800 mb-4 flex items-center">
                        <Award className="mr-2" size={20} />
                        Final Award Decision (अंतिम पुरस्कार निर्णय)
                      </h4>
                      
                      <div className="mb-6 p-4 bg-white border border-yellow-300 rounded-lg">
                        <h5 className="font-bold text-gray-800 mb-3">Complete Score Summary:</h5>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Self-Assessment:</p>
                            <p className="font-bold text-lg">{selectedNomination?.scores?.selfAssessment || 0}/150</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Corporation:</p>
                            <p className="font-bold text-lg">{selectedNomination?.scores?.corporationCommittee || 0}/30</p>
                          </div>
                          <div>
                            <p className="text-gray-600">State Committee:</p>
                            <p className="font-bold text-lg text-yellow-600">{currentStateScore}/20</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Grand Total:</p>
                            <p className="font-bold text-2xl text-yellow-800">{currentGrandTotal}/200</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Award Category (पुरस्कार श्रेणी)
                          </label>
                          <select
                            {...register('awardCategory', { required: 'Award category is required' })}
                            className="government-input"
                          >
                            <option value="">Select Award Category...</option>
                            {awardTiers.map((tier) => (
                              <option key={tier.value} value={tier.value}>
                                {tier.label} (Min: {tier.minScore}/200)
                              </option>
                            ))}
                          </select>
                          {errors.awardCategory && (
                            <p className="text-red-600 text-sm mt-1">{errors.awardCategory.message}</p>
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

                      <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Award Justification (पुरस्कार औचित्य)
                        </label>
                        <textarea
                          {...register('awardJustification', { required: 'Award justification is required' })}
                          rows={4}
                          className="government-input"
                          placeholder="Provide detailed justification for the award category selection and overall assessment..."
                        />
                        {errors.awardJustification && (
                          <p className="text-red-600 text-sm mt-1">{errors.awardJustification.message}</p>
                        )}
                      </div>

                      <div className="mt-6 p-4 bg-white border border-yellow-300 rounded-lg">
                        <h5 className="font-bold text-gray-800 mb-2">State Committee Score Breakdown:</h5>
                        <div className="text-sm space-y-1">
                          <p>Q1 - Best Practice: <span className="font-bold">{watchedValues.bestPracticeScore || 0}/4</span></p>
                          <p>Q2 - Inter-Departmental Coordination: <span className="font-bold">{watchedValues.coordinationScore || 0}/4</span></p>
                          <p>Q3 - Long-Term Sustainability: <span className="font-bold">{watchedValues.sustainabilityScore || 0}/4</span></p>
                          <p>Q4 - Leadership Quality: <span className="font-bold">{watchedValues.leadershipScore || 0}/4</span></p>
                          <p>Q5 - Overall Presentation: <span className="font-bold">{watchedValues.presentationScore || 0}/4</span></p>
                          <hr className="my-2" />
                          <p className="text-lg font-bold text-yellow-800">
                            Total State Score: <span className="text-2xl">{currentStateScore}/20</span>
                          </p>
                          <p className="text-xl font-bold text-green-800">
                            FINAL GRAND TOTAL: <span className="text-3xl">{currentGrandTotal}/200</span>
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
                    onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                    disabled={currentQuestion === 0}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                      currentQuestion === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-500 text-white hover:bg-gray-600'
                    }`}
                  >
                    Previous Question
                  </button>

                  <div className="text-sm text-gray-600 text-center">
                    <div>Question {currentQuestion + 1} of {questions.length}</div>
                    <div>State: {currentStateScore}/20 | Grand Total: {currentGrandTotal}/200</div>
                  </div>

                  {currentQuestion < questions.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
                      className="px-6 py-2 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700 transition-colors"
                    >
                      Next Question
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                        isLoading
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'government-button bg-gradient-to-r from-yellow-500 to-orange-500'
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Submitting Final Award...</span>
                        </>
                      ) : (
                        <>
                          <Award size={16} />
                          <span>Submit Final Award Decision</span>
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