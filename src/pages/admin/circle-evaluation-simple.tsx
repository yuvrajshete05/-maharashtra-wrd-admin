import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import toast from 'react-hot-toast'
import { LogOut, ArrowLeft, Eye, CheckCircle, XCircle, MessageSquare, Send } from 'lucide-react'

interface Application {
  id: string
  wuaName: string
  district: string
  status: string
  submissionDate: string
  category: string
  feedback: string
  submittedBy: string
  userType: string
  workflowStage: string
  circleStatus: string
  corporationStatus: string
  stateStatus: string
  finalStatus: string
  circleRemarks: string
  corporationRemarks: string
  stateRemarks: string
  circleActionDate: string | null
  corporationActionDate: string | null
  stateActionDate: string | null
  finalActionDate: string | null
}

export default function CircleEvaluationSimple() {
  const router = useRouter()
  const [adminData, setAdminData] = useState<any>(null)
  const [applications, setApplications] = useState<Application[]>([])
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [remarks, setRemarks] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

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
      loadSubmissions()
    } catch (error) {
      console.error('Error parsing admin data:', error)
      toast.error('Invalid session data. Please login again.')
      router.push('/admin/login')
    }
  }, [router])

  const loadSubmissions = () => {
    const storedApplications = JSON.parse(localStorage.getItem('nominee_applications') || '[]')
    // Filter applications that are pending for circle committee review
    const pendingApplications = storedApplications.filter((app: Application) => 
      app.workflowStage === 'user-submitted' && app.circleStatus === 'pending'
    )
    setApplications(pendingApplications)
    console.log('Circle Committee - Loaded applications:', pendingApplications)
  }

  const handleViewSubmission = (application: Application) => {
    setSelectedApplication(application)
    setRemarks(application.circleRemarks || '')
  }

  const handleApprove = async () => {
    if (!selectedApplication || !remarks.trim()) {
      toast.error('Please add remarks before approving')
      return
    }

    setIsProcessing(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update the application
      const storedApplications = JSON.parse(localStorage.getItem('nominee_applications') || '[]')
      const updatedApplications = storedApplications.map((app: Application) => {
        if (app.id === selectedApplication.id) {
          return {
            ...app,
            circleStatus: 'approved',
            circleRemarks: remarks,
            circleActionDate: new Date().toLocaleDateString('en-GB'),
            workflowStage: 'circle-approved',
            status: 'Circle Approved',
            corporationStatus: 'pending' // Set corporation status to pending for next level review
          }
        }
        return app
      })
      
      localStorage.setItem('nominee_applications', JSON.stringify(updatedApplications))
      toast.success('Application approved and recommended to Corporation Committee')
      
      setSelectedApplication(null)
      setRemarks('')
      loadSubmissions()
    } catch (error) {
      toast.error('Failed to approve application')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReject = async () => {
    if (!selectedApplication || !remarks.trim()) {
      toast.error('Please add remarks before rejecting')
      return
    }

    setIsProcessing(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update the application
      const storedApplications = JSON.parse(localStorage.getItem('nominee_applications') || '[]')
      const updatedApplications = storedApplications.map((app: Application) => {
        if (app.id === selectedApplication.id) {
          return {
            ...app,
            circleStatus: 'rejected',
            circleRemarks: remarks,
            circleActionDate: new Date().toLocaleDateString('en-GB'),
            workflowStage: 'circle-rejected',
            status: 'Circle Rejected',
            finalStatus: 'rejected'
          }
        }
        return app
      })
      
      localStorage.setItem('nominee_applications', JSON.stringify(updatedApplications))
      toast.success('Application rejected')
      
      setSelectedApplication(null)
      setRemarks('')
      loadSubmissions()
    } catch (error) {
      toast.error('Failed to reject application')
    } finally {
      setIsProcessing(false)
    }
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
        <title>Circle Committee Evaluation - Maharashtra WRD</title>
        <meta name="description" content="Circle Committee Evaluation Interface" />
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
                    Circle Committee Evaluation
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
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Applications for Review</h2>
              <p className="text-gray-600">Review and evaluate user submissions</p>
            </div>

            {applications.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No pending applications for review</p>
                <button 
                  onClick={loadSubmissions}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Refresh Applications
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((application) => (
                  <div key={application.id} className="bg-white border rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-800">{application.wuaName}</h3>
                        <p className="text-sm text-gray-600">
                          Submitted: {application.submissionDate} | District: {application.district}
                        </p>
                        <p className="text-sm text-gray-500">By: {application.submittedBy}</p>
                        <span className="inline-block mt-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                          {application.status}
                        </span>
                      </div>
                      <button
                        onClick={() => handleViewSubmission(application)}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Details</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Application Details Modal */}
          {selectedApplication && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Application Details</h3>
                    <button
                      onClick={() => setSelectedApplication(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Applicant Name</label>
                      <p className="text-gray-800">{selectedApplication.wuaName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">District</label>
                      <p className="text-gray-800">{selectedApplication.district}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Submission Date</label>
                      <p className="text-gray-800">{selectedApplication.submissionDate}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Marks</label>
                      <p className="text-gray-800 bg-gray-50 p-3 rounded-md">{selectedApplication.marks || selectedApplication.feedback || 'No marks available'}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MessageSquare className="inline w-4 h-4 mr-2" />
                      Add Your Remarks
                    </label>
                    <textarea
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Add your evaluation remarks here..."
                      disabled={isProcessing}
                    />
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={handleApprove}
                      disabled={isProcessing}
                      className="flex items-center space-x-2 px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>{isProcessing ? 'Processing...' : 'Approve & Recommend'}</span>
                    </button>
                    <button
                      onClick={handleReject}
                      disabled={isProcessing}
                      className="flex items-center space-x-2 px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>{isProcessing ? 'Processing...' : 'Reject'}</span>
                    </button>
                    <button
                      onClick={() => setSelectedApplication(null)}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                    >
                      Cancel
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