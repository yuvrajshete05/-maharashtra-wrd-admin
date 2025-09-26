// models/AssessmentQuestion.js - Questions for each module
import mongoose from 'mongoose'

const AssessmentQuestionSchema = new mongoose.Schema({
  moduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AssessmentModule',
    required: [true, 'Module ID is required']
  },
  
  questionNumber: {
    type: String,
    required: true,
    trim: true
  },
  
  questionText: {
    type: String,
    required: [true, 'Question text is required'],
    maxlength: [1000, 'Question text cannot exceed 1000 characters']
  },
  
  questionTextMarathi: {
    type: String,
    maxlength: [1000, 'Marathi question text cannot exceed 1000 characters']
  },
  
  helpText: {
    type: String,
    maxlength: [500, 'Help text cannot exceed 500 characters']
  },
  
  questionType: {
    type: String,
    enum: ['yes_no', 'multiple_choice', 'numeric', 'text', 'file_upload', 'rating'],
    required: [true, 'Question type is required']
  },
  
  maxScore: {
    type: Number,
    required: true,
    min: 0
  },
  
  isMandatory: {
    type: Boolean,
    default: true
  },
  
  // For multiple choice questions
  options: [{
    optionText: String,
    optionTextMarathi: String,
    score: Number
  }],
  
  // Validation rules
  validation: {
    minValue: Number,
    maxValue: Number,
    minLength: Number,
    maxLength: Number,
    requiredFileTypes: [String], // ['pdf', 'jpg', 'png']
    maxFileSize: Number // in bytes
  },
  
  sortOrder: {
    type: Number,
    default: 0
  },
  
  isActive: {
    type: Boolean,
    default: true
  }
  
}, {
  timestamps: true
})

// Compound index for efficient querying
AssessmentQuestionSchema.index({ moduleId: 1, sortOrder: 1 })
AssessmentQuestionSchema.index({ questionType: 1, isActive: 1 })

// Populate module info
AssessmentQuestionSchema.pre(/^find/, function(next) {
  this.populate('moduleId', 'moduleName moduleNameMarathi maxScore')
  next()
})

export default mongoose.models.AssessmentQuestion || mongoose.model('AssessmentQuestion', AssessmentQuestionSchema)