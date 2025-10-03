// Check localStorage applications data
console.log('=== Checking localStorage data ===')

const applications = JSON.parse(localStorage.getItem('applications') || '[]')
console.log('Total applications:', applications.length)

applications.forEach((app, index) => {
  console.log(`Application ${index + 1}:`)
  console.log('  Name:', app.wuaName)
  console.log('  UserType:', app.userType)
  console.log('  Has marks:', !!app.marks)
  console.log('  Has feedback:', !!app.feedback)
  console.log('  Marks value:', app.marks)
  console.log('  Feedback value:', app.feedback)
  console.log('  ---')
})

// Clear localStorage if needed (uncomment to clear)
// localStorage.removeItem('applications')
// console.log('Applications cleared from localStorage')