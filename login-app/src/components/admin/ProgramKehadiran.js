// Program & Kehadiran (New) - Main Component
import { ProgramService } from '../../services/backend/ProgramService.js';
import { ProgramManagement } from './ProgramManagement.js';
import { AttendanceTracking } from './AttendanceTracking.js';

export class ProgramKehadiran {
  constructor(containerId) {
    this.containerId = containerId;
    this.container = document.getElementById(containerId);
    this.currentView = 'overview';
    this.programManagement = null;
    this.attendanceTracking = null;
    
    this.init();
  }

  init() {
    if (!this.container) {
      console.error(`Container with ID ${this.containerId} not found`);
      return;
    }

    this.render();
    this.setupEventListeners();
  }

  render() {
    this.container.innerHTML = `
      <div class="program-kehadiran-new">
        <!-- Overview Section -->
        <div id="overview-section" class="overview-section">
          <div class="section-header">
            <h2>Program & Kehadiran (New)</h2>
            <p class="section-description">Manage programs and attendance records</p>
          </div>
          
          <div class="overview-cards">
            <div class="overview-card" data-action="program-management">
              <div class="card-icon">
                <i class="fas fa-calendar-alt"></i>
              </div>
              <div class="card-content">
                <h3>Program Management</h3>
                <p>Create and manage community programs</p>
                <div class="card-stats">
                  <span id="program-count">Loading...</span>
                </div>
              </div>
              <div class="card-action">
                <button class="btn btn-primary">Manage Programs</button>
              </div>
            </div>

            <div class="overview-card" data-action="attendance-tracking">
              <div class="card-icon">
                <i class="fas fa-users"></i>
              </div>
              <div class="card-content">
                <h3>Attendance Tracking</h3>
                <p>Track attendance for all participants</p>
                <div class="card-stats">
                  <span id="attendance-count">Loading...</span>
                </div>
              </div>
              <div class="card-action">
                <button class="btn btn-primary">View Attendance</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Program Management Section -->
        <div id="program-management-section" class="sub-section" style="display: none;">
          <div class="section-header">
            <button class="btn btn-secondary back-btn" data-back="overview">
              <i class="fas fa-arrow-left"></i> Back to Overview
            </button>
            <h2>Program Management</h2>
          </div>
          <div id="program-management-container"></div>
        </div>

        <!-- Attendance Tracking Section -->
        <div id="attendance-tracking-section" class="sub-section" style="display: none;">
          <div class="section-header">
            <button class="btn btn-secondary back-btn" data-back="overview">
              <i class="fas fa-arrow-left"></i> Back to Overview
            </button>
            <h2>Attendance Tracking</h2>
          </div>
          <div id="attendance-tracking-container"></div>
        </div>
      </div>
    `;

    this.loadOverviewStats();
    this.injectStyles();
  }

