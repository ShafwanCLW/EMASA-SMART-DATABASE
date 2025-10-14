// Attendance Tracking Component
import { ProgramService } from '../../services/backend/ProgramService.js';

export class AttendanceTracking {
  constructor(containerId) {
    this.containerId = containerId;
    this.container = document.getElementById(containerId);
    this.attendanceRecords = [];
    this.filteredRecords = [];
    this.programs = [];
    this.currentFilters = {
      programId: '',
      date: '',
      present: '',
      search: ''
    };
    
    this.init();
  }

  init() {
    if (!this.container) {
      console.error(`Container with ID ${this.containerId} not found`);
      return;
    }

    this.render();
    this.setupEventListeners();
    this.loadData();
  }

  render() {
    this.container.innerHTML = `
      <div class="attendance-tracking">
        <!-- Filter Section -->
        <div class="filter-section">
          <div class="filter-row">
            <div class="filter-group">
              <label for="program-filter">Program:</label>
              <select id="program-filter">
                <option value="">All Programs</option>
              </select>
            </div>
            <div class="filter-group">
              <label for="date-filter">Date:</label>
              <input type="date" id="date-filter" />
            </div>
            <div class="filter-group">
              <label for="present-filter">Attendance:</label>
              <select id="present-filter">
                <option value="">All</option>
                <option value="true">Present</option>
                <option value="false">Absent</option>
              </select>
            </div>
            <div class="filter-group">
              <label for="search-filter">Search:</label>
              <div class="search-box">
                <i class="fas fa-search"></i>
                <input type="text" id="search-filter" placeholder="Search participants..." />
              </div>
            </div>
          </div>
          <div class="filter-actions">
            <button class="btn btn-secondary" id="reset-filters-btn">
              <i class="fas fa-undo"></i> Reset Filters
            </button>
            <button class="btn btn-primary" id="apply-filters-btn">
              <i class="fas fa-filter"></i> Apply Filters
            </button>
            <button class="btn btn-secondary" id="refresh-btn">
              <i class="fas fa-sync-alt"></i> Refresh
            </button>
          </div>
        </div>

        <!-- Summary Cards -->
        <div class="summary-cards">
          <div class="summary-card">
            <div class="card-icon present">
              <i class="fas fa-check-circle"></i>
            </div>
            <div class="card-content">
              <h3 id="present-count">0</h3>
              <p>Present</p>
            </div>
          </div>
          <div class="summary-card">
            <div class="card-icon absent">
              <i class="fas fa-times-circle"></i>
            </div>
            <div class="card-content">
              <h3 id="absent-count">0</h3>
              <p>Absent</p>
            </div>
          </div>
          <div class="summary-card">
            <div class="card-icon total">
              <i class="fas fa-users"></i>
            </div>
            <div class="card-content">
              <h3 id="total-count">0</h3>
              <p>Total Records</p>
            </div>
          </div>
        </div>

        <!-- Attendance Table -->
        <div class="table-container">
          <div class="loading-state" id="loading-state">
            <i class="fas fa-spinner fa-spin"></i>
            <span>Loading attendance records...</span>
          </div>
          
          <table class="attendance-table" id="attendance-table" style="display: none;">
            <thead>
              <tr>
                <th>Name</th>
                <th>ID</th>
                <th>Type</th>
                <th>Program</th>
                <th>Date</th>
                <th>Present</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="attendance-tbody">
            </tbody>
          </table>

          <div class="empty-state" id="empty-state" style="display: none;">
            <i class="fas fa-clipboard-list"></i>
            <h3>No Attendance Records Found</h3>
            <p>No attendance records match your current filters. Try adjusting your search criteria.</p>
          </div>
        </div>

        <!-- Edit Notes Modal -->
        <div class="modal" id="notes-modal" style="display: none;">
          <div class="modal-content">
            <div class="modal-header">
              <h3>Edit Notes</h3>
              <button class="close-btn" id="close-notes-modal-btn">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label for="participant-name">Participant:</label>
                <input type="text" id="participant-name" readonly />
              </div>
              <div class="form-group">
                <label for="attendance-notes">Notes:</label>
                <textarea id="attendance-notes" rows="4" placeholder="Enter notes about this attendance record..."></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" id="cancel-notes-btn">Cancel</button>
              <button class="btn btn-primary" id="save-notes-btn">
                <span id="save-notes-text">Save Notes</span>
                <i class="fas fa-spinner fa-spin" id="save-notes-spinner" style="display: none;"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    this.injectStyles();
  }

  setupEventListeners() {
    // Filter controls
    const applyFiltersBtn = this.container.querySelector('#apply-filters-btn');
    applyFiltersBtn.addEventListener('click', () => {
      this.applyFilters();
    });

    const resetFiltersBtn = this.container.querySelector('#reset-filters-btn');
    resetFiltersBtn.addEventListener('click', () => {
      this.resetFilters();
    });

    const refreshBtn = this.container.querySelector('#refresh-btn');
    refreshBtn.addEventListener('click', () => {
      this.loadData();
    });

    // Search input with debounce
    const searchInput = this.container.querySelector('#search-filter');
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        this.currentFilters.search = e.target.value;
        this.applyFilters();
      }, 300);
    });

    // Notes modal events
    const closeNotesModalBtn = this.container.querySelector('#close-notes-modal-btn');
    const cancelNotesBtn = this.container.querySelector('#cancel-notes-btn');
    [closeNotesModalBtn, cancelNotesBtn].forEach(btn => {
      btn.addEventListener('click', () => {
        this.hideNotesModal();
      });
    });

    const saveNotesBtn = this.container.querySelector('#save-notes-btn');
    saveNotesBtn.addEventListener('click', () => {
      this.saveNotes();
    });

    // Modal backdrop click
    const notesModal = this.container.querySelector('#notes-modal');
    notesModal.addEventListener('click', (e) => {
      if (e.target === notesModal) {
        this.hideNotesModal();
      }
    });
  }

  async loadData() {
    try {
      this.showLoading();
      
      // Load programs for filter dropdown
      this.programs = await ProgramService.listProgram();
      this.populateProgramFilter();
      
      // Load attendance records
      this.attendanceRecords = await ProgramService.listAllAttendance();
      
      this.applyFilters();
      this.hideLoading();
    } catch (error) {
      console.error('Error loading attendance data:', error);
      this.showError('Failed to load attendance data: ' + error.message);
      this.hideLoading();
    }
  }

  populateProgramFilter() {
    const programFilter = this.container.querySelector('#program-filter');
    const currentValue = programFilter.value;
    
    programFilter.innerHTML = '<option value="">All Programs</option>';
    
    this.programs.forEach(program => {
      const option = document.createElement('option');
      option.value = program.id;
      option.textContent = program.nama_program || 'Untitled Program';
      programFilter.appendChild(option);
    });
    
    // Restore previous selection
    programFilter.value = currentValue;
  }

  applyFilters() {
    // Get current filter values
    this.currentFilters.programId = this.container.querySelector('#program-filter').value;
    this.currentFilters.date = this.container.querySelector('#date-filter').value;
    this.currentFilters.present = this.container.querySelector('#present-filter').value;
    // search is already updated via input event

    let filtered = [...this.attendanceRecords];

    // Apply program filter
    if (this.currentFilters.programId) {
      filtered = filtered.filter(record => record.program_id === this.currentFilters.programId);
    }

    // Apply date filter
    if (this.currentFilters.date) {
      const filterDate = new Date(this.currentFilters.date).toDateString();
      filtered = filtered.filter(record => {
        const recordDate = new Date(record.tarikh || record.date).toDateString();
        return recordDate === filterDate;
      });
    }

    // Apply present filter
    if (this.currentFilters.present !== '') {
      const isPresent = this.currentFilters.present === 'true';
      filtered = filtered.filter(record => record.hadir === isPresent || record.present === isPresent);
    }

    // Apply search filter
    if (this.currentFilters.search) {
      const searchTerm = this.currentFilters.search.toLowerCase();
      filtered = filtered.filter(record => 
        record.nama?.toLowerCase().includes(searchTerm) ||
        record.name?.toLowerCase().includes(searchTerm) ||
        record.kir_id?.toLowerCase().includes(searchTerm) ||
        record.participant_id?.toLowerCase().includes(searchTerm) ||
        record.catatan?.toLowerCase().includes(searchTerm) ||
        record.notes?.toLowerCase().includes(searchTerm)
      );
    }

    this.filteredRecords = filtered;
    this.renderAttendanceTable();
    this.updateSummaryCards();
  }

  resetFilters() {
    this.container.querySelector('#program-filter').value = '';
    this.container.querySelector('#date-filter').value = '';
    this.container.querySelector('#present-filter').value = '';
    this.container.querySelector('#search-filter').value = '';
    
    this.currentFilters = {
      programId: '',
      date: '',
      present: '',
      search: ''
    };
    
    this.applyFilters();
  }

  renderAttendanceTable() {
    const tbody = this.container.querySelector('#attendance-tbody');
    const table = this.container.querySelector('#attendance-table');
    const emptyState = this.container.querySelector('#empty-state');

    if (this.filteredRecords.length === 0) {
      table.style.display = 'none';
      emptyState.style.display = 'block';
      return;
    }

    table.style.display = 'table';
    emptyState.style.display = 'none';

    tbody.innerHTML = this.filteredRecords.map(record => {
      const program = this.programs.find(p => p.id === record.program_id);
      const isPresent = record.hadir || record.present;
      
      return `
        <tr>
          <td>
            <div class="participant-name">
              <strong>${this.escapeHtml(record.nama || record.name || 'Unknown')}</strong>
            </div>
          </td>
          <td>
            <span class="participant-id">${this.escapeHtml(record.kir_id || record.participant_id || 'N/A')}</span>
          </td>
          <td>
            <span class="participant-type">${this.escapeHtml(record.jenis || record.type || 'N/A')}</span>
          </td>
          <td>
            <div class="program-name">
              ${this.escapeHtml(program?.nama_program || 'Unknown Program')}
            </div>
          </td>
          <td>${this.formatDate(record.tarikh || record.date)}</td>
          <td>
            <div class="attendance-status">
              <button class="status-toggle ${isPresent ? 'present' : 'absent'}" 
                      onclick="attendanceTracking.toggleAttendance('${record.id}', ${!isPresent})">
                <i class="fas fa-${isPresent ? 'check' : 'times'}"></i>
                ${isPresent ? 'Present' : 'Absent'}
              </button>
            </div>
          </td>
          <td>
            <div class="notes-preview">
              ${this.truncateText(record.catatan || record.notes || '', 30)}
            </div>
          </td>
          <td>
            <div class="action-buttons">
              <button class="btn btn-sm btn-secondary" onclick="attendanceTracking.editNotes('${record.id}')">
                <i class="fas fa-edit"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // Store reference for global access
    window.attendanceTracking = this;
  }

