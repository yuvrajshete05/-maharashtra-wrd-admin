// src/pages/api/auth/login.js - Login API for all 5 user types
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
      const { email, password } = req.body
      
      console.log('🔍 DEVELOPMENT MODE: Login attempt for email:', email)

      // Validation
      if (!email || !password) {
        console.log('❌ Missing email or password')
        return res.status(400).json({ 
          message: 'Email and password are required' 
        })
      }

      // Mock successful authentication for development
      // Determine userType based on email patterns for development testing
      let userType = 'nominee'; // Default to nominee for nominee login page
      let name = 'WUA Nominee';
      
      if (email.includes('admin')) {
        userType = 'admin';
        name = 'Admin User';
      } else if (email.includes('state')) {
        userType = 'state-committee';
        name = 'State Committee Member';
      } else if (email.includes('corporation')) {
        userType = 'corporation-committee';
        name = 'Corporation Committee Member';
      } else if (email.includes('circle')) {
        userType = 'circle-committee';
        name = 'Circle Committee Member';
      } else if (email.includes('committee')) {
        userType = 'committee-member';
        name = 'Committee Member';
      }

      const mockUser = {
        _id: 'dev-user-123',
        email: email,
        userType: userType,
        username: email.split('@')[0],
        name: name,
        fullName: name,
        createdAt: new Date(),
        lastLogin: new Date()
      }

      const mockProfile = {
        userId: mockUser._id,
        name: mockUser.name,
        organization: 'Maharashtra WRD',
        designation: mockUser.userType === 'admin' ? 'Administrator' : 
                    mockUser.userType === 'nominee' ? 'WUA Nominee' :
                    mockUser.userType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        district: 'Pune'
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

      console.log('✅ DEVELOPMENT MODE: Mock login successful')
      console.log('📧 Email:', email)
      console.log('👤 User Type:', mockUser.userType)
      console.log('📝 User Name:', mockUser.name)

      return res.status(200).json({
        success: true,
        message: 'Login successful (Development Mode)',
        data: {
          token,
          user: mockUser,
          profile: mockProfile
        }
      })
    }

    // PRODUCTION MODE: Use MongoDB
    await dbConnect()

    const { email, password } = req.body
    
    console.log('🔍 Login attempt for email:', email)

    // Validation
    if (!email || !password) {
      console.log('❌ Missing email or password')
      return res.status(400).json({ 
        message: 'Email and password are required' 
      })
    }

    console.log('🔍 Looking for user with email:', email)
    
    // Check if user exists first
    const userExists = await User.findOne({ email })
    console.log('👤 User exists:', !!userExists)
    
    if (!userExists) {
      console.log('❌ User not found in database')
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      })
    }

    console.log('🔑 Testing password with findByCredentials...')
    
    // Find user by credentials
    const user = await User.findByCredentials(email, password)
    
    // Get user profile
    const userProfile = await UserProfile.findOne({ userId: user._id })
    
    // Update last login
    user.lastLogin = new Date()
    await user.save()

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id,
        userType: user.userType,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    )

    // Prepare response data
    const responseData = {
      token,
      user: user.toPublicJSON(),
      profile: userProfile
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: responseData
    })

  } catch (error) {
    console.error('Login error:', error)
    
    if (error.message === 'Invalid login credentials') {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      })
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    })
  }
}