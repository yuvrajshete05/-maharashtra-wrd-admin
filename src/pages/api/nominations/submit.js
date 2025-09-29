// API Route for Nomination Form Submission
// Path: src/pages/api/nominations/submit.js

import { connectToDatabase } from '../../../../lib/mongodb'
import NominationForm from '../../../../models/NominationForm'
import { verifyToken } from '../../../../lib/auth'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    // Verify authentication
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' })
    }

    const user = verifyToken(token)
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' })
    }

    // Connect to database
    await connectToDatabase()

    // Extract nomination data from request
    const nominationData = req.body

    // Generate unique WUA ID
    const wuaId = `WUA/MH/${nominationData.applicationYear}/${Date.now()}`

    // Create new nomination form entry
    const nomination = new NominationForm({
      wuaId,
      submittedBy: user.userId,
      submitterType: user.userType,
      submissionDate: new Date(),
      
      // Basic WUA Information
      wuaName: nominationData.wuaName,
      wuaNameMarathi: nominationData.wuaNameMarathi,
      applicationYear: nominationData.applicationYear,
      category: nominationData.category,
      
      // Geographic Information
      geographic: {
        district: nominationData.district,
        taluka: nominationData.taluka,
        village: nominationData.village,
        pincode: nominationData.pincode,
        coordinates: nominationData.coordinates
      },

      // Contact Information
      contactInfo: {
        chairman: {
          name: nominationData.chairmanName,
          mobile: nominationData.chairmanMobile,
          email: nominationData.chairmanEmail
        },
        secretary: {
          name: nominationData.secretaryName,
          mobile: nominationData.secretaryMobile,
          email: nominationData.secretaryEmail
        }
      },

      // WUA Statistics
      statistics: {
        totalMembers: nominationData.totalMembers,
        maleFarmers: nominationData.maleFarmers,
        femaleFarmers: nominationData.femaleFarmers,
        totalLandArea: nominationData.totalLandArea,
        irrigatedArea: nominationData.irrigatedArea,
        commandArea: nominationData.commandArea
      },

      // Project Information
      projectInfo: {
        projectName: nominationData.projectName,
        projectType: nominationData.projectType,
        startDate: nominationData.projectStartDate,
        completionDate: nominationData.projectCompletionDate,
        totalCost: nominationData.totalCost,
        fundingSources: nominationData.fundingSources,
        achievements: nominationData.achievements
      },

      // Banking Information
      bankingInfo: {
        bankName: nominationData.bankName,
        branchName: nominationData.branchName,
        accountNumber: nominationData.accountNumber,
        ifscCode: nominationData.ifscCode
      },

      // Application Status
      status: 'submitted',
      currentStage: 'nomination',
      
      // Evaluation Tracking
      evaluationJourney: {
        nominationSubmitted: {
          date: new Date(),
          status: 'completed'
        },
        selfAssessmentPending: true,
        circleCommitteePending: false,
        corporationCommitteePending: false,
        stateCommitteePending: false
      }
    })

    // Save to database
    const savedNomination = await nomination.save()

    console.log(`✅ Nomination saved: ${wuaId} by ${user.userType}`)

    res.status(200).json({
      success: true,
      message: 'Nomination submitted successfully',
      wuaId: savedNomination.wuaId,
      _id: savedNomination._id
    })

  } catch (error) {
    console.error('Error saving nomination:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to submit nomination',
      error: error.message
    })
  }
}