  updateSummaryCards() {
    const presentCount = this.filteredRecords.filter(r => r.hadir || r.present).length;
    const absentCount = this.filteredRecords.filter(r => !(r.hadir || r.present)).length;
    const totalCount = this.filteredRecords.length;

    this.container.querySelector('#present-count').textContent = presentCount;
    this.container.querySelector('#absent-count').textContent = absentCount;
    this.container.querySelector('#total-count').textContent = totalCount;
  }

  async toggleAttendance(recordId, newStatus) {
    try {
      await ProgramService.updateAttendanceStatus(recordId, newStatus);
      
      // Update local data
      const record = this.attendanceRecords.find(r => r.id === recordId);
      if (record) {
        record.hadir = newStatus;
        record.present = newStatus;
      }
      
      this.applyFilters(); // Re-render table
      this.showNotification(`Attendance updated successfully!`, 'success');
    } catch (error) {
      console.error('Error updating attendance:', error);
      this.showNotification('Failed to update attendance: ' + error.message, 'error');
    }
  }

  async editNotes(recordId) {
    try {
      const record = await ProgramService.getAttendanceById(recordId);
      this.showNotesModal(record);
    } catch (error) {
      console.error('Error loading attendance record:', error);
      this.showNotification('Failed to load attendance record', 'error');
    }
  }

