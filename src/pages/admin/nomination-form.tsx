import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { ArrowLeft, Save, Send, User, Building2, MapPin, Phone, Mail, CreditCard, LogOut } from 'lucide-react'

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

// Complete Nomination Form Interface
interface NominationFormData {
  // WUA Basic Information
  wuaName: string
  wuaNameMarathi: string
  registrationNumber: string
  registrationDate: string
  district: string
  taluka: string
  village: string
  pincode: string
  category: 'MAJOR' | 'MINOR'
  
  // Contact Information
  chairmanName: string
  chairmanMobile: string
  chairmanEmail: string
  secretaryName: string
  secretaryMobile: string
  secretaryEmail: string
  
  // Banking Information
  bankName: string
  branchName: string
  accountNumber: string
  ifscCode: string
  
  // WUA Details
  totalMembers: number
  maleMembers: number
  femaleMembers: number
  irrigationArea: number
  
  // Project Information
  projectName: string
  projectDescription: string
  completionYear: number
  projectBenefits: string
  
  // Application Details
  applicationYear: number
}

export default function FullNominationForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [userToken, setUserToken] = useState<string | null>(null)
  const [userData, setUserData] = useState<any>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset
  } = useForm<NominationFormData>()

  // Watch for form changes to enable auto-save
  const watchedFields = watch()

  // Authentication check
  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    const adminData = localStorage.getItem('adminData')

    if (!token || !adminData) {
      toast.error('Please login first')
      router.push('/welcome')
      return
    }

    try {
      const parsedData = JSON.parse(adminData)
      if (parsedData.userType !== 'nominee') {
        toast.error('Only nominees can submit applications')
        router.push('/admin/dashboard')
        return
      }
      setUserToken(token)
      setUserData(parsedData)
    } catch (error) {
      console.error('Auth error:', error)
      toast.error('Invalid session')
      router.push('/welcome')
    }
  }, [router])

  // Logout handler
  const handleLogout = () => {
    const userData = localStorage.getItem('adminData');
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        if (parsedData.userType === 'nominee') {
          BrowserSessionManager.forceLogoutNominee();
          toast.success('Logged out successfully');
          router.push('/welcome');
        } else {
          BrowserSessionManager.forceLogoutAdmin();
          toast.success('Logged out successfully');
          router.push('/admin/login');
        }
      } catch (error) {
        BrowserSessionManager.forceLogoutAdmin();
        toast.success('Logged out successfully');
        router.push('/admin/login');
      }
    }
  };

  // Form submission handler
  const onSubmit = async (data: NominationFormData) => {
    if (!userToken) {
      toast.error('Authentication required')
      return
    }

    setIsLoading(true)

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Prepare complete nomination data
      const nominationData = {
        wuaId: `WUA/MH/${data.applicationYear}/${Date.now()}`,
        applicationYear: data.applicationYear,
        category: data.category,
        
        // WUA Information
        wuaName: data.wuaName,
        wuaNameMarathi: data.wuaNameMarathi,
        district: data.district,
        taluka: data.taluka,
        village: data.village,
        pincode: data.pincode,
        
        // Contact Information
        contactInfo: {
          chairmanName: data.chairmanName,
          chairmanMobile: data.chairmanMobile,
          chairmanEmail: data.chairmanEmail,
          secretaryName: data.secretaryName,
          secretaryMobile: data.secretaryMobile,
          secretaryEmail: data.secretaryEmail
        },
        
        // WUA Details
        wuaDetails: {
          registrationNumber: data.registrationNumber,
          registrationDate: data.registrationDate,
          totalMembers: data.totalMembers,
          maleMembers: data.maleMembers,
          femaleMembers: data.femaleMembers,
          irrigationArea: data.irrigationArea
        },
        
        // Project Information
        projectInfo: {
          projectName: data.projectName,
          projectDescription: data.projectDescription,
          completionYear: data.completionYear,
          projectBenefits: data.projectBenefits
        },
        
        // Banking Information
        bankingInfo: {
          bankName: data.bankName,
          branchName: data.branchName,
          accountNumber: data.accountNumber,
          ifscCode: data.ifscCode
        },
        
        // Default self-assessment (to be filled later)
        selfAssessment: {
          governanceScore: 0,
          waterManagementScore: 0,
          financialManagementScore: 0,
          maintenanceScore: 0,
          documentationScore: 0,
          totalScore: 0
        }
      }

      const response = await fetch('/api/nominations/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify(data) // Send direct form data
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Nomination submitted successfully!')
        setTimeout(() => {
          router.push('/admin/dashboard')
        }, 2000)
      } else {
        toast.error(result.message || 'Failed to submit nomination')
      }
    } catch (error) {
      console.error('Submission error:', error)
      toast.error('Failed to submit nomination. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Save as draft
  const saveDraft = async () => {
    toast.success('Draft saved locally')
    // In a real implementation, this would save to localStorage or database
  }

  if (!userToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Complete Nomination Form - Maharashtra WRD</title>
        <meta name="description" content="Submit complete WUA nomination for Punyashlok Ahilyabai Holkar Award" />
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

            <div className="flex items-center space-x-4">
              <div className="text-center">
                <h1 className="text-lg font-semibold text-white">Complete Nomination Form</h1>
                <p className="text-sm text-white/70">Punyashlok Ahilyabai Holkar Award</p>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-white rounded-lg transition-colors border border-red-500/30"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="government-card p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Water User Association Nomination Form
                </h2>
                <p className="text-gray-600">Complete all sections to submit your nomination</p>
                {userData && (
                  <div className="mt-2 text-sm text-orange-600">
                    Submitted by: {userData.name}
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Section 1: Basic WUA Information */}
                <div className="bg-orange-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Building2 className="w-5 h-5 mr-2 text-orange-600" />
                    WUA Basic Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        WUA Name (English) *
                      </label>
                      <input
                        type="text"
                        {...register('wuaName', { required: 'WUA name is required' })}
                        className="government-input"
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
                        {...register('wuaNameMarathi', { required: 'WUA name in Marathi is required' })}
                        className="government-input marathi-text"
                        placeholder="WUA नाव मराठीत"
                      />
                      {errors.wuaNameMarathi && (
                        <p className="mt-1 text-sm text-red-600">{errors.wuaNameMarathi.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Registration Number *
                      </label>
                      <input
                        type="text"
                        {...register('registrationNumber', { required: 'Registration number is required' })}
                        className="government-input"
                        placeholder="WUA/MH/2023/001"
                      />
                      {errors.registrationNumber && (
                        <p className="mt-1 text-sm text-red-600">{errors.registrationNumber.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Registration Date *
                      </label>
                      <input
                        type="date"
                        {...register('registrationDate', { required: 'Registration date is required' })}
                        className="government-input"
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

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Project Category *
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center">
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

                        <label className="flex items-center">
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
                  </div>
                </div>

                {/* Section 2: Geographic Information */}
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                    Geographic Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        District *
                      </label>
                      <input
                        type="text"
                        {...register('district', { required: 'District is required' })}
                        className="government-input"
                        placeholder="District name"
                      />
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
                        className="government-input"
                        placeholder="Taluka name"
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
                        className="government-input"
                        placeholder="Village name"
                      />
                      {errors.village && (
                        <p className="mt-1 text-sm text-red-600">{errors.village.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        {...register('pincode', { 
                          required: 'Pincode is required',
                          pattern: {
                            value: /^[1-9][0-9]{5}$/,
                            message: 'Enter valid 6-digit pincode'
                          }
                        })}
                        className="government-input"
                        placeholder="400001"
                      />
                      {errors.pincode && (
                        <p className="mt-1 text-sm text-red-600">{errors.pincode.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Section 3: Contact Information */}
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2 text-green-600" />
                    Contact Information
                  </h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Chairman Information */}
                    <div>
                      <h4 className="font-medium text-gray-800 mb-4 text-center bg-green-100 py-2 rounded">Chairman Details</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Chairman Name *
                          </label>
                          <input
                            type="text"
                            {...register('chairmanName', { required: 'Chairman name is required' })}
                            className="government-input"
                            placeholder="Full name"
                          />
                          {errors.chairmanName && (
                            <p className="mt-1 text-sm text-red-600">{errors.chairmanName.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Chairman Mobile *
                          </label>
                          <input
                            type="tel"
                            {...register('chairmanMobile', {
                              required: 'Chairman mobile is required',
                              pattern: {
                                value: /^[6-9]\d{9}$/,
                                message: 'Enter valid 10-digit mobile number'
                              }
                            })}
                            className="government-input"
                            placeholder="9876543210"
                          />
                          {errors.chairmanMobile && (
                            <p className="mt-1 text-sm text-red-600">{errors.chairmanMobile.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Chairman Email
                          </label>
                          <input
                            type="email"
                            {...register('chairmanEmail', {
                              pattern: {
                                value: /^\S+@\S+$/,
                                message: 'Enter valid email address'
                              }
                            })}
                            className="government-input"
                            placeholder="chairman@example.com"
                          />
                          {errors.chairmanEmail && (
                            <p className="mt-1 text-sm text-red-600">{errors.chairmanEmail.message}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Secretary Information */}
                    <div>
                      <h4 className="font-medium text-gray-800 mb-4 text-center bg-green-100 py-2 rounded">Secretary Details</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Secretary Name *
                          </label>
                          <input
                            type="text"
                            {...register('secretaryName', { required: 'Secretary name is required' })}
                            className="government-input"
                            placeholder="Full name"
                          />
                          {errors.secretaryName && (
                            <p className="mt-1 text-sm text-red-600">{errors.secretaryName.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Secretary Mobile *
                          </label>
                          <input
                            type="tel"
                            {...register('secretaryMobile', {
                              required: 'Secretary mobile is required',
                              pattern: {
                                value: /^[6-9]\d{9}$/,
                                message: 'Enter valid 10-digit mobile number'
                              }
                            })}
                            className="government-input"
                            placeholder="9876543210"
                          />
                          {errors.secretaryMobile && (
                            <p className="mt-1 text-sm text-red-600">{errors.secretaryMobile.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Secretary Email
                          </label>
                          <input
                            type="email"
                            {...register('secretaryEmail', {
                              pattern: {
                                value: /^\S+@\S+$/,
                                message: 'Enter valid email address'
                              }
                            })}
                            className="government-input"
                            placeholder="secretary@example.com"
                          />
                          {errors.secretaryEmail && (
                            <p className="mt-1 text-sm text-red-600">{errors.secretaryEmail.message}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 4: WUA Statistics */}
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2 text-purple-600" />
                    WUA Member Statistics
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Total Members *
                      </label>
                      <input
                        type="number"
                        {...register('totalMembers', { 
                          required: 'Total members is required',
                          min: { value: 1, message: 'Must be at least 1' },
                          valueAsNumber: true
                        })}
                        className="government-input"
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
                          min: { value: 0, message: 'Cannot be negative' },
                          valueAsNumber: true
                        })}
                        className="government-input"
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
                          min: { value: 0, message: 'Cannot be negative' },
                          valueAsNumber: true
                        })}
                        className="government-input"
                        placeholder="40"
                      />
                      {errors.femaleMembers && (
                        <p className="mt-1 text-sm text-red-600">{errors.femaleMembers.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Irrigation Area (hectares) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        {...register('irrigationArea', { 
                          required: 'Irrigation area is required',
                          min: { value: 0.01, message: 'Must be greater than 0' },
                          valueAsNumber: true
                        })}
                        className="government-input"
                        placeholder="1500.50"
                      />
                      {errors.irrigationArea && (
                        <p className="mt-1 text-sm text-red-600">{errors.irrigationArea.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Section 5: Project Information */}
                <div className="bg-yellow-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Building2 className="w-5 h-5 mr-2 text-yellow-600" />
                    Project Information
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Project Name *
                        </label>
                        <input
                          type="text"
                          {...register('projectName', { required: 'Project name is required' })}
                          className="government-input"
                          placeholder="Irrigation Project Name"
                        />
                        {errors.projectName && (
                          <p className="mt-1 text-sm text-red-600">{errors.projectName.message}</p>
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
                            max: { value: 2030, message: 'Year cannot be beyond 2030' },
                            valueAsNumber: true
                          })}
                          className="government-input"
                          placeholder="2023"
                        />
                        {errors.completionYear && (
                          <p className="mt-1 text-sm text-red-600">{errors.completionYear.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Project Description *
                      </label>
                      <textarea
                        {...register('projectDescription', { 
                          required: 'Project description is required',
                          minLength: { value: 50, message: 'Description must be at least 50 characters' }
                        })}
                        rows={4}
                        className="government-input"
                        placeholder="Describe the irrigation project, its scope, implementation details, and technical specifications..."
                      />
                      {errors.projectDescription && (
                        <p className="mt-1 text-sm text-red-600">{errors.projectDescription.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Project Benefits *
                      </label>
                      <textarea
                        {...register('projectBenefits', { 
                          required: 'Project benefits description is required',
                          minLength: { value: 30, message: 'Benefits description must be at least 30 characters' }
                        })}
                        rows={3}
                        className="government-input"
                        placeholder="Describe the benefits to farmers, community, and agricultural productivity..."
                      />
                      {errors.projectBenefits && (
                        <p className="mt-1 text-sm text-red-600">{errors.projectBenefits.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Section 6: Banking Information */}
                <div className="bg-indigo-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2 text-indigo-600" />
                    Banking Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bank Name *
                      </label>
                      <input
                        type="text"
                        {...register('bankName', { required: 'Bank name is required' })}
                        className="government-input"
                        placeholder="State Bank of India"
                      />
                      {errors.bankName && (
                        <p className="mt-1 text-sm text-red-600">{errors.bankName.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Branch Name *
                      </label>
                      <input
                        type="text"
                        {...register('branchName', { required: 'Branch name is required' })}
                        className="government-input"
                        placeholder="Main Branch"
                      />
                      {errors.branchName && (
                        <p className="mt-1 text-sm text-red-600">{errors.branchName.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Account Number *
                      </label>
                      <input
                        type="text"
                        {...register('accountNumber', { 
                          required: 'Account number is required',
                          minLength: { value: 9, message: 'Account number must be at least 9 digits' },
                          maxLength: { value: 18, message: 'Account number cannot exceed 18 digits' }
                        })}
                        className="government-input"
                        placeholder="1234567890123456"
                      />
                      {errors.accountNumber && (
                        <p className="mt-1 text-sm text-red-600">{errors.accountNumber.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        IFSC Code *
                      </label>
                      <input
                        type="text"
                        {...register('ifscCode', { 
                          required: 'IFSC code is required',
                          pattern: {
                            value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
                            message: 'Enter valid IFSC code (e.g., SBIN0001234)'
                          }
                        })}
                        className="government-input"
                        placeholder="SBIN0001234"
                        style={{ textTransform: 'uppercase' }}
                      />
                      {errors.ifscCode && (
                        <p className="mt-1 text-sm text-red-600">{errors.ifscCode.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <button
                    type="button"
                    onClick={saveDraft}
                    className="flex-1 flex items-center justify-center px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save as Draft
                  </button>
                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 government-button flex items-center justify-center space-x-2"
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
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}