// Quick localStorage Check Commands
// Copy and paste these one by one in browser console

// 1. Check if user is logged in
console.log('Admin Token:', localStorage.getItem('adminToken'));

// 2. Check user details  
console.log('User Data:', JSON.parse(localStorage.getItem('adminData') || '{}'));

// 3. Check all localStorage items
console.log('All localStorage items:');
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  console.log(`${key}:`, localStorage.getItem(key));
}

// 4. Check storage size
console.log('Total items in localStorage:', localStorage.length);

// 5. Pretty print user data
const userData = localStorage.getItem('adminData');
if (userData) {
  console.table(JSON.parse(userData));
} else {
  console.log('No user data found - please login first');
}