  showNotesModal(record) {
    const modal = this.container.querySelector('#notes-modal');
    const participantName = this.container.querySelector('#participant-name');
    const attendanceNotes = this.container.querySelector('#attendance-notes');

    this.currentEditingRecord = record;

    participantName.value = record.nama || record.name || 'Unknown';
    attendanceNotes.value = record.catatan || record.notes || '';

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    attendanceNotes.focus();
  }

  hideNotesModal() {
    const modal = this.container.querySelector('#notes-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    this.currentEditingRecord = null;
  }

  async saveNotes() {
    if (!this.currentEditingRecord) return;

    const saveBtn = this.container.querySelector('#save-notes-btn');
    const saveText = this.container.querySelector('#save-notes-text');
    const saveSpinner = this.container.querySelector('#save-notes-spinner');
    const notesValue = this.container.querySelector('#attendance-notes').value;

    try {
      // Show loading state
      saveBtn.disabled = true;
      saveText.style.display = 'none';
      saveSpinner.style.display = 'inline-block';

      await ProgramService.updateAttendanceNotes(this.currentEditingRecord.id, notesValue);
      
      // Update local data
      const record = this.attendanceRecords.find(r => r.id === this.currentEditingRecord.id);
      if (record) {
        record.catatan = notesValue;
        record.notes = notesValue;
      }
      
      this.hideNotesModal();
      this.applyFilters(); // Re-render table
      this.showNotification('Notes updated successfully!', 'success');

    } catch (error) {
      console.error('Error updating notes:', error);
      this.showNotification('Failed to update notes: ' + error.message, 'error');
    } finally {
      // Reset button state
      saveBtn.disabled = false;
      saveText.style.display = 'inline';
      saveSpinner.style.display = 'none';
    }
  }

  showLoading() {
    this.container.querySelector('#loading-state').style.display = 'flex';
    this.container.querySelector('#attendance-table').style.display = 'none';
    this.container.querySelector('#empty-state').style.display = 'none';
  }

  hideLoading() {
    this.container.querySelector('#loading-state').style.display = 'none';
  }

  showError(message) {
    this.showNotification(message, 'error');
  }

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
      <span>${message}</span>
    `;

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 5000);
  }

  formatDate(dateString) {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-MY');
    } catch {
      return dateString;
    }
  }

  truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return this.escapeHtml(text);
    return this.escapeHtml(text.substring(0, maxLength)) + '...';
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  injectStyles() {
    const styleId = 'attendance-tracking-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .attendance-tracking {
        padding: 20px 0;
      }

      .filter-section {
        background: white;
        border-radius: 12px;
        padding: 24px;
        margin-bottom: 24px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .filter-row {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin-bottom: 20px;
      }

      .filter-group {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .filter-group label {
        font-weight: 500;
        color: #374151;
        font-size: 14px;
      }

      .filter-group input,
      .filter-group select {
        padding: 10px 12px;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        font-size: 14px;
      }

      .filter-group input:focus,
      .filter-group select:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }

      .search-box {
        position: relative;
      }

      .search-box i {
        position: absolute;
        left: 12px;
        top: 50%;
        transform: translateY(-50%);
        color: #64748b;
      }

      .search-box input {
        padding-left: 40px;
      }

      .filter-actions {
        display: flex;
        gap: 12px;
        justify-content: flex-end;
        flex-wrap: wrap;
      }

      .summary-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin-bottom: 24px;
      }

      .summary-card {
        background: white;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .card-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        color: white;
      }

      .card-icon.present {
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      }

      .card-icon.absent {
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      }

      .card-icon.total {
        background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      }

      .card-content h3 {
        margin: 0 0 4px 0;
        font-size: 24px;
        font-weight: 600;
        color: #1e293b;
      }

      .card-content p {
        margin: 0;
        color: #64748b;
        font-size: 14px;
      }

      .table-container {
        background: white;
        border-radius: 12px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }

      .attendance-table {
        width: 100%;
        border-collapse: collapse;
      }

      .attendance-table th,
      .attendance-table td {
        padding: 16px;
        text-align: left;
        border-bottom: 1px solid #f1f5f9;
      }

      .attendance-table th {
        background: #f8fafc;
        font-weight: 600;
        color: #374151;
        font-size: 14px;
      }

      .attendance-table td {
        font-size: 14px;
        color: #374151;
      }

      .attendance-table tr:hover {
        background: #f8fafc;
      }

      .participant-name strong {
        color: #1e293b;
      }

      .participant-id {
        color: #64748b;
        font-family: monospace;
        font-size: 13px;
      }

      .participant-type {
        color: #64748b;
        text-transform: capitalize;
      }

      .program-name {
        max-width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .status-toggle {
        padding: 6px 12px;
        border: none;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 6px;
        transition: all 0.2s ease;
      }

      .status-toggle.present {
        background: #dcfce7;
        color: #166534;
      }

      .status-toggle.present:hover {
        background: #bbf7d0;
      }

      .status-toggle.absent {
        background: #fee2e2;
        color: #dc2626;
      }

      .status-toggle.absent:hover {
        background: #fecaca;
      }

      .notes-preview {
        max-width: 120px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #64748b;
        font-size: 13px;
      }

      .loading-state,
      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 60px 20px;
        color: #64748b;
      }

      .loading-state i,
      .empty-state i {
        font-size: 48px;
        margin-bottom: 16px;
        color: #cbd5e1;
      }

      .empty-state h3 {
        margin: 0 0 8px 0;
        color: #374151;
      }

      .empty-state p {
        margin: 0;
        text-align: center;
        max-width: 400px;
      }

      /* Modal Styles */
      .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
      }

      .modal-content {
        background: white;
        border-radius: 12px;
        width: 90%;
        max-width: 500px;
        max-height: 90vh;
        overflow-y: auto;
      }

      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 24px 24px 0 24px;
        margin-bottom: 24px;
      }

      .modal-header h3 {
        margin: 0;
        color: #1e293b;
        font-size: 20px;
        font-weight: 600;
      }

      .close-btn {
        background: none;
        border: none;
        font-size: 20px;
        color: #64748b;
        cursor: pointer;
        padding: 4px;
      }

      .close-btn:hover {
        color: #374151;
      }

      .modal-body {
        padding: 0 24px;
      }

      .modal-footer {
        padding: 24px;
        border-top: 1px solid #f1f5f9;
        display: flex;
        justify-content: flex-end;
        gap: 12px;
      }

      .form-group {
        margin-bottom: 20px;
      }

      .form-group label {
        display: block;
        margin-bottom: 6px;
        font-weight: 500;
        color: #374151;
        font-size: 14px;
      }

      .form-group input,
      .form-group textarea {
        width: 100%;
        padding: 10px 12px;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        font-size: 14px;
        box-sizing: border-box;
      }

      .form-group input:focus,
      .form-group textarea:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }

      .form-group input[readonly] {
        background: #f8fafc;
        color: #64748b;
      }

      /* Notification Styles */
      .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1001;
        display: flex;
        align-items: center;
        gap: 8px;
        animation: slideIn 0.3s ease;
      }

      .notification-success {
        background: #10b981;
      }

      .notification-error {
        background: #ef4444;
      }

      .notification-info {
        background: #3b82f6;
      }

      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      @media (max-width: 768px) {
        .filter-row {
          grid-template-columns: 1fr;
        }

        .filter-actions {
          justify-content: stretch;
        }

        .filter-actions .btn {
          flex: 1;
        }

        .summary-cards {
          grid-template-columns: 1fr;
        }

        .attendance-table {
          font-size: 12px;
        }

        .attendance-table th,
        .attendance-table td {
          padding: 12px 8px;
        }

        .program-name,
        .notes-preview {
          max-width: 100px;
        }

        .status-toggle {
          font-size: 11px;
          padding: 4px 8px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Public methods
  refresh() {
    this.loadData();
  }

  destroy() {
    const styleEl = document.getElementById('attendance-tracking-styles');
    if (styleEl) {
      styleEl.remove();
    }
    
    // Clean up global reference
    if (window.attendanceTracking === this) {
      delete window.attendanceTracking;
    }
  }
}