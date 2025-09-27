// Session Management System for Maharashtra WRD Admin
// Handles single session control for nominees and admins

class SessionManager {
  constructor() {
    this.NOMINEE_SESSION_KEY = 'nominee_active_session';
    this.ADMIN_SESSION_KEY = 'admin_active_session';
    this.SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  }

  // Generate unique session ID
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Check if a session is expired
  isSessionExpired(sessionData) {
    if (!sessionData || !sessionData.timestamp) return true;
    const now = new Date().getTime();
    return (now - sessionData.timestamp) > this.SESSION_TIMEOUT;
  }

  // Create new session for nominee
  createNomineeSession(userData) {
    const sessionId = this.generateSessionId();
    const sessionData = {
      sessionId,
      userId: userData.username,
      userType: 'nominee',
      name: userData.name,
      timestamp: new Date().getTime(),
      loginTime: new Date().toISOString()
    };

    // Store in localStorage
    localStorage.setItem(this.NOMINEE_SESSION_KEY, JSON.stringify(sessionData));
    localStorage.setItem('adminToken', userData.token);
    localStorage.setItem('adminData', JSON.stringify({
      username: userData.username,
      name: userData.name,
      userType: 'nominee',
      adminLevel: 'nominee',
      loginTime: sessionData.loginTime,
      sessionId: sessionId
    }));

    return sessionId;
  }

  // Create new session for admin/committee
  createAdminSession(userData) {
    const sessionId = this.generateSessionId();
    const sessionData = {
      sessionId,
      userId: userData.username,
      userType: userData.userType,
      name: userData.name,
      adminLevel: userData.adminLevel,
      timestamp: new Date().getTime(),
      loginTime: new Date().toISOString()
    };

    // Store in localStorage
    localStorage.setItem(this.ADMIN_SESSION_KEY, JSON.stringify(sessionData));
    localStorage.setItem('adminToken', userData.token);
    localStorage.setItem('adminData', JSON.stringify({
      username: userData.username,
      name: userData.name,
      userType: userData.userType,
      adminLevel: userData.adminLevel,
      loginTime: sessionData.loginTime,
      sessionId: sessionId
    }));

    return sessionId;
  }

  // Check if nominee can login (no active nominee session)
  canNomineeLogin() {
    const existingSession = localStorage.getItem(this.NOMINEE_SESSION_KEY);
    
    if (!existingSession) return true;
    
    try {
      const sessionData = JSON.parse(existingSession);
      
      // If session expired, allow login
      if (this.isSessionExpired(sessionData)) {
        this.clearNomineeSession();
        return true;
      }
      
      // Active session exists
      return false;
    } catch (error) {
      // Invalid session data, clear and allow login
      this.clearNomineeSession();
      return true;
    }
  }

  // Check if admin can login (no active admin session)
  canAdminLogin() {
    const existingSession = localStorage.getItem(this.ADMIN_SESSION_KEY);
    
    if (!existingSession) return true;
    
    try {
      const sessionData = JSON.parse(existingSession);
      
      // If session expired, allow login
      if (this.isSessionExpired(sessionData)) {
        this.clearAdminSession();
        return true;
      }
      
      // Active session exists
      return false;
    } catch (error) {
      // Invalid session data, clear and allow login
      this.clearAdminSession();
      return true;
    }
  }

  // Get active nominee session info
  getActiveNomineeSession() {
    const existingSession = localStorage.getItem(this.NOMINEE_SESSION_KEY);
    if (!existingSession) return null;
    
    try {
      const sessionData = JSON.parse(existingSession);
      if (this.isSessionExpired(sessionData)) {
        this.clearNomineeSession();
        return null;
      }
      return sessionData;
    } catch (error) {
      this.clearNomineeSession();
      return null;
    }
  }

  // Get active admin session info
  getActiveAdminSession() {
    const existingSession = localStorage.getItem(this.ADMIN_SESSION_KEY);
    if (!existingSession) return null;
    
    try {
      const sessionData = JSON.parse(existingSession);
      if (this.isSessionExpired(sessionData)) {
        this.clearAdminSession();
        return null;
      }
      return sessionData;
    } catch (error) {
      this.clearAdminSession();
      return null;
    }
  }

  // Clear nominee session
  clearNomineeSession() {
    localStorage.removeItem(this.NOMINEE_SESSION_KEY);
    
    // Only clear main session if it belongs to nominee
    const adminData = localStorage.getItem('adminData');
    if (adminData) {
      try {
        const data = JSON.parse(adminData);
        if (data.userType === 'nominee') {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminData');
        }
      } catch (error) {
        // If can't parse, clear anyway
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
      }
    }
  }

  // Clear admin session
  clearAdminSession() {
    localStorage.removeItem(this.ADMIN_SESSION_KEY);
    
    // Only clear main session if it belongs to admin
    const adminData = localStorage.getItem('adminData');
    if (adminData) {
      try {
        const data = JSON.parse(adminData);
        if (data.userType !== 'nominee') {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminData');
        }
      } catch (error) {
        // If can't parse, clear anyway
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
      }
    }
  }

  // Check if current user is nominee
  isNomineeLoggedIn() {
    const adminData = localStorage.getItem('adminData');
    if (!adminData) return false;
    
    try {
      const data = JSON.parse(adminData);
      return data.userType === 'nominee';
    } catch (error) {
      return false;
    }
  }

  // Check if current user is admin
  isAdminLoggedIn() {
    const adminData = localStorage.getItem('adminData');
    if (!adminData) return false;
    
    try {
      const data = JSON.parse(adminData);
      return data.userType !== 'nominee';
    } catch (error) {
      return false;
    }
  }

  // Force logout existing session and allow new login
  forceLogoutNominee() {
    this.clearNomineeSession();
    return true;
  }

  // Force logout existing admin session and allow new login
  forceLogoutAdmin() {
    this.clearAdminSession();
    return true;
  }

  // Get session status summary
  getSessionStatus() {
    return {
      nominee: {
        active: !!this.getActiveNomineeSession(),
        sessionInfo: this.getActiveNomineeSession()
      },
      admin: {
        active: !!this.getActiveAdminSession(),
        sessionInfo: this.getActiveAdminSession()
      }
    };
  }
}

// Export for use in other files
if (typeof window !== 'undefined') {
  window.SessionManager = SessionManager;
}

// For Node.js environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SessionManager;
}