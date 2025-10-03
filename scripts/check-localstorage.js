// Check localStorage data after login
// Run this in browser console after login to see stored data

console.log('=== LOCAL STORAGE DATA AFTER LOGIN ===');

// Check for admin token
const adminToken = localStorage.getItem('adminToken');
if (adminToken) {
  console.log('✅ Admin Token Found:', adminToken);
} else {
  console.log('❌ Admin Token: Not found');
}

// Check for admin data
const adminData = localStorage.getItem('adminData');
if (adminData) {
  console.log('✅ Admin Data Found:');
  try {
    const parsedData = JSON.parse(adminData);
    console.log('  - Username:', parsedData.username);
    console.log('  - Name:', parsedData.name);
    console.log('  - User Type:', parsedData.userType);
    console.log('  - Admin Level:', parsedData.adminLevel);
    console.log('  - Login Time:', parsedData.loginTime);
    console.log('  - Full Object:', parsedData);
  } catch (error) {
    console.log('❌ Error parsing admin data:', error);
  }
} else {
  console.log('❌ Admin Data: Not found');
}

// Check for old login token (if any)
const loginToken = localStorage.getItem('loginToken');
if (loginToken) {
  console.log('⚠️ Old Login Token Found:', loginToken);
} else {
  console.log('✅ Old Login Token: Not found (good)');
}

// Check for old login data (if any)
const loginData = localStorage.getItem('loginData');
if (loginData) {
  console.log('⚠️ Old Login Data Found:', loginData);
} else {
  console.log('✅ Old Login Data: Not found (good)');
}

console.log('=== END STORAGE CHECK ===');