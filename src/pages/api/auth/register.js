// src/pages/api/auth/register.js - Register API for creating users
import dbConnect from '../../../../lib/mongodb'
import User from '../../../../models/User'
import UserProfile from '../../../../models/UserProfile'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
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

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
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