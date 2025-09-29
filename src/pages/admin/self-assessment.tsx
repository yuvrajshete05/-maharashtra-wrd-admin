import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { ArrowLeft, Save, Send, LogOut, CheckCircle, Circle, Award, TrendingUp, Users, Droplets, FileText, DollarSign, Users2 } from 'lucide-react'

// Browser-Only Session Manager
class BrowserSessionManager {
  static forceLogoutAdmin(): boolean {
    localStorage.removeItem('admin_active_session');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    return true;
  }

  static forceLogoutNominee(): boolean {
    localStorage.removeItem('nominee_active_session');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    return true;
  }
}

// Assessment Modules Structure (Exact as per specifications - 5 modules, max 150 marks)
const assessmentModules = [
  {
    id: 1,
    title: 'Institutional & Governance (संस्थागत व शासन)',
    icon: Users,
    maxMarks: 30,
    description: 'Registration status, Regular meetings, Board elections, Record-keeping, Transparency',
    questions: [
      {
        id: 'inst_gov_1',
        text: 'WUA registration status (WUA पंजीकरण की स्थिति)',
        type: 'select',
        marks: 5,
        options: [
          { value: 5, label: 'Fully registered with all documents (सभी दस्तावेजों के साथ पूर्ण पंजीकृत)' },
          { value: 3, label: 'Registered but some documents pending (पंजीकृत लेकिन कुछ दस्तावेज बाकी)' },
          { value: 1, label: 'Registration in progress (पंजीकरण प्रक्रियाधीन)' },
          { value: 0, label: 'Not registered (अपंजीकृत)' }
        ]
      },
      {
        id: 'inst_gov_2',
        text: 'Frequency of General Body meetings (साधारण सभा की बैठकों की आवृत्ति)',
        type: 'select',
        marks: 8,
        options: [
          { value: 8, label: 'Monthly meetings (मासिक बैठकें)' },
          { value: 6, label: 'Quarterly meetings (त्रैमासिक बैठकें)' },
          { value: 4, label: 'Half-yearly meetings (अर्धवार्षिक बैठकें)' },
          { value: 2, label: 'Annual meetings only (केवल वार्षिक बैठकें)' },
          { value: 0, label: 'Irregular meetings (अनियमित बैठकें)' }
        ]
      },
      {
        id: 'inst_gov_3', 
        text: 'Board members election process (बोर्ड सदस्यों की चुनाव प्रक्रिया)',
        type: 'select',
        marks: 7,
        options: [
          { value: 7, label: 'Regular democratic elections every 3 years (हर 3 साल में नियमित लोकतांत्रिक चुनाव)' },
          { value: 5, label: 'Elections conducted but delayed (चुनाव हुए लेकिन देर से)' },
          { value: 3, label: 'Partial election process (आंशिक चुनाव प्रक्रिया)' },
          { value: 0, label: 'No proper elections (उचित चुनाव नहीं)' }
        ]
      },
      {
        id: 'inst_gov_4',
        text: 'Meeting minutes and record keeping (बैठक कार्यवृत्त और रिकॉर्ड रखना)',
        type: 'select', 
        marks: 5,
        options: [
          { value: 5, label: 'Detailed minutes with signatures (हस्ताक्षर के साथ विस्तृत कार्यवृत्त)' },
          { value: 3, label: 'Basic minutes maintained (बुनियादी कार्यवृत्त बनाए गए)' },
          { value: 1, label: 'Irregular record keeping (अनियमित रिकॉर्ड रखना)' },
          { value: 0, label: 'No proper records (उचित रिकॉर्ड नहीं)' }
        ]
      },
      {
        id: 'inst_gov_5',
        text: 'Transparency and audit reports (पारदर्शिता और ऑडिट रिपोर्ट)',
        type: 'select',
        marks: 5,
        options: [
          { value: 5, label: 'Annual audits with public disclosure (सार्वजनिक प्रकटीकरण के साथ वार्षिक ऑडिट)' },
          { value: 3, label: 'Internal audits conducted (आंतरिक ऑडिट किए गए)' },
          { value: 1, label: 'Limited transparency (सीमित पारदर्शिता)' },
          { value: 0, label: 'No audit process (कोई ऑडिट प्रक्रिया नहीं)' }
        ]
      }
    ]
  },
  {
    id: 2,
    title: 'Financial Management (वित्तीय प्रबंधन)',
    icon: DollarSign,
    maxMarks: 40, 
    description: 'Water tax collection, Budgeting, Fund utilization, Internal/External audit',
    questions: [
      {
        id: 'fin_mgmt_1',
        text: 'Water tax collection rate (पानी कर संग्रह दर)',
        type: 'select',
        marks: 12,
        options: [
          { value: 12, label: '90-100% collection (90-100% संग्रह)' },
          { value: 9, label: '75-89% collection (75-89% संग्रह)' },
          { value: 6, label: '60-74% collection (60-74% संग्रह)' },
          { value: 3, label: '50-59% collection (50-59% संग्रह)' },
          { value: 0, label: 'Below 50% collection (50% से कम संग्रह)' }
        ]
      },
      {
        id: 'fin_mgmt_2',
        text: 'Annual budgeting and planning (वार्षिक बजट और योजना)',
        type: 'select',
        marks: 8,
        options: [
          { value: 8, label: 'Detailed annual budget with member approval (सदस्य अनुमोदन के साथ विस्तृत वार्षिक बजट)' },
          { value: 6, label: 'Basic budget prepared (बुनियादी बजट तैयार)' },
          { value: 3, label: 'Informal financial planning (अनौपचारिक वित्तीय योजना)' },
          { value: 0, label: 'No proper budgeting (उचित बजट नहीं)' }
        ]
      },
      {
        id: 'fin_mgmt_3',
        text: 'Fund utilization efficiency (निधि उपयोग दक्षता)',
        type: 'select',
        marks: 10,
        options: [
          { value: 10, label: '90-100% funds utilized for intended purposes (90-100% फंड इच्छित उद्देश्यों के लिए उपयोग)' },
          { value: 8, label: '75-89% proper utilization (75-89% उचित उपयोग)' },
          { value: 5, label: '60-74% proper utilization (60-74% उचित उपयोग)' },
          { value: 2, label: '50-59% proper utilization (50-59% उचित उपयोग)' },
          { value: 0, label: 'Below 50% or misuse (50% से कम या दुरुपयोग)' }
        ]
      },
      {
        id: 'fin_mgmt_4',
        text: 'External audit compliance (बाहरी ऑडिट अनुपालन)',
        type: 'select',
        marks: 10,
        options: [
          { value: 10, label: 'Annual external audit with clean reports (स्वच्छ रिपोर्ट के साथ वार्षिक बाहरी ऑडिट)' },
          { value: 7, label: 'External audit with minor issues (मामूली मुद्दों के साथ बाहरी ऑडिट)' },
          { value: 4, label: 'Irregular external audits (अनियमित बाहरी ऑडिट)' },
          { value: 0, label: 'No external audit (कोई बाहरी ऑडिट नहीं)' }
        ]
      }
    ]
  },
  {
    id: 3,
    title: 'Water Management & Operation (जल प्रबंधन व संचालन)',
    icon: Droplets,
    maxMarks: 50,
    description: 'Water demand & distribution records, Canal/Network maintenance, Water request process',
    questions: [
      {
        id: 'water_mgmt_1',
        text: 'Water demand and distribution records (पानी की मांग और वितरण रिकॉर्ड)',
        type: 'select',
        marks: 15,
        options: [
          { value: 15, label: 'Comprehensive digital records with daily logs (दैनिक लॉग के साथ व्यापक डिजिटल रिकॉर्ड)' },
          { value: 12, label: 'Regular manual records maintained (नियमित मैनुअल रिकॉर्ड बनाए गए)' },
          { value: 8, label: 'Basic records with some gaps (कुछ अंतराल के साथ बुनियादी रिकॉर्ड)' },
          { value: 4, label: 'Irregular record keeping (अनियमित रिकॉर्ड रखना)' },
          { value: 0, label: 'No proper records (उचित रिकॉर्ड नहीं)' }
        ]
      },
      {
        id: 'water_mgmt_2',
        text: 'Canal and distribution network maintenance (नहर और वितरण नेटवर्क का रखरखाव)',
        type: 'select', 
        marks: 15,
        options: [
          { value: 15, label: 'Excellent maintenance with preventive measures (निवारक उपायों के साथ उत्कृष्ट रखरखाव)' },
          { value: 12, label: 'Good maintenance, regular repairs (अच्छा रखरखाव, नियमित मरम्मत)' },
          { value: 8, label: 'Average maintenance (औसत रखरखाव)' },
          { value: 4, label: 'Poor maintenance, frequent breakdowns (खराब रखरखाव, बार-बार खराबी)' },
          { value: 0, label: 'No systematic maintenance (कोई व्यवस्थित रखरखाव नहीं)' }
        ]
      },
      {
        id: 'water_mgmt_3',
        text: 'Water request and allocation process (पानी अनुरोध और आवंटन प्रक्रिया)', 
        type: 'select',
        marks: 10,
        options: [
          { value: 10, label: 'Systematic process with written requests (लिखित अनुरोधों के साथ व्यवस्थित प्रक्रिया)' },
          { value: 7, label: 'Regular process but informal (नियमित प्रक्रिया लेकिन अनौपचारिक)' },
          { value: 4, label: 'Ad-hoc water allocation (तदर्थ पानी आवंटन)' },
          { value: 0, label: 'No systematic allocation (कोई व्यवस्थित आवंटन नहीं)' }
        ]
      },
      {
        id: 'water_mgmt_4',
        text: 'Water conservation and efficiency measures (जल संरक्षण और दक्षता उपाय)',
        type: 'select',
        marks: 10,
        options: [
          { value: 10, label: 'Multiple conservation methods implemented (कई संरक्षण विधियां लागू)' },
          { value: 7, label: 'Some conservation measures in place (कुछ संरक्षण उपाय मौजूद)' },
          { value: 4, label: 'Basic awareness but limited action (बुनियादी जागरूकता लेकिन सीमित कार्रवाई)' },
          { value: 0, label: 'No conservation efforts (कोई संरक्षण प्रयास नहीं)' }
        ]
      }
    ]
  },
  {
    id: 4,
    title: 'Farmer Participation (किसान सहभागिता)',
    icon: Users2,
    maxMarks: 25,
    description: 'Member participation in meetings, Conflict resolution process, Awareness programs',
    questions: [
      {
        id: 'farmer_part_1',
        text: 'Member attendance in general body meetings (सामान्य सभा की बैठकों में सदस्यों की उपस्थिति)',
        type: 'select',
        marks: 8,
        options: [
          { value: 8, label: '75-100% average attendance (75-100% औसत उपस्थिति)' },
          { value: 6, label: '60-74% average attendance (60-74% औसत उपस्थिति)' },
          { value: 4, label: '45-59% average attendance (45-59% औसत उपस्थिति)' },
          { value: 2, label: '30-44% average attendance (30-44% औसत उपस्थिति)' },
          { value: 0, label: 'Below 30% attendance (30% से कम उपस्थिति)' }
        ]
      },
      {
        id: 'farmer_part_2',
        text: 'Conflict resolution mechanism (संघर्ष समाधान तंत्र)',
        type: 'select',
        marks: 7,
        options: [
          { value: 7, label: 'Established committee with documented process (प्रलेखित प्रक्रिया के साथ स्थापित समिति)' },
          { value: 5, label: 'Informal but effective resolution process (अनौपचारिक लेकिन प्रभावी समाधान प्रक्रिया)' },
          { value: 3, label: 'Limited conflict resolution (सीमित संघर्ष समाधान)' },
          { value: 0, label: 'No systematic conflict resolution (कोई व्यवस्थित संघर्ष समाधान नहीं)' }
        ]
      },
      {
        id: 'farmer_part_3',
        text: 'Awareness and training programs for farmers (किसानों के लिए जागरूकता और प्रशिक्षण कार्यक्रम)',
        type: 'select',
        marks: 10,
        options: [
          { value: 10, label: 'Regular programs with expert trainers (विशेषज्ञ प्रशिक्षकों के साथ नियमित कार्यक्रम)' },
          { value: 7, label: 'Occasional awareness programs (कभी-कभार जागरूकता कार्यक्रम)' },
          { value: 4, label: 'Basic information sharing (बुनियादी जानकारी साझाकरण)' },
          { value: 0, label: 'No training or awareness programs (कोई प्रशिक्षण या जागरूकता कार्यक्रम नहीं)' }
        ]
      }
    ]
  },
  {
    id: 5,
    title: 'Other Performance (अन्य प्रदर्शन)',
    icon: Award,
    maxMarks: 20,
    description: 'Impact on agricultural yield, Environmental compliance, Innovation and best practices',
    questions: [
      {
        id: 'other_perf_1',
        text: 'Impact on agricultural productivity (कृषि उत्पादकता पर प्रभाव)',
        type: 'select',
        marks: 8,
        options: [
          { value: 8, label: 'Significant yield increase (25%+) (महत्वपूर्ण उत्पादन वृद्धि (25%+))' },
          { value: 6, label: 'Moderate yield increase (15-24%) (मध्यम उत्पादन वृद्धि (15-24%))' },
          { value: 4, label: 'Slight yield increase (5-14%) (थोड़ी उत्पादन वृद्धि (5-14%))' },
          { value: 2, label: 'Yield maintained (उत्पादन बना रहा)' },
          { value: 0, label: 'Yield declined (उत्पादन में गिरावट)' }
        ]
      },
      {
        id: 'other_perf_2',
        text: 'Environmental compliance and sustainability (पर्यावरण अनुपालन और स्थिरता)',
        type: 'select',
        marks: 6,
        options: [
          { value: 6, label: 'Excellent environmental practices (उत्कृष्ट पर्यावरणीय प्रथाएं)' },
          { value: 4, label: 'Good environmental awareness (अच्छी पर्यावरणीय जागरूकता)' },
          { value: 2, label: 'Basic compliance (बुनियादी अनुपालन)' },
          { value: 0, label: 'Poor environmental practices (खराब पर्यावरणीय प्रथाएं)' }
        ]
      },
      {
        id: 'other_perf_3',
        text: 'Innovation and best practices adoption (नवाचार और सर्वोत्तम प्रथाओं को अपनाना)',
        type: 'select',
        marks: 6,
        options: [
          { value: 6, label: 'Multiple innovations implemented (कई नवाचार लागू किए गए)' },
          { value: 4, label: 'Some innovative practices (कुछ नवाचार प्रथाएं)' },
          { value: 2, label: 'Adopting others\' best practices (दूसरों की सर्वोत्तम प्रथाओं को अपनाना)' },
          { value: 0, label: 'Traditional methods only (केवल पारंपरिक तरीके)' }
        ]
      }
    ]
  }
]

