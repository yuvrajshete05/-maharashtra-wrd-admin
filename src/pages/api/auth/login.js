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