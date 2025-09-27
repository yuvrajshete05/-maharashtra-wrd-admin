// localStorage Troubleshooting Guide
// Maharashtra WRD Admin System

console.log('🔧 LOCALSTORAGE TROUBLESHOOTING');
console.log('='.repeat(40));

// Check 1: Is localStorage supported?
if (typeof(Storage) !== "undefined") {
    console.log('✅ localStorage is supported');
} else {
    console.log('❌ localStorage is NOT supported in this browser');
    console.log('💡 Please use a modern browser');
}

// Check 2: Can we write to localStorage?
try {
    localStorage.setItem('test', 'value');
    localStorage.removeItem('test');
    console.log('✅ localStorage write access works');
} catch (e) {
    console.log('❌ localStorage write access failed:', e.message);
    console.log('💡 Check if browser is in private/incognito mode');
}

// Check 3: Current localStorage status
console.log('📊 Current localStorage status:');
console.log('   Items stored:', localStorage.length);
console.log('   Storage quota used: ~' + 
    Math.round(JSON.stringify(localStorage).length / 1024) + ' KB');

// Check 4: Common issues and solutions
console.log('');
console.log('🚨 Common Issues:');
console.log('1. "No data found" → Login first');
console.log('2. "Storage not supported" → Use Chrome/Firefox/Edge');
console.log('3. "Write access failed" → Exit incognito mode');
console.log('4. "Data disappeared" → Browser cleared cache');

// Check 5: Manual commands
console.log('');
console.log('🎮 Manual Commands:');
console.log('localStorage.getItem("adminToken")    // Get token');
console.log('localStorage.getItem("adminData")     // Get user data'); 
console.log('localStorage.clear()                  // Clear all data');
console.log('localStorage.setItem("key", "value")  // Set data');
console.log('localStorage.removeItem("key")        // Remove data');

console.log('');
console.log('✨ Ready to check your localStorage!');