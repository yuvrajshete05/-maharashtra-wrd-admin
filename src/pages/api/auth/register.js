// src/pages/api/auth/register.js - Register API for creating users
import dbConnect from '../../../../lib/mongodb'
import User from '../../../../models/User'
import UserProfile from '../../../../models/UserProfile'
import jwt from 'jsonwebtoken'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    // DEVELOPMENT MODE: Skip MongoDB if SKIP_MONGODB is true
    if (process.env.SKIP_MONGODB === 'true') {
      const { 
        username, 
        email, 
        password, 
        fullName, 
        mobile, 
        userType,
        profileData 
      } = req.body

      console.log('🔍 DEVELOPMENT MODE: Registration attempt for email:', email)

      // Validation
      if (!username || !email || !password || !fullName || !userType) {
        return res.status(400).json({ 
          message: 'Username, email, password, full name, and user type are required' 
        })
      }

      // Mock successful registration for development
      const mockUser = {
        _id: 'dev-user-' + Date.now(),
        username,
        email,
        userType,
        fullName,
        mobile,
        createdAt: new Date(),
        lastLogin: new Date()
      }

      const mockProfile = {
        userId: mockUser._id,
        name: fullName,
        organization: profileData?.organization || 'Maharashtra WRD',
        designation: profileData?.designation || userType,
        district: profileData?.district || 'Pune',
        ...profileData
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: mockUser._id,
          userType: mockUser.userType,
          email: mockUser.email
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
      )

      console.log('✅ DEVELOPMENT MODE: Mock registration successful')

      return res.status(201).json({
        success: true,
        message: 'User registered successfully (Development Mode)',
        data: {
          token,
          user: mockUser,
          profile: mockProfile
        }
      })
    }

    // PRODUCTION MODE: Use MongoDB
    await dbConnect()

    const { 
      username, 
      email, 
      password, 
      fullName, 
      mobile, 
      userType,
      profileData 
    } = req.body

    // Validation
    if (!username || !email || !password || !fullName || !userType) {
      return res.status(400).json({ 
        message: 'Username, email, password, full name, and user type are required' 
      })
    }

    // Validate user type
    const validUserTypes = ['nominee', 'circle_committee', 'corporation_committee', 'state_committee', 'admin']
    if (!validUserTypes.includes(userType)) {
      return res.status(400).json({ 
        message: 'Invalid user type' 
      })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    })
    
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with this email or username already exists' 
      })
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      fullName,
      mobile,
      userType,
      status: 'active'
    })

    await user.save()

    // Create user profile based on user type
    const profilePayload = { userId: user._id }
    
    if (userType === 'nominee' && profileData?.nomineeProfile) {
      profilePayload.nomineeProfile = profileData.nomineeProfile
    } else if (['circle_committee', 'corporation_committee', 'state_committee'].includes(userType) && profileData?.committeeProfile) {
      profilePayload.committeeProfile = {
        ...profileData.committeeProfile,
        committeeType: userType.replace('_committee', '') // 'circle', 'corporation', 'state'
      }
    } else if (userType === 'admin' && profileData?.adminProfile) {
      profilePayload.adminProfile = profileData.adminProfile
    }

    const userProfile = new UserProfile(profilePayload)
    await userProfile.save()

    // Generate JWT token for immediate login
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    )

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        token,
        user: user.toPublicJSON(),
        profile: userProfile
      }
    })

  } catch (error) {
    console.error('Registration error:', error)
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message)
      return res.status(400).json({ 
        success: false,
        message: 'Validation error',
        errors: messages 
      })
    }
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false,
        message: 'User with this email or username already exists' 
      })
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    })
  }
}