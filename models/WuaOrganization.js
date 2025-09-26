// models/WuaOrganization.js - Water User Association Model
import mongoose from 'mongoose'

const WuaOrganizationSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'WUA name is required'],
    trim: true,
    maxlength: [200, 'WUA name cannot exceed 200 characters']
  },
  
  nameMarathi: {
    type: String,
    trim: true,
    maxlength: [200, 'WUA Marathi name cannot exceed 200 characters']
  },
  
  registrationNumber: {
    type: String,
    required: [true, 'Registration number is required'],
    unique: true,
    trim: true,
    maxlength: [50, 'Registration number cannot exceed 50 characters']
  },
  
  registrationDate: Date,
  establishedDate: Date,
  
  // Geographic Information
  location: {
    district: {
      type: String,
      required: [true, 'District is required'],
      trim: true
    },
    taluka: {
      type: String,
      trim: true
    },
    village: {
      type: String,
      trim: true
    },
    pincode: {
      type: String,
      match: [/^[0-9]{6}$/, 'Please enter a valid 6-digit pincode']
    },
    address: {
      type: String,
      maxlength: [500, 'Address cannot exceed 500 characters']
    }
  },
  
  // Contact Information
  contact: {
    contactPerson: {
      type: String,
      trim: true,
      maxlength: [100, 'Contact person name cannot exceed 100 characters']
    },
    mobile: {
      type: String,
      match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit mobile number']
    },
    email: {
      type: String,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    }
  },
  
  // Banking Information
  banking: {
    accountNumber: {
      type: String,
      trim: true
    },
    bankName: {
      type: String,
      trim: true
    },
    branchName: {
      type: String,
      trim: true
    },
    ifscCode: {
      type: String,
      trim: true,
      match: [/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Please enter a valid IFSC code']
    },
    panNumber: {
      type: String,
      trim: true,
      match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Please enter a valid PAN number']
    },
    gstNumber: {
      type: String,
      trim: true
    }
  },
  
  // Operational Information
  operations: {
    totalMembers: {
      type: Number,
      default: 0,
      min: 0
    },
    irrigatedArea: {
      type: Number,
      min: 0 // in hectares
    },
    commandArea: {
      type: Number,
      min: 0 // in hectares
    },
    mainCrop: {
      type: String,
      trim: true
    },
    cropPattern: [{
      type: String,
      trim: true
    }]
  },
  
  // WUA Status
  status: {
    type: String,
    enum: ['active', 'inactive', 'dissolved'],
    default: 'active'
  }
  
}, {
  timestamps: true
})

// Indexes for performance
WuaOrganizationSchema.index({ registrationNumber: 1 })
WuaOrganizationSchema.index({ 'location.district': 1 })
WuaOrganizationSchema.index({ name: 'text', nameMarathi: 'text' }) // Text search
WuaOrganizationSchema.index({ status: 1 })

// Virtual for full address
WuaOrganizationSchema.virtual('fullAddress').get(function() {
  const location = this.location
  return [location.address, location.village, location.taluka, location.district]
    .filter(Boolean)
    .join(', ')
})

// Method to get active members count
WuaOrganizationSchema.methods.getActiveMembersCount = async function() {
  const UserProfile = mongoose.model('UserProfile')
  return UserProfile.countDocuments({
    'nomineeProfile.wuaId': this._id,
    // Add status check if you have member status
  })
}

export default mongoose.models.WuaOrganization || mongoose.model('WuaOrganization', WuaOrganizationSchema)