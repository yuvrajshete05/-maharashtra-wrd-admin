// models/EvaluationForm.js - Committee/Admin Fills This Form
import mongoose from 'mongoose'

const EvaluationFormSchema = new mongoose.Schema({
  // Reference to the nomination being evaluated
  nominationFormId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NominationForm',
    required: [true, 'Nomination form ID is required']
  },
  
  // Who is evaluating
  evaluatorUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Evaluator user ID is required']
  },
  
  // What type of evaluation this is
  evaluatorType: {
    type: String,
    enum: ['circle', 'corporation', 'state', 'admin'],
    required: [true, 'Evaluator type is required']
  },
  
  // Circle Committee Evaluation
  circleEvaluation: {
    // Document verification
    documentVerification: {
      documentsComplete: {
        type: Boolean,
        default: false
      },
      documentsVerified: {
        type: Boolean,
        default: false
      },
      verificationRemarks: String,
      verifiedDocuments: [{
        documentId: mongoose.Schema.Types.ObjectId,
        documentName: String,
        isVerified: Boolean,
        remarks: String
      }]
    },
    
    // Site visit (as per your Miro diagram)
    siteVisit: {
      visitScheduled: {
        type: Boolean,
        default: false
      },
      visitDate: Date,
      visitCompleted: {
        type: Boolean,
        default: false
      },
      siteVisitReport: {
        infrastructureStatus: String,
        operationalStatus: String,
        memberParticipation: String,
        overallObservation: String,
        recommendations: [String]
      }
    },
    
    // Parameter checks (from your Miro: water request, water tax, elections, log reporting)
    parameterChecks: [{
      parameter: String, // 'regular_water_request', 'regular_water_tax', 'regular_elections', 'regular_log_reporting'
      status: {
        type: String,
        enum: ['yes', 'no', 'partial']
      },
      remarks: String
    }],
    
    // Circle committee recommendation
    recommendation: {
      type: String,
      enum: ['qualified', 'disqualified', 'needs_clarification'],
      required: function() {
        return this.evaluatorType === 'circle'
      }
    },
    
    overallRemarks: String
  },
  
  // Corporation Committee Evaluation (5 modules × 30 marks each = 150 max)
  corporationEvaluation: {
    moduleEvaluations: [{
      moduleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AssessmentModule'
      },
      moduleName: String, // Denormalized
      
      // Evaluator scoring for this module
      evaluatorScore: {
        type: Number,
        min: 0,
        max: 30 // As per your Miro diagram
      },
      
      maxScore: {
        type: Number,
        default: 30
      },
      
      // Detailed evaluation criteria
      evaluationCriteria: [{
        criterion: String,
        score: Number,
        maxScore: Number,
        remarks: String
      }],
      
      moduleRemarks: String
    }],
    
    totalEvaluatorScore: {
      type: Number,
      default: 0,
      max: 150 // 5 modules × 30 each
    },
    
    recommendation: {
      type: String,
      enum: ['approve', 'reject', 'needs_review']
    },
    
    overallRemarks: String
  },
  
  // State Committee Evaluation (5 questions × 20 marks each = 100 max)
  stateEvaluation: {
    finalQuestions: [{
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AssessmentQuestion'
      },
      question: String, // Denormalized
      
      evaluatorScore: {
        type: Number,
        min: 0,
        max: 20 // As per your Miro diagram
      },
      
      maxScore: {
        type: Number,
        default: 20
      },
      
      remarks: String
    }],
    
    finalScore: {
      type: Number,
      default: 0,
      max: 100 // 5 questions × 20 each
    },
    
    finalRank: Number,
    
    finalStatus: {
      type: String,
      enum: ['winner', 'runner_up', 'qualified', 'not_qualified']
    },
    
    overallRemarks: String
  },
  
  // Evaluation Status
  status: {
    type: String,
    enum: ['assigned', 'in_progress', 'completed', 'submitted'],
    default: 'assigned'
  },
  
  // Assignment details
  assignedDate: {
    type: Date,
    default: Date.now
  },
  
  dueDate: Date,
  
  completedDate: Date
  
}, {
  timestamps: true
})

// Compound indexes
EvaluationFormSchema.index({ nominationFormId: 1, evaluatorType: 1 }, { unique: true })
EvaluationFormSchema.index({ evaluatorUserId: 1, status: 1 })
EvaluationFormSchema.index({ evaluatorType: 1, assignedDate: -1 })
EvaluationFormSchema.index({ dueDate: 1, status: 1 })

// Calculate total scores before saving
EvaluationFormSchema.pre('save', function(next) {
  // Calculate corporation total score
  if (this.corporationEvaluation && this.corporationEvaluation.moduleEvaluations) {
    this.corporationEvaluation.totalEvaluatorScore = this.corporationEvaluation.moduleEvaluations.reduce((total, module) => {
      return total + (module.evaluatorScore || 0)
    }, 0)
  }
  
  // Calculate state final score
  if (this.stateEvaluation && this.stateEvaluation.finalQuestions) {
    this.stateEvaluation.finalScore = this.stateEvaluation.finalQuestions.reduce((total, question) => {
      return total + (question.evaluatorScore || 0)
    }, 0)
  }
  
  next()
})

// Populate references
EvaluationFormSchema.pre(/^find/, function(next) {
  this.populate('evaluatorUserId', 'username fullName userType')
    .populate('nominationFormId', 'applicationNumber applicationYear wuaId status')
  next()
})

export default mongoose.models.EvaluationForm || mongoose.model('EvaluationForm', EvaluationFormSchema)