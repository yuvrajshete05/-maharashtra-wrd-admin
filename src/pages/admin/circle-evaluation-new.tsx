import { useState, useEffect } from 'react'import { useState, useEffect } from 'react'import { useState, useEffect } from 'react'import { useState, useEffect } from 'react'

import { useRouter } from 'next/router'

import Head from 'next/head'import { useRouter } from 'next/router'

import toast from 'react-hot-toast'

import { ArrowLeft, LogOut, FileCheck } from 'lucide-react'import Head from 'next/head'import { useRouter } from 'next/router'import { useRouter } from 'next/router'



export default function CircleCommitteeEvaluationNew() {import toast from 'react-hot-toast'

  const router = useRouter()

  const [userToken, setUserToken] = useState<string | null>(null)import { ArrowLeft, LogOut, FileCheck } from 'lucide-react'import Head from 'next/head'import Head from 'next/head'

  const [userData, setUserData] = useState<any>(null)



  // Authentication check

  useEffect(() => {export default function CircleCommitteeEvaluationNew() {import toast from 'react-hot-toast'import { useForm } from 'react-hook-form'

    const token = localStorage.getItem('adminToken')

    const adminData = localStorage.getItem('adminData')  const router = useRouter()



    if (!token || !adminData) {  const [userToken, setUserToken] = useState<string | null>(null)import { ArrowLeft, LogOut, FileCheck } from 'lucide-react'import toast from 'react-hot-toast'

      toast.error('Please login first')

      router.push('/admin/login')  const [userData, setUserData] = useState<any>(null)

      return

    }import { ArrowLeft, Save, Send, LogOut, FileCheck, MapPin, CheckCircle, XCircle, AlertTriangle, Eye, Users, Droplets, FileText } from 'lucide-react'



    try {  // Authentication check

      const parsedData = JSON.parse(adminData)

      setUserToken(token)  useEffect(() => {export default function CircleCommitteeEvaluationNew() {

      setUserData(parsedData)

    } catch (error) {    const token = localStorage.getItem('adminToken')

      console.error('Auth error:', error)

      toast.error('Invalid session')    const adminData = localStorage.getItem('adminData')  const router = useRouter()// Browser-Only Session Manager

      router.push('/admin/login')

    }

  }, [router])

    if (!token || !adminData) {  const [userToken, setUserToken] = useState<string | null>(null)class BrowserSessionManager {

  // Logout handler

  const handleLogout = () => {      toast.error('Please login first')

    localStorage.removeItem('admin_active_session')

    localStorage.removeItem('adminToken')      router.push('/admin/login')  const [userData, setUserData] = useState<any>(null)  static forceLogoutAdmin(): boolean {

    localStorage.removeItem('adminData')

    toast.success('Logged out successfully')      return

    router.push('/admin/login')

  }    }    localStorage.removeItem('admin_active_session');



  if (!userToken) {

    return (

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">    try {  // Authentication check    localStorage.removeItem('adminToken');

        <div className="text-center">

          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>      const parsedData = JSON.parse(adminData)

          <p className="text-white">Loading...</p>

        </div>      setUserToken(token)  useEffect(() => {    localStorage.removeItem('adminData');

      </div>

    )      setUserData(parsedData)

  }

    } catch (error) {    const token = localStorage.getItem('adminToken')    return true;

  return (

    <>      console.error('Auth error:', error)

      <Head>

        <title>Circle Committee Evaluation - Maharashtra WRD</title>      toast.error('Invalid session')    const adminData = localStorage.getItem('adminData')  }

      </Head>

      router.push('/admin/login')

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">

        {/* Background Pattern */}    }}

        <div className="absolute inset-0 opacity-20" style={{

          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`  }, [router])

        }}></div>

    if (!token || !adminData) {

        {/* Header */}

        <div className="relative z-10">  // Logout handler

          <div className="bg-white/10 backdrop-blur-md border-b border-white/20">

            <div className="container mx-auto px-6 py-4">  const handleLogout = () => {      toast.error('Please login first')// Circle Committee Evaluation Form Data (Exact as per specifications)

              <div className="flex items-center justify-between">

                <div className="flex items-center space-x-4">    localStorage.removeItem('admin_active_session')

                  <button

                    onClick={() => router.push('/admin/dashboard')}    localStorage.removeItem('adminToken')      router.push('/admin/login')interface CircleEvaluationData {

                    className="flex items-center text-white/80 hover:text-white transition-colors"

                  >    localStorage.removeItem('adminData')

                    <ArrowLeft className="w-5 h-5 mr-2" />

                    Back to Dashboard    toast.success('Logged out successfully')      return  // Application Details

                  </button>

                  <div className="h-6 w-px bg-white/20"></div>    router.push('/admin/login')

                  <FileCheck className="text-orange-400" size={24} />

                  <div>  }    }  applicationId: string

                    <h1 className="text-xl font-bold text-white">Circle Committee Evaluation</h1>

                    <p className="text-white/60 text-sm">सर्कल समिति मूल्यांकन</p>

                  </div>

                </div>  if (!userToken) {  wuaName: string

                <button

                  onClick={handleLogout}    return (

                  className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"

                >      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">    try {  applicantName: string

                  <LogOut size={16} />

                  <span>Logout</span>        <div className="text-center">

                </button>

              </div>          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>      const parsedData = JSON.parse(adminData)  district: string

            </div>

          </div>          <p className="text-white">Loading...</p>



          {/* Main Content */}        </div>      setUserToken(token)  

          <div className="container mx-auto px-6 py-8">

            <div className="government-card p-8 text-center">      </div>

              <p className="text-gray-600">Circle Committee evaluation page is currently empty.</p>

            </div>    )      setUserData(parsedData)  // Section 1: Application Verification (सत्यापन)

          </div>

        </div>  }

      </div>

    </>    } catch (error) {  nominationFormVerified: 'yes' | 'no'

  )

}  return (

    <>      console.error('Auth error:', error)  selfAssessmentVerified: 'yes' | 'no'

      <Head>

        <title>Circle Committee Evaluation - Maharashtra WRD</title>      toast.error('Invalid session')  dataAccuracyCheck: 'verified' | 'minor_issues' | 'major_issues'

      </Head>

      router.push('/admin/login')  verificationRemarks: string

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">

        {/* Background Pattern */}    }  

        <div className="absolute inset-0 opacity-20" style={{

          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`  }, [router])  // Section 2: Key Regulatory Checks (4 Mandatory Parameters - नियामक जांच)

        }}></div>

  regularWaterRequests: 'yes' | 'no' | 'partial'

        {/* Header */}

        <div className="relative z-10">  // Logout handler  waterRequestsRemarks: string

          <div className="bg-white/10 backdrop-blur-md border-b border-white/20">

            <div className="container mx-auto px-6 py-4">  const handleLogout = () => {  

              <div className="flex items-center justify-between">

                <div className="flex items-center space-x-4">    localStorage.removeItem('admin_active_session')  regularWaterTax: 'yes' | 'no' | 'partial'

                  <button

                    onClick={() => router.push('/admin/dashboard')}    localStorage.removeItem('adminToken')  waterTaxRemarks: string

                    className="flex items-center text-white/80 hover:text-white transition-colors"

                  >    localStorage.removeItem('adminData')  

                    <ArrowLeft className="w-5 h-5 mr-2" />

                    Back to Dashboard    toast.success('Logged out successfully')  regularElections: 'yes' | 'no' | 'partial' 

                  </button>

                  <div className="h-6 w-px bg-white/20"></div>    router.push('/admin/login')  electionsRemarks: string

                  <FileCheck className="text-orange-400" size={24} />

                  <div>  }  

                    <h1 className="text-xl font-bold text-white">Circle Committee Evaluation</h1>

                    <p className="text-white/60 text-sm">सर्कल समिति मूल्यांकन</p>  regularLogReporting: 'yes' | 'no' | 'partial'

                  </div>

                </div>  if (!userToken) {  logReportingRemarks: string

                <button

                  onClick={handleLogout}    return (  

                  className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"

                >      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">  // Section 3: Site Visit and Documentation (स्थल दौरा व दस्तावेज़ीकरण)

                  <LogOut size={16} />

                  <span>Logout</span>        <div className="text-center">  siteVisitConducted: 'yes' | 'no'

                </button>

              </div>          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>  siteVisitDate: string

            </div>

          </div>          <p className="text-white">Loading...</p>  siteVisitOfficers: string



          {/* Main Content */}        </div>  documentsPhysicallyVerified: 'yes' | 'no' | 'partial'

          <div className="container mx-auto px-6 py-8">

            <div className="government-card p-8 text-center">      </div>  siteConditionAssessment: 'excellent' | 'good' | 'satisfactory' | 'poor'

              <p className="text-gray-600">Circle Committee evaluation page is currently empty.</p>

            </div>    )  verificationMarks: number // Max 50 marks

          </div>

        </div>  }  

      </div>

    </>  // Section 4: Self-Assessment Review (स्व-मूल्यांकन समीक्षा)

  )

}  return (  selfAssessmentScore: number // Out of 150

    <>  scoreEndorsed: 'yes' | 'no' | 'partial'

      <Head>  scoreAdjustment: number // + or - adjustment

        <title>Circle Committee Evaluation - Maharashtra WRD</title>  endorsementRemarks: string

      </Head>  

  // Section 5: Final Recommendation (अंतिम सिफारिश)

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">  finalRecommendation: 'recommended' | 'not_recommended' | 'disqualified'

        {/* Background Pattern */}  disqualificationReason?: string

        <div className="absolute inset-0 opacity-20" style={{  specialObservations: string

          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`  

        }}></div>  // Committee Details

  evaluatedBy: string

        {/* Header */}  evaluationDate: string

        <div className="relative z-10">  committeeSignature: string

          <div className="bg-white/10 backdrop-blur-md border-b border-white/20">}

            <div className="container mx-auto px-6 py-4">

              <div className="flex items-center justify-between">export default function CircleCommitteeEvaluationNew() {

                <div className="flex items-center space-x-4">  const router = useRouter()

                  <button  const [isLoading, setIsLoading] = useState(false)

                    onClick={() => router.push('/admin/dashboard')}  const [userToken, setUserToken] = useState<string | null>(null)

                    className="flex items-center text-white/80 hover:text-white transition-colors"  const [userData, setUserData] = useState<any>(null)

                  >  const [currentStep, setCurrentStep] = useState(0)

                    <ArrowLeft className="w-5 h-5 mr-2" />  const [nominations, setNominations] = useState<any[]>([])

                    Back to Dashboard  const [selectedNomination, setSelectedNomination] = useState<any>(null)

                  </button>  const [isLoadingData, setIsLoadingData] = useState(false)

                  <div className="h-6 w-px bg-white/20"></div>

                  <FileCheck className="text-orange-400" size={24} />  const {

                  <div>    register,

                    <h1 className="text-xl font-bold text-white">Circle Committee Evaluation</h1>    handleSubmit,

                    <p className="text-white/60 text-sm">सर्कल समिति मूल्यांकन</p>    formState: { errors },

                  </div>    watch,

                </div>    setValue,

                <button    reset

                  onClick={handleLogout}  } = useForm<CircleEvaluationData>()

                  className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"

                >  // Watch form values

                  <LogOut size={16} />  const watchedValues = watch()

                  <span>Logout</span>

                </button>  // Authentication check

              </div>  useEffect(() => {

            </div>    const token = localStorage.getItem('adminToken')

          </div>    const adminData = localStorage.getItem('adminData')



          {/* Main Content */}    if (!token || !adminData) {

          <div className="container mx-auto px-6 py-8">      toast.error('Please login first')

            <div className="government-card p-8 text-center">      router.push('/admin/login')

              <p className="text-gray-600">Circle Committee evaluation page is currently empty.</p>      return

            </div>    }

          </div>

        </div>    try {

      </div>      const parsedData = JSON.parse(adminData)

    </>      // Check if user is authorized for circle committee evaluation

  )      if (!['admin', 'super-admin', 'circle-committee'].includes(parsedData.userType || parsedData.adminLevel)) {

}        toast.error('Access denied. Circle Committee members only.')
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

  // Load nominations from MongoDB
  const loadNominations = async (token: string, adminData: any) => {
    setIsLoadingData(true)
    try {
      const response = await fetch('/api/nominations/get-for-evaluation?stage=circle', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const result = await response.json()
      if (result.success) {
        setNominations(result.nominations)
        console.log(`✅ Loaded ${result.nominations.length} nominations for circle evaluation`)
        
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
    setValue('selfAssessmentScore', nomination.scores?.selfAssessment || 0)
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
  const onSubmit = async (data: CircleEvaluationData) => {
    if (!userToken) {
      toast.error('Authentication required')
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call to save evaluation
      await new Promise(resolve => setTimeout(resolve, 2000))

      console.log('Circle Committee Evaluation Data:', data)
      toast.success('Evaluation submitted successfully!')
      
      // Reset form after successful submission
      reset()
      setCurrentStep(0)
      
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

  const steps = [
    'Application Verification',
    'Regulatory Checks', 
    'Site Visit & Documentation',
    'Self-Assessment Review',
    'Final Recommendation'
  ]

  if (!userToken || isLoadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading nominations...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Circle Committee Evaluation - Maharashtra WRD</title>
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
                  <FileCheck className="text-orange-400" size={24} />
                  <div>
                    <h1 className="text-xl font-bold text-white">Circle Committee Evaluation</h1>
                    <p className="text-white/60 text-sm">सर्कल समिति मूल्यांकन</p>
                  </div>
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

          {/* Main Content */}
          <div className="container mx-auto px-6 py-8">
            {/* Step Progress */}
            <div className="government-card p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                {steps.map((step, index) => (
                  <div key={index} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      currentStep >= index ? 'bg-orange-500 text-white' : 'bg-gray-300 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    <span className={`ml-2 text-sm font-medium ${
                      currentStep >= index ? 'text-orange-600' : 'text-gray-500'
                    }`}>
                      {step}
                    </span>
                    {index < steps.length - 1 && (
                      <div className={`w-16 h-1 mx-4 ${
                        currentStep > index ? 'bg-orange-500' : 'bg-gray-300'
                      }`}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Nomination Selection */}
            {nominations.length > 0 && (
              <div className="government-card p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Select Nomination for Evaluation</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {nominations.map((nomination) => (
                    <div
                      key={nomination.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedNomination?.id === nomination.id
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                      onClick={() => selectNominationForEvaluation(nomination)}
                    >
                      <h3 className="font-bold text-gray-800">{nomination.wuaName}</h3>
                      <p className="text-sm text-gray-600">ID: {nomination.wuaId}</p>
                      <p className="text-sm text-gray-600">District: {nomination.district}</p>
                      <p className="text-sm text-gray-600">Chairman: {nomination.chairmanName}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Evaluation Form */}
            {selectedNomination && (
              <form onSubmit={handleSubmit(onSubmit)} className="government-card p-8">
                {/* Step 1: Application Verification */}
                {currentStep === 0 && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <FileCheck className="text-orange-500" size={24} />
                      <h2 className="text-2xl font-bold text-gray-800">Application Verification (आवेदन सत्यापन)</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nomination Form Verified? (नामांकन फॉर्म सत्यापित?)
                        </label>
                        <select
                          {...register('nominationFormVerified', { required: 'This field is required' })}
                          className="government-input"
                        >
                          <option value="">Select...</option>
                          <option value="yes">Yes - Verified (हाँ - सत्यापित)</option>
                          <option value="no">No - Not Verified (नहीं - सत्यापित नहीं)</option>
                        </select>
                        {errors.nominationFormVerified && (
                          <p className="text-red-600 text-sm mt-1">{errors.nominationFormVerified.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Self-Assessment Verified? (स्व-मूल्यांकन सत्यापित?)
                        </label>
                        <select
                          {...register('selfAssessmentVerified', { required: 'This field is required' })}
                          className="government-input"
                        >
                          <option value="">Select...</option>
                          <option value="yes">Yes - Verified (हाँ - सत्यापित)</option>
                          <option value="no">No - Not Verified (नहीं - सत्यापित नहीं)</option>
                        </select>
                        {errors.selfAssessmentVerified && (
                          <p className="text-red-600 text-sm mt-1">{errors.selfAssessmentVerified.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Data Accuracy Check (डेटा सटीकता जांच)
                        </label>
                        <select
                          {...register('dataAccuracyCheck', { required: 'This field is required' })}
                          className="government-input"
                        >
                          <option value="">Select...</option>
                          <option value="verified">Verified - All Data Accurate (सत्यापित - सभी डेटा सटीक)</option>
                          <option value="minor_issues">Minor Issues Found (मामूली समस्याएं मिलीं)</option>
                          <option value="major_issues">Major Issues Found (बड़ी समस्याएं मिलीं)</option>
                        </select>
                        {errors.dataAccuracyCheck && (
                          <p className="text-red-600 text-sm mt-1">{errors.dataAccuracyCheck.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Verification Remarks (सत्यापन टिप्पणी)
                      </label>
                      <textarea
                        {...register('verificationRemarks', { required: 'Remarks are required' })}
                        rows={4}
                        className="government-input"
                        placeholder="Enter your verification observations..."
                      />
                      {errors.verificationRemarks && (
                        <p className="text-red-600 text-sm mt-1">{errors.verificationRemarks.message}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 2: Key Regulatory Checks */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <CheckCircle className="text-orange-500" size={24} />
                      <h2 className="text-2xl font-bold text-gray-800">Key Regulatory Checks (मुख्य नियामक जांच)</h2>
                      <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                        4 Mandatory Parameters
                      </div>
                    </div>

                    <div className="space-y-8">
                      {/* 1. Regular Water Requests */}
                      <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                        <h3 className="font-bold text-gray-800 mb-4">1. Regular Water Requests (नियमित पानी अनुरोध)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <select
                              {...register('regularWaterRequests', { required: 'This field is required' })}
                              className="government-input"
                            >
                              <option value="">Select...</option>
                              <option value="yes">Yes - Regular Requests (हाँ - नियमित अनुरोध)</option>
                              <option value="partial">Partial - Some Requests (आंशिक - कुछ अनुरोध)</option>
                              <option value="no">No - No Regular Requests (नहीं - कोई नियमित अनुरोध नहीं)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
                            <textarea
                              {...register('waterRequestsRemarks')}
                              rows={3}
                              className="government-input"
                              placeholder="Details about water request process..."
                            />
                          </div>
                        </div>
                      </div>

                      {/* 2. Regular Water Tax */}
                      <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                        <h3 className="font-bold text-gray-800 mb-4">2. Regular Water Tax Collection (नियमित पानी कर वसूली)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <select
                              {...register('regularWaterTax', { required: 'This field is required' })}
                              className="government-input"
                            >
                              <option value="">Select...</option>
                              <option value="yes">Yes - Regular Collection (हाँ - नियमित वसूली)</option>
                              <option value="partial">Partial - Some Collection (आंशिक - कुछ वसूली)</option>
                              <option value="no">No - No Regular Collection (नहीं - कोई नियमित वसूली नहीं)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
                            <textarea
                              {...register('waterTaxRemarks')}
                              rows={3}
                              className="government-input"
                              placeholder="Details about tax collection..."
                            />
                          </div>
                        </div>
                      </div>

                      {/* 3. Regular Elections */}
                      <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                        <h3 className="font-bold text-gray-800 mb-4">3. Regular Elections (नियमित चुनाव)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <select
                              {...register('regularElections', { required: 'This field is required' })}
                              className="government-input"
                            >
                              <option value="">Select...</option>
                              <option value="yes">Yes - Regular Elections (हाँ - नियमित चुनाव)</option>
                              <option value="partial">Partial - Some Elections (आंशिक - कुछ चुनाव)</option>
                              <option value="no">No - No Regular Elections (नहीं - कोई नियमित चुनाव नहीं)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
                            <textarea
                              {...register('electionsRemarks')}
                              rows={3}
                              className="government-input"
                              placeholder="Details about election process..."
                            />
                          </div>
                        </div>
                      </div>

                      {/* 4. Regular Log Reporting */}
                      <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                        <h3 className="font-bold text-gray-800 mb-4">4. Regular Log Reporting (नियमित लॉग रिपोर्टिंग)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <select
                              {...register('regularLogReporting', { required: 'This field is required' })}
                              className="government-input"
                            >
                              <option value="">Select...</option>
                              <option value="yes">Yes - Regular Reporting (हाँ - नियमित रिपोर्टिंग)</option>
                              <option value="partial">Partial - Some Reporting (आंशिक - कुछ रिपोर्टिंग)</option>
                              <option value="no">No - No Regular Reporting (नहीं - कोई नियमित रिपोर्टिंग नहीं)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
                            <textarea
                              {...register('logReportingRemarks')}
                              rows={3}
                              className="government-input"
                              placeholder="Details about log reporting..."
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Site Visit & Documentation */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <MapPin className="text-orange-500" size={24} />
                      <h2 className="text-2xl font-bold text-gray-800">Site Visit & Documentation (स्थल दौरा व दस्तावेज़ीकरण)</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Site Visit Conducted? (स्थल दौरा किया गया?)
                        </label>
                        <select
                          {...register('siteVisitConducted', { required: 'This field is required' })}
                          className="government-input"
                        >
                          <option value="">Select...</option>
                          <option value="yes">Yes - Site Visit Completed (हाँ - स्थल दौरा पूर्ण)</option>
                          <option value="no">No - Site Visit Not Done (नहीं - स्थल दौरा नहीं हुआ)</option>
                        </select>
                        {errors.siteVisitConducted && (
                          <p className="text-red-600 text-sm mt-1">{errors.siteVisitConducted.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Site Visit Date (स्थल दौरे की तारीख)
                        </label>
                        <input
                          type="date"
                          {...register('siteVisitDate')}
                          className="government-input"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Site Visit Officers (स्थल दौरा अधिकारी)
                        </label>
                        <input
                          type="text"
                          {...register('siteVisitOfficers')}
                          className="government-input"
                          placeholder="Names of officers who visited..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Documents Physically Verified? (दस्तावेज़ भौतिक सत्यापन?)
                        </label>
                        <select
                          {...register('documentsPhysicallyVerified')}
                          className="government-input"
                        >
                          <option value="">Select...</option>
                          <option value="yes">Yes - All Verified (हाँ - सभी सत्यापित)</option>
                          <option value="partial">Partial - Some Verified (आंशिक - कुछ सत्यापित)</option>
                          <option value="no">No - Not Verified (नहीं - सत्यापित नहीं)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Site Condition Assessment (स्थल स्थिति मूल्यांकन)
                        </label>
                        <select
                          {...register('siteConditionAssessment')}
                          className="government-input"
                        >
                          <option value="">Select...</option>
                          <option value="excellent">Excellent (उत्कृष्ट)</option>
                          <option value="good">Good (अच्छा)</option>
                          <option value="satisfactory">Satisfactory (संतोषजनक)</option>
                          <option value="poor">Poor (खराब)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Verification Marks (सत्यापन अंक) - Max 50
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="50"
                          {...register('verificationMarks', { 
                            required: 'This field is required',
                            min: { value: 0, message: 'Minimum 0 marks' },
                            max: { value: 50, message: 'Maximum 50 marks' }
                          })}
                          className="government-input"
                          placeholder="Enter marks out of 50..."
                        />
                        {errors.verificationMarks && (
                          <p className="text-red-600 text-sm mt-1">{errors.verificationMarks.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Self-Assessment Review */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <Eye className="text-orange-500" size={24} />
                      <h2 className="text-2xl font-bold text-gray-800">Self-Assessment Review (स्व-मूल्यांकन समीक्षा)</h2>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                      <h3 className="font-bold text-blue-800 mb-2">Original Self-Assessment Score</h3>
                      <p className="text-blue-700">
                        WUA claimed score: <span className="font-bold text-2xl">{selectedNomination?.scores?.selfAssessment || 0}</span> out of 150 marks
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Self-Assessment Score (स्व-मूल्यांकन अंक) - Out of 150
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="150"
                          {...register('selfAssessmentScore', { 
                            required: 'This field is required',
                            min: { value: 0, message: 'Minimum 0 marks' },
                            max: { value: 150, message: 'Maximum 150 marks' }
                          })}
                          className="government-input"
                          placeholder="Enter actual score..."
                        />
                        {errors.selfAssessmentScore && (
                          <p className="text-red-600 text-sm mt-1">{errors.selfAssessmentScore.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Score Endorsed? (अंक अनुमोदित?)
                        </label>
                        <select
                          {...register('scoreEndorsed', { required: 'This field is required' })}
                          className="government-input"
                        >
                          <option value="">Select...</option>
                          <option value="yes">Yes - Fully Endorsed (हाँ - पूर्ण अनुमोदन)</option>
                          <option value="partial">Partial - With Adjustments (आंशिक - समायोजन के साथ)</option>
                          <option value="no">No - Not Endorsed (नहीं - अनुमोदित नहीं)</option>
                        </select>
                        {errors.scoreEndorsed && (
                          <p className="text-red-600 text-sm mt-1">{errors.scoreEndorsed.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Score Adjustment (अंक समायोजन) - (+/-)
                        </label>
                        <input
                          type="number"
                          {...register('scoreAdjustment')}
                          className="government-input"
                          placeholder="Enter adjustment (+ or -)..."
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Endorsement Remarks (अनुमोदन टिप्पणी)
                      </label>
                      <textarea
                        {...register('endorsementRemarks', { required: 'Remarks are required' })}
                        rows={4}
                        className="government-input"
                        placeholder="Explain your score assessment and any adjustments..."
                      />
                      {errors.endorsementRemarks && (
                        <p className="text-red-600 text-sm mt-1">{errors.endorsementRemarks.message}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 5: Final Recommendation */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <CheckCircle className="text-orange-500" size={24} />
                      <h2 className="text-2xl font-bold text-gray-800">Final Recommendation (अंतिम सिफारिश)</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Final Recommendation (अंतिम सिफारिश)
                        </label>
                        <select
                          {...register('finalRecommendation', { required: 'This field is required' })}
                          className="government-input"
                        >
                          <option value="">Select...</option>
                          <option value="recommended">Recommended for Corporation Committee (निगम समिति के लिए सिफारिश)</option>
                          <option value="not_recommended">Not Recommended (सिफारिश नहीं)</option>
                          <option value="disqualified">Disqualified (अयोग्य)</option>
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
                          {...register('committeeSignature', { required: 'This field is required' })}
                          className="government-input"
                          placeholder="Digital signature or name..."
                        />
                        {errors.committeeSignature && (
                          <p className="text-red-600 text-sm mt-1">{errors.committeeSignature.message}</p>
                        )}
                      </div>
                    </div>

                    {watchedValues.finalRecommendation === 'disqualified' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Disqualification Reason (अयोग्यता का कारण)
                        </label>
                        <textarea
                          {...register('disqualificationReason')}
                          rows={4}
                          className="government-input"
                          placeholder="Explain the reason for disqualification..."
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Special Observations (विशेष टिप्पणियां)
                      </label>
                      <textarea
                        {...register('specialObservations')}
                        rows={5}
                        className="government-input"
                        placeholder="Any special observations or recommendations for improvement..."
                      />
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                    disabled={currentStep === 0}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                      currentStep === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-500 text-white hover:bg-gray-600'
                    }`}
                  >
                    Previous Step
                  </button>

                  <div className="text-sm text-gray-600">
                    Step {currentStep + 1} of {steps.length}
                  </div>

                  {currentStep < steps.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Next Step
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