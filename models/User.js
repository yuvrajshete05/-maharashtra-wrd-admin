// models/User.js - Main User Authentication Model
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const UserSchema = new mongoose.Schema({
  // Basic Authentication
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [50, 'Username cannot exceed 50 characters']
  },
  
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  
  // User Type - Your 5 User Types
  userType: {
    type: String,
    required: [true, 'User type is required'],
    enum: {
      values: ['nominee', 'circle_committee', 'corporation_committee', 'state_committee', 'admin'],
      message: '{VALUE} is not a valid user type'
    }
  },
  
  // User Status
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  
  // Contact Information
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    maxlength: [100, 'Full name cannot exceed 100 characters']
  },
  
  mobile: {
    type: String,
    trim: true,
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit mobile number']
  },
  
  // System Fields
  lastLogin: {
    type: Date
  },
  
  profileImage: {
    type: String
  }
  
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
})

// Indexes for performance
UserSchema.index({ username: 1 })
UserSchema.index({ email: 1 })
UserSchema.index({ userType: 1, status: 1 })

// Hash password before saving
UserSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next()
  
  try {
    // Hash password with cost of 12
    const hashedPassword = await bcrypt.hash(this.password, 12)
    this.password = hashedPassword
    next()
  } catch (error) {
    next(error)
  }
})

// Method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

// Method to get user without sensitive data
UserSchema.methods.toPublicJSON = function() {
  const userObject = this.toObject()
  delete userObject.password
  return userObject
}

// Static method to find user by credentials
UserSchema.statics.findByCredentials = async function(email, password) {
  const user = await this.findOne({ email }).select('+password')
  
  if (!user) {
    throw new Error('Invalid login credentials')
  }
  
  const isPasswordMatch = await user.comparePassword(password)
  
  if (!isPasswordMatch) {
    throw new Error('Invalid login credentials')
  }
  
  return user
}

export default mongoose.models.User || mongoose.model('User', UserSchema)