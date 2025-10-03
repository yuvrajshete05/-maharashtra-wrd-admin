import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { ArrowLeft, CheckCircle2, Calendar, User, MapPin, FileText, ArrowRight, Info } from 'lucide-react'
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
  originalFeedback?: string // For backward compatibility
  marks?: string // New marks field
}

export default function CorporationApprovedApplications() {
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
    if (admin.userType !== 'corporation-committee') {
      toast.error('Access denied. Corporation Committee access required.')
      router.push('/admin/dashboard')
      return
    }

    // Load approved applications
    loadApprovedApplications()
  }, [])

  const loadApprovedApplications = () => {
    try {
      const storedApplications = JSON.parse(localStorage.getItem('nominee_applications') || '[]')
      const approvedApps = storedApplications.filter(app => app.corporationStatus === 'approved')
      setApplications(approvedApps)
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
        <div className="text-white text-xl">Loading approved applications...</div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Corporation Committee - Approved Applications | Maharashtra WRD</title>
        <meta name="description" content="View approved applications by Corporation Committee" />
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
                  <h1 className="text-xl font-bold text-white">Corporation Committee</h1>
                  <p className="text-orange-300 text-sm">Approved & Forwarded to State Committee</p>
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
              <CheckCircle2 className="w-16 h-16 text-orange-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">No Approved Applications</h2>
              <p className="text-gray-300">You haven't approved any applications yet.</p>
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
              <div className="bg-green-50/10 backdrop-blur-md border border-green-200/20 rounded-xl p-6 mb-8">
                <div className="flex items-center space-x-4">
                  <CheckCircle2 className="w-12 h-12 text-green-400" />
                  <div>
                    <h2 className="text-2xl font-bold text-white">Applications Approved by Corporation Committee</h2>
                    <p className="text-gray-300">
                      {applications.length} application{applications.length !== 1 ? 's' : ''} approved and forwarded to State Committee
                    </p>
                  </div>
                </div>
              </div>

              {/* Applications Grid */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="bg-white/10 backdrop-blur-md border border-green-200/20 rounded-xl p-6 hover:bg-white/15 transition-all cursor-pointer"
                    onClick={() => setSelectedApp(app)}
                  >
                    {/* Status Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100/20 text-green-300 border border-green-300/20">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Corp. Approved
                      </span>
                      <ArrowRight className="w-4 h-4 text-blue-400" />
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
                          <span>Corp. Approved: {app.corporationActionDate}</span>
                        </div>
                      </div>

                      {/* Workflow Progress */}
                      <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-2">Workflow Progress:</p>
                        <div className="flex items-center text-xs space-x-2">
                          <span className="text-green-300">✓ Circle</span>
                          <ArrowRight className="w-3 h-3 text-gray-400" />
                          <span className="text-green-300 font-medium">✓ Corporation</span>
                          <ArrowRight className="w-3 h-3 text-gray-400" />
                          <span className="text-blue-300">→ State Committee</span>
                        </div>
                      </div>

                      {/* Corporation Remarks Preview */}
                      {app.corporationRemarks && (
                        <div className="bg-green-50/10 border border-green-200/20 rounded-lg p-3">
                          <p className="text-xs text-green-300 font-medium mb-1">Corporation Committee Changes:</p>
                          <p className="text-green-200 text-sm line-clamp-2">
                            {app.corporationRemarks.length > 80 
                              ? `${app.corporationRemarks.substring(0, 80)}...` 
                              : app.corporationRemarks
                            }
                          </p>
                        </div>
                      )}
                    </div>

                    {/* View Details Button */}
                    <div className="mt-4 pt-4 border-t border-green-200/20">
                      <button className="text-green-300 text-sm hover:text-green-200 transition-colors flex items-center">
                        <Info className="w-4 h-4 mr-1" />
                        View Full Details & Changes
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
            <div className="bg-white/10 backdrop-blur-md border border-green-200/20 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white/10 backdrop-blur-md border-b border-green-200/20 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white">Application Details</h3>
                    <p className="text-green-300 text-sm">Approved by Corporation Committee</p>
                  </div>
                  <button
                    onClick={() => setSelectedApp(null)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <CheckCircle2 className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Status Section */}
                <div className="bg-green-50/10 border border-green-200/20 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <CheckCircle2 className="w-8 h-8 text-green-400" />
                    <div>
                      <h4 className="font-bold text-white">Application Status</h4>
                      <p className="text-green-300 text-sm">Approved by Corporation Committee & Forwarded to State Committee</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Circle Approval:</p>
                      <p className="text-green-300 font-medium">{selectedApp.circleActionDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Corporation Approval:</p>
                      <p className="text-green-300 font-medium">{selectedApp.corporationActionDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Current Stage:</p>
                      <p className="text-blue-300 font-medium">State Committee Review</p>
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
                {(selectedApp.marks || selectedApp.originalFeedback) && (
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-3 flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      Original Application Marks
                    </h4>
                    <p className="text-gray-300">{selectedApp.marks || selectedApp.originalFeedback || 'No marks available'}</p>
                  </div>
                )}

                {/* Circle Committee Review */}
                <div className="bg-green-50/10 border border-green-200/20 rounded-lg p-4">
                  <h4 className="font-bold text-white mb-3 flex items-center">
                    <CheckCircle2 className="w-5 h-5 mr-2 text-green-400" />
                    Circle Committee Review
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-green-300 text-sm font-medium">Approval Date:</p>
                      <p className="text-white">{selectedApp.circleActionDate}</p>
                    </div>
                    <div>
                      <p className="text-green-300 text-sm font-medium">Circle Committee Remarks:</p>
                      <p className="text-white bg-green-50/10 border border-green-200/20 rounded p-3 mt-1">
                        {selectedApp.circleRemarks}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Corporation Committee Changes */}
                <div className="bg-blue-50/10 border border-blue-200/20 rounded-lg p-4">
                  <h4 className="font-bold text-white mb-3 flex items-center">
                    <CheckCircle2 className="w-5 h-5 mr-2 text-blue-400" />
                    Corporation Committee Changes & Approval
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-blue-300 text-sm font-medium">Approval Date:</p>
                      <p className="text-white">{selectedApp.corporationActionDate}</p>
                    </div>
                    <div>
                      <p className="text-blue-300 text-sm font-medium">Corporation Committee Changes:</p>
                      <p className="text-white bg-blue-50/10 border border-blue-200/20 rounded p-3 mt-1">
                        {selectedApp.corporationRemarks}
                      </p>
                    </div>
                    <div className="bg-blue-100/10 border border-blue-300/20 rounded p-3">
                      <p className="text-blue-300 text-sm">
                        <ArrowRight className="w-4 h-4 inline mr-1" />
                        This application has been approved by Corporation Committee with the above changes and forwarded to State Committee for final review.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-white/10 backdrop-blur-md border-t border-green-200/20 p-6">
                <button
                  onClick={() => setSelectedApp(null)}
                  className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
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