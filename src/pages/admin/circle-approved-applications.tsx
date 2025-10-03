import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import toast from 'react-hot-toast'
import { LogOut, ArrowLeft, CheckCircle, Eye, Calendar, User } from 'lucide-react'

interface Application {
  id: string
  wuaName: string
  district: string
  status: string
  submissionDate: string
  category: string
  feedback?: string // For backward compatibility
  marks?: string // New marks field
  submittedBy: string
  userType: string
  workflowStage: string
  circleStatus: string
  circleRemarks: string
  circleActionDate: string | null
}

export default function CircleApprovedApplications() {
  const router = useRouter()
  const [adminData, setAdminData] = useState<any>(null)
  const [approvedApplications, setApprovedApplications] = useState<Application[]>([])
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)

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
      setAdminData(parsedData)
      loadApprovedApplications()
    } catch (error) {
      console.error('Error parsing admin data:', error)
      toast.error('Invalid session data. Please login again.')
      router.push('/admin/login')
    }
  }, [router])

  const loadApprovedApplications = () => {
    const storedApplications = JSON.parse(localStorage.getItem('nominee_applications') || '[]')
    const approved = storedApplications.filter((app: Application) => app.circleStatus === 'approved')
    setApprovedApplications(approved)
    console.log('Circle Committee - Approved applications:', approved)
  }

  const handleViewApplication = (application: Application) => {
    setSelectedApplication(application)
  }

  const handleLogout = () => {
    localStorage.clear()
    toast.success('Logged out successfully')
    router.push('/admin/login')
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
        <title>Circle Committee - Approved Applications - Maharashtra WRD</title>
        <meta name="description" content="Circle Committee Approved Applications" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-md border-b border-white/20">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="flex items-center space-x-2 text-white/80 hover:text-white"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Dashboard</span>
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-maharashtra-orange rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">मह</span>
                </div>
                <div>
                  <h1 className="font-semibold text-lg text-white">
                    Circle Committee - Approved Applications
                  </h1>
                  <p className="text-white/70 text-sm">Maharashtra Water Resources Department</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-white">{adminData.name}</p>
                <p className="text-xs text-white/70">{adminData.userType || adminData.adminLevel}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 px-3 py-2 text-sm bg-red-500/20 text-red-200 rounded-md hover:bg-red-500/30 border border-red-500/30"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="container mx-auto px-6 py-8">
          <div className="government-card p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
                <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
                Applications Approved by Circle Committee
              </h2>
              <p className="text-gray-600">Applications you have approved and forwarded to Corporation Committee</p>
            </div>

            {approvedApplications.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No approved applications yet</p>
                <p className="text-gray-500 text-sm mt-2">Applications you approve will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {approvedApplications.map((application) => (
                  <div key={application.id} className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg p-6 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <CheckCircle className="w-6 h-6 text-green-600" />
                          <h3 className="text-xl font-semibold text-gray-800">{application.wuaName}</h3>
                          <span className="px-3 py-1 bg-green-500 text-white text-sm rounded-full">
                            ✓ Approved
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center space-x-2 text-gray-600">
                            <User className="w-4 h-4" />
                            <span className="text-sm">
                              <strong>Submitted by:</strong> {application.submittedBy}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">
                              <strong>District:</strong> {application.district}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">
                              <strong>Submitted:</strong> {application.submissionDate}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-sm">
                              <strong>Approved on:</strong> {application.circleActionDate}
                            </span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">Original Feedback:</p>
                          <p className="text-gray-800 bg-white p-3 rounded-md border">{application.feedback}</p>
                        </div>

                        <div className="mb-4">
                          <p className="text-sm font-medium text-green-700 mb-2">Your Circle Committee Remarks:</p>
                          <p className="text-green-800 bg-green-100 p-3 rounded-md border border-green-200">{application.circleRemarks}</p>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <p className="text-blue-800 text-sm font-medium flex items-center">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Status: Application forwarded to Corporation Committee for next level review
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleViewApplication(application)}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 ml-4"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Details</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8 text-center">
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Back to Dashboard
              </button>
            </div>
          </div>

          {/* Application Details Modal */}
          {selectedApplication && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center">
                      <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
                      Approved Application Details
                    </h3>
                    <button
                      onClick={() => setSelectedApplication(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Application ID</label>
                        <p className="text-gray-800 font-mono">{selectedApplication.id}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <p className="text-gray-800">{selectedApplication.category}</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Applicant Name</label>
                      <p className="text-gray-800 text-lg font-semibold">{selectedApplication.wuaName}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">District</label>
                        <p className="text-gray-800">{selectedApplication.district}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Submitted By</label>
                        <p className="text-gray-800">{selectedApplication.submittedBy}</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Original User Marks</label>
                      <p className="text-gray-800 bg-gray-50 p-4 rounded-md border">{selectedApplication.marks || selectedApplication.feedback || 'No marks available'}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-green-700">Circle Committee Approval Remarks</label>
                      <p className="text-green-800 bg-green-50 p-4 rounded-md border border-green-200">{selectedApplication.circleRemarks}</p>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 text-green-800">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">Approval Status</span>
                      </div>
                      <p className="text-green-700 mt-2">
                        ✓ Approved by Circle Committee on {selectedApplication.circleActionDate}
                      </p>
                      <p className="text-blue-700 mt-1">
                        → Forwarded to Corporation Committee for next level review
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => setSelectedApplication(null)}
                      className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  )
}