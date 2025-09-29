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
  Database,
  LogOut,
  Bell,
  Search,
  Filter,
  ChevronDown,
  Eye,
  FormInput,
  Building2,
  Award,
  Crown,
  Star,
  Trophy,
  Send,
  ArrowRight
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
          { key: 'forms', label: 'WUA Forms System', icon: FormInput },
          { key: 'users', label: 'User Management', icon: Users },
          { key: 'reports', label: 'System Reports', icon: BarChart3 }
        ]
      case 'nominee':
        return [
          ...baseNav,
          { key: 'my-applications', label: 'My Applications', icon: FileText },
          { key: 'forms', label: 'Available Forms', icon: FormInput },
          { key: 'submit', label: 'Submit New Application', icon: FileText }
        ]
      case 'circle_committee':
        return [
          ...baseNav,
          { key: 'review', label: 'Applications to Review', icon: FileText },
          { key: 'forms', label: 'Evaluation Forms', icon: FormInput },
          { key: 'evaluated', label: 'Evaluated Applications', icon: CheckCircle2 }
        ]
      case 'corporation_committee':
        return [
          ...baseNav,
          { key: 'evaluate', label: 'Applications to Evaluate', icon: FileText },
          { key: 'forms', label: 'Assessment Forms', icon: FormInput },
          { key: 'forwarded', label: 'Forwarded Applications', icon: CheckCircle2 }
        ]
      case 'state_committee':
        return [
          ...baseNav,
          { key: 'final-review', label: 'Final Review', icon: FileText },
          { key: 'forms', label: 'Award Decision Forms', icon: FormInput },
          { key: 'approved', label: 'Approved Applications', icon: CheckCircle2 }
        ]
      default:
        return [...baseNav, { key: 'forms', label: 'Forms System', icon: FormInput }]
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
            ) : activeSection === 'forms' ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">WUA Competition Forms System</h2>
                  <div className="flex items-center space-x-2">
                    <button className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition-colors text-gray-700">
                      System Guide
                    </button>
                    <button className="px-4 py-2 text-sm bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors flex items-center space-x-2 shadow-lg">
                      <RefreshCw className="w-4 h-4" />
                      <span>Refresh</span>
                    </button>
                  </div>
                </div>

                {/* Forms System Overview */}
                <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-lg p-6 mb-8">
                  <div className="flex items-center mb-4">
                    <Trophy className="w-8 h-8 text-orange-600 mr-3" />
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Punyashlok Ahilyabai Holkar Award System</h3>
                      <p className="text-gray-600">Complete Water User Association Competition Management</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                    <div className="text-center p-4 bg-white/70 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">380</div>
                      <div className="text-sm text-gray-600">Total Journey Points</div>
                    </div>
                    <div className="text-center p-4 bg-white/70 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">5</div>
                      <div className="text-sm text-gray-600">Evaluation Stages</div>
                    </div>
                    <div className="text-center p-4 bg-white/70 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">5</div>
                      <div className="text-sm text-gray-600">Award Categories</div>
                    </div>
                    <div className="text-center p-4 bg-white/70 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">3</div>
                      <div className="text-sm text-gray-600">Committee Levels</div>
                    </div>
                  </div>
                </div>

                {/* Application Journey Workflow */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Complete Application Journey</h3>
                  
                  <div className="relative">
                    {/* Journey Line */}
                    <div className="absolute top-12 left-12 right-12 h-1 bg-gradient-to-r from-blue-200 via-green-200 via-purple-200 via-orange-200 to-yellow-200 rounded-full"></div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 relative">
                      {[
                        { 
                          stage: 1, 
                          title: 'WUA Nomination', 
                          description: 'Initial application submission with comprehensive details', 
                          maxPoints: 'Eligibility',
                          icon: FormInput,
                          color: 'blue',
                          route: '/admin/nomination-form'
                        },
                        { 
                          stage: 2, 
                          title: 'Self-Assessment', 
                          description: '5-module questionnaire for self-evaluation', 
                          maxPoints: '150 pts',
                          icon: Users,
                          color: 'green',
                          route: '/admin/self-assessment'
                        },
                        { 
                          stage: 3, 
                          title: 'Circle Committee', 
                          description: 'Document verification & site visit evaluation', 
                          maxPoints: '100 pts',
                          icon: Building2,
                          color: 'purple',
                          route: '/admin/circle-evaluation'
                        },
                        { 
                          stage: 4, 
                          title: 'Corporation Committee', 
                          description: '5-module assessment for second-level review', 
                          maxPoints: '30 pts',
                          icon: Award,
                          color: 'orange',
                          route: '/admin/corporation-evaluation'
                        },
                        { 
                          stage: 5, 
                          title: 'State Committee', 
                          description: 'Final evaluation & award decision', 
                          maxPoints: '100 pts',
                          icon: Crown,
                          color: 'yellow',
                          route: '/admin/state-committee'
                        }
                      ].map((stage, index) => {
                        const StageIcon = stage.icon
                        return (
                          <div key={stage.stage} className="text-center relative">
                            {/* Stage Number Circle */}
                            <div className={`w-24 h-24 bg-${stage.color}-100 border-4 border-${stage.color}-300 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10`}>
                              <div className={`w-16 h-16 bg-${stage.color}-500 rounded-full flex items-center justify-center`}>
                                <StageIcon className="w-8 h-8 text-white" />
                              </div>
                            </div>
                            
                            {/* Stage Content */}
                            <div className="space-y-2">
                              <h4 className="font-bold text-gray-900">{stage.title}</h4>
                              <p className="text-sm text-gray-600 px-2">{stage.description}</p>
                              <div className={`text-xs font-semibold text-${stage.color}-700 bg-${stage.color}-100 px-2 py-1 rounded-full inline-block`}>
                                {stage.maxPoints}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* Forms Access Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {/* Nominee Forms - Only visible to nominees */}
                  {adminData && adminData.userType === 'nominee' && (
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
                      <div className="flex items-center mb-4">
                        <Users className="w-6 h-6 text-blue-600 mr-3" />
                        <h3 className="text-lg font-semibold text-gray-900">My Application Forms</h3>
                      </div>
                      
                      <div className="space-y-3">
                        <button 
                          onClick={() => router.push('/admin/submit-application')}
                          className="w-full p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-left"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-blue-900">WUA Nomination Form</h4>
                              <p className="text-sm text-blue-600">Complete application submission</p>
                              <p className="text-xs text-blue-500 mt-1">6 sections • Comprehensive details</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-blue-600" />
                          </div>
                        </button>

                        <button 
                          onClick={() => router.push('/admin/self-assessment')}
                          className="w-full p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors text-left"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-green-900">Self-Assessment Questionnaire</h4>
                              <p className="text-sm text-green-600">Interactive evaluation modules</p>
                              <p className="text-xs text-green-500 mt-1">5 modules • 150 max points</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-green-600" />
                          </div>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Committee Review Section - Only visible to committee members */}
                  {adminData && adminData.userType !== 'nominee' && (
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
                      <div className="flex items-center mb-4">
                        <Eye className="w-6 h-6 text-indigo-600 mr-3" />
                        <h3 className="text-lg font-semibold text-gray-900">Review Nominee Submissions</h3>
                      </div>
                      
                      <div className="space-y-3">
                        <button 
                          onClick={() => router.push('/admin/data-flow-test')}
                          className="w-full p-4 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors text-left"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-indigo-900">View Submitted Applications</h4>
                              <p className="text-sm text-indigo-600">Review nominee data and submissions</p>
                              <p className="text-xs text-indigo-500 mt-1">Applications • Self-Assessments • Results</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-indigo-600" />
                          </div>
                        </button>

                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                          <div className="flex items-center">
                            <Bell className="w-4 h-4 text-amber-600 mr-2" />
                            <div>
                              <h4 className="font-medium text-amber-800">Committee Member Access</h4>
                              <p className="text-sm text-amber-700">You can only view and evaluate submitted applications</p>
                              <p className="text-xs text-amber-600 mt-1">Nominees complete their own applications</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Committee Forms - Only visible to committee members and admins */}
                  {adminData && adminData.userType !== 'nominee' && (
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
                      <div className="flex items-center mb-4">
                        <Award className="w-6 h-6 text-purple-600 mr-3" />
                        <h3 className="text-lg font-semibold text-gray-900">Committee Evaluation Forms</h3>
                      </div>
                      
                      <div className="space-y-3">
                        <button 
                          onClick={() => router.push('/admin/circle-evaluation-new')}
                          className="w-full p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors text-left"
                          disabled={!['admin', 'super-admin', 'circle-committee'].includes(adminData?.userType || adminData?.adminLevel || '')}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-purple-900">Circle Committee Evaluation</h4>
                              <p className="text-sm text-purple-600">Document verification & site visit</p>
                              <p className="text-xs text-purple-500 mt-1">5 steps • Regulatory compliance</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-purple-600" />
                          </div>
                        </button>

                        <button 
                          onClick={() => router.push('/admin/corporation-evaluation-new')}
                          className="w-full p-4 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors text-left"
                          disabled={!['admin', 'super-admin', 'corporation-committee'].includes(adminData?.userType || adminData?.adminLevel || '')}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-orange-900">Corporation Committee Assessment</h4>
                              <p className="text-sm text-orange-600">Strategic evaluation modules</p>
                              <p className="text-xs text-orange-500 mt-1">5 modules • 30 max points</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-orange-600" />
                          </div>
                        </button>

                        <button 
                          onClick={() => router.push('/admin/state-committee-new')}
                          className="w-full p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-lg hover:from-yellow-100 hover:to-orange-100 transition-colors text-left"
                          disabled={!['admin', 'super-admin', 'state-committee'].includes(adminData?.userType || adminData?.adminLevel || '')}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-yellow-900 flex items-center">
                                <Crown className="w-4 h-4 mr-1" />
                                State Committee Final Evaluation
                              </h4>
                              <p className="text-sm text-yellow-700">Ultimate award decision</p>
                              <p className="text-xs text-yellow-600 mt-1">5 questions • 20 max points • Final scoring</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-yellow-600" />
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Forms System Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total System Forms</p>
                        <p className="text-2xl font-bold text-gray-900">5</p>
                        <p className="text-xs text-gray-500 mt-1">Nomination + Evaluation</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center border border-blue-200">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Active Applications</p>
                        <p className="text-2xl font-bold text-gray-900">23</p>
                        <p className="text-xs text-gray-500 mt-1">In various stages</p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center border border-green-200">
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Completed Evaluations</p>
                        <p className="text-2xl font-bold text-gray-900">48</p>
                        <p className="text-xs text-gray-500 mt-1">Awards processed</p>
                      </div>
                      <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center border border-yellow-200">
                        <Trophy className="w-6 h-6 text-yellow-600" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button 
                      onClick={() => toast('System help guide will be available soon', { icon: '📋' })}
                      className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <FileText className="w-8 h-8 text-gray-600 mb-2 mx-auto" />
                      <p className="font-medium text-gray-900">System Guide</p>
                      <p className="text-sm text-gray-600">Forms usage guide</p>
                    </button>

                    <button 
                      onClick={() => toast('Application tracking will be implemented', { icon: '🔍' })}
                      className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Search className="w-8 h-8 text-blue-600 mb-2 mx-auto" />
                      <p className="font-medium text-gray-900">Track Applications</p>
                      <p className="text-sm text-gray-600">Monitor progress</p>
                    </button>

                    <button 
                      onClick={() => router.push('/admin/data-flow-test')}
                      className="p-4 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors"
                    >
                      <Database className="w-8 h-8 text-orange-600 mb-2 mx-auto" />
                      <p className="font-medium text-gray-900">Data Flow Test</p>
                      <p className="text-sm text-gray-600">Test MongoDB integration</p>
                    </button>

                    <button 
                      onClick={() => toast('Reports generation coming soon', { icon: '📊' })}
                      className="p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
                    >
                      <BarChart3 className="w-8 h-8 text-purple-600 mb-2 mx-auto" />
                      <p className="font-medium text-gray-900">Generate Reports</p>
                      <p className="text-sm text-gray-600">System analytics</p>
                    </button>
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