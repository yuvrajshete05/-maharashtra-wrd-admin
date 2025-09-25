import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { 
  BarChart3, 
  FileText, 
  Clock, 
  CheckCircle2, 
  Users, 
  RefreshCw, 
  Download,
  LogOut,
  Bell,
  Search,
  Filter,
  ChevronDown
} from 'lucide-react'
import toast from 'react-hot-toast'

interface AdminData {
  username: string
  adminLevel: string
  name: string
  loginTime: string
}

interface Application {
  id: string
  wuaName: string
  district: string
  status: 'Under Review' | 'Completed' | 'Forwarded' | 'Pending Review'
  submissionDate: string
  category: 'MAJOR' | 'MINOR'
}

export default function AdminDashboard() {
  const router = useRouter()
  const [adminData, setAdminData] = useState<AdminData | null>(null)
  const [activeSection, setActiveSection] = useState('dashboard')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [categoryFilter, setCategoryFilter] = useState('All Categories')
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Mock data for applications
  const applications: Application[] = [
    { id: 'WUA001', wuaName: 'श्री गंगा सुगारी पाणी वापर संघ', district: 'Pune', status: 'Under Review', submissionDate: '15 Aug 2024', category: 'MAJOR' },
    { id: 'WUA001', wuaName: 'महासंघ शिवराज संघ', district: 'Mumbai', status: 'Completed', submissionDate: '12 Aug 2024', category: 'MINOR' },
    { id: 'WUA001', wuaName: 'जलवाही जल संचार संघ', district: 'Nashik', status: 'Forwarded', submissionDate: '10 Aug 2024', category: 'MAJOR' },
    { id: 'WUA001', wuaName: 'गोदावरी नदी संघ', district: 'Aurangabad', status: 'Pending Review', submissionDate: '18 Aug 2024', category: 'MINOR' },
    { id: 'WUA001', wuaName: 'गोदावरी नदी संघ', district: 'Pune', status: 'Pending Review', submissionDate: '15 Aug 2024', category: 'MINOR' }
  ]

  const recentActivities = [
    { type: 'new', title: 'New Application Received', subtitle: 'Shivaji WUA - Minor Category', time: '2 hours ago' },
    { type: 'completed', title: 'Verification Completed', subtitle: 'Shivam WUA - Minor Category', time: '4 hours ago' },
    { type: 'review', title: 'Document Review Pending', subtitle: 'Maharashtra WUA - Major Category', time: '1 day ago' },
    { type: 'completed', title: 'Verification Completed', subtitle: 'Godavari WUA - Minor Category', time: '2 days ago' }
  ]

  useEffect(() => {
    // Check if user is authenticated
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
    } catch (error) {
      toast.error('Invalid session data')
      router.push('/admin/login')
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminData')
    toast.success('Logged out successfully')
    router.push('/admin/login')
  }

  const handleViewApplication = (app: Application) => {
    setSelectedApplication(app)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedApplication(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800'
      case 'Under Review': return 'bg-orange-100 text-orange-800'
      case 'Forwarded': return 'bg-blue-100 text-blue-800'
      case 'Pending Review': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'new': return <Bell className="w-4 h-4 text-blue-300" />
      case 'completed': return <CheckCircle2 className="w-4 h-4 text-green-300" />
      case 'review': return <Clock className="w-4 h-4 text-orange-300" />
      default: return <Bell className="w-4 h-4 text-white/70" />
    }
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
        <title>Admin Dashboard - Maharashtra Water Resources Department</title>
        <meta name="description" content="Admin dashboard for Maharashtra Water Resources Department" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-50">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23374151' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        {/* Header */}
        <header className="relative z-10 bg-white/10 backdrop-blur-md border-b border-white/20">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm p-[5mm]">महाराष्ट्र</span>
              </div>
              <div className="text-white">
                <h1 className="text-lg font-semibold">Maharashtra Water Resources Department</h1>
                <p className="text-white/80 text-sm marathi-text">Government of Maharashtra</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-white/90">
              <div className="text-right">
                <p className="text-sm font-medium text-white">Corporation Admin</p>
                <p className="text-sm text-white/80">Krishna Corporation</p>
              </div>
              <select className="px-3 py-1 text-sm border border-white/20 rounded-md bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 transition-colors">
                <option className="text-gray-900">English</option>
                <option className="text-gray-900">मराठी</option>
              </select>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm border border-white/20 rounded-lg hover:bg-white/10 transition-colors text-white/90"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Sidebar */}
          <aside className="relative z-10 w-64 bg-white/10 backdrop-blur-md border-r border-white/20 min-h-[calc(100vh-80px)]">
            <div className="p-4">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{adminData.name}</h3>
                  <p className="text-sm text-white/70 capitalize">{adminData.adminLevel}</p>
                </div>
              </div>

              <nav className="space-y-2">
                <div className="text-xs font-semibold text-white/60 uppercase tracking-wide mb-3">
                  MAIN DASHBOARD
                  <hr></hr>
                </div>
                <button
                  onClick={() => setActiveSection('dashboard')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeSection === 'dashboard' 
                      ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' 
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <BarChart3 className="w-5 h-5" />
                  <span>Dashboard Overview</span>
                </button>
                <button
                  onClick={() => setActiveSection('applications')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeSection === 'applications' 
                      ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' 
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <FileText className="w-5 h-5" />
                  <span>Applications</span>
                </button>

                <div className="text-xs font-semibold text-white/60 uppercase tracking-wide mb-3 mt-6">
                  REPORTS & ANALYTICS
                  <hr></hr>
                </div>
                <button
                  onClick={() => toast('Reports functionality will be implemented here', { icon: 'ℹ️' })}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors text-white/80 hover:bg-white/10 hover:text-white"
                >
                  <FileText className="w-5 h-5" />
                  <span>Reports</span>
                </button>
                <button
                  onClick={() => toast('Analytics functionality will be implemented here', { icon: 'ℹ️' })}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors text-white/80 hover:bg-white/10 hover:text-white"
                >
                  <BarChart3 className="w-5 h-5" />
                  <span>Analytics</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="relative z-10 flex-1 p-6">
            {activeSection === 'dashboard' ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
                  <div className="flex items-center space-x-2">
                    <button className="px-4 py-2 text-sm border border-white/20 rounded-md hover:bg-white/10 transition-colors text-white/90">
                      Export Data
                    </button>
                    <button className="px-4 py-2 text-sm bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-md hover:from-orange-600 hover:to-orange-700 transition-colors flex items-center space-x-2 shadow-lg">
                      <RefreshCw className="w-4 h-4" />
                      <span>Refresh</span>
                    </button>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-white/70">Total Applications</p>
                        <p className="text-2xl font-bold text-white">18</p>
                      </div>
                      <div className="w-12 h-12 bg-orange-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-orange-500/30">
                        <FileText className="w-6 h-6 text-orange-300" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-white/70">Pending Review</p>
                        <p className="text-2xl font-bold text-white">6</p>
                      </div>
                      <div className="w-12 h-12 bg-yellow-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-yellow-500/30">
                        <Clock className="w-6 h-6 text-yellow-300" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-white/70">Completed</p>
                        <p className="text-2xl font-bold text-white">12</p>
                      </div>
                      <div className="w-12 h-12 bg-green-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-green-500/30">
                        <CheckCircle2 className="w-6 h-6 text-green-300" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-white/70">Completed</p>
                        <p className="text-2xl font-bold text-white">12</p>
                      </div>
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30">
                        <CheckCircle2 className="w-6 h-6 text-white/70" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Applications Management Preview */}
                  <div className="lg:col-span-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-lg">
                    <div className="flex items-center justify-between p-4 border-b border-white/20">
                      <h3 className="text-lg font-semibold text-white">Applications Management</h3>
                      <button className="px-4 py-2 text-sm bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-md hover:from-orange-600 hover:to-orange-700 transition-colors shadow-lg">
                        Refresh
                      </button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-white/5">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Application ID</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">WUA Name</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">District</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Submission Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                          {applications.slice(0, 3).map((app, index) => (
                            <tr key={index} className="hover:bg-white/5 transition-colors">
                              <td className="px-4 py-3 text-sm text-white">{app.id}</td>
                              <td className="px-4 py-3 text-sm text-white marathi-text">{app.wuaName}</td>
                              <td className="px-4 py-3 text-sm text-white">{app.district}</td>
                              <td className="px-4 py-3">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(app.status)}`}>
                                  {app.status}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm text-white">{app.submissionDate}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-lg">
                    <div className="p-4 border-b border-white/20">
                      <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
                    </div>
                    <div className="p-4 space-y-4">
                      {recentActivities.map((activity, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white">{activity.title}</p>
                            <p className="text-sm text-white/70">{activity.subtitle}</p>
                            <p className="text-xs text-white/50">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : activeSection === 'applications' ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Applications Management</h2>
                  <div className="flex items-center space-x-2">
                    <button className="px-4 py-2 text-sm border border-white/20 rounded-md hover:bg-white/10 transition-colors text-white/90">
                      Export Data
                    </button>
                    <button className="px-4 py-2 text-sm bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-md hover:from-orange-600 hover:to-orange-700 transition-colors flex items-center space-x-2 shadow-lg">
                      <RefreshCw className="w-4 h-4" />
                      <span>Refresh</span>
                    </button>
                  </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4 mb-6 shadow-lg">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                        <input
                          type="text"
                          placeholder="Search applications..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent backdrop-blur-sm"
                        />
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 bg-white/10 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent backdrop-blur-sm"
                      >
                        <option className="text-gray-900">All Status</option>
                        <option className="text-gray-900">Under Review</option>
                        <option className="text-gray-900">Completed</option>
                        <option className="text-gray-900">Forwarded</option>
                        <option className="text-gray-900">Pending Review</option>
                      </select>
                      <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="px-4 py-2 bg-white/10 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent backdrop-blur-sm"
                      >
                        <option className="text-gray-900">All Categories</option>
                        <option className="text-gray-900">MAJOR</option>
                        <option className="text-gray-900">MINOR</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Applications Table */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-white/5">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">-</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Application ID</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">WUA Name</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">District</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Category</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Submission Date</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {applications.map((app, index) => (
                          <tr key={index} className="hover:bg-white/5 transition-colors">
                            <td className="px-4 py-3 text-sm text-white">-</td>
                            <td className="px-4 py-3 text-sm text-white">{app.id}</td>
                            <td className="px-4 py-3 text-sm text-white marathi-text">{app.wuaName}</td>
                            <td className="px-4 py-3 text-sm text-white">{app.district}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${app.category === 'MAJOR' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                                {app.category}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(app.status)}`}>
                                {app.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-white">{app.submissionDate}</td>
                            <td className="px-4 py-3">
                              <div className="flex space-x-2">
                                <button 
                                  onClick={() => handleViewApplication(app)}
                                  className="px-3 py-1 text-xs bg-gray-500/20 text-white border border-gray-500/30 rounded hover:bg-gray-500/30 transition-colors"
                                >
                                  View
                                </button>
                                <button className="px-3 py-1 text-xs bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded hover:bg-teal-500/30 transition-colors">
                                  Evaluation
                                </button>
                                <button className="px-3 py-1 text-xs bg-green-500/20 text-green-300 border border-green-500/30 rounded hover:bg-green-500/30 transition-colors">
                                  Forward
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center text-white">
                <h2 className="text-2xl font-bold mb-4">Section Under Development</h2>
                <p className="text-white/70">This section is being developed and will be available soon.</p>
              </div>
            )}
          </main>
        </div>

        {/* Application Details Modal */}
        {isModalOpen && selectedApplication && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              {/* Background overlay */}
              <div className="fixed inset-0 transition-opacity bg-slate-900/80 backdrop-blur-sm" onClick={handleCloseModal}></div>
              
              {/* Modal panel */}
              <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-gradient-to-br from-slate-800 to-slate-700 shadow-2xl rounded-2xl border border-slate-600/50">
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-100">Application Details</h3>
                  <button
                    onClick={handleCloseModal}
                    className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-600/30 rounded-lg transition-colors"
                  >
                    ✕
                  </button>
                </div>

                {/* Organization Information */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-slate-200 mb-4">Organization Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-600/20 border border-slate-500/30 rounded-lg p-3 hover:bg-slate-600/30 transition-colors">
                      <p className="text-xs text-slate-400 font-medium mb-1">WUA Name:</p>
                      <p className="text-sm text-slate-100 font-medium marathi-text">{selectedApplication.wuaName}</p>
                    </div>
                    <div className="bg-slate-600/20 border border-slate-500/30 rounded-lg p-3 hover:bg-slate-600/30 transition-colors">
                      <p className="text-xs text-slate-400 font-medium mb-1">Registration No:</p>
                      <p className="text-sm text-slate-100 font-medium">WUA/MH/2019/002345</p>
                    </div>
                    <div className="bg-slate-600/20 border border-slate-500/30 rounded-lg p-3 hover:bg-slate-600/30 transition-colors">
                      <p className="text-xs text-slate-400 font-medium mb-1">District:</p>
                      <p className="text-sm text-slate-100 font-medium">{selectedApplication.district}</p>
                    </div>
                    <div className="bg-slate-600/20 border border-slate-500/30 rounded-lg p-3 hover:bg-slate-600/30 transition-colors">
                      <p className="text-xs text-slate-400 font-medium mb-1">Category:</p>
                      <p className="text-sm text-slate-100 font-medium">{selectedApplication.category === 'MINOR' ? 'Minor Projects' : 'Major Projects'}</p>
                    </div>
                  </div>
                </div>

                {/* Self-Assessment Breakdown */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-slate-200 mb-4">Self-Assessment Breakdown</h4>
                  <div className="space-y-3">
                    {[
                      { module: 'Module 1: Governance', status: 'Review' },
                      { module: 'Module 2: Water Management', status: 'Review' },
                      { module: 'Module 3: Financial Management', status: 'Review' },
                      { module: 'Module 4: Maintenance & Repairs', status: 'Review' },
                      { module: 'Module 5: Documentation & Data', status: 'Review' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-600/15 border border-slate-500/20 rounded-lg hover:bg-slate-600/25 transition-colors">
                        <span className="text-sm text-slate-200">{item.module}</span>
                        <span className="text-sm text-sky-400 font-medium bg-sky-400/10 px-2 py-1 rounded-full">{item.status}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions Row */}
                {/* <div className="flex justify-center space-x-4 pt-6">
                  <div className="text-right">
                    <span className="block text-xs text-gray-600 font-medium mb-2">Actions</span>
                    <div className="flex space-x-2">
                      <button className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 rounded-lg transition-colors font-medium">
                        View
                      </button>
                      <button className="px-4 py-2 text-sm bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-lg transition-colors font-medium shadow-lg">
                        Evaluation
                      </button>
                      <button className="px-4 py-2 text-sm bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg transition-colors font-medium shadow-lg">
                        Forward
                      </button>
                    </div>
                  </div>
                </div> */}

                {/* Modal Footer */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-slate-500/30">
                  <button
                    onClick={handleCloseModal}
                    className="px-6 py-2 text-sm text-slate-300 hover:text-slate-100 hover:bg-slate-600/30 border border-slate-500/30 rounded-lg transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => toast('Start Evaluation functionality will be implemented here', { icon: 'ℹ️' })}
                    className="px-6 py-2 text-sm bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white rounded-lg transition-colors shadow-lg"
                  >
                    Start Evaluation
                  </button>
                  <button
                    onClick={() => toast('Forward functionality will be implemented here', { icon: 'ℹ️' })}
                    className="px-6 py-2 text-sm bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white rounded-lg transition-colors shadow-lg"
                  >
                    Forward
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}