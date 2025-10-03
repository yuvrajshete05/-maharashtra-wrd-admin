// Debug localStorage data to check workflow stages
console.log('=== Checking Workflow Data ===');

const apps = JSON.parse(localStorage.getItem('nominee_applications') || '[]');
console.log('Total applications in localStorage:', apps.length);

apps.forEach((app, index) => {
  console.log(`\n${index + 1}. ${app.wuaName || app.id}`);
  console.log('  workflowStage:', app.workflowStage);
  console.log('  circleStatus:', app.circleStatus);
  console.log('  corporationStatus:', app.corporationStatus);
  console.log('  stateStatus:', app.stateStatus);
  console.log('  status:', app.status);
});

// Check specifically for circle-approved applications
const circleApproved = apps.filter(app => app.workflowStage === 'circle-approved');
console.log('\n=== Circle Approved Applications ===');
console.log('Count:', circleApproved.length);
circleApproved.forEach(app => {
  console.log(`- ${app.wuaName || app.id}: corporationStatus = ${app.corporationStatus}`);
});

// If no circle-approved, check what stages exist
const stages = [...new Set(apps.map(app => app.workflowStage))];
console.log('\n=== All Workflow Stages ===');
console.log('Existing stages:', stages);