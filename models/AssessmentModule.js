// models/AssessmentModule.js - 5 Evaluation Modules
import mongoose from 'mongoose'

const AssessmentModuleSchema = new mongoose.Schema({
  moduleNumber: {
    type: Number,
    required: true,
    unique: true,
    min: 1,
    max: 5
  },
  
  moduleName: {
    type: String,
    required: [true, 'Module name is required'],
    trim: true
  },
  
  moduleNameMarathi: {
    type: String,
    trim: true
  },
  
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  
  maxScore: {
    type: Number,
    required: true,
    default: 30 // As per your Miro diagram: 5 modules × 30 each = 150
  },
  
  weightage: {
    type: Number,
    default: 1.0,
    min: 0,
    max: 5
  },
  
  isActive: {
    type: Boolean,
    default: true
  }
  
}, {
  timestamps: true
})

// Index
AssessmentModuleSchema.index({ moduleNumber: 1 })

export default mongoose.models.AssessmentModule || mongoose.model('AssessmentModule', AssessmentModuleSchema)

// Default modules data (you can seed this)
export const defaultModules = [
  {
    moduleNumber: 1,
    moduleName: 'Governance and Management',
    moduleNameMarathi: 'गव्हर्नन्स आणि व्यवस्थापन',
    description: 'Leadership, decision-making, transparency, and organizational structure',
    maxScore: 30
  },
  {
    moduleNumber: 2,
    moduleName: 'Water Management',
    moduleNameMarathi: 'जल व्यवस्थापन',
    description: 'Water distribution, irrigation efficiency, water conservation practices',
    maxScore: 30
  },
  {
    moduleNumber: 3,
    moduleName: 'Financial Management',
    moduleNameMarathi: 'आर्थिक व्यवस्थापन',
    description: 'Financial transparency, accounting, revenue collection, expenditure management',
    maxScore: 30
  },
  {
    moduleNumber: 4,
    moduleName: 'Operations and Maintenance',
    moduleNameMarathi: 'ऑपरेशन आणि मेंटेनन्स',
    description: 'Infrastructure maintenance, equipment management, operational efficiency',
    maxScore: 30
  },
  {
    moduleNumber: 5,
    moduleName: 'Community Impact and Sustainability',
    moduleNameMarathi: 'समुदायिक प्रभाव आणि टिकाऊपणा',
    description: 'Social impact, environmental sustainability, community participation',
    maxScore: 30
  }
]