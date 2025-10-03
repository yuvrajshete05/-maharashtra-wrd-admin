import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { ArrowLeft, XCircle, Calendar, User, MapPin, FileText, AlertTriangle, Info } from 'lucide-react'
import toast from 'react-hot-toast'

interface Application {
  id: string
  wuaName: string
  district: string
  submissionDate: string
  workflowStage: string
  circleStatus: string
  circleActionDate: string
  circleRemarks: string
  corporationStatus: string
  corporationActionDate: string
  corporationRemarks: string
  stateStatus: string
  stateActionDate: string
  stateRemarks: string
  finalStatus: string
  originalFeedback: string
}

export default function StateRejectedApplications() {
  const router = useRouter()
  const [applications, setApplications] = useState<Application[]>([])
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check authentication
    const adminData = localStorage.getItem('adminData')
    if (!adminData) {
      router.push('/admin/login')
      return
    }

    const admin = JSON.parse(adminData)
    if (admin.userType !== 'state-committee') {
      toast.error('Access denied. State Committee access required.')
      router.push('/admin/dashboard')
      return
    }

    // Load rejected applications
    loadRejectedApplications()
  }, [])

  const loadRejectedApplications = () => {
    try {
      const storedApplications = JSON.parse(localStorage.getItem('nominee_applications') || '[]')
      const rejectedApps = storedApplications.filter(app => app.stateStatus === 'rejected')
      setApplications(rejectedApps)
      setIsLoading(false)
    } catch (error) {
      console.error('Error loading applications:', error)
      toast.error('Error loading applications')
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading rejected applications...</div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>State Committee - Rejected Applications | Maharashtra WRD</title>
        <meta name="description" content="View rejected applications by State Committee" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* Header */}
        <div className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-40">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.push('/admin/dashboard')}
                  className="flex items-center space-x-2 text-white hover:text-orange-300 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Back to Dashboard</span>
                </button>
                <div className="h-6 w-px bg-white/30" />
                <div>
                  <h1 className="text-xl font-bold text-white">State Committee</h1>
                  <p className="text-orange-300 text-sm">Rejected Applications</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-medium">Maharashtra Water Resources Department</p>
                <p className="text-orange-300 text-sm">महाराष्ट्र जल संसाधन विभाग</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-8">
          {applications.length === 0 ? (
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8 text-center">
              <AlertTriangle className="w-16 h-16 text-orange-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">No Rejected Applications</h2>
              <p className="text-gray-300">You haven't rejected any applications yet.</p>
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="mt-6 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          ) : (
            <>
              {/* Summary Card */}
              <div className="bg-red-50/10 backdrop-blur-md border border-red-200/20 rounded-xl p-6 mb-8">
                <div className="flex items-center space-x-4">
                  <XCircle className="w-12 h-12 text-red-400" />
                  <div>
                    <h2 className="text-2xl font-bold text-white">Rejected Applications</h2>
                    <p className="text-gray-300">
                      {applications.length} application{applications.length !== 1 ? 's' : ''} rejected by State Committee
                    </p>
                  </div>
                </div>
              </div>

              {/* Applications Grid */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="bg-white/10 backdrop-blur-md border border-red-200/20 rounded-xl p-6 hover:bg-white/15 transition-all cursor-pointer"
                    onClick={() => setSelectedApp(app)}
                  >
                    {/* Status Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100/20 text-red-300 border border-red-300/20">
                        <XCircle className="w-3 h-3 mr-1" />
                        Rejected by State
                      </span>
                    </div>

                    {/* Application Details */}
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-bold text-white text-lg mb-1">{app.wuaName}</h3>
                        <div className="flex items-center text-gray-300 text-sm">
                          <MapPin className="w-4 h-4 mr-1" />
                          {app.district}
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center text-gray-300">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>Submitted: {app.submissionDate}</span>
                        </div>
                        <div className="flex items-center text-green-300">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>Circle Approved: {app.circleActionDate}</span>
                        </div>
                        <div className="flex items-center text-blue-300">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>Corp Approved: {app.corporationActionDate}</span>
                        </div>
                        <div className="flex items-center text-red-300">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>State Rejected: {app.stateActionDate}</span>
                        </div>
                      </div>

                      {/* Rejection Reason Preview */}
                      {app.stateRemarks && (
                        <div className="bg-red-50/10 border border-red-200/20 rounded-lg p-3">
                          <p className="text-xs text-red-300 font-medium mb-1">Rejection Reason:</p>
                          <p className="text-red-200 text-sm line-clamp-2">
                            {app.stateRemarks.length > 80 
                              ? `${app.stateRemarks.substring(0, 80)}...` 
                              : app.stateRemarks
                            }
                          </p>
                        </div>
                      )}
                    </div>

                    {/* View Details Button */}
                    <div className="mt-4 pt-4 border-t border-red-200/20">
                      <button className="text-red-300 text-sm hover:text-red-200 transition-colors flex items-center">
                        <Info className="w-4 h-4 mr-1" />
                        View Full Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Detail Modal */}
        {selectedApp && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white/10 backdrop-blur-md border border-red-200/20 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white/10 backdrop-blur-md border-b border-red-200/20 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white">Application Details</h3>
                    <p className="text-red-300 text-sm">Rejected by State Committee</p>
                  </div>
                  <button
                    onClick={() => setSelectedApp(null)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Status Section */}
                <div className="bg-red-50/10 border border-red-200/20 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <XCircle className="w-8 h-8 text-red-400" />
                    <div>
                      <h4 className="font-bold text-white">Application Status</h4>
                      <p className="text-red-300 text-sm">Rejected by State Committee</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Rejection Date:</p>
                      <p className="text-white font-medium">{selectedApp.stateActionDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Final Status:</p>
                      <p className="text-red-300 font-medium">Not Selected for Award</p>
                    </div>
                  </div>
                </div>

                {/* Application Information */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <h4 className="font-bold text-white mb-3 flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Application Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">WUA Name:</p>
                      <p className="text-white font-medium">{selectedApp.wuaName}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">District:</p>
                      <p className="text-white font-medium">{selectedApp.district}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Submission Date:</p>
                      <p className="text-white font-medium">{selectedApp.submissionDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Application ID:</p>
                      <p className="text-white font-medium">{selectedApp.id}</p>
                    </div>
                  </div>
                </div>

                {/* Original Feedback */}
                {selectedApp.originalFeedback && (
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-3 flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      Original Application Feedback
                    </h4>
                    <p className="text-gray-300">{selectedApp.originalFeedback}</p>
                  </div>
                )}

                {/* Committee Decisions Timeline */}
                <div className="space-y-4">
                  {/* Circle Committee */}
                  <div className="bg-green-50/10 border border-green-200/20 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-3 flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-green-400" />
                      Circle Committee - Approved
                    </h4>
                    <div className="space-y-2">
                      <p className="text-green-300 text-sm">Approved on: {selectedApp.circleActionDate}</p>
                      {selectedApp.circleRemarks && (
                        <p className="text-white bg-green-50/10 border border-green-200/20 rounded p-3 text-sm">
                          {selectedApp.circleRemarks}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Corporation Committee */}
                  <div className="bg-blue-50/10 border border-blue-200/20 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-3 flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-blue-400" />
                      Corporation Committee - Approved
                    </h4>
                    <div className="space-y-2">
                      <p className="text-blue-300 text-sm">Approved on: {selectedApp.corporationActionDate}</p>
                      {selectedApp.corporationRemarks && (
                        <p className="text-white bg-blue-50/10 border border-blue-200/20 rounded p-3 text-sm">
                          {selectedApp.corporationRemarks}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* State Committee Rejection */}
                  <div className="bg-red-50/10 border border-red-200/20 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-3 flex items-center">
                      <XCircle className="w-5 h-5 mr-2 text-red-400" />
                      State Committee - Final Decision
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-red-300 text-sm font-medium">Rejection Date:</p>
                        <p className="text-white">{selectedApp.stateActionDate}</p>
                      </div>
                      <div>
                        <p className="text-red-300 text-sm font-medium">Reason for Rejection:</p>
                        <p className="text-white bg-red-50/10 border border-red-200/20 rounded p-3 mt-1">
                          {selectedApp.stateRemarks}
                        </p>
                      </div>
                      <div className="bg-red-100/10 border border-red-300/20 rounded p-3">
                        <p className="text-red-300 text-sm">
                          <AlertTriangle className="w-4 h-4 inline mr-1" />
                          This application was approved by both Circle and Corporation Committees but was not selected for the final award by the State Committee.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-white/10 backdrop-blur-md border-t border-red-200/20 p-6">
                <button
                  onClick={() => setSelectedApp(null)}
                  className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Close Details
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}