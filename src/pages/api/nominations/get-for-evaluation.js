// API Route for Committee Form Data Access
// Path: src/pages/api/nominations/get-for-evaluation.js

import { connectToDatabase } from '../../../../lib/mongodb'
import NominationForm from '../../../../models/NominationForm'
import { verifyToken } from '../../../../lib/auth'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
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

    // Get query parameters
    const { 
      wuaId, 
      district, 
      category, 
      stage = 'all',
      evaluatorType = user.userType 
    } = req.query

    // Build query based on evaluator type and permissions
    let query = {}
    
    // Specific WUA lookup
    if (wuaId) {
      query.wuaId = wuaId
    }

    // Filter by district for circle committee
    if (evaluatorType === 'circle-committee' && district) {
      query['geographic.district'] = district
    }

    // Filter by category
    if (category) {
      query.category = category
    }

    // Filter by evaluation stage
    switch (stage) {
      case 'circle':
        query['evaluationJourney.circleCommitteePending'] = true
        query.status = { $in: ['submitted', 'self-assessment-completed'] }
        break
      case 'corporation':
        query['evaluationJourney.corporationCommitteePending'] = true
        query.status = 'circle-evaluation-completed'
        break
      case 'state':
        query['evaluationJourney.stateCommitteePending'] = true
        query.status = 'corporation-evaluation-completed'
        break
      default:
        // Return all accessible nominations
        break
    }

    // Fetch nominations from database
    const nominations = await NominationForm.find(query)
      .select('-__v') // Exclude version field
      .sort({ submissionDate: -1 }) // Latest first
      .limit(100) // Limit for performance

    // Transform data for committee forms
    const transformedData = nominations.map(nomination => ({
      id: nomination._id,
      wuaId: nomination.wuaId,
      
      // Basic Info
      wuaName: nomination.wuaName,
      wuaNameMarathi: nomination.wuaNameMarathi,
      category: nomination.category,
      
      // Geographic Info
      district: nomination.geographic.district,
      taluka: nomination.geographic.taluka,
      village: nomination.geographic.village,
      
      // Contact Info
      chairmanName: nomination.contactInfo.chairman.name,
      chairmanMobile: nomination.contactInfo.chairman.mobile,
      secretaryName: nomination.contactInfo.secretary.name,
      
      // Statistics
      totalMembers: nomination.statistics.totalMembers,
      totalLandArea: nomination.statistics.totalLandArea,
      irrigatedArea: nomination.statistics.irrigatedArea,
      
      // Project Info
      projectName: nomination.projectInfo.projectName,
      projectType: nomination.projectInfo.projectType,
      totalCost: nomination.projectInfo.totalCost,
      achievements: nomination.projectInfo.achievements,
      
      // Status & Journey
      status: nomination.status,
      submissionDate: nomination.submissionDate,
      evaluationJourney: nomination.evaluationJourney,
      
      // Scores (if evaluations completed)
      scores: {
        selfAssessment: nomination.scores?.selfAssessment || null,
        circleCommittee: nomination.scores?.circleCommittee || null,
        corporationCommittee: nomination.scores?.corporationCommittee || null,
        stateCommittee: nomination.scores?.stateCommittee || null
      }
    }))

    console.log(`✅ Retrieved ${transformedData.length} nominations for ${evaluatorType}`)

    res.status(200).json({
      success: true,
      nominations: transformedData,
      count: transformedData.length,
      evaluatorType,
      filters: { district, category, stage }
    })

  } catch (error) {
    console.error('Error fetching nominations:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch nominations',
      error: error.message
    })
  }
}