// Data Flow Test Dashboard
// Path: src/pages/admin/data-flow-test.tsx

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import toast from 'react-hot-toast'
import { ArrowLeft, Database, Users, CheckCircle, Eye, RefreshCw } from 'lucide-react'

interface NominationRecord {
  _id: string
  wuaId: string
  wuaName: string
  district: string
  status: string
  submissionDate: string
  chairmanName: string
  totalMembers: number
  evaluationJourney: any
}

export default function DataFlowTest() {
  const router = useRouter()
  const [nominations, setNominations] = useState<NominationRecord[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [userToken, setUserToken] = useState<string | null>(null)

  // Authentication check
  useEffect(() => {
    const token = localStorage.getItem('adminToken') || localStorage.getItem('loginToken')
    const adminData = localStorage.getItem('adminData')

    if (!token) {
      toast.error('Please login first')
      router.push('/admin/login')
      return
    }

    setUserToken(token)
    loadAllNominations(token)
  }, [router])

  // Load all nominations from MongoDB
  const loadAllNominations = async (token: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/nominations/get-for-evaluation?stage=all', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const result = await response.json()
      if (result.success) {
        setNominations(result.nominations)
        toast.success(`✅ Loaded ${result.nominations.length} nominations from MongoDB`)
      } else {
        toast.error('Failed to load nominations: ' + result.message)
      }
    } catch (error) {
      console.error('Error loading nominations:', error)
      toast.error('Network error loading data')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-500/20 text-blue-400'
      case 'self-assessment-completed': return 'bg-green-500/20 text-green-400'
      case 'circle-evaluation-completed': return 'bg-purple-500/20 text-purple-400'
      case 'corporation-evaluation-completed': return 'bg-orange-500/20 text-orange-400'
      case 'state-evaluation-completed': return 'bg-red-500/20 text-red-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  return (
    <>
      <Head>
        <title>Data Flow Test - Maharashtra WRD Admin</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative">
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
                    className="flex items-center space-x-2 text-white hover:text-maharashtra-orange transition-colors"
                  >
                    <ArrowLeft size={20} />
                    <span>Back to Dashboard</span>
                  </button>
                  <div className="h-8 w-px bg-white/20"></div>
                  <Database className="text-maharashtra-orange" size={24} />
                  <h1 className="text-2xl font-bold text-white">
                    MongoDB Data Flow Test
                  </h1>
                </div>
                <button
                  onClick={() => userToken && loadAllNominations(userToken)}
                  className="flex items-center space-x-2 px-4 py-2 bg-maharashtra-blue hover:bg-maharashtra-blue/80 text-white rounded-lg transition-colors"
                >
                  <RefreshCw size={16} />
                  <span>Refresh Data</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="container mx-auto px-6 py-8">
            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-maharashtra-orange"></div>
                <p className="text-white mt-4">Loading nominations from MongoDB...</p>
              </div>
            )}

            {/* Data Display */}
            {!isLoading && (
              <div className="government-card p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Users className="text-maharashtra-orange" size={24} />
                  <h2 className="text-2xl font-bold text-gray-800">
                    Nominations Database ({nominations.length} records)
                  </h2>
                </div>

                {nominations.length === 0 ? (
                  <div className="text-center py-12">
                    <Database className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-600 text-lg mb-2">No nominations found in MongoDB</p>
                    <p className="text-gray-500">Submit a nomination form to see data here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {nominations.map((nomination, index) => (
                      <div
                        key={nomination._id}
                        className="bg-white/50 border border-gray-200 rounded-lg p-4 hover:bg-white/70 transition-colors"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                          {/* WUA Info */}
                          <div>
                            <div className="font-bold text-gray-800 mb-1">
                              {nomination.wuaName}
                            </div>
                            <div className="text-sm text-gray-600">
                              ID: {nomination.wuaId}
                            </div>
                            <div className="text-sm text-gray-600">
                              District: {nomination.district}
                            </div>
                          </div>

                          {/* Status */}
                          <div>
                            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(nomination.status)}`}>
                              <CheckCircle size={14} className="mr-2" />
                              {nomination.status}
                            </div>
                          </div>

                          {/* Details */}
                          <div className="text-sm text-gray-600">
                            <div>Chairman: {nomination.chairmanName}</div>
                            <div>Members: {nomination.totalMembers}</div>
                            <div>Submitted: {new Date(nomination.submissionDate).toLocaleDateString()}</div>
                          </div>

                          {/* Evaluation Journey */}
                          <div>
                            <div className="text-xs text-gray-500 mb-2">Evaluation Progress:</div>
                            <div className="flex space-x-1">
                              {[
                                { key: 'nominationSubmitted', label: 'N', color: 'green' },
                                { key: 'selfAssessmentPending', label: 'S', color: nomination.evaluationJourney?.selfAssessmentPending ? 'orange' : 'gray' },
                                { key: 'circleCommitteePending', label: 'C', color: nomination.evaluationJourney?.circleCommitteePending ? 'orange' : 'gray' },
                                { key: 'corporationCommitteePending', label: 'R', color: nomination.evaluationJourney?.corporationCommitteePending ? 'orange' : 'gray' },
                                { key: 'stateCommitteePending', label: 'S', color: nomination.evaluationJourney?.stateCommitteePending ? 'orange' : 'gray' }
                              ].map((stage, i) => (
                                <div
                                  key={i}
                                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                    stage.color === 'green' ? 'bg-green-500 text-white' :
                                    stage.color === 'orange' ? 'bg-orange-500 text-white' :
                                    'bg-gray-300 text-gray-600'
                                  }`}
                                  title={stage.label}
                                >
                                  {stage.label}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Testing Instructions */}
                <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-bold text-blue-800 mb-2">🧪 Data Flow Testing Instructions:</h3>
                  <ol className="text-blue-700 space-y-1 text-sm">
                    <li>1. Go to <strong>Nomination Form</strong> and submit a complete application</li>
                    <li>2. Return to this page and click "Refresh Data" to see it in MongoDB</li>
                    <li>3. Go to <strong>Circle Committee Evaluation</strong> to see the nomination available</li>
                    <li>4. Complete the evaluation and check status changes here</li>
                    <li>5. Repeat for Corporation and State Committee forms</li>
                  </ol>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}