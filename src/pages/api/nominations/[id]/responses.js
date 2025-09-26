// src/pages/api/nominations/[id]/responses.js - Save questionnaire responses
import dbConnect from '../../../../../lib/mongodb'
import NominationForm from '../../../../../models/NominationForm'
import jwt from 'jsonwebtoken'

const verifyToken = (req) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) throw new Error('No token provided')
  
  return jwt.verify(token, process.env.JWT_SECRET)
}

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    await dbConnect()

    const { id } = req.query // nomination form id
    const { responses } = req.body

    // Verify authentication
    const decoded = verifyToken(req)
    const userId = decoded.userId

    // Find nomination form
    const nomination = await NominationForm.findById(id)
    
    if (!nomination) {
      return res.status(404).json({ message: 'Nomination form not found' })
    }

    // Check if user owns this nomination
    if (nomination.nomineeUserId.toString() !== userId) {
      return res.status(403).json({ 
        message: 'You can only update your own nomination form' 
      })
    }

    // Check if nomination is still editable
    if (nomination.status !== 'draft') {
      return res.status(400).json({ 
        message: 'Cannot edit submitted nomination form' 
      })
    }

    // Validation
    if (!responses || !Array.isArray(responses)) {
      return res.status(400).json({ 
        message: 'Responses must be an array' 
      })
    }

    // Update responses
    for (const response of responses) {
      const existingIndex = nomination.questionnaireResponses.findIndex(
        r => r.questionId.toString() === response.questionId
      )

      if (existingIndex >= 0) {
        // Update existing response
        nomination.questionnaireResponses[existingIndex] = {
          ...nomination.questionnaireResponses[existingIndex].toObject(),
          ...response
        }
      } else {
        // Add new response
        nomination.questionnaireResponses.push(response)
      }
    }

    // Update last modified date
    nomination.lastModifiedDate = new Date()

    await nomination.save()

    res.status(200).json({
      success: true,
      message: 'Responses saved successfully',
      data: nomination
    })

  } catch (error) {
    console.error('Save responses error:', error)
    
    if (error.message === 'No token provided') {
      return res.status(401).json({ message: 'Authentication required' })
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' })
    }
    
    res.status(500).json({ 
      message: 'Internal server error' 
    })
  }
}