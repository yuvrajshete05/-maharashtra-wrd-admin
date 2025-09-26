// models/NominationForm.js - Nominee Fills This Form
import mongoose from 'mongoose'

const NominationFormSchema = new mongoose.Schema({
  // Application Basic Info
  applicationNumber: {
    type: String,
    // Remove required: true to let pre-save hook handle it
    unique: true,
    trim: true
  },
  
  // Who submitted this nomination
  nomineeUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Nominee user ID is required']
  },
  
  // Which WUA is applying
  wuaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WuaOrganization',
    required: [true, 'WUA ID is required']
  },
  
  // Application Details
  applicationYear: {
    type: Number,
    required: [true, 'Application year is required'],
    min: 2020,
    max: 2030
  },
  
  category: {
    type: String,
    enum: ['MAJOR', 'MINOR'],
    required: [true, 'Category is required']
  },
  
  // Self-Assessment Questionnaire Responses
  questionnaireResponses: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AssessmentQuestion',
      required: true
    },
    questionText: {
      type: String,
      required: true // Denormalized for performance
    },
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AssessmentModule'
    },
    moduleName: String, // Denormalized
    
    // Response Data (flexible for different question types)
    response: {
      textResponse: String,
      numericResponse: Number,
      booleanResponse: Boolean,
      choiceResponse: String,
      fileUploadIds: [{
        type: mongoose.Schema.Types.ObjectId
      }]
    },
    
    // Self-scoring by nominee
    selfScore: {
      type: Number,
      required: true,
      min: 0
    },
    
    maxScore: {
      type: Number,
      required: true
    },
    
    remarks: String
  }],
  
  // Calculated Scores
  scoring: {
    totalSelfScore: {
      type: Number,
      default: 0
    },
    maxPossibleScore: {
      type: Number,
      default: 150 // As per your Miro diagram
    },
    completionPercentage: {
      type: Number,
      default: 0
    }
  },
  
  // Application Status
  status: {
    type: String,
    enum: [
      'draft',           // Being filled by nominee
      'submitted',       // Submitted by nominee, waiting for circle committee
      'circle_review',   // Under circle committee review
      'corporation_review', // Under corporation committee review
      'state_review',    // Under state committee review
      'completed',       // All evaluations done
      'rejected'         // Rejected at any stage
    ],
    default: 'draft'
  },
  
  // Workflow tracking
  currentStage: {
    type: String,
    enum: ['self_assessment', 'circle_committee', 'corporation_committee', 'state_committee', 'final'],
    default: 'self_assessment'
  },
  
  // Documents uploaded by nominee
  uploadedDocuments: [{
    documentId: mongoose.Schema.Types.ObjectId,
    documentName: String,
    documentType: String,
    uploadDate: Date,
    isVerified: {
      type: Boolean,
      default: false
    }
  }],
  
  // Timeline
  submissionDate: Date,
  lastModifiedDate: Date
  
}, {
  timestamps: true
})

// Indexes
NominationFormSchema.index({ applicationNumber: 1 })
NominationFormSchema.index({ nomineeUserId: 1, applicationYear: -1 })
NominationFormSchema.index({ wuaId: 1 })
NominationFormSchema.index({ status: 1, currentStage: 1 })
NominationFormSchema.index({ applicationYear: 1, category: 1 })

// Auto-generate application number
NominationFormSchema.pre('save', async function(next) {
  if (!this.applicationNumber && this.isNew) {
    try {
      const year = this.applicationYear || new Date().getFullYear()
      const count = await this.constructor.countDocuments({ applicationYear: year })
      this.applicationNumber = `APP/MH/${year}/${String(count + 1).padStart(4, '0')}`
      console.log(`Generated application number: ${this.applicationNumber}`)
    } catch (error) {
      console.error('Error generating application number:', error)
      return next(error)
    }
  }
  next()
})

// Calculate total score before saving
NominationFormSchema.pre('save', function(next) {
  if (this.questionnaireResponses && this.questionnaireResponses.length > 0) {
    this.scoring.totalSelfScore = this.questionnaireResponses.reduce((total, response) => {
      return total + (response.selfScore || 0)
    }, 0)
    
    this.scoring.maxPossibleScore = this.questionnaireResponses.reduce((total, response) => {
      return total + (response.maxScore || 0)
    }, 0)
    
    if (this.scoring.maxPossibleScore > 0) {
      this.scoring.completionPercentage = (this.scoring.totalSelfScore / this.scoring.maxPossibleScore) * 100
    }
  }
  next()
})

// Populate references
NominationFormSchema.pre(/^find/, function(next) {
  this.populate('nomineeUserId', 'username fullName email')
    .populate('wuaId', 'name nameMarathi registrationNumber location.district')
  next()
})

export default mongoose.models.NominationForm || mongoose.model('NominationForm', NominationFormSchema)