// Navigation utilities

// Handle sidebar navigation
export function handleSidebarNavigation(event) {
  event.preventDefault();
  const navItem = event.target.closest('.nav-item, .nav-subitem');
  if (!navItem) return;
  
  const section = navItem.dataset.section;
  const currentActiveNav = document.querySelector('.nav-item.active, .nav-subitem.active');
  const currentSection = currentActiveNav ? currentActiveNav.dataset.section : null;
  
  // Check if leaving Cipta KIR section with unsaved data
  if (currentSection === 'cipta-kir' && section !== 'cipta-kir') {
    const hasUnsavedData = checkForUnsavedCiptaKIRData();
    if (hasUnsavedData) {
      // Removed confirm dialog - always allow navigation
      // Clear the draft data when leaving
      clearCiptaKIRDraft();
    }
  }
  
  // Reset Cipta KIR form when entering the section
  if (section === 'cipta-kir') {
    // Clear any existing draft data to start fresh
    clearCiptaKIRDraft();
  }
  
  // Update active nav item (handle both nav-item and nav-subitem)
  document.querySelectorAll('.nav-item, .nav-subitem').forEach(item => {
    item.classList.remove('active');
  });
  navItem.classList.add('active');
  
  // Show corresponding content section
  document.querySelectorAll('.content-section').forEach(content => {
    content.classList.remove('active');
  });
  
  const targetContent = document.getElementById(`${section}-content`);
  if (targetContent) {
    targetContent.classList.add('active');
    
    // Initialize specific sections when they are activated
    if (section === 'program-kehadiran') {
      console.log('Program & Kehadiran section activated, initializing...');
      // Import and call the initialization function
      import('../pages/admin/AdminDashboard.js')
        .then(module => {
          if (typeof module.initializeProgramKehadiran === 'function') {
            setTimeout(() => module.initializeProgramKehadiran(), 100);
          }
        })
        .catch(err => console.error('Error initializing Program & Kehadiran:', err));
    }
  }
}

// Check if there's unsaved data in Cipta KIR
function checkForUnsavedCiptaKIRData() {
  const savedData = localStorage.getItem('ciptaKIR_draft');
  if (!savedData) return false;
  
  try {
    const parsed = JSON.parse(savedData);
    // Check if there's actual form data (not just empty object)
    return parsed.data && Object.keys(parsed.data).length > 0;
  } catch (error) {
    console.error('Error checking unsaved data:', error);
    return false;
  }
}

// Clear Cipta KIR draft data
function clearCiptaKIRDraft() {
  localStorage.removeItem('ciptaKIR_draft');
  localStorage.removeItem('wizardKirId');
  
  // Clear form if it exists
  const form = document.getElementById('ciptaKIRForm');
  if (form) {
    form.reset();
    
    // Clear any dynamically added fields
    const dynamicContainers = [
      'air-rows',
      'penyakit-kronik-container',
      'ubat-tetap-container', 
      'rawatan-container',
      'pembedahan-container',
      'pendapatan-tetap-container',
      'pendapatan-tidak-tetap-container',
      'perbelanjaan-container',
      'bantuan-bulanan-container'
    ];
    
    dynamicContainers.forEach(containerId => {
      const container = document.getElementById(containerId);
      if (container) {
        // Keep only the first item (template) and remove the rest
        const items = container.querySelectorAll('.form-grid, .air-row');
        for (let i = 1; i < items.length; i++) {
          items[i].remove();
        }
        // Clear the first item's values
        if (items[0]) {
          const inputs = items[0].querySelectorAll('input, select, textarea');
          inputs.forEach(input => {
            if (input.type === 'checkbox') {
              input.checked = false;
            } else {
              input.value = '';
            }
          });
        }
      }
    });
  }
  
  console.log('Cipta KIR draft data cleared');
}

// Setup navigation event listeners
export function setupNavigationListeners(onLogout) {
  // Add logout button event listener
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', onLogout);
  }
  
  // Add sidebar navigation event listener
  const sidebarNav = document.querySelector('.sidebar-nav');
  if (sidebarNav) {
    sidebarNav.addEventListener('click', handleSidebarNavigation);
  }
  
  // Add mobile menu toggle functionality
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const sidebar = document.querySelector('.sidebar');
  
  if (mobileMenuToggle && sidebar) {
    mobileMenuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('mobile-open');
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (event) => {
      if (!sidebar.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
        sidebar.classList.remove('mobile-open');
      }
    });
    
    // Close mobile menu when navigating
    sidebar.addEventListener('click', (event) => {
      if (event.target.classList.contains('nav-item')) {
        sidebar.classList.remove('mobile-open');
      }
    });
  }
}