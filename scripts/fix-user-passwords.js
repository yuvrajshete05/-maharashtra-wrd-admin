// Fix user passwords script
// Run with: node scripts/fix-user-passwords.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = 'mongodb://localhost:27017/maharashtra_wrd_admin';

// User schema (simplified for this script)
const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  userType: String,
  fullName: String,
  status: String,
  mobile: String
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

async function fixUserPasswords() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('🔗 Connected to MongoDB');

    // Define users with correct passwords
    const usersToFix = [
      {
        email: 'nominee@test.com',
        password: 'password123',
        fullName: 'Test Nominee User',
        userType: 'nominee',
        username: 'test_nominee'
      },
      {
        email: 'circle@test.com',
        password: 'password123',
        fullName: 'Circle Committee Member',
        userType: 'circle_committee',
        username: 'circle_committee'
      },
      {
        email: 'corporation@test.com',
        password: 'password123',
        fullName: 'Corporation Committee Member',
        userType: 'corporation_committee',
        username: 'corporation_committee'
      },
      {
        email: 'state@test.com',
        password: 'password123',
        fullName: 'State Committee Member',
        userType: 'state_committee',
        username: 'state_committee'
      },
      {
        email: 'admin@test.com',
        password: 'password123',
        fullName: 'System Administrator',
        userType: 'admin',
        username: 'admin'
      }
    ];

    console.log('\n🔧 Fixing user passwords...');

    for (const userData of usersToFix) {
      // Hash the password
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      
      // Update or create the user
      const result = await User.updateOne(
        { email: userData.email },
        {
          $set: {
            password: hashedPassword,
            fullName: userData.fullName,
            userType: userData.userType,
            username: userData.username,
            status: 'active'
          }
        },
        { upsert: true }
      );

      if (result.upsertedCount) {
        console.log(`✅ Created user: ${userData.email} (${userData.userType})`);
      } else {
        console.log(`🔄 Updated user: ${userData.email} (${userData.userType})`);
      }
    }

    console.log('\n📊 Final user list:');
    const allUsers = await User.find({}).select('email userType fullName status');
    allUsers.forEach(user => {
      console.log(`  - ${user.email} | ${user.userType} | ${user.fullName} | ${user.status}`);
    });

    console.log('\n✅ Password fix completed!');
    console.log('All users now have password: password123');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

fixUserPasswords();