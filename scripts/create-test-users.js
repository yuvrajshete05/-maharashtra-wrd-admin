// scripts/create-test-users.js - Create dummy users for testing
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Configure environment
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({ path: join(__dirname, '..', '.env.local') })

// Import models
import User from '../models/User.js'
import UserProfile from '../models/UserProfile.js'
import WuaOrganization from '../models/WuaOrganization.js'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/maharashtra_wrd_admin'

async function createTestUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Clear existing test data (optional)
    // await User.deleteMany({ email: { $regex: '@test.com$' } })
    // await UserProfile.deleteMany({})
    // console.log('🧹 Cleaned existing test data')

    // Create test WUA first
    const testWua = new WuaOrganization({
      name: 'Test Water User Association',
      nameMarathi: 'चाचणी जल वापरकर्ता संघटना',
      registrationNumber: 'TEST/WUA/2024/001',
      location: {
        district: 'Pune',
        taluka: 'Haveli',
        village: 'Test Village',
        pincode: '411014'
      },
      contact: {
        contactPerson: 'Test Contact Person',
        mobile: '9876543210',
        email: 'wua@test.com'
      },
      operations: {
        totalMembers: 50,
        irrigatedArea: 100.5,
        commandArea: 120.0
      }
    })
    
    await testWua.save()
    console.log('🏢 Created test WUA')

    // Test User Data
    const testUsers = [
      // 1. Nominee User
      {
        user: {
          username: 'nominee_test',
          email: 'nominee@test.com',
          password: '123456',
          fullName: 'Ramesh Kumar Patil',
          mobile: '9876543211',
          userType: 'nominee'
        },
        profile: {
          nomineeProfile: {
            wuaId: testWua._id,
            positionInWua: 'president',
            landHolding: 5.5,
            membershipDate: new Date('2020-01-01'),
            aadharNumber: '123456789012'
          }
        }
      },
      
      // 2. Circle Committee User
      {
        user: {
          username: 'circle_test',
          email: 'circle@test.com',
          password: '123456',
          fullName: 'Suresh Bhosale',
          mobile: '9876543212',
          userType: 'circle_committee'
        },
        profile: {
          committeeProfile: {
            committeeType: 'circle',
            designation: 'Circle Engineer',
            department: 'Water Resources Department',
            assignedDistricts: ['Pune', 'Satara'],
            assignedCircles: ['Pune Circle'],
            specialization: 'Irrigation Management',
            experienceYears: 8,
            qualification: 'B.E. Civil Engineering'
          }
        }
      },
      
      // 3. Corporation Committee User
      {
        user: {
          username: 'corporation_test',
          email: 'corporation@test.com',
          password: '123456',
          fullName: 'Dr. Priya Sharma',
          mobile: '9876543213',
          userType: 'corporation_committee'
        },
        profile: {
          committeeProfile: {
            committeeType: 'corporation',
            designation: 'Chief Engineer',
            department: 'Water Resources Department',
            assignedDistricts: ['Pune', 'Mumbai', 'Nashik'],
            assignedCorporations: ['Maharashtra State'],
            specialization: 'Water Resource Management',
            experienceYears: 15,
            qualification: 'Ph.D. in Water Engineering'
          }
        }
      },
      
      // 4. State Committee User
      {
        user: {
          username: 'state_test',
          email: 'state@test.com',
          password: '123456',
          fullName: 'Ashok Deshmukh',
          mobile: '9876543214',
          userType: 'state_committee'
        },
        profile: {
          committeeProfile: {
            committeeType: 'state',
            designation: 'Secretary',
            department: 'Water Resources Department, Government of Maharashtra',
            assignedDistricts: ['All Districts'],
            specialization: 'Policy and Administration',
            experienceYears: 20,
            qualification: 'IAS, M.A. Public Administration'
          }
        }
      },
      
      // 5. Admin User
      {
        user: {
          username: 'admin_test',
          email: 'admin@test.com',
          password: '123456',
          fullName: 'Vijay Singh',
          mobile: '9876543215',
          userType: 'admin'
        },
        profile: {
          adminProfile: {
            adminLevel: 'super_admin',
            department: 'IT Department',
            officeLocation: 'Mantralaya, Mumbai',
            permissions: ['user_management', 'system_settings', 'report_generation', 'data_export'],
            canCreateUsers: true,
            canManageSystem: true
          }
        }
      }
    ]

    // Create users and profiles
    for (const userData of testUsers) {
      try {
        // Check if user already exists
        const existingUser = await User.findOne({ email: userData.user.email })
        if (existingUser) {
          console.log(`⚠️  User ${userData.user.email} already exists, skipping...`)
          continue
        }

        // Create user
        const user = new User(userData.user)
        await user.save()
        
        // Create profile
        const profile = new UserProfile({
          userId: user._id,
          ...userData.profile
        })
        await profile.save()
        
        console.log(`✅ Created ${userData.user.userType} user: ${userData.user.email}`)
        
      } catch (error) {
        console.error(`❌ Error creating user ${userData.user.email}:`, error.message)
      }
    }

    console.log('\n🎉 Test users created successfully!')
    console.log('\n📋 Login Credentials:')
    console.log('1. Nominee: nominee@test.com / 123456')
    console.log('2. Circle Committee: circle@test.com / 123456')
    console.log('3. Corporation Committee: corporation@test.com / 123456')
    console.log('4. State Committee: state@test.com / 123456')
    console.log('5. Admin: admin@test.com / 123456')
    
  } catch (error) {
    console.error('❌ Error creating test users:', error)
  } finally {
    await mongoose.disconnect()
    console.log('\n🔌 Disconnected from MongoDB')
    process.exit(0)
  }
}

// Run the script
createTestUsers()