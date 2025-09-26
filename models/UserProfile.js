// models/UserProfile.js - Role-specific user data
import mongoose from 'mongoose'

const UserProfileSchema = new mongoose.Schema({
  // Reference to main user
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  
  // Nominee Profile (End User)
  nomineeProfile: {
    wuaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WuaOrganization'
    },
    positionInWua: {
      type: String,
      enum: ['president', 'secretary', 'treasurer', 'member', 'vice_president']
    },
    landHolding: {
      type: Number,
      min: 0
    },
    membershipDate: Date,
    aadharNumber: {
      type: String,
      match: [/^[0-9]{12}$/, 'Please enter a valid 12-digit Aadhar number']
    }
  },
  
  // Committee Member Profile (Circle/Corporation/State)
  committeeProfile: {
    committeeType: {
      type: String,
      enum: ['circle', 'corporation', 'state']
    },
    designation: {
      type: String,
      maxlength: [100, 'Designation cannot exceed 100 characters']
    },
    department: {
      type: String,
      maxlength: [100, 'Department cannot exceed 100 characters']
    },
    assignedDistricts: [{
      type: String,
      trim: true
    }],
    assignedCircles: [{
      type: String,
      trim: true
    }],
    assignedCorporations: [{
      type: String,
      trim: true
    }],
    specialization: {
      type: String,
      maxlength: [200, 'Specialization cannot exceed 200 characters']
    },
    experienceYears: {
      type: Number,
      min: 0,
      max: 50
    },
    qualification: {
      type: String,
      maxlength: [200, 'Qualification cannot exceed 200 characters']
    }
  },
  
  // Admin Profile
  adminProfile: {
    adminLevel: {
      type: String,
      enum: ['super_admin', 'admin', 'moderator'],
      default: 'admin'
    },
    department: {
      type: String,
      maxlength: [100, 'Department cannot exceed 100 characters']
    },
    officeLocation: {
      type: String,
      maxlength: [200, 'Office location cannot exceed 200 characters']
    },
    permissions: [{
      type: String,
      trim: true
    }],
    canCreateUsers: {
      type: Boolean,
      default: false
    },
    canManageSystem: {
      type: Boolean,
      default: false
    }
  }
  
}, {
  timestamps: true
})

// Indexes
UserProfileSchema.index({ userId: 1 })
UserProfileSchema.index({ 'nomineeProfile.wuaId': 1 })
UserProfileSchema.index({ 'committeeProfile.committeeType': 1 })
UserProfileSchema.index({ 'committeeProfile.assignedDistricts': 1 })

// Populate user data when querying
UserProfileSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'userId',
    select: 'username email fullName userType status'
  })
  next()
})

export default mongoose.models.UserProfile || mongoose.model('UserProfile', UserProfileSchema)