  setupEventListeners() {
    // Overview card clicks
    const overviewCards = this.container.querySelectorAll('.overview-card');
    overviewCards.forEach(card => {
      card.addEventListener('click', (e) => {
        const action = card.dataset.action;
        this.navigateToSection(action);
      });
    });

    // Back button clicks
    const backButtons = this.container.querySelectorAll('.back-btn');
    backButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const target = btn.dataset.back;
        this.navigateToSection(target);
      });
    });
  }

  async loadOverviewStats() {
    try {
      // Load program count
      const programs = await ProgramService.listProgram();
      const programCountEl = this.container.querySelector('#program-count');
      if (programCountEl) {
        programCountEl.textContent = `${programs.length} Programs`;
      }

      // Load attendance count
      const attendanceRecords = await ProgramService.listAllAttendance();
      const attendanceCountEl = this.container.querySelector('#attendance-count');
      if (attendanceCountEl) {
        attendanceCountEl.textContent = `${attendanceRecords.length} Records`;
      }
    } catch (error) {
      console.error('Error loading overview stats:', error);
      const programCountEl = this.container.querySelector('#program-count');
      const attendanceCountEl = this.container.querySelector('#attendance-count');
      if (programCountEl) programCountEl.textContent = 'Error loading';
      if (attendanceCountEl) attendanceCountEl.textContent = 'Error loading';
    }
  }

  navigateToSection(section) {
    // Hide all sections
    const sections = this.container.querySelectorAll('.overview-section, .sub-section');
    sections.forEach(s => s.style.display = 'none');

    this.currentView = section;

    switch (section) {
      case 'overview':
        this.container.querySelector('#overview-section').style.display = 'block';
        this.loadOverviewStats(); // Refresh stats
        break;
        
      case 'program-management':
        this.container.querySelector('#program-management-section').style.display = 'block';
        this.initializeProgramManagement();
        break;
        
      case 'attendance-tracking':
        this.container.querySelector('#attendance-tracking-section').style.display = 'block';
        this.initializeAttendanceTracking();
        break;
    }
  }

  initializeProgramManagement() {
    if (!this.programManagement) {
      this.programManagement = new ProgramManagement('program-management-container');
    } else {
      this.programManagement.refresh();
    }
  }

  initializeAttendanceTracking() {
    if (!this.attendanceTracking) {
      this.attendanceTracking = new AttendanceTracking('attendance-tracking-container');
    } else {
      this.attendanceTracking.refresh();
    }
  }

  injectStyles() {
    const styleId = 'program-kehadiran-new-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .program-kehadiran-new {
        padding: 20px;
        max-width: 1200px;
        margin: 0 auto;
      }

      .section-header {
        margin-bottom: 30px;
      }

      .section-header h2 {
        margin: 0 0 8px 0;
        color: #1e293b;
        font-size: 28px;
        font-weight: 600;
      }

      .section-description {
        color: #64748b;
        margin: 0;
        font-size: 16px;
      }

      .overview-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 24px;
        margin-top: 24px;
      }

      .overview-card {
        background: white;
        border-radius: 12px;
        padding: 24px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        border: 1px solid #e2e8f0;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .overview-card:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transform: translateY(-2px);
      }

      .card-icon {
        width: 48px;
        height: 48px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 20px;
      }

      .card-content h3 {
        margin: 0 0 8px 0;
        color: #1e293b;
        font-size: 20px;
        font-weight: 600;
      }

      .card-content p {
        margin: 0 0 12px 0;
        color: #64748b;
        font-size: 14px;
        line-height: 1.5;
      }

      .card-stats {
        font-size: 14px;
        color: #3b82f6;
        font-weight: 500;
      }

      .card-action {
        margin-top: auto;
      }

      .btn {
        padding: 10px 20px;
        border: none;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 8px;
      }

      .btn-primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
      }

      .btn-primary:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
      }

      .btn-secondary {
        background: #f8fafc;
        color: #64748b;
        border: 1px solid #e2e8f0;
      }

      .btn-secondary:hover {
        background: #f1f5f9;
        color: #475569;
      }

      .back-btn {
        margin-bottom: 16px;
      }

      .sub-section {
        animation: fadeIn 0.3s ease;
      }

      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      @media (max-width: 768px) {
        .overview-cards {
          grid-template-columns: 1fr;
        }
        
        .program-kehadiran-new {
          padding: 16px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Public method to refresh the component
  refresh() {
    if (this.currentView === 'overview') {
      this.loadOverviewStats();
    } else if (this.currentView === 'program-management' && this.programManagement) {
      this.programManagement.refresh();
    } else if (this.currentView === 'attendance-tracking' && this.attendanceTracking) {
      this.attendanceTracking.refresh();
    }
  }

  // Public method to destroy the component
  destroy() {
    if (this.programManagement) {
      this.programManagement.destroy();
    }
    if (this.attendanceTracking) {
      this.attendanceTracking.destroy();
    }
    
    const styleEl = document.getElementById('program-kehadiran-new-styles');
    if (styleEl) {
      styleEl.remove();
    }
  }
}