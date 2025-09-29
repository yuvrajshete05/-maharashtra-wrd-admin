// Quick Testing Data Generator for Maharashtra WRD Admin System
// Use this in browser console or save for reference

const SAMPLE_TEST_DATA = {
  // USER REGISTRATION DATA
  userRegistration: {
    email: "testuser@wua.maharashtra.gov.in",
    password: "Test@123456",
    confirmPassword: "Test@123456", 
    fullName: "राम कृष्ण पाटील (Ram Krishna Patil)",
    mobile: "9876543210"
  },

  // ADMIN LOGIN DATA  
  adminLogin: {
    username: "admin",
    password: "admin123"
  },

  // WUA NOMINATION FORM DATA
  nominationForm: {
    // Basic WUA Information
    wuaNameEnglish: "Sahyadri Water Users Association",
    wuaNameMarathi: "सह्याद्री पाणी वापरकर्ता संघटना",
    registrationNumber: "MH/WUA/2020/001234",
    registrationDate: "15/03/2020",

    // Location Details
    district: "पुणे (Pune)",
    taluka: "मावळ (Maval)",
    village: "लोणावला (Lonavala)",
    pinCode: "410401",

    // Project Details
    irrigationProject: "कुडळी सिंचन प्रकल्प (Kudali Irrigation Project)",
    canalName: "मुख्य कालवा क्रमांक ३ (Main Canal No. 3)",
    commandArea: "2500",
    designCapacity: "450",

    // Water & Irrigation
    waterSource: "कृष्णा नदी (Krishna River)",
    irrigationType: "गुरुत्वाकर्षण (Gravity Flow)",
    croppingPattern: "भात, गहू, ऊस (Rice, Wheat, Sugarcane)",

    // Leadership
    presidentName: "श्री. सुरेश महादेव शिंदे (Shri Suresh Mahadev Shinde)",
    presidentMobile: "9876543210",
    secretaryName: "श्रीमती. सुनिता राम कदम (Smt. Sunita Ram Kadam)",
    secretaryMobile: "9876543211",
    officeAddress: "कार्यालय, सह्याद्री WUA, मुख्य रस्ता, लोणावला - 410401",

    // Membership
    totalMembers: "850",
    maleMembers: "520", 
    femaleMembers: "330",
    marginalFarmers: "450",
    smallFarmers: "280",
    mediumFarmers: "100",
    largeFarmers: "20",

    // Financial
    annualBudget: "4500000",
    waterTaxCollection: "85",
    maintenanceFund: "1200000"
  },

  // SELF-ASSESSMENT OPTIMAL RESPONSES (150 marks total)
  selfAssessment: {
    // Module 1: Institutional & Governance (30 marks)
    module1: {
      inst_gov_1: 5, // WUA registration status
      inst_gov_2: 8, // Meeting frequency  
      inst_gov_3: 5, // Board elections
      inst_gov_4: 4, // Record maintenance
      inst_gov_5: 3, // Transparency
      inst_gov_6: 5  // Conflict resolution
    },
    
    // Module 2: Financial Management (40 marks)
    module2: {
      fin_mgmt_1: 8,  // Budget preparation
      fin_mgmt_2: 10, // Tax collection efficiency
      fin_mgmt_3: 8,  // Financial audit
      fin_mgmt_4: 6,  // Bank account management
      fin_mgmt_5: 8   // Financial transparency
    },

    // Module 3: Water Management & Operation (50 marks)
    module3: {
      water_mgmt_1: 12, // Water distribution
      water_mgmt_2: 10, // Infrastructure maintenance  
      water_mgmt_3: 8,  // Water use efficiency
      water_mgmt_4: 10, // Crop water planning
      water_mgmt_5: 10  // Emergency management
    },

    // Module 4: Farmer Participation (25 marks)
    module4: {
      farmer_part_1: 8, // Meeting participation
      farmer_part_2: 6, // Women's participation
      farmer_part_3: 5, // Training programs
      farmer_part_4: 6  // Grievance handling
    },

    // Module 5: Other Performance (20 marks)
    module5: {
      other_perf_1: 5, // Environmental conservation
      other_perf_2: 5, // Innovation adoption
      other_perf_3: 5, // Inter-WUA cooperation
      other_perf_4: 5  // Government schemes
    }
  },

  // CORPORATION COMMITTEE RESPONSES (30 marks)
  corporationEvaluation: {
    strategic_planning: 6,    // Strategic Planning & Vision
    water_efficiency: 6,      // Water Use Efficiency  
    financial_sustainability: 6, // Financial Sustainability
    community_impact: 6,      // Community Impact & Participation
    compliance_governance: 6   // Compliance & Governance
  },

  // STATE COMMITTEE RESPONSES (20 marks)
  stateCommittee: {
    overall_performance: 4,   // Overall WUA performance
    innovation_practices: 4,  // Innovation and best practices
    sustainability: 4,        // Sustainability and replicability
    agricultural_impact: 4,   // Impact on agricultural productivity
    future_potential: 4       // Future potential and scalability
  }
};