// Form data interface
interface SelfAssessmentFormData {
  [key: string]: number | string
}

export default function SelfAssessmentQuestionnaire() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [userToken, setUserToken] = useState<string | null>(null)
  const [userData, setUserData] = useState<any>(null)
  const [currentModule, setCurrentModule] = useState(0)
  const [moduleScores, setModuleScores] = useState<number[]>([0, 0, 0, 0, 0])

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<SelfAssessmentFormData>()

  // Watch all form values
  const watchedValues = watch()

  // Authentication check
  useEffect(() => {
    const token = localStorage.getItem('loginToken') || localStorage.getItem('adminToken')
    const adminData = localStorage.getItem('adminData')

    if (!token || !adminData) {
      toast.error('Please login first')
      router.push('/welcome')
      return
    }

    try {
      const parsedData = JSON.parse(adminData)
      setUserToken(token)
      setUserData(parsedData)
    } catch (error) {
      console.error('Auth error:', error)
      toast.error('Invalid session')
      router.push('/welcome')
    }
  }, [router])

  // Calculate module score
  const calculateModuleScore = (moduleIndex: number): number => {
    const module = assessmentModules[moduleIndex]
    let totalScore = 0

    module.questions.forEach(question => {
      const value = watchedValues[question.id]
      if (value !== undefined && value !== '') {
        totalScore += Number(value)
      }
    })

    return totalScore
  }

  // Calculate total score
  const calculateTotalScore = (): number => {
    return assessmentModules.reduce((total, _, index) => {
      return total + calculateModuleScore(index)
    }, 0)
  }

  // Update module score when form values change
  useEffect(() => {
    const newScores = assessmentModules.map((_, index) => calculateModuleScore(index))
    setModuleScores(newScores)
  }, [watchedValues])

  // Logout handler
  const handleLogout = () => {
    if (userData?.userType === 'nominee') {
      BrowserSessionManager.forceLogoutNominee();
    } else {
      BrowserSessionManager.forceLogoutAdmin();
    }
    toast.success('Logged out successfully');
    router.push('/welcome');
  };

  // Form submission
  const onSubmit = async (data: SelfAssessmentFormData) => {
    if (!userToken) {
      toast.error('Authentication required')
      return
    }

    setIsLoading(true)

    try {
      const totalScore = calculateTotalScore()
      const assessmentData = {
        ...data,
        moduleScores,
        totalScore,
        maxPossibleScore: 150,
        submissionDate: new Date().toISOString()
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      console.log('Self-Assessment Data:', assessmentData)
      toast.success(`Self-Assessment completed! Total Score: ${totalScore}/150 marks`)
      
      // Redirect to dashboard
      setTimeout(() => {
        router.push('/admin/dashboard')
      }, 2000)
      
    } catch (error) {
      console.error('Submission error:', error)
      toast.error('Failed to submit assessment. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const currentModuleScore = calculateModuleScore(currentModule)
  const totalScore = calculateTotalScore()

  if (!userToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Self-Assessment Questionnaire - Maharashtra WRD</title>
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
                  <Award className="text-green-400" size={24} />
                  <div>
                    <h1 className="text-xl font-bold text-white">Self-Assessment Questionnaire</h1>
                    <p className="text-white/60 text-sm">स्व-मूल्यांकन प्रश्नावली - Max 150 Marks (5 Modules)</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-white text-sm">
                    Total Score: <span className="font-bold text-lg text-green-300">{totalScore}/150</span>
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
                {assessmentModules.map((module, index) => (
                  <div key={index} className="flex items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold ${
                      currentModule >= index ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                    }`}>
                      {React.createElement(module.icon, { size: 20 })}
                    </div>
                    <div className="ml-3 text-left">
                      <div className={`text-sm font-medium ${
                        currentModule >= index ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        Module {module.id}
                      </div>
                      <div className="text-xs text-gray-500">
                        {moduleScores[index] || 0}/{module.maxMarks}
                      </div>
                    </div>
                    {index < assessmentModules.length - 1 && (
                      <div className={`w-16 h-1 mx-4 ${
                        currentModule > index ? 'bg-green-500' : 'bg-gray-300'
                      }`}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Assessment Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="government-card p-8">
              {/* Current Module */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  {React.createElement(assessmentModules[currentModule].icon, { className: "text-green-500", size: 24 })}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {assessmentModules[currentModule].title}
                    </h2>
                    <p className="text-gray-600 text-sm">
                      {assessmentModules[currentModule].description}
                    </p>
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium inline-block mt-2">
                      Max {assessmentModules[currentModule].maxMarks} Marks | Current: {currentModuleScore}
                    </div>
                  </div>
                </div>

                {/* Questions for Current Module */}
                <div className="space-y-6">
                  {assessmentModules[currentModule].questions.map((question, qIndex) => (
                    <div key={question.id} className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                      <h3 className="font-semibold text-gray-800 mb-3">
                        Question {qIndex + 1} - {question.text}
                        <span className="text-sm text-gray-500 ml-2">({question.marks} marks)</span>
                      </h3>

                      <div className="space-y-3">
                        {question.options.map((option, optIndex) => (
                          <label key={optIndex} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-white cursor-pointer transition-colors">
                            <input
                              type="radio"
                              {...register(question.id, { required: 'This question is required' })}
                              value={option.value}
                              className="text-green-600 focus:ring-green-500"
                            />
                            <div className="flex-1">
                              <div className="font-medium text-gray-800">{option.label}</div>
                              <div className="text-sm text-green-600 font-medium">
                                Score: {option.value} marks
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>

                      {errors[question.id] && (
                        <p className="text-red-600 text-sm mt-2">{errors[question.id]?.message}</p>
                      )}
                    </div>
                  ))}
                </div>
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

                <div className="text-sm text-gray-600 text-center">
                  <div>Module {currentModule + 1} of {assessmentModules.length}</div>
                  <div>Current Score: {currentModuleScore}/{assessmentModules[currentModule].maxMarks}</div>
                  <div>Total Score: {totalScore}/150</div>
                </div>

                {currentModule < assessmentModules.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentModule(Math.min(assessmentModules.length - 1, currentModule + 1))}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
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
                        <span>Submitting Assessment...</span>
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        <span>Submit Self-Assessment</span>
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