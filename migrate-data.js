// Migration script to fix existing applications
console.log('=== Application Data Migration ===');

// Get existing applications
let applications = JSON.parse(localStorage.getItem('applications') || '[]');
console.log('Found', applications.length, 'applications');

// Fix each application
applications = applications.map((app, index) => {
  console.log(`Fixing application ${index + 1}: ${app.wuaName}`);
  
  // If it's a nominee application and has feedback but no marks
  if (app.userType === 'nominee' && app.feedback && !app.marks) {
    console.log('  Converting feedback to marks');
    app.marks = app.feedback;
    // Keep feedback for backward compatibility
  }
  
  // Ensure userType is set for all applications
  if (!app.userType) {
    app.userType = 'nominee'; // Default to nominee
    console.log('  Set userType to nominee');
  }
  
  return app;
});

// Save updated applications
localStorage.setItem('applications', JSON.stringify(applications));
console.log('Migration completed!');

// Display results
console.log('\n=== Updated Applications ===');
applications.forEach((app, index) => {
  console.log(`${index + 1}. ${app.wuaName}`);
  console.log(`   UserType: ${app.userType}`);
  console.log(`   Has marks: ${!!app.marks}`);
  console.log(`   Has feedback: ${!!app.feedback}`);
  if (app.marks) console.log(`   Marks: ${app.marks.substring(0, 50)}...`);
});

console.log('\nPlease refresh the page to see the changes!');