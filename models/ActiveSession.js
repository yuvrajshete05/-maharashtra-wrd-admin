const mongoose = require('mongoose');

const activeSessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: String,
    required: true
  },
  userType: {
    type: String,
    required: true,
    enum: ['nominee', 'admin', 'circle_committee', 'corporation_committee', 'state_committee']
  },
  userCategory: {
    type: String,
    required: true,
    enum: ['nominee', 'admin'] // nominee or admin (grouping committee types as admin)
  },
  userName: {
    type: String,
    required: true
  },
  loginTime: {
    type: Date,
    required: true,
    default: Date.now
  },
  lastActivity: {
    type: Date,
    required: true,
    default: Date.now
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  expiresAt: {
    type: Date,
    required: true,
    default: function() {
      return new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
    }
  }
}, {
  timestamps: true
});

// Create index for automatic cleanup of expired sessions
activeSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Create compound index for efficient queries
activeSessionSchema.index({ userCategory: 1, isActive: 1 });
activeSessionSchema.index({ userId: 1, isActive: 1 });

// Static method to check if a user category can login
activeSessionSchema.statics.canUserLogin = async function(userCategory, userId) {
  try {
    // Clean expired sessions first
    await this.deleteMany({ 
      expiresAt: { $lt: new Date() } 
    });
    
    // Check if there's already an active session for this category
    const existingSession = await this.findOne({
      userCategory: userCategory,
      isActive: true
    });
    
    if (existingSession) {
      // If same user is trying to login again, allow it (refresh session)
      if (existingSession.userId === userId) {
        return {
          canLogin: true,
          reason: 'same_user_refresh',
          existingSession: existingSession
        };
      }
      
      // Different user of same category is already logged in
      return {
        canLogin: false,
        reason: 'category_occupied',
        existingSession: existingSession
      };
    }
    
    // No active session found, user can login
    return {
      canLogin: true,
      reason: 'no_active_session',
      existingSession: null
    };
    
  } catch (error) {
    console.error('Error checking user login capability:', error);
    return {
      canLogin: false,
      reason: 'database_error',
      error: error.message
    };
  }
};

// Static method to create new session
activeSessionSchema.statics.createSession = async function(sessionData) {
  try {
    // First, deactivate any existing sessions for this user
    await this.updateMany(
      { userId: sessionData.userId },
      { isActive: false }
    );
    
    // Create new session
    const session = new this(sessionData);
    await session.save();
    
    return {
      success: true,
      session: session
    };
    
  } catch (error) {
    console.error('Error creating session:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Static method to terminate session
activeSessionSchema.statics.terminateSession = async function(sessionId) {
  try {
    const result = await this.updateOne(
      { sessionId: sessionId },
      { isActive: false }
    );
    
    return {
      success: result.modifiedCount > 0,
      result: result
    };
    
  } catch (error) {
    console.error('Error terminating session:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Static method to force logout existing session of same category
activeSessionSchema.statics.forceLogoutCategory = async function(userCategory) {
  try {
    const result = await this.updateMany(
      { userCategory: userCategory, isActive: true },
      { isActive: false }
    );
    
    return {
      success: true,
      terminatedSessions: result.modifiedCount
    };
    
  } catch (error) {
    console.error('Error force logging out category:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Method to update last activity
activeSessionSchema.methods.updateActivity = async function() {
  this.lastActivity = new Date();
  return await this.save();
};

module.exports = mongoose.model('ActiveSession', activeSessionSchema);