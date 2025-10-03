// scripts/create-test-data.mjs - Create dummy users for testing
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/maharashtra_wrd_admin'

// User Schema
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  mobile: String,
  userType: { 
    type: String, 
    enum: ['nominee', 'circle_committee', 'corporation_committee', 'state_committee', 'admin'],
    required: true 
  },
  status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' },
  lastLogin: Date,
  profileImage: String
}, { timestamps: true })

const User = mongoose.models.User || mongoose.model('User', UserSchema)

async function createTestData() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Test users data
    const testUsers = [
      {
        username: 'nominee_test',
        email: 'nominee@test.com',
        password: await bcrypt.hash('123456', 12),
        fullName: 'Ramesh Kumar Patil',
        mobile: '9876543211',
        userType: 'nominee'
      },
      {
        username: 'circle_test',
        email: 'circle@test.com',
        password: await bcrypt.hash('123456', 12),
        fullName: 'Suresh Bhosale',
        mobile: '9876543212',
        userType: 'circle_committee'
      },
      {
        username: 'corporation_test',
        email: 'corporation@test.com',
        password: await bcrypt.hash('123456', 12),
        fullName: 'Dr. Priya Sharma',
        mobile: '9876543213',
        userType: 'corporation_committee'
      },
      {
        username: 'state_test',
        email: 'state@test.com',
        password: await bcrypt.hash('123456', 12),
        fullName: 'Ashok Deshmukh',
        mobile: '9876543214',
        userType: 'state_committee'
      },
      {
        username: 'admin_test',
        email: 'admin@test.com',
        password: await bcrypt.hash('123456', 12),
        fullName: 'Vijay Singh',
        mobile: '9876543215',
        userType: 'admin'
      }
    ]

    // Insert users
    for (const userData of testUsers) {
      try {
        const existingUser = await User.findOne({ email: userData.email })
        if (!existingUser) {
          await User.create(userData)
          console.log(`✅ Created ${userData.userType}: ${userData.email}`)
        } else {
          console.log(`⚠️  User ${userData.email} already exists`)
        }
      } catch (error) {
        console.error(`❌ Error creating ${userData.email}:`, error.message)
      }
    }

    console.log('\n🎉 Test data created successfully!')
    console.log('\n📋 Login Credentials:')
    console.log('1. Nominee: nominee@test.com / 123456')
    console.log('2. Circle Committee: circle@test.com / 123456')
    console.log('3. Corporation Committee: corporation@test.com / 123456')
    console.log('4. State Committee: state@test.com / 123456')
    console.log('5. Admin: admin@test.com / 123456')

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await mongoose.disconnect()
    console.log('\n🔌 Disconnected from MongoDB')
    process.exit(0)
  }
}

createTestData()