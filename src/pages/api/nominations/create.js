// src/pages/api/nominations/create.js - Create nomination form (Nominee fills)
import dbConnect from '../../../../lib/mongodb'
import NominationForm from '../../../../models/NominationForm'
import WuaOrganization from '../../../../models/WuaOrganization'
import User from '../../../../models/User'
import jwt from 'jsonwebtoken'

// Middleware to verify JWT token
const verifyToken = (req) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) throw new Error('No token provided')
  
  return jwt.verify(token, process.env.JWT_SECRET)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    await dbConnect()

    // Verify authentication
    const decoded = verifyToken(req)
    const userId = decoded.userId

    // Check if user is a nominee
    const user = await User.findById(userId)
    if (!user || user.userType !== 'nominee') {
      return res.status(403).json({ 
        message: 'Only nominees can create nomination forms' 
      })
    }

    const { wuaId, applicationYear, category, wuaName, wuaNameMarathi, district, taluka, village, contactInfo, wuaDetails, projectInfo, selfAssessment, applicantName, mobileNumber } = req.body

    console.log('📝 Form submission data:', {
      wuaId,
      applicationYear,
      category,
      wuaName,
      applicantName,
      mobileNumber,
      hasContactInfo: !!contactInfo,
      hasWuaDetails: !!wuaDetails
    })

    // Validation
    if (!applicationYear || !category || !applicantName || !mobileNumber) {
      console.log('❌ Missing required fields:', { applicationYear, category, applicantName, mobileNumber })
      return res.status(400).json({ 
        message: 'Application year, category, applicant name, and mobile number are required' 
      })
    }

    // Check if nominee already has a nomination for this year
    const existingNomination = await NominationForm.findOne({
      nomineeUserId: userId,
      applicationYear
    })

    if (existingNomination) {
      return res.status(400).json({ 
        message: `You already have a nomination for year ${applicationYear}` 
      })
    }

    let wuaObjectId;
    
    // If wuaId is provided as a string (like "WUA/MH/2024/001234"), try to find existing WUA
    if (wuaId && typeof wuaId === 'string' && wuaId.includes('/')) {
      const existingWUA = await WuaOrganization.findOne({ registrationNumber: wuaId })
      if (existingWUA) {
        wuaObjectId = existingWUA._id
      } else {
        // Create new WUA if it doesn't exist
        const newWUA = new WuaOrganization({
          name: wuaName,
          nameMarathi: wuaNameMarathi,
          registrationNumber: wuaId,
          registrationDate: wuaDetails?.registrationDate,
          location: {
            district: district,
            taluka: taluka,
            village: village
          },
          contact: {
            contactPerson: contactInfo?.chairmanName,
            mobile: contactInfo?.chairmanMobile,
            email: contactInfo?.chairmanEmail
          },
          operations: {
            totalMembers: wuaDetails?.totalMembers || 0,
            irrigatedArea: wuaDetails?.irrigationArea || 0
          }
        })
        
        const savedWUA = await newWUA.save()
        wuaObjectId = savedWUA._id
      }
    } else {
      // If no wuaId provided, create a new WUA
      const newWUA = new WuaOrganization({
        name: wuaName || 'New WUA',
        nameMarathi: wuaNameMarathi,
        registrationNumber: wuaId || `WUA/MH/${applicationYear}/${Date.now()}`,
        registrationDate: wuaDetails?.registrationDate,
        location: {
          district: district,
          taluka: taluka,
          village: village
        },
        contact: {
          contactPerson: contactInfo?.chairmanName,
          mobile: contactInfo?.chairmanMobile,
          email: contactInfo?.chairmanEmail
        },
        operations: {
          totalMembers: wuaDetails?.totalMembers || 0,
          irrigatedArea: wuaDetails?.irrigationArea || 0
        }
      })
      
      const savedWUA = await newWUA.save()
      wuaObjectId = savedWUA._id
    }

    // Create new nomination form
    console.log('🏗️ Creating nomination form with:', {
      nomineeUserId: userId,
      wuaObjectId,
      applicationYear,
      category
    })

    // Generate application number manually
    const existingCount = await NominationForm.countDocuments({ applicationYear })
    const applicationNumber = `APP/MH/${applicationYear}/${String(existingCount + 1).padStart(4, '0')}`
    
    const nominationForm = new NominationForm({
      applicationNumber, // Set explicitly
      nomineeUserId: userId,
      wuaId: wuaObjectId,
      applicationYear,
      category,
      applicantInfo: {
        applicantName: applicantName,
        mobileNumber: mobileNumber
      },
      questionnaireResponses: [],
      status: 'draft',
      currentStage: 'self_assessment'
    })

    console.log('💾 Saving nomination form with application number:', applicationNumber)
    await nominationForm.save()
    console.log('✅ Nomination form saved successfully:', nominationForm.applicationNumber)

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: {
        nominationId: nominationForm._id,
        applicationNumber: nominationForm.applicationNumber,
        wuaId: wuaObjectId
      }
    })

  } catch (error) {
    console.error('Create nomination error:', error)
    
    if (error.message === 'No token provided') {
      return res.status(401).json({ message: 'Authentication required' })
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' })
    }
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message)
      return res.status(400).json({ 
        message: 'Validation error',
        errors: messages 
      })
    }
    
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message
    })
  }
}