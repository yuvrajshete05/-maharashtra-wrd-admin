// Global Session Manager for Maharashtra WRD Admin
// Handles server-side session control across all browsers/devices

class GlobalSessionManager {
  constructor() {
    this.API_BASE = '/api/session/manage';
  }

  // Generate unique session ID
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Determine user category (nominee or admin)
  getUserCategory(userType) {
    if (userType === 'nominee') {
      return 'nominee';
    } else {
      // All committee types and admin are grouped as 'admin'
      return 'admin';
    }
  }

  // Check if user can login (server-side check)
  async checkLoginCapability(userId, userType) {
    try {
      const response = await fetch(this.API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'check_login',
          sessionData: {
            userId: userId,
            userCategory: this.getUserCategory(userType)
          }
        })
      });

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error checking login capability:', error);
      return {
        canLogin: false,
        reason: 'network_error',
        error: error.message
      };
    }
  }

  // Create new global session
  async createGlobalSession(userData) {
    try {
      const sessionId = this.generateSessionId();
      const userCategory = this.getUserCategory(userData.userType);

      const response = await fetch(this.API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create_session',
          sessionData: {
            sessionId: sessionId,
            userId: userData.userId,
            userType: userData.userType,
            userCategory: userCategory,
            userName: userData.userName
          }
        })
      });

      const result = await response.json();
      
      if (result.success) {
        // Store session info in localStorage as backup
        localStorage.setItem('globalSessionId', sessionId);
        localStorage.setItem('adminToken', userData.token);
        localStorage.setItem('adminData', JSON.stringify({
          username: userData.userId,
          name: userData.userName,
          userType: userData.userType,
          adminLevel: userData.userType,
          loginTime: new Date().toISOString(),
          sessionId: sessionId,
          globalSession: true
        }));

        return {
          success: true,
          sessionId: sessionId,
          data: result.data
        };
      } else {
        return {
          success: false,
          error: result.error || 'Failed to create session'
        };
      }
    } catch (error) {
      console.error('Error creating global session:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Force logout existing session of same category
  async forceLogoutCategory(userCategory) {
    try {
      const response = await fetch(this.API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'force_logout_category',
          userCategory: userCategory
        })
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error force logging out category:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Terminate current session
  async terminateSession(sessionId) {
    try {
      const response = await fetch(this.API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'terminate_session',
          sessionId: sessionId
        })
      });

      const result = await response.json();
      
      if (result.success) {
        // Clear localStorage
        localStorage.removeItem('globalSessionId');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
      }
      
      return result;
    } catch (error) {
      console.error('Error terminating session:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get all active sessions (for debugging/admin)
  async getActiveSessions() {
    try {
      const response = await fetch(this.API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'get_active_sessions'
        })
      });

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error getting active sessions:', error);
      return {
        sessions: [],
        count: 0,
        error: error.message
      };
    }
  }

  // Check if current session is still valid
  async validateCurrentSession() {
    const sessionId = localStorage.getItem('globalSessionId');
    if (!sessionId) return false;

    try {
      const activeSessions = await this.getActiveSessions();
      const currentSession = activeSessions.sessions?.find(s => s.sessionId === sessionId);
      
      return !!currentSession;
    } catch (error) {
      console.error('Error validating session:', error);
      return false;
    }
  }

  // Handle login process with global session management
  async handleLogin(loginData) {
    const { userId, userType, userName, token } = loginData;
    const userCategory = this.getUserCategory(userType);

    // Step 1: Check if user can login
    const loginCheck = await this.checkLoginCapability(userId, userType);

    if (!loginCheck.canLogin) {
      if (loginCheck.reason === 'category_occupied') {
        const existingSession = loginCheck.existingSession;
        const shouldForceLogin = confirm(
          `Another ${userCategory} is already logged in globally!\n\n` +
          `Current User: ${existingSession.userName}\n` +
          `Login Time: ${new Date(existingSession.loginTime).toLocaleString()}\n` +
          `User Type: ${existingSession.userType}\n\n` +
          `Do you want to force logout the existing session and login?`
        );

        if (!shouldForceLogin) {
          return {
            success: false,
            message: `Login cancelled. Only one ${userCategory} can be logged in at a time globally.`,
            reason: 'user_cancelled'
          };
        }

        // Force logout existing session
        const forceLogoutResult = await this.forceLogoutCategory(userCategory);
        if (!forceLogoutResult.success) {
          return {
            success: false,
            message: 'Failed to logout existing session. Please try again.',
            reason: 'force_logout_failed'
          };
        }
      } else {
        return {
          success: false,
          message: `Cannot login: ${loginCheck.reason}`,
          reason: loginCheck.reason
        };
      }
    }

    // Step 2: Create new global session
    const sessionResult = await this.createGlobalSession({
      userId,
      userType,
      userName,
      token
    });

    if (sessionResult.success) {
      return {
        success: true,
        message: `Login successful! Global ${userCategory} session created.`,
        sessionId: sessionResult.sessionId,
        data: sessionResult.data
      };
    } else {
      return {
        success: false,
        message: 'Failed to create session. Please try again.',
        error: sessionResult.error
      };
    }
  }

  // Handle logout process
  async handleLogout() {
    const sessionId = localStorage.getItem('globalSessionId');
    const adminData = localStorage.getItem('adminData');

    if (sessionId) {
      const result = await this.terminateSession(sessionId);
      
      if (adminData) {
        try {
          const data = JSON.parse(adminData);
          const userCategory = this.getUserCategory(data.userType);
          
          return {
            success: true,
            message: `Global ${userCategory} session terminated.`,
            redirectTo: data.userType === 'nominee' ? '/welcome' : '/admin/login'
          };
        } catch (error) {
          // Fallback
          localStorage.clear();
          return {
            success: true,
            message: 'Session terminated.',
            redirectTo: '/'
          };
        }
      }
    } else {
      // Clear any remaining localStorage
      localStorage.clear();
      return {
        success: true,
        message: 'Logged out.',
        redirectTo: '/'
      };
    }
  }
}

// Make available globally
if (typeof window !== 'undefined') {
  window.GlobalSessionManager = GlobalSessionManager;
}

// For Node.js environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GlobalSessionManager;
}