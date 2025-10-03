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
  XCircle,
  Send,
  ArrowUp,
  Trophy,
  Crown,
  Star,
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
  feedback?: string // For backward compatibility
  marks?: string // New field for nominee applications
  submittedBy?: string
  userType?: string
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
  const [applications, setApplications] = useState<Application[]>([])
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@wua.gov.in', role: 'Circle Committee', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@wua.gov.in', role: 'Corporation Committee', status: 'Active' },
    { id: 3, name: 'Ram Patil', email: 'ram@wua.gov.in', role: 'State Committee', status: 'Active' },
    { id: 4, name: 'Priya Sharma', email: 'priya@wua.gov.in', role: 'Nominee', status: 'Pending' },
    { id: 5, name: 'Admin User', email: 'admin@wua.gov.in', role: 'Admin', status: 'Active' }
  ])

  // Load applications from localStorage (for nominees) or use default data (for admins)
  const loadApplications = () => {
    if (adminData?.userType === 'nominee') {
      // For nominees, load their submitted applications
      const nomineeApps = JSON.parse(localStorage.getItem('nominee_applications') || '[]')
      console.log('Loading nominee applications:', nomineeApps)
      return nomineeApps
    } else {
      // For committee members and admins, show applications based on their role
      const dynamicApps = JSON.parse(localStorage.getItem('nominee_applications') || '[]')
      console.log('Loading dynamic applications from localStorage:', dynamicApps)
      
      let filteredApps = [...dynamicApps]
      
      // Filter based on committee type
      if (adminData?.userType === 'circle-committee') {
        // Circle Committee sees: only applications that need review (not yet processed)
        const circleRelevant = dynamicApps.filter(app => 
          app.workflowStage === 'user-submitted' && 
          (!app.circleStatus || app.circleStatus === 'pending')
        )
        filteredApps = [...circleRelevant]
        console.log('Circle Committee - Showing pending applications for review:', filteredApps)
      } else if (adminData?.userType === 'corporation-committee') {
        // Corporation Committee sees: circle-approved applications
        const corpRelevant = dynamicApps.filter(app => app.workflowStage === 'circle-approved')
        filteredApps = [...corpRelevant]
        console.log('Corporation Committee - Showing circle-approved applications:', filteredApps)
      } else if (adminData?.userType === 'state-committee') {
        // State Committee sees: corporation-approved applications
        const stateRelevant = dynamicApps.filter(app => app.workflowStage === 'corporation-approved')
        filteredApps = [...stateRelevant]
        console.log('State Committee - Showing corporation-approved applications:', filteredApps)
      }
      
      const allApplications = filteredApps
      console.log('Total applications for committee member:', allApplications)
      return allApplications
    }
  }

  // RECENT ACTIVITIES FUNCTIONS - COMMENTED OUT FOR FUTURE USE
  /*
  // Generate dynamic recent activities from localStorage data
  const generateRecentActivities = () => {
    try {
      const storedApplications = JSON.parse(localStorage.getItem('nominee_applications') || '[]')
      const activities = []

      // Sort applications by most recent activity
      const sortedApps = storedApplications.sort((a, b) => {
        const getLatestDate = (app) => {
          const dates = [
            app.stateActionDate,
            app.corporationActionDate, 
            app.circleActionDate,
            app.submissionDate
          ].filter(date => date).map(date => new Date(date))
          return dates.length > 0 ? Math.max(...dates) : new Date(app.submissionDate)
        }
        return getLatestDate(b) - getLatestDate(a)
      })

      // Generate activities for each application
      sortedApps.slice(0, 6).forEach(app => {
        const category = app.category || 'Minor'
        
        // State Committee Activities (most recent)
        if (app.stateStatus === 'approved' && app.finalStatus === 'winner') {
          activities.push({
            type: 'winner',
            title: '🏆 Winner Declared!',
            subtitle: `${app.wuaName} - ${category} Category`,
            time: app.stateActionDate
          })
        } else if (app.stateStatus === 'rejected') {
          activities.push({
            type: 'rejected',
            title: 'State Committee Rejected',
            subtitle: `${app.wuaName} - ${category} Category`,
            time: app.stateActionDate
          })
        }
        
        // Corporation Committee Activities
        if (app.corporationStatus === 'approved') {
          activities.push({
            type: 'approved',
            title: 'Corporation Committee Approved',
            subtitle: `${app.wuaName} - ${category} Category`,
            time: app.corporationActionDate
          })
        } else if (app.corporationStatus === 'rejected') {
          activities.push({
            type: 'rejected',
            title: 'Corporation Committee Rejected',
            subtitle: `${app.wuaName} - ${category} Category`,
            time: app.corporationActionDate
          })
        }
        
        // Circle Committee Activities
        if (app.circleStatus === 'approved') {
          activities.push({
            type: 'approved',
            title: 'Circle Committee Approved',
            subtitle: `${app.wuaName} - ${category} Category`,
            time: app.circleActionDate
          })
        } else if (app.circleStatus === 'rejected') {
          activities.push({
            type: 'rejected',
            title: 'Circle Committee Rejected',
            subtitle: `${app.wuaName} - ${category} Category`,
            time: app.circleActionDate
          })
        }
        
        // Application Submission (always present)
        activities.push({
          type: 'new',
          title: 'New Application Received',
          subtitle: `${app.wuaName} - ${category} Category`,
          time: app.submissionDate
        })
      })

      // Remove duplicates and sort by date (most recent first)
      const uniqueActivities = activities
        .filter((activity, index, self) => 
          index === self.findIndex(a => a.title === activity.title && a.subtitle === activity.subtitle)
        )
        .sort((a, b) => new Date(b.time) - new Date(a.time))
        .slice(0, 8) // Show only latest 8 activities

      // Format time to relative format
      const formatTimeAgo = (dateString) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
        
        if (diffInHours < 1) return 'Just now'
        if (diffInHours < 24) return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`
        
        const diffInDays = Math.floor(diffInHours / 24)
        if (diffInDays < 7) return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`
        
        const diffInWeeks = Math.floor(diffInDays / 7)
        return `${diffInWeeks} week${diffInWeeks !== 1 ? 's' : ''} ago`
      }

      return uniqueActivities.map(activity => ({
        ...activity,
        time: formatTimeAgo(activity.time)
      }))

    } catch (error) {
      console.error('Error generating recent activities:', error)
      // Fallback to default activities if there's an error
      return [
        { type: 'new', title: 'Welcome to Dashboard', subtitle: 'System ready for applications', time: 'Just now' }
      ]
    }
  }

  const recentActivities = generateRecentActivities()
  */

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

  // Load applications when adminData changes
  useEffect(() => {
    if (adminData) {
      console.log('=== INITIAL LOAD ===')
      console.log('AdminData in useEffect:', adminData)
      const loadedApplications = loadApplications()
      console.log('Loaded applications in useEffect:', loadedApplications)
      setApplications(loadedApplications)
    }
  }, [adminData])

  // Refresh applications function
  const refreshApplications = () => {
    if (adminData) {
      const loadedApplications = loadApplications()
      console.log('Refreshing applications:', loadedApplications)
      console.log('Current adminData userType:', adminData.userType)
      setApplications(loadedApplications)
      toast.success(`Applications refreshed! Found ${loadedApplications.length} applications`)
    }
  }

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
          { key: 'users', label: 'User Management', icon: Users }
        ]
      case 'nominee':
        return [
          ...baseNav,
          { key: 'my-applications', label: 'My Applications', icon: FileText },
          { key: 'forms', label: 'Available Forms', icon: FormInput }
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
        // COMMENTED OUT - Admin Statistics Section (can be restored in future)
        // return [
        //   { label: 'Total Applications', value: '18', icon: FileText, color: 'teal' },
        //   { label: 'Pending Review', value: '6', icon: Clock, color: 'yellow' },
        //   { label: 'Under Review', value: '8', icon: Eye, color: 'blue' },
        //   { label: 'Completed', value: '4', icon: CheckCircle2, color: 'green' }
        // ]
        return []
      case 'nominee':
        return []
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

  // User Management Functions
  const handleEditUser = (userId: string, userName: string) => {
    const userIndex = parseInt(userId.replace('user-', ''))
    const user = users[userIndex]
    
    const newName = prompt('Enter new name:', user.name)
    if (newName && newName.trim() !== '') {
      const newEmail = prompt('Enter new email:', user.email)
      if (newEmail && newEmail.trim() !== '') {
        setUsers(prevUsers => 
          prevUsers.map((u, index) => 
            index === userIndex 
              ? { ...u, name: newName.trim(), email: newEmail.trim() }
              : u
          )
        )
        toast.success(`User ${userName} updated successfully!`)
      }
    }
  }

  const handleDeleteUser = (userId: string, userName: string) => {
    if (confirm(`Are you sure you want to delete user: ${userName}?`)) {
      // Extract the index from userId (e.g., "user-1" -> 1)
      const userIndex = parseInt(userId.replace('user-', ''))
      setUsers(prevUsers => prevUsers.filter((user, index) => index !== userIndex))
      toast.success(`User ${userName} deleted successfully`)
    }
  }

  const handleAddUser = () => {
    const newName = prompt('Enter user name:')
    if (newName && newName.trim() !== '') {
      const newEmail = prompt('Enter user email:')
      if (newEmail && newEmail.trim() !== '') {
        const newRole = prompt('Enter user role (Circle Committee/Corporation Committee/State Committee/Nominee/Admin):', 'Nominee')
        if (newRole && newRole.trim() !== '') {
          const newId = Math.max(...users.map(u => u.id)) + 1
          const newUser = {
            id: newId,
            name: newName.trim(),
            email: newEmail.trim(),
            role: newRole.trim(),
            status: 'Active'
          }
          setUsers(prevUsers => [...prevUsers, newUser])
          toast.success(`User ${newName} added successfully!`)
        }
      }
    }
  }

  // Form Management Functions
  const handleEditApplication = (appId: string, wuaName: string) => {
    const applications = JSON.parse(localStorage.getItem('nominee_applications') || '[]')
    const appIndex = applications.findIndex((app: any) => app.id === appId)
    
    if (appIndex !== -1) {
      const app = applications[appIndex]
      
      // Allow editing of key fields
      const newWuaName = prompt('Edit WUA Name:', app.wuaName || '')
      if (newWuaName !== null && newWuaName.trim() !== '') {
        const newMarks = prompt('Edit Marks/Feedback:', app.marks || app.feedback || '')
        if (newMarks !== null) {
          // Update the application
          applications[appIndex] = {
            ...app,
            wuaName: newWuaName.trim(),
            marks: newMarks.trim(),
            feedback: newMarks.trim() // Keep both for compatibility
          }
          
          // Save back to localStorage
          localStorage.setItem('nominee_applications', JSON.stringify(applications))
          toast.success(`Application ${newWuaName} updated successfully!`)
          
          // Refresh to show changes
          window.location.reload()
        }
      }
    } else {
      toast.error('Application not found!')
    }
  }

  const handleDeleteApplication = (appId: string, wuaName: string) => {
    if (confirm(`Are you sure you want to delete application: ${wuaName}?`)) {
      // Remove from localStorage
      const applications = JSON.parse(localStorage.getItem('nominee_applications') || '[]')
      const updatedApplications = applications.filter((app: any) => app.id !== appId)
      localStorage.setItem('nominee_applications', JSON.stringify(updatedApplications))
      toast.success(`Application ${wuaName} deleted successfully`)
      // Refresh the page to show updated data
      window.location.reload()
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

  // ACTIVITY ICON FUNCTIONS - COMMENTED OUT FOR FUTURE USE
  /*
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'new': return <Bell className="w-4 h-4 text-blue-600" />
      case 'approved': return <CheckCircle2 className="w-4 h-4 text-green-600" />
      case 'rejected': return <XCircle className="w-4 h-4 text-red-600" />
      case 'winner': return <Trophy className="w-4 h-4 text-yellow-600" />
      case 'completed': return <CheckCircle2 className="w-4 h-4 text-green-600" />
      case 'review': return <Clock className="w-4 h-4 text-orange-600" />
      default: return <Bell className="w-4 h-4 text-gray-600" />
    }
  }

  const getActivityBgColor = (type: string) => {
    switch (type) {
      case 'new': return 'bg-blue-50 border-blue-200'
      case 'approved': return 'bg-green-50 border-green-200'
      case 'rejected': return 'bg-red-50 border-red-200'
      case 'winner': return 'bg-yellow-50 border-yellow-200'
      case 'completed': return 'bg-green-50 border-green-200'
      case 'review': return 'bg-orange-50 border-orange-200'
      default: return 'bg-gray-50 border-gray-200'
    }
  }
  */

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


              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-4 sm:p-6 md:ml-0 w-full min-w-0 bg-gray-200">
            {activeSection === 'dashboard' ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">{getRoleBasedWelcome()}</h2>
                  {adminData?.userType !== 'nominee' && (
                    <div className="flex items-center space-x-2">
                      <button className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition-colors text-gray-700">
                        Export Data
                      </button>
                      <button className="px-4 py-2 text-sm bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors flex items-center space-x-2 shadow-lg">
                        <RefreshCw className="w-4 h-4" />
                        <span>Refresh</span>
                      </button>
                    </div>
                  )}
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
                </div>                {/* Role-specific content */}
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

                {adminData && adminData.userType === 'circle-committee' && (
                  <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Circle Committee Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <button 
                        onClick={() => router.push('/admin/circle-evaluation-simple')}
                        className="p-4 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors"
                      >
                        <FileText className="w-8 h-8 text-orange-600 mb-2" />
                        <p className="font-medium text-gray-900">View Submissions</p>
                        <p className="text-sm text-gray-600">Review user applications</p>
                      </button>
                      <button 
                        onClick={() => {
                          router.push('/admin/circle-approved-applications')
                        }}
                        className="p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                      >
                        <CheckCircle2 className="w-8 h-8 text-green-600 mb-2" />
                        <p className="font-medium text-gray-900">Approved Applications</p>
                        <p className="text-sm text-gray-600">Your approved submissions</p>
                      </button>
                      <button 
                        onClick={() => {
                          router.push('/admin/circle-rejected-applications')
                        }}
                        className="p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <XCircle className="w-8 h-8 text-red-600 mb-2" />
                        <p className="font-medium text-gray-900">Rejected Applications</p>
                        <p className="text-sm text-gray-600">Applications you rejected</p>
                      </button>
                    </div>
                  </div>
                )}

                {adminData && adminData.userType === 'corporation-committee' && (
                  <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Corporation Committee Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <button 
                        onClick={() => router.push('/admin/corporation-evaluation-simple')}
                        className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <FileText className="w-8 h-8 text-blue-600 mb-2" />
                        <p className="font-medium text-gray-900">View Circle Recommended Forms</p>
                        <p className="text-sm text-gray-600">Review circle-approved applications</p>
                      </button>

                      <button 
                        onClick={() => {
                          router.push('/admin/corporation-approved-applications')
                        }}
                        className="p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
                      >
                        <ArrowUp className="w-8 h-8 text-purple-600 mb-2" />
                        <p className="font-medium text-gray-900">Recommend to State</p>
                        <p className="text-sm text-gray-600">Forward to state committee</p>
                      </button>

                      <button 
                        onClick={() => {
                          router.push('/admin/corporation-rejected-applications')
                        }}
                        className="p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <XCircle className="w-8 h-8 text-red-600 mb-2" />
                        <p className="font-medium text-gray-900">Rejected Applications</p>
                        <p className="text-sm text-gray-600">Applications you rejected</p>
                      </button>
                    </div>
                  </div>
                )}

                {adminData && adminData.userType === 'state-committee' && (
                  <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">State Committee Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <button 
                        onClick={() => router.push('/admin/state-evaluation-simple')}
                        className="p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
                      >
                        <FileText className="w-8 h-8 text-purple-600 mb-2" />
                        <p className="font-medium text-gray-900">View Corporation Recommended Forms</p>
                        <p className="text-sm text-gray-600">Review corporation-approved forms</p>
                      </button>
                      <button 
                        onClick={() => {
                          router.push('/admin/state-approved-applications')
                        }}
                        className="p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                      >
                        <Trophy className="w-8 h-8 text-green-600 mb-2" />
                        <p className="font-medium text-gray-900">Final Approval</p>
                        <p className="text-sm text-gray-600">View award winners</p>
                      </button>
                      <button 
                        onClick={() => {
                          router.push('/admin/state-rejected-applications')
                        }}
                        className="p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <XCircle className="w-8 h-8 text-red-600 mb-2" />
                        <p className="font-medium text-gray-900">Reject Applications</p>
                        <p className="text-sm text-gray-600">Applications you rejected</p>
                      </button>
                    </div>
                  </div>
                )}

                {adminData && (adminData.userType === 'admin' || adminData.adminLevel === 'admin' || adminData.adminLevel === 'super-admin') && (
                  <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Management</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <button 
                        onClick={() => setActiveSection('manage-users')}
                        className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <Users className="w-8 h-8 text-blue-600 mb-2" />
                        <p className="font-medium text-gray-900">Manage Users</p>
                        <p className="text-sm text-gray-600">Add/edit/delete users</p>
                      </button>
                      
                      <button 
                        onClick={() => setActiveSection('manage-forms')}
                        className="p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                      >
                        <Database className="w-8 h-8 text-green-600 mb-2" />
                        <p className="font-medium text-gray-900">Manage Forms</p>
                        <p className="text-sm text-gray-600">Edit/Delete applications</p>
                      </button>
                      
                      <button 
                        onClick={() => setActiveSection('view-submissions')}
                        className="p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
                      >
                        <FileText className="w-8 h-8 text-purple-600 mb-2" />
                        <p className="font-medium text-gray-900">View All Submissions</p>
                        <p className="text-sm text-gray-600">Complete workflow overview</p>
                      </button>

                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Applications Management Preview */}
                  <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {adminData?.userType === 'nominee' ? 'My Applications' : 
                           adminData?.userType === 'admin' ? 'All Applications' : 
                           'Applications for Review'}
                        </h3>
                        <p className="text-sm text-gray-500">Total: {applications.length} applications</p>
                      </div>

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
                            {adminData?.userType === 'circle-committee' && (
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
                            )}
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
                              {adminData?.userType === 'circle-committee' && (
                                <td className="px-4 py-3">
                                  {app.workflowStage === 'user-submitted' && app.circleStatus === 'pending' ? (
                                    <button
                                      onClick={() => router.push('/admin/circle-evaluation-simple')}
                                      className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                                    >
                                      Review →
                                    </button>
                                  ) : app.circleStatus === 'approved' ? (
                                    <span className="text-green-600 text-xs font-medium">✓ Approved</span>
                                  ) : app.circleStatus === 'rejected' ? (
                                    <span className="text-red-600 text-xs font-medium">✗ Rejected</span>
                                  ) : (
                                    <span className="text-gray-500 text-xs">-</span>
                                  )}
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Recent Activity Section - COMMENTED OUT FOR FUTURE USE 
                  <div className="bg-white border border-gray-200 rounded-lg shadow-lg">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                    </div>
                    <div className="p-4 space-y-4">
                      {recentActivities.length === 0 ? (
                        <p className="text-gray-500 text-sm text-center py-4">No recent activities</p>
                      ) : (
                        recentActivities.map((activity, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border ${getActivityBgColor(activity.type)}`}>
                              {getActivityIcon(activity.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                              <p className="text-sm text-gray-600">{activity.subtitle}</p>
                              <p className="text-xs text-gray-500">{activity.time}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                  */}
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
                      <div className="text-2xl font-bold text-orange-600">200</div>
                      <div className="text-sm text-gray-600">Total Marks</div>
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
                          maxPoints: 'Review',
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
                          maxPoints: '20 pts',
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
                {adminData && adminData.userType === 'nominee' && (
                  <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 shadow-lg">
                    <div className="flex items-center mb-4">
                      <Users className="w-6 h-6 text-blue-600 mr-3" />
                      <h3 className="text-lg font-semibold text-gray-900">My Application Forms</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button 
                          onClick={() => router.push('/admin/submit-application')}
                          className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-left"
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
                          className="p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors text-left"
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




              </>
            ) : activeSection === 'applications' ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {adminData?.userType === 'nominee' ? 'My Applications' : 'Applications Management'}
                  </h2>
                  <div className="flex items-center space-x-2">
                    {adminData?.userType !== 'nominee' && (
                      <button className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition-colors text-gray-700">
                        Export Data
                      </button>
                    )}
                    <button 
                      onClick={refreshApplications}
                      className="px-4 py-2 text-sm bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors flex items-center space-x-2 shadow-lg"
                    >
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
                                  {adminData?.userType !== 'nominee' && (
                                    <>
                                      <button className="px-2 py-1 text-xs bg-teal-100 text-teal-700 border border-teal-300 rounded hover:bg-teal-200 transition-colors">
                                        Eval
                                      </button>
                                      <button className="px-2 py-1 text-xs bg-green-100 text-green-700 border border-green-300 rounded hover:bg-green-200 transition-colors">
                                        Forward
                                      </button>
                                    </>
                                  )}
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
            ) : activeSection === 'my-applications' ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">My Applications</h2>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={refreshApplications}
                      className="px-4 py-2 text-sm bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors flex items-center space-x-2 shadow-lg"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Refresh</span>
                    </button>
                  </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-lg">
                  <div className="flex flex-col gap-4">
                    <div className="w-full">
                      <input
                        type="text"
                        placeholder="Search by WUA name or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Applications Table */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-sm font-medium text-gray-900">My Submitted Applications</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Application ID</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">WUA Name</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">District</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Date</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {applications.filter(app => {
                            const matchesSearch = app.wuaName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                                  app.id.toLowerCase().includes(searchTerm.toLowerCase())
                            return matchesSearch
                          }).map((app) => (
                            <tr key={app.id} className="hover:bg-gray-50">
                              <td className="px-3 py-3 text-sm font-medium text-gray-900">{app.id}</td>
                              <td className="px-3 py-3 text-sm text-gray-900 marathi-text">{app.wuaName}</td>
                              <td className="px-3 py-3 text-sm text-gray-900">{app.district}</td>
                              <td className="px-3 py-3">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(app.status)}`}>
                                  {app.status}
                                </span>
                              </td>
                              <td className="px-3 py-3 text-sm text-gray-900">{app.submissionDate}</td>
                              <td className="px-3 py-3">
                                <button 
                                  onClick={() => handleViewApplication(app)}
                                  className="px-2 py-1 text-xs bg-gray-100 text-gray-700 border border-gray-300 rounded hover:bg-gray-200 transition-colors"
                                >
                                  View
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </>
            ) : activeSection === 'manage-users' ? (
              // 🔹 1. MANAGE USERS DASHBOARD
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">👥 User Management Dashboard</h2>
                  <button 
                    onClick={handleAddUser}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Users className="w-4 h-4" />
                    <span>➕ Add New User</span>
                  </button>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                  <div className="px-6 py-4 bg-gray-50 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">All System Users</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {user.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm space-x-2">
                              <button 
                                onClick={() => handleEditUser(`user-${index}`, user.name)}
                                className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 transition-colors"
                              >
                                ✏️ Edit
                              </button>
                              <button 
                                onClick={() => handleDeleteUser(`user-${index}`, user.name)}
                                className="px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
                              >
                                ❌ Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : activeSection === 'manage-forms' ? (
              // 🔹 2. MANAGE FORMS DASHBOARD
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">📝 Form Management Dashboard</h2>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="🔍 Search forms..."
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                      <option>All Stages</option>
                      <option>Circle Committee</option>
                      <option>Corporation Committee</option>
                      <option>State Committee</option>
                    </select>
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                  <div className="px-6 py-4 bg-gray-50 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">All WUA Application Forms</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Form ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Marks/Feedback</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Stage</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {JSON.parse(localStorage.getItem('nominee_applications') || '[]').map((app, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{app.id}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{app.wuaName || 'N/A'}</td>
                            <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                              {app.marks || app.feedback || 'No data'}
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                                {app.workflowStage || 'Submitted'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                app.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                                app.status === 'Rejected' ? 'bg-red-100 text-red-800' : 
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {app.status || 'Pending'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm space-x-2">
                              <button 
                                onClick={() => handleEditApplication(app.id, app.wuaName || 'Unknown')}
                                className="px-3 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors"
                              >
                                ✏️ Edit
                              </button>
                              <button 
                                onClick={() => handleDeleteApplication(app.id, app.wuaName || 'Unknown')}
                                className="px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
                              >
                                ❌ Delete
                              </button>
                              <button 
                                onClick={() => handleViewApplication(app)}
                                className="px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
                              >
                                👁️ View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : activeSection === 'view-submissions' ? (
              // 🔹 3. VIEW ALL SUBMISSIONS DASHBOARD
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">📊 Complete Workflow Overview</h2>
                  <button 
                    onClick={() => {
                      const allApps = JSON.parse(localStorage.getItem('nominee_applications') || '[]');
                      toast.success(`Downloading report with ${allApps.length} applications!`, { icon: '📥' });
                    }}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                  >
                    <FileText className="w-4 h-4" />
                    <span>📥 Download Report</span>
                  </button>
                </div>
                
                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {(() => {
                    const allApps = JSON.parse(localStorage.getItem('nominee_applications') || '[]');
                    const circleApproved = allApps.filter(app => app.circleStatus === 'approved').length;
                    const circlePending = allApps.filter(app => !app.circleStatus || app.circleStatus === 'pending').length;
                    const corporationApproved = allApps.filter(app => app.corporationStatus === 'approved').length;
                    const corporationPending = allApps.filter(app => app.workflowStage === 'circle-approved' && app.corporationStatus === 'pending').length;
                    const stateApproved = allApps.filter(app => app.stateStatus === 'approved' || app.finalStatus === 'winner').length;
                    const statePending = allApps.filter(app => app.workflowStage === 'corporation-approved' && app.stateStatus === 'pending').length;
                    
                    return [
                      { label: 'Total Submissions', value: allApps.length, color: 'bg-blue-500', icon: '📝' },
                      { label: 'Circle Approved', value: circleApproved, color: 'bg-green-500', icon: '✅' },
                      { label: 'Corporation Approved', value: corporationApproved, color: 'bg-yellow-500', icon: '🏢' },
                      { label: 'State Finalized', value: stateApproved, color: 'bg-purple-500', icon: '🏆' }
                    ].map((stat, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                          </div>
                          <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center text-white text-xl`}>
                            {stat.icon}
                          </div>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
                
                {/* Workflow Status Table */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                  <div className="px-6 py-4 bg-gray-50 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">📋 Complete Submission Tracking</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Application ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">WUA Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Circle Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Corporation Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">State Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Final Result</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {JSON.parse(localStorage.getItem('nominee_applications') || '[]').map((app, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{app.id}</td>
                            <td className="px-6 py-4 text-sm text-gray-900 marathi-text">{app.wuaName || 'N/A'}</td>
                            <td className="px-6 py-4 text-sm">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                app.circleStatus === 'approved' ? 'bg-green-100 text-green-800' :
                                app.circleStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {app.circleStatus || 'Pending'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                app.corporationStatus === 'approved' ? 'bg-green-100 text-green-800' :
                                app.corporationStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {app.corporationStatus || 'Not Reached'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                app.stateStatus === 'approved' ? 'bg-green-100 text-green-800' :
                                app.stateStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {app.stateStatus || 'Not Reached'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm">
                              {app.finalStatus === 'winner' ? (
                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                                  🏆 Winner
                                </span>
                              ) : app.stateStatus === 'approved' ? (
                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                  ✅ Approved
                                </span>
                              ) : (
                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                                  ⏳ In Progress
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
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

                {/* Application Content - Different for nominees vs admins */}
                {(selectedApplication.userType === 'nominee' || selectedApplication.marks || selectedApplication.feedback) ? (
                  /* Marks/Feedback Section for Nominee Applications */
                  <div className="mb-6 sm:mb-8">
                    <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Submitted Application</h4>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6">
                      <div className="mb-4">
                        <p className="text-xs text-gray-600 font-medium mb-2">Submitted By:</p>
                        <p className="text-sm text-gray-900 font-medium">{selectedApplication.submittedBy || 'Unknown'}</p>
                      </div>
                      <div className="mb-4">
                        <p className="text-xs text-gray-600 font-medium mb-2">Submission Date:</p>
                        <p className="text-sm text-gray-900">{selectedApplication.submissionDate}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-medium mb-2">
                          Marks:
                        </p>
                        <div className="bg-white border border-gray-200 rounded p-3 max-h-48 overflow-y-auto">
                          <p className="text-sm text-gray-900 whitespace-pre-wrap">
                            {selectedApplication.marks || selectedApplication.feedback || 'No marks data found. Please ensure the application was submitted with marks.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Self-Assessment Breakdown for Admin Applications */
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
                )}

                {/* Modal Footer - Different actions for nominees vs admins */}
                <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4 sm:pt-6 border-t border-gray-200">
                  <button
                    onClick={handleCloseModal}
                    className="px-4 sm:px-6 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-300 rounded-lg transition-colors"
                  >
                    Close
                  </button>
                  
                  {(selectedApplication.userType === 'nominee' || selectedApplication.marks || selectedApplication.feedback) ? (
                    /* Actions for Nominee Applications - Only Close button needed */
                    null
                  ) : (
                    /* Actions for Admin Applications */
                    <>
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
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}