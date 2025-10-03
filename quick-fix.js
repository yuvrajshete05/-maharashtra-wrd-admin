// Quick localStorage fix for marks display
const apps = JSON.parse(localStorage.getItem('applications') || '[]');
console.log('Before fix:', apps);

// Add sample marks data to all applications for testing
apps.forEach(app => {
  if (!app.marks && !app.feedback) {
    app.marks = "85/100 - Excellent performance in water management";
  }
  if (!app.userType) {
    app.userType = 'nominee';
  }
});

localStorage.setItem('applications', JSON.stringify(apps));
console.log('Fixed! Refresh the page.');
console.log('After fix:', JSON.parse(localStorage.getItem('applications')));