import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { ArrowLeft, Trophy, Calendar, User, MapPin, FileText, Crown, Info, Star } from 'lucide-react'
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
  originalFeedback?: string // For backward compatibility
  marks?: string // New marks field
}

export default function StateApprovedApplications() {
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

    // Load winner applications
    loadWinnerApplications()
  }, [])

  const loadWinnerApplications = () => {
    try {
      const storedApplications = JSON.parse(localStorage.getItem('nominee_applications') || '[]')
      const winners = storedApplications.filter(app => app.finalStatus === 'winner')
      setApplications(winners)
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
        <div className="text-white text-xl">Loading final winners...</div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>State Committee - Final Winners | Maharashtra WRD</title>
        <meta name="description" content="View final approved winners by State Committee" />
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
                  <p className="text-orange-300 text-sm">Final Winners - Punyashlok Ahilyabai Holkar Award</p>
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
              <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">No Winners Declared Yet</h2>
              <p className="text-gray-300">No applications have been declared as final winners yet.</p>
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="mt-6 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          ) : (
            <>
              {/* Winners Header */}
              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-md border border-yellow-200/20 rounded-xl p-6 mb-8">
                <div className="flex items-center space-x-4">
                  <Crown className="w-12 h-12 text-yellow-400" />
                  <div>
                    <h2 className="text-3xl font-bold text-white">🏆 Final Winners</h2>
                    <p className="text-yellow-300 text-lg">
                      Punyashlok Ahilyabai Holkar Award Winners - {applications.length} Winner{applications.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </div>

              {/* Winners Grid */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {applications.map((app, index) => (
                  <div
                    key={app.id}
                    className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-md border border-yellow-200/20 rounded-xl p-6 hover:from-yellow-500/15 hover:to-orange-500/15 transition-all cursor-pointer relative"
                    onClick={() => setSelectedApp(app)}
                  >
                    {/* Winner Badge */}
                    <div className="absolute -top-3 -right-3 bg-yellow-500 text-yellow-900 rounded-full p-2">
                      <Crown className="w-6 h-6" />
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100/20 text-yellow-300 border border-yellow-300/20">
                        <Trophy className="w-3 h-3 mr-1" />
                        Winner #{index + 1}
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
                        <div className="flex items-center text-yellow-300">
                          <Star className="w-4 h-4 mr-2" />
                          <span>Winner Declared: {app.stateActionDate}</span>
                        </div>
                      </div>

                      {/* Winner Status */}
                      <div className="bg-yellow-50/10 border border-yellow-200/20 rounded-lg p-3">
                        <p className="text-xs text-yellow-300 font-medium mb-1">Final Status:</p>
                        <p className="text-yellow-200 text-sm font-bold">
                          🏆 Punyashlok Ahilyabai Holkar Award Winner
                        </p>
                      </div>
                    </div>

                    {/* View Details Button */}
                    <div className="mt-4 pt-4 border-t border-yellow-200/20">
                      <button className="text-yellow-300 text-sm hover:text-yellow-200 transition-colors flex items-center">
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
            <div className="bg-white/10 backdrop-blur-md border border-yellow-200/20 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-md border-b border-yellow-200/20 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Crown className="w-8 h-8 text-yellow-400" />
                    <div>
                      <h3 className="text-xl font-bold text-white">Winner Details</h3>
                      <p className="text-yellow-300 text-sm">Punyashlok Ahilyabai Holkar Award Winner</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedApp(null)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Winner Status Section */}
                <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-200/20 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <Trophy className="w-8 h-8 text-yellow-400" />
                    <div>
                      <h4 className="font-bold text-white">🏆 Final Winner</h4>
                      <p className="text-yellow-300 text-sm">Punyashlok Ahilyabai Holkar Award</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Winner Declared:</p>
                      <p className="text-white font-medium">{selectedApp.stateActionDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Final Status:</p>
                      <p className="text-yellow-300 font-medium">🏆 Award Winner</p>
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

                {/* Original Marks */}
                {(selectedApp.marks || selectedApp.originalFeedback) && (
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-3 flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      Original Application Marks
                    </h4>
                    <p className="text-gray-300">{selectedApp.marks || selectedApp.originalFeedback || 'No marks available'}</p>
                  </div>
                )}

                {/* Committee Approvals Timeline */}
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

                  {/* State Committee Final Decision */}
                  <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-200/20 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-3 flex items-center">
                      <Crown className="w-5 h-5 mr-2 text-yellow-400" />
                      State Committee - Final Winner Decision
                    </h4>
                    <div className="space-y-2">
                      <p className="text-yellow-300 text-sm">Winner Declared on: {selectedApp.stateActionDate}</p>
                      {selectedApp.stateRemarks && (
                        <p className="text-white bg-yellow-50/10 border border-yellow-200/20 rounded p-3 text-sm">
                          {selectedApp.stateRemarks}
                        </p>
                      )}
                      <div className="bg-yellow-100/10 border border-yellow-300/20 rounded p-3 mt-3">
                        <p className="text-yellow-300 text-sm font-medium">
                          🏆 This WUA has been declared the winner of the Punyashlok Ahilyabai Holkar Award for excellence in water management and community participation.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-md border-t border-yellow-200/20 p-6">
                <button
                  onClick={() => setSelectedApp(null)}
                  className="w-full px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-lg hover:from-yellow-700 hover:to-orange-700 transition-colors"
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