// TESTING HELPER FUNCTIONS
const TestingHelpers = {
  // Fill user registration form
  fillRegistrationForm() {
    const data = SAMPLE_TEST_DATA.userRegistration;
    const fields = {
      email: document.querySelector('input[type="email"]'),
      password: document.querySelector('input[type="password"]'),
      confirmPassword: document.querySelectorAll('input[type="password"]')[1],
      fullName: document.querySelector('input[name="fullName"]'),
      mobile: document.querySelector('input[name="mobile"]')
    };
    
    Object.keys(fields).forEach(key => {
      if (fields[key]) {
        fields[key].value = data[key];
        fields[key].dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    console.log("✅ Registration form filled with sample data");
  },

  // Calculate expected total score
  calculateTotalScore() {
    const selfTotal = 150; // Maximum possible
    const corpTotal = 30;  // Maximum possible  
    const stateTotal = 20; // Maximum possible
    const grandTotal = selfTotal + corpTotal + stateTotal;
    
    console.log("📊 Expected Scoring:");
    console.log(`Self-Assessment: ${selfTotal}/150 marks`);
    console.log(`Corporation: ${corpTotal}/30 marks`);
    console.log(`State Committee: ${stateTotal}/20 marks`);
    console.log(`TOTAL: ${grandTotal}/200 marks`);
    console.log(`🏆 AWARD: ${grandTotal >= 180 ? 'EXCELLENT' : 'Check calculation'}`);
    
    return grandTotal;
  },

  // Validate current page
  validateCurrentPage() {
    const url = window.location.pathname;
    const pageInfo = {
      '/welcome': 'User Registration/Login Page',
      '/admin/login': 'Admin Login Page',
      '/admin/dashboard': 'Admin Dashboard',
      '/admin/submit-application': 'Nomination Form',
      '/admin/self-assessment': 'Self-Assessment (150 marks)',
      '/admin/circle-evaluation-new': 'Circle Committee Evaluation',
      '/admin/corporation-evaluation-new': 'Corporation Committee (30 marks)',
      '/admin/state-committee-new': 'State Committee (20 marks)',
      '/admin/data-flow-test': 'Database Testing Page'
    };
    
    console.log(`📍 Current Page: ${pageInfo[url] || 'Unknown page'}`);
    console.log(`🔗 URL: ${url}`);
    return pageInfo[url];
  },

  // Quick setup test data in localStorage
  setupTestSession() {
    const adminData = {
      username: "test_admin",
      adminLevel: "super-admin", 
      name: "Test Administrator",
      loginTime: new Date().toISOString()
    };
    
    localStorage.setItem('adminToken', 'test_token_123');
    localStorage.setItem('adminData', JSON.stringify(adminData));
    localStorage.setItem('admin_active_session', JSON.stringify({
      timestamp: Date.now(),
      user: adminData
    }));
    
    console.log("✅ Test session setup complete");
    console.log("🔑 Admin session created");
    return adminData;
  }
};

// AUTO-RUN VALIDATION
console.log("🎉 Maharashtra WRD Testing Data Loaded!");
console.log("=====================================");
TestingHelpers.validateCurrentPage();
TestingHelpers.calculateTotalScore();
console.log("\n📋 Available Test Data:");
console.log("• SAMPLE_TEST_DATA.userRegistration");
console.log("• SAMPLE_TEST_DATA.nominationForm");  
console.log("• SAMPLE_TEST_DATA.selfAssessment");
console.log("• SAMPLE_TEST_DATA.corporationEvaluation");
console.log("• SAMPLE_TEST_DATA.stateCommittee");
console.log("\n🔧 Available Helper Functions:");
console.log("• TestingHelpers.fillRegistrationForm()");
console.log("• TestingHelpers.calculateTotalScore()");
console.log("• TestingHelpers.validateCurrentPage()");
console.log("• TestingHelpers.setupTestSession()");
console.log("=====================================");

// Export for use
if (typeof window !== 'undefined') {
  window.SAMPLE_TEST_DATA = SAMPLE_TEST_DATA;
  window.TestingHelpers = TestingHelpers;
}