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
  ChevronDown,
  Eye
} from 'lucide-react'
import toast from 'react-hot-toast'

interface AdminData {
  username: string
  adminLevel: string
  name: string
  loginTime: string
  userType?: string
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
      
      // Route protection and session validation
      console.log(`🔐 Dashboard access by: ${parsedData.userType || parsedData.adminLevel} (${parsedData.name})`);
      
      // Both nominees and admins can access dashboard, but with different permissions
      if (parsedData.userType === 'nominee') {
        console.log('✅ Nominee accessing dashboard with limited permissions');
      } else {
        console.log(`✅ ${parsedData.userType} accessing dashboard with full permissions`);
      }
      
      setAdminData(parsedData)
    } catch (error) {
      console.error('Error parsing admin data:', error);
      toast.error('Invalid session data. Please login again.')
      localStorage.clear()
      router.push('/admin/login')
    }
  }, [router])

  // Get role-specific welcome message
  const getRoleBasedWelcome = () => {
    if (!adminData) return ''
    
    const userType = adminData.userType || adminData.adminLevel
    
    switch (userType) {
      case 'admin':
        return 'Admin Dashboard - Full System Access'
      case 'nominee':
        return 'Nominee Dashboard - Submit Applications'
      case 'circle_committee':
        return 'Circle Committee Dashboard - Review Applications'
      case 'corporation_committee':
        return 'Corporation Committee Dashboard - Evaluate Applications'
      case 'state_committee':
        return 'State Committee Dashboard - Final Approval'
      default:
        return 'User Dashboard'
    }
  }

  // Get role-specific navigation items
  const getRoleBasedNavigation = () => {
    if (!adminData) return []
    
    const userType = adminData.userType || adminData.adminLevel
    
    const baseNav = [
      { key: 'dashboard', label: 'Dashboard Overview', icon: BarChart3 }
    ]
    
    switch (userType) {
      case 'admin':
        return [
          ...baseNav,
          { key: 'applications', label: 'All Applications', icon: FileText },
          { key: 'users', label: 'User Management', icon: Users },
          { key: 'reports', label: 'System Reports', icon: BarChart3 }
        ]
      case 'nominee':
        return [
          ...baseNav,
          { key: 'my-applications', label: 'My Applications', icon: FileText },
          { key: 'submit', label: 'Submit New Application', icon: FileText }
        ]
      case 'circle_committee':
        return [
          ...baseNav,
          { key: 'review', label: 'Applications to Review', icon: FileText },
          { key: 'evaluated', label: 'Evaluated Applications', icon: CheckCircle2 }
        ]
      case 'corporation_committee':
        return [
          ...baseNav,
          { key: 'evaluate', label: 'Applications to Evaluate', icon: FileText },
          { key: 'forwarded', label: 'Forwarded Applications', icon: CheckCircle2 }
        ]
      case 'state_committee':
        return [
          ...baseNav,
          { key: 'final-review', label: 'Final Review', icon: FileText },
          { key: 'approved', label: 'Approved Applications', icon: CheckCircle2 }
        ]
      default:
        return baseNav
    }
  }

  // Get role-specific stats
  const getRoleBasedStats = () => {
    if (!adminData) return []
    
    const userType = adminData.userType || adminData.adminLevel
    
    switch (userType) {
      case 'admin':
        return [
          { label: 'Total Applications', value: '18', icon: FileText, color: 'teal' },
          { label: 'Pending Review', value: '6', icon: Clock, color: 'yellow' },
          { label: 'Under Review', value: '8', icon: Eye, color: 'blue' },
          { label: 'Completed', value: '4', icon: CheckCircle2, color: 'green' }
        ]
      case 'nominee':
        return [
          { label: 'My Applications', value: '2', icon: FileText, color: 'teal' },
          { label: 'Under Review', value: '1', icon: Clock, color: 'yellow' },
          { label: 'Approved', value: '1', icon: CheckCircle2, color: 'green' },
          { label: 'Pending', value: '0', icon: Eye, color: 'blue' }
        ]
      case 'circle_committee':
        return [
          { label: 'To Review', value: '5', icon: FileText, color: 'teal' },
          { label: 'Reviewed Today', value: '3', icon: CheckCircle2, color: 'green' },
          { label: 'Pending Action', value: '2', icon: Clock, color: 'yellow' },
          { label: 'Total Reviewed', value: '15', icon: Eye, color: 'blue' }
        ]
      case 'corporation_committee':
        return [
          { label: 'To Evaluate', value: '4', icon: FileText, color: 'teal' },
          { label: 'Evaluated', value: '8', icon: CheckCircle2, color: 'green' },
          { label: 'Pending', value: '2', icon: Clock, color: 'yellow' },
          { label: 'Forwarded', value: '6', icon: Eye, color: 'blue' }
        ]
      case 'state_committee':
        return [
          { label: 'Final Review', value: '3', icon: FileText, color: 'teal' },
          { label: 'Approved', value: '12', icon: CheckCircle2, color: 'green' },
          { label: 'Pending Decision', value: '1', icon: Clock, color: 'yellow' },
          { label: 'Total Processed', value: '16', icon: Eye, color: 'blue' }
        ]
      default:
        return []
    }
  }

  const handleLogout = () => {
    if (adminData) {
      // Clear appropriate sessions based on user type
      if (adminData.userType === 'nominee') {
        localStorage.removeItem('nominee_active_session');
        console.log('🚪 Nominee session cleared');
        toast.success('Logged out successfully');
        router.push('/welcome');
      } else {
        localStorage.removeItem('admin_active_session');
        console.log('🚪 Admin session cleared');
        toast.success('Logged out successfully');
        router.push('/admin/login');
      }
      
      // Clear main session data
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');
    } else {
      // Fallback: clear everything
      localStorage.clear();
      toast.success('Logged out successfully');
      router.push('/');
    }
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

      <div className="min-h-screen bg-gray-200">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-gray-800 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="w-5 h-5 flex flex-col justify-center space-y-1">
                  <div className={`w-full h-0.5 bg-gray-800 transition-transform ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : ''}`}></div>
                  <div className={`w-full h-0.5 bg-gray-800 transition-opacity ${isMobileMenuOpen ? 'opacity-0' : ''}`}></div>
                  <div className={`w-full h-0.5 bg-gray-800 transition-transform ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : ''}`}></div>
                </div>
              </button>
              <div className="w-12 h-12 sm:w-16 sm:h-12 bg-teal-500 rounded-lg flex items-center justify-center flex-shrink-0 px-2 py-1">
                <span className="text-white font-bold text-xs sm:text-sm marathi-text">महाराष्ट्र</span>
              </div>
              <div className="text-gray-800 min-w-0">
                <h1 className="text-xs sm:text-sm md:text-lg font-semibold leading-tight truncate">Maharashtra Water Resources Department</h1>
                <p className="text-gray-600 text-xs marathi-text hidden sm:block">Government of Maharashtra</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-gray-700 flex-shrink-0">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-gray-900">{adminData.name}</p>
                <p className="text-sm text-gray-600 capitalize">{adminData.userType || adminData.adminLevel}</p>
              </div>
              <select className="px-2 py-1 text-xs border border-gray-300 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors">
                <option>EN</option>
                <option>MR</option>
              </select>
              <button
                onClick={handleLogout}
                className="px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <div className="flex relative">
          {/* Mobile Sidebar Overlay */}
          {isMobileMenuOpen && (
            <div 
              className="fixed inset-0 z-40 md:hidden bg-black/50 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            ></div>
          )}

          {/* Sidebar */}
          <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          } md:block shadow-lg`}>
            <div className="p-4 h-full overflow-y-auto">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center border border-teal-200">
                  <Users className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{adminData.name}</h3>
                  <p className="text-sm text-gray-600 capitalize">{adminData.userType || adminData.adminLevel}</p>
                </div>
              </div>

              <nav className="space-y-2">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  MAIN DASHBOARD
                </div>
                {getRoleBasedNavigation().map((item) => (
                  <button
                    key={item.key}
                    onClick={() => {
                      if (item.key === 'submit') {
                        router.push('/admin/submit-application')
                      } else {
                        setActiveSection(item.key)
                      }
                      setIsMobileMenuOpen(false)
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeSection === item.key 
                        ? 'bg-teal-100 text-teal-700 border border-teal-200' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                ))}

                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 mt-6">
                  REPORTS & ANALYTICS
                </div>
                <button
                  onClick={() => {
                    toast('Reports functionality will be implemented here', { icon: 'ℹ️' })
                    setIsMobileMenuOpen(false)
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  <FileText className="w-5 h-5" />
                  <span>Reports</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-4 sm:p-6 md:ml-0 w-full min-w-0 bg-gray-200">
            {activeSection === 'dashboard' ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">{getRoleBasedWelcome()}</h2>
                  <div className="flex items-center space-x-2">
                    <button className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition-colors text-gray-700">
                      Export Data
                    </button>
                    <button className="px-4 py-2 text-sm bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors flex items-center space-x-2 shadow-lg">
                      <RefreshCw className="w-4 h-4" />
                      <span>Refresh</span>
                    </button>
                  </div>
                </div>

                {/* Role-based Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {getRoleBasedStats().map((stat, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">{stat.label}</p>
                          <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                        <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center border border-${stat.color}-200`}>
                          <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Role-specific content */}
                {adminData && adminData.userType === 'nominee' && (
                  <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions for Nominees</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button 
                        onClick={() => router.push('/admin/submit-application')}
                        className="p-4 bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100 transition-colors"
                      >
                        <FileText className="w-8 h-8 text-teal-600 mb-2" />
                        <p className="font-medium text-gray-900">Submit New Application</p>
                        <p className="text-sm text-gray-600">Create a new WUA application</p>
                      </button>
                      <button 
                        onClick={() => toast('View application status functionality will be implemented', { icon: 'ℹ️' })}
                        className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <Eye className="w-8 h-8 text-blue-600 mb-2" />
                        <p className="font-medium text-gray-900">View Application Status</p>
                        <p className="text-sm text-gray-600">Track your submitted applications</p>
                      </button>
                    </div>
                  </div>
                )}

                {adminData && (adminData.userType === 'circle_committee' || adminData.userType === 'corporation_committee' || adminData.userType === 'state_committee') && (
                  <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Committee Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <button 
                        onClick={() => toast('Review applications functionality will be implemented', { icon: 'ℹ️' })}
                        className="p-4 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors"
                      >
                        <FileText className="w-8 h-8 text-orange-600 mb-2" />
                        <p className="font-medium text-gray-900">Review Applications</p>
                        <p className="text-sm text-gray-600">Applications awaiting review</p>
                      </button>
                      <button 
                        onClick={() => toast('Evaluated applications functionality will be implemented', { icon: 'ℹ️' })}
                        className="p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                      >
                        <CheckCircle2 className="w-8 h-8 text-green-600 mb-2" />
                        <p className="font-medium text-gray-900">Completed Reviews</p>
                        <p className="text-sm text-gray-600">Applications you've reviewed</p>
                      </button>
                      <button 
                        onClick={() => toast('Generate reports functionality will be implemented', { icon: 'ℹ️' })}
                        className="p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
                      >
                        <BarChart3 className="w-8 h-8 text-purple-600 mb-2" />
                        <p className="font-medium text-gray-900">Committee Reports</p>
                        <p className="text-sm text-gray-600">Generate review reports</p>
                      </button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Applications Management Preview */}
                  <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {adminData?.userType === 'nominee' ? 'My Applications' : 
                         adminData?.userType === 'admin' ? 'All Applications' : 
                         'Applications for Review'}
                      </h3>
                      <button className="px-4 py-2 text-sm bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors shadow-lg">
                        Refresh
                      </button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Application ID</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">WUA Name</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">District</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {applications.slice(0, 3).map((app, index) => (
                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                              <td className="px-4 py-3 text-sm text-gray-900">{app.id}</td>
                              <td className="px-4 py-3 text-sm text-gray-900 marathi-text">{app.wuaName}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{app.district}</td>
                              <td className="px-4 py-3">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(app.status)}`}>
                                  {app.status}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900">{app.submissionDate}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white border border-gray-200 rounded-lg shadow-lg">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                    </div>
                    <div className="p-4 space-y-4">
                      {recentActivities.map((activity, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                            <p className="text-sm text-gray-600">{activity.subtitle}</p>
                            <p className="text-xs text-gray-500">{activity.time}</p>
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
                  <h2 className="text-2xl font-bold text-gray-900">Applications Management</h2>
                  <div className="flex items-center space-x-2">
                    <button className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition-colors text-gray-700">
                      Export Data
                    </button>
                    <button className="px-4 py-2 text-sm bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors flex items-center space-x-2 shadow-lg">
                      <RefreshCw className="w-4 h-4" />
                      <span>Refresh</span>
                    </button>
                  </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-lg">
                  <div className="flex flex-col gap-4">
                    <div className="w-full">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search applications..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent flex-1"
                      >
                        <option>All Status</option>
                        <option>Under Review</option>
                        <option>Completed</option>
                        <option>Forwarded</option>
                        <option>Pending Review</option>
                      </select>
                      <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent flex-1"
                      >
                        <option>All Categories</option>
                        <option>MAJOR</option>
                        <option>MINOR</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Applications Table */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <div className="min-w-full">
                      <table className="w-full min-w-[800px]">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">App ID</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider min-w-[150px]">WUA Name</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">District</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Category</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Date</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider min-w-[200px]">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {applications.map((app, index) => (
                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                              <td className="px-3 py-3 text-sm text-gray-900">{app.id}</td>
                              <td className="px-3 py-3 text-sm text-gray-900 marathi-text">{app.wuaName}</td>
                              <td className="px-3 py-3 text-sm text-gray-900">{app.district}</td>
                              <td className="px-3 py-3">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${app.category === 'MAJOR' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                                  {app.category}
                                </span>
                              </td>
                              <td className="px-3 py-3">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(app.status)}`}>
                                  {app.status}
                                </span>
                              </td>
                              <td className="px-3 py-3 text-sm text-gray-900">{app.submissionDate}</td>
                              <td className="px-3 py-3">
                                <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                                  <button 
                                    onClick={() => handleViewApplication(app)}
                                    className="px-2 py-1 text-xs bg-gray-100 text-gray-700 border border-gray-300 rounded hover:bg-gray-200 transition-colors"
                                  >
                                    View
                                  </button>
                                  <button className="px-2 py-1 text-xs bg-teal-100 text-teal-700 border border-teal-300 rounded hover:bg-teal-200 transition-colors">
                                    Eval
                                  </button>
                                  <button className="px-2 py-1 text-xs bg-green-100 text-green-700 border border-green-300 rounded hover:bg-green-200 transition-colors">
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
                </div>
              </>
            ) : (
              <div className="text-center text-gray-600">
                <h2 className="text-2xl font-bold mb-4 text-gray-900">Section Under Development</h2>
                <p className="text-gray-600">This section is being developed and will be available soon.</p>
              </div>
            )}
          </main>
        </div>

        {/* Application Details Modal */}
        {isModalOpen && selectedApplication && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen p-4 text-center">
              {/* Background overlay */}
              <div className="fixed inset-0 transition-opacity bg-black/50" onClick={handleCloseModal}></div>
              
              {/* Modal panel */}
              <div className="inline-block w-full max-w-4xl p-4 sm:p-6 my-4 sm:my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-2xl border border-gray-200 relative">
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">Application Details</h3>
                  <button
                    onClick={handleCloseModal}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    ✕
                  </button>
                </div>

                {/* Organization Information */}
                <div className="mb-6 sm:mb-8">
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Organization Information</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                      <p className="text-xs text-gray-600 font-medium mb-1">WUA Name:</p>
                      <p className="text-sm text-gray-900 font-medium marathi-text">{selectedApplication.wuaName}</p>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                      <p className="text-xs text-gray-600 font-medium mb-1">Registration No:</p>
                      <p className="text-sm text-gray-900 font-medium">WUA/MH/2019/002345</p>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                      <p className="text-xs text-gray-600 font-medium mb-1">District:</p>
                      <p className="text-sm text-gray-900 font-medium">{selectedApplication.district}</p>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 hover:bg-gray-100 transition-colors sm:col-span-2 lg:col-span-1">
                      <p className="text-xs text-gray-600 font-medium mb-1">Category:</p>
                      <p className="text-sm text-gray-900 font-medium">{selectedApplication.category === 'MINOR' ? 'Minor Projects' : 'Major Projects'}</p>
                    </div>
                  </div>
                </div>

                {/* Self-Assessment Breakdown */}
                <div className="mb-6 sm:mb-8">
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Self-Assessment Breakdown</h4>
                  <div className="space-y-2 sm:space-y-3">
                    {[
                      { module: 'Module 1: Governance', status: 'Review' },
                      { module: 'Module 2: Water Management', status: 'Review' },
                      { module: 'Module 3: Financial Management', status: 'Review' },
                      { module: 'Module 4: Maintenance & Repairs', status: 'Review' },
                      { module: 'Module 5: Documentation & Data', status: 'Review' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                        <span className="text-sm text-gray-900 flex-1 pr-2">{item.module}</span>
                        <span className="text-xs sm:text-sm text-teal-700 font-medium bg-teal-100 px-2 py-1 rounded-full flex-shrink-0">{item.status}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4 sm:pt-6 border-t border-gray-200">
                  <button
                    onClick={handleCloseModal}
                    className="px-4 sm:px-6 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-300 rounded-lg transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => toast('Start Evaluation functionality will be implemented here', { icon: 'ℹ️' })}
                    className="px-4 sm:px-6 py-2 text-sm bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors shadow-lg"
                  >
                    Start Evaluation
                  </button>
                  <button
                    onClick={() => toast('Forward functionality will be implemented here', { icon: 'ℹ️' })}
                    className="px-4 sm:px-6 py-2 text-sm bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white rounded-lg transition-colors shadow-lg"
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