// Fix workflow data for Corporation Committee visibility
console.log('=== Fixing Workflow Data ===');

let apps = JSON.parse(localStorage.getItem('nominee_applications') || '[]');
console.log('Current applications:', apps.length);

// If no applications exist, create a test one for Corporation Committee
if (apps.length === 0) {
  const testApp = {
    id: 'TEST001',
    wuaName: 'Test WUA for Corporation',
    district: 'Pune',
    status: 'Circle Approved',
    submissionDate: '03 Oct 2025',
    category: 'MINOR',
    marks: 'Excellent work - 95/100 marks',
    feedback: 'Excellent work - 95/100 marks', // For backward compatibility
    submittedBy: 'Test User',
    userType: 'nominee',
    workflowStage: 'circle-approved',
    circleStatus: 'approved',
    corporationStatus: 'pending',
    stateStatus: 'pending',
    finalStatus: 'pending',
    circleRemarks: 'Approved by Circle Committee with excellent performance',
    corporationRemarks: '',
    stateRemarks: '',
    circleActionDate: '03/10/2025',
    corporationActionDate: null,
    stateActionDate: null
  };
  
  apps.push(testApp);
  console.log('✅ Created test application for Corporation Committee');
} else {
  // Fix existing applications that were approved by Circle Committee
  apps = apps.map(app => {
    console.log(`Checking app: ${app.wuaName || app.id}`);
    console.log(`  Current workflowStage: ${app.workflowStage}`);
    console.log(`  Current circleStatus: ${app.circleStatus}`);
    console.log(`  Current corporationStatus: ${app.corporationStatus}`);
    
    // If an application has circleStatus: 'approved' but wrong workflow setup
    if (app.circleStatus === 'approved') {
      console.log(`  ✅ Fixing ${app.wuaName || app.id} for Corporation Committee`);
      app.workflowStage = 'circle-approved';
      app.corporationStatus = 'pending';
      app.status = 'Circle Approved';
      
      // Ensure it has marks for display
      if (!app.marks && app.feedback) {
        app.marks = app.feedback;
      }
    }
    
    return app;
  });
  
  console.log('✅ Fixed existing applications');
}

// Save the fixed data
localStorage.setItem('nominee_applications', JSON.stringify(apps));

// Show what Corporation Committee should see
const circleApproved = apps.filter(app => app.workflowStage === 'circle-approved');
console.log('\n=== Applications for Corporation Committee ===');
console.log('Total circle-approved applications:', circleApproved.length);

circleApproved.forEach(app => {
  console.log(`\n📋 ${app.wuaName || app.id}`);
  console.log(`   workflowStage: ${app.workflowStage}`);
  console.log(`   corporationStatus: ${app.corporationStatus}`);
  console.log(`   circleRemarks: ${app.circleRemarks}`);
});

console.log('\n🎯 NEXT STEPS:');
console.log('1. Refresh Corporation Committee dashboard (F5)');
console.log('2. Click "View Circle Recommended Forms"');
console.log('3. You should now see the approved applications!');

console.log('\n✅ Data fixed! Corporation Committee should now see applications.');