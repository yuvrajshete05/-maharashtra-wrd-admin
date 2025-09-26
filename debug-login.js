// Debug login script to check user authentication
import dbConnect from './lib/mongodb.js'
import User from './models/User.js'

async function debugLogin() {
  try {
    console.log('🔌 Connecting to MongoDB...')
    await dbConnect()
    console.log('✅ Connected to MongoDB')

    // Test finding admin user
    console.log('\n🔍 Looking for admin user...')
    const adminUser = await User.findOne({ email: 'admin@test.com' }).select('+password')
    
    if (!adminUser) {
      console.log('❌ Admin user not found!')
      return
    }
    
    console.log('✅ Found admin user:')
    console.log('- Email:', adminUser.email)
    console.log('- User Type:', adminUser.userType)
    console.log('- Password Hash Length:', adminUser.password ? adminUser.password.length : 'No password')
    console.log('- Full Name:', adminUser.fullName)
    
    // Test password comparison
    console.log('\n🔑 Testing password comparison...')
    const testPassword = '123456'
    
    try {
      const isMatch = await adminUser.comparePassword(testPassword)
      console.log('Password match result:', isMatch)
      
      if (isMatch) {
        console.log('✅ Password comparison successful!')
      } else {
        console.log('❌ Password comparison failed!')
      }
    } catch (error) {
      console.log('❌ Error comparing password:', error.message)
    }
    
    // Test the full findByCredentials method
    console.log('\n🎯 Testing findByCredentials method...')
    try {
      const user = await User.findByCredentials('admin@test.com', '123456')
      console.log('✅ findByCredentials successful!')
      console.log('User found:', user.email, user.userType)
    } catch (error) {
      console.log('❌ findByCredentials failed:', error.message)
    }

  } catch (error) {
    console.error('❌ Error:', error)
  }
  
  process.exit(0)
}

debugLogin()