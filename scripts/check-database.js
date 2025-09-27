// Quick database checker script
// Run with: node scripts/check-database.js

const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb://localhost:27017/maharashtra_wrd_admin';

async function checkDatabase() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('🔗 Connected to MongoDB');
    
    const db = client.db('maharashtra_wrd_admin');
    
    // Check collections
    const collections = await db.listCollections().toArray();
    console.log('\n📚 Collections found:');
    collections.forEach(col => console.log(`  - ${col.name}`));
    
    // Check nomination forms with detailed applicant info
    const nominations = await db.collection('nominationforms').find().toArray();
    console.log(`\n📝 Nomination Forms: ${nominations.length} found`);
    nominations.forEach((nom, index) => {
      const applicantInfo = nom.applicantInfo || {};
      console.log(`\n  ${index + 1}. Application: ${nom.applicationNumber}`);
      console.log(`     Category: ${nom.category} | Status: ${nom.status}`);
      console.log(`     👤 Applicant Name: "${applicantInfo.applicantName || 'Not provided'}"`);
      console.log(`     📱 Mobile Number: "${applicantInfo.mobileNumber || 'Not provided'}"`);
      console.log(`     📅 Created: ${new Date(nom.createdAt).toLocaleDateString()}`);
    });
    
    // Check WUA organizations
    const wuas = await db.collection('wuaorganizations').find().toArray();
    console.log(`\n🏢 WUA Organizations: ${wuas.length} found`);
    wuas.forEach(wua => {
      console.log(`  - ${wua.name} (${wua.registrationNumber})`);
    });
    
    // Check users
    const users = await db.collection('users').find().toArray();
    console.log(`\n👥 Users: ${users.length} found`);
    users.forEach(user => {
      console.log(`  - ${user.name} (${user.userType}) - ${user.email}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

checkDatabase();