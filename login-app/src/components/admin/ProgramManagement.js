// Program Management Component
import { ProgramService } from '../../services/backend/ProgramService.js';

export class ProgramManagement {
  constructor(containerId) {
    this.containerId = containerId;
    this.container = document.getElementById(containerId);
    this.programs = [];
    this.filteredPrograms = [];
    this.currentFilters = {
      search: '',
      kategori: '',
      status: ''
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
    this.loadPrograms();
  }

  render() {
    this.container.innerHTML = `
      <div class="program-management">
        <!-- Action Bar -->
        <div class="action-bar">
          <div class="filters-section">
            <div class="search-box">
              <i class="fas fa-search"></i>
              <input type="text" id="search-input" placeholder="Search programs..." />
            </div>
            <select id="kategori-filter">
              <option value="">All Categories</option>
              <option value="Pendidikan">Pendidikan</option>
              <option value="Kesihatan">Kesihatan</option>
              <option value="Kemasyarakatan">Kemasyarakatan</option>
              <option value="Kebudayaan">Kebudayaan</option>
              <option value="Sukan">Sukan</option>
              <option value="Test">Test</option>
            </select>
            <select id="status-filter">
              <option value="">All Status</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div class="action-buttons">
            <button class="btn btn-secondary" id="refresh-btn">
              <i class="fas fa-sync-alt"></i> Refresh
            </button>
            <button class="btn btn-primary" id="add-program-btn">
              <i class="fas fa-plus"></i> Add Program
            </button>
          </div>
        </div>

        <!-- Programs Table -->
        <div class="table-container">
          <div class="loading-state" id="loading-state">
            <i class="fas fa-spinner fa-spin"></i>
            <span>Loading programs...</span>
          </div>
          
          <table class="programs-table" id="programs-table" style="display: none;">
            <thead>
              <tr>
                <th>Program Name</th>
                <th>Description</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Category</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="programs-tbody">
            </tbody>
          </table>

          <div class="empty-state" id="empty-state" style="display: none;">
            <i class="fas fa-calendar-alt"></i>
            <h3>No Programs Found</h3>
            <p>No programs match your current filters. Try adjusting your search criteria.</p>
          </div>
        </div>

        <!-- Program Form Modal -->
        <div class="modal" id="program-modal" style="display: none;">
          <div class="modal-content">
            <div class="modal-header">
              <h3 id="modal-title">Add New Program</h3>
              <button class="close-btn" id="close-modal-btn">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <form id="program-form">
              <div class="form-group">
                <label for="program-name">Program Name *</label>
                <input type="text" id="program-name" required />
              </div>
              <div class="form-group">
                <label for="program-description">Description</label>
                <textarea id="program-description" rows="3"></textarea>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label for="start-date">Start Date *</label>
                  <input type="date" id="start-date" required />
                </div>
                <div class="form-group">
                  <label for="end-date">End Date *</label>
                  <input type="date" id="end-date" required />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label for="program-kategori">Category *</label>
                  <select id="program-kategori" required>
                    <option value="">Select Category</option>
                    <option value="Pendidikan">Pendidikan</option>
                    <option value="Kesihatan">Kesihatan</option>
                    <option value="Kemasyarakatan">Kemasyarakatan</option>
                    <option value="Kebudayaan">Kebudayaan</option>
                    <option value="Sukan">Sukan</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="program-status">Status *</label>
                  <select id="program-status" required>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <div class="form-actions">
                <button type="button" class="btn btn-secondary" id="cancel-btn">Cancel</button>
                <button type="submit" class="btn btn-primary" id="save-btn">
                  <span id="save-btn-text">Save Program</span>
                  <i class="fas fa-spinner fa-spin" id="save-btn-spinner" style="display: none;"></i>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

    this.injectStyles();
  }

  setupEventListeners() {
    // Search input
    const searchInput = this.container.querySelector('#search-input');
    searchInput.addEventListener('input', (e) => {
      this.currentFilters.search = e.target.value;
      this.applyFilters();
    });

    // Filter selects
    const kategoriFilter = this.container.querySelector('#kategori-filter');
    kategoriFilter.addEventListener('change', (e) => {
      this.currentFilters.kategori = e.target.value;
      this.applyFilters();
    });

    const statusFilter = this.container.querySelector('#status-filter');
    statusFilter.addEventListener('change', (e) => {
      this.currentFilters.status = e.target.value;
      this.applyFilters();
    });

    // Action buttons
    const refreshBtn = this.container.querySelector('#refresh-btn');
    refreshBtn.addEventListener('click', () => {
      this.loadPrograms();
    });

    const addProgramBtn = this.container.querySelector('#add-program-btn');
    addProgramBtn.addEventListener('click', () => {
      this.showProgramModal();
    });

    // Modal events
    const closeModalBtn = this.container.querySelector('#close-modal-btn');
    const cancelBtn = this.container.querySelector('#cancel-btn');
    [closeModalBtn, cancelBtn].forEach(btn => {
      btn.addEventListener('click', () => {
        this.hideProgramModal();
      });
    });

    // Form submission
    const programForm = this.container.querySelector('#program-form');
    programForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleFormSubmit();
    });

    // Modal backdrop click
    const modal = this.container.querySelector('#program-modal');
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.hideProgramModal();
      }
    });
  }

  async loadPrograms() {
    try {
      this.showLoading();
      this.programs = await ProgramService.listProgram();
      this.applyFilters();
      this.hideLoading();
    } catch (error) {
      console.error('Error loading programs:', error);
      this.showError('Failed to load programs: ' + error.message);
      this.hideLoading();
    }
  }

  applyFilters() {
    let filtered = [...this.programs];

    // Apply search filter
    if (this.currentFilters.search) {
      const searchTerm = this.currentFilters.search.toLowerCase();
      filtered = filtered.filter(program => 
        program.nama_program?.toLowerCase().includes(searchTerm) ||
        program.penerangan?.toLowerCase().includes(searchTerm)
      );
    }

    // Apply category filter
    if (this.currentFilters.kategori) {
      filtered = filtered.filter(program => program.kategori === this.currentFilters.kategori);
    }

    // Apply status filter
    if (this.currentFilters.status) {
      filtered = filtered.filter(program => program.status === this.currentFilters.status);
    }

    this.filteredPrograms = filtered;
    this.renderProgramsTable();
  }

  renderProgramsTable() {
    const tbody = this.container.querySelector('#programs-tbody');
    const table = this.container.querySelector('#programs-table');
    const emptyState = this.container.querySelector('#empty-state');

    if (this.filteredPrograms.length === 0) {
      table.style.display = 'none';
      emptyState.style.display = 'block';
      return;
    }

    table.style.display = 'table';
    emptyState.style.display = 'none';

    tbody.innerHTML = this.filteredPrograms.map(program => `
      <tr>
        <td>
          <div class="program-name">
            <strong>${this.escapeHtml(program.nama_program || 'Untitled Program')}</strong>
          </div>
        </td>
        <td>
          <div class="program-description">
            ${this.escapeHtml(program.penerangan || program.deskripsi || 'No description')}
          </div>
        </td>
        <td>${this.formatDate(program.tarikh_mula)}</td>
        <td>${this.formatDate(program.tarikh_tamat)}</td>
        <td>
          <span class="category-badge category-${program.kategori?.toLowerCase() || 'default'}">
            ${program.kategori || 'Uncategorized'}
          </span>
        </td>
        <td>
          <span class="status-badge status-${program.status?.toLowerCase() || 'default'}">
            ${program.status || 'Unknown'}
          </span>
        </td>
        <td>
          <div class="action-buttons">
            <button class="btn btn-sm btn-secondary" onclick="programManagement.editProgram('${program.id}')">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-sm btn-danger" onclick="programManagement.deleteProgram('${program.id}')">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');

    // Store reference for global access
    window.programManagement = this;
  }

  showProgramModal(program = null) {
    const modal = this.container.querySelector('#program-modal');
    const modalTitle = this.container.querySelector('#modal-title');
    const form = this.container.querySelector('#program-form');

    this.currentEditingProgram = program;

    if (program) {
      modalTitle.textContent = 'Edit Program';
      this.populateForm(program);
    } else {
      modalTitle.textContent = 'Add New Program';
      form.reset();
    }

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  hideProgramModal() {
    const modal = this.container.querySelector('#program-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    this.currentEditingProgram = null;
  }

  populateForm(program) {
    this.container.querySelector('#program-name').value = program.nama_program || '';
    this.container.querySelector('#program-description').value = program.penerangan || program.deskripsi || '';
    this.container.querySelector('#start-date').value = this.formatDateForInput(program.tarikh_mula);
    this.container.querySelector('#end-date').value = this.formatDateForInput(program.tarikh_tamat);
    this.container.querySelector('#program-kategori').value = program.kategori || '';
    this.container.querySelector('#program-status').value = program.status || 'Upcoming';
  }

  async handleFormSubmit() {
    const saveBtn = this.container.querySelector('#save-btn');
    const saveBtnText = this.container.querySelector('#save-btn-text');
    const saveBtnSpinner = this.container.querySelector('#save-btn-spinner');

    try {
      // Show loading state
      saveBtn.disabled = true;
      saveBtnText.style.display = 'none';
      saveBtnSpinner.style.display = 'inline-block';

      const formData = {
        nama_program: this.container.querySelector('#program-name').value,
        penerangan: this.container.querySelector('#program-description').value,
        tarikh_mula: this.container.querySelector('#start-date').value,
        tarikh_tamat: this.container.querySelector('#end-date').value,
        kategori: this.container.querySelector('#program-kategori').value,
        status: this.container.querySelector('#program-status').value,
        env: 'production'
      };

      if (this.currentEditingProgram) {
        await ProgramService.updateProgram(this.currentEditingProgram.id, formData);
        this.showNotification('Program updated successfully!', 'success');
      } else {
        await ProgramService.createProgram(formData);
        this.showNotification('Program created successfully!', 'success');
      }

      this.hideProgramModal();
      this.loadPrograms();

    } catch (error) {
      console.error('Error saving program:', error);
      this.showNotification('Failed to save program: ' + error.message, 'error');
    } finally {
      // Reset button state
      saveBtn.disabled = false;
      saveBtnText.style.display = 'inline';
      saveBtnSpinner.style.display = 'none';
    }
  }

  async editProgram(programId) {
    try {
      const program = await ProgramService.getProgramById(programId);
      this.showProgramModal(program);
    } catch (error) {
      console.error('Error loading program:', error);
      this.showNotification('Failed to load program details', 'error');
    }
  }

  async deleteProgram(programId) {
    const program = this.programs.find(p => p.id === programId);
    const programName = program?.nama_program || 'this program';

    if (!confirm(`Are you sure you want to delete "${programName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await ProgramService.deleteProgram(programId);
      this.showNotification('Program deleted successfully!', 'success');
      this.loadPrograms();
    } catch (error) {
      console.error('Error deleting program:', error);
      this.showNotification('Failed to delete program: ' + error.message, 'error');
    }
  }

  showLoading() {
    this.container.querySelector('#loading-state').style.display = 'flex';
    this.container.querySelector('#programs-table').style.display = 'none';
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

  formatDateForInput(dateString) {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch {
      return '';
    }
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  injectStyles() {
    const styleId = 'program-management-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .program-management {
        padding: 20px 0;
      }

      .action-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        gap: 20px;
        flex-wrap: wrap;
      }

      .filters-section {
        display: flex;
        gap: 12px;
        align-items: center;
        flex-wrap: wrap;
      }

      .search-box {
        position: relative;
        min-width: 250px;
      }

      .search-box i {
        position: absolute;
        left: 12px;
        top: 50%;
        transform: translateY(-50%);
        color: #64748b;
      }

      .search-box input {
        width: 100%;
        padding: 10px 12px 10px 40px;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        font-size: 14px;
      }

      .search-box input:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }

      .filters-section select {
        padding: 10px 12px;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        font-size: 14px;
        background: white;
        min-width: 140px;
      }

      .action-buttons {
        display: flex;
        gap: 12px;
      }

      .table-container {
        background: white;
        border-radius: 12px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }

      .programs-table {
        width: 100%;
        border-collapse: collapse;
      }

      .programs-table th,
      .programs-table td {
        padding: 16px;
        text-align: left;
        border-bottom: 1px solid #f1f5f9;
      }

      .programs-table th {
        background: #f8fafc;
        font-weight: 600;
        color: #374151;
        font-size: 14px;
      }

      .programs-table td {
        font-size: 14px;
        color: #374151;
      }

      .programs-table tr:hover {
        background: #f8fafc;
      }

      .program-name strong {
        color: #1e293b;
      }

      .program-description {
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #64748b;
      }

      .category-badge,
      .status-badge {
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 500;
        text-transform: capitalize;
      }

      .category-pendidikan { background: #dbeafe; color: #1e40af; }
      .category-kesihatan { background: #dcfce7; color: #166534; }
      .category-kemasyarakatan { background: #fef3c7; color: #92400e; }
      .category-kebudayaan { background: #fce7f3; color: #be185d; }
      .category-sukan { background: #e0e7ff; color: #3730a3; }
      .category-test { background: #f3f4f6; color: #374151; }
      .category-default { background: #f3f4f6; color: #374151; }

      .status-upcoming { background: #dbeafe; color: #1e40af; }
      .status-ongoing { background: #dcfce7; color: #166534; }
      .status-completed { background: #f3f4f6; color: #374151; }
      .status-cancelled { background: #fee2e2; color: #dc2626; }
      .status-default { background: #f3f4f6; color: #374151; }

      .btn-sm {
        padding: 6px 10px;
        font-size: 12px;
      }

      .btn-danger {
        background: #dc2626;
        color: white;
      }

      .btn-danger:hover {
        background: #b91c1c;
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
        max-width: 600px;
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

      #program-form {
        padding: 0 24px 24px 24px;
      }

      .form-group {
        margin-bottom: 20px;
      }

      .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
      }

      .form-group label {
        display: block;
        margin-bottom: 6px;
        font-weight: 500;
        color: #374151;
        font-size: 14px;
      }

      .form-group input,
      .form-group select,
      .form-group textarea {
        width: 100%;
        padding: 10px 12px;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        font-size: 14px;
        box-sizing: border-box;
      }

      .form-group input:focus,
      .form-group select:focus,
      .form-group textarea:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }

      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        margin-top: 32px;
        padding-top: 20px;
        border-top: 1px solid #f1f5f9;
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
        .action-bar {
          flex-direction: column;
          align-items: stretch;
        }

        .filters-section {
          justify-content: stretch;
        }

        .search-box {
          min-width: auto;
          flex: 1;
        }

        .filters-section select {
          min-width: auto;
          flex: 1;
        }

        .form-row {
          grid-template-columns: 1fr;
        }

        .programs-table {
          font-size: 12px;
        }

        .programs-table th,
        .programs-table td {
          padding: 12px 8px;
        }

        .program-description {
          max-width: 150px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Public methods
  refresh() {
    this.loadPrograms();
  }

  destroy() {
    const styleEl = document.getElementById('program-management-styles');
    if (styleEl) {
      styleEl.remove();
    }
    
    // Clean up global reference
    if (window.programManagement === this) {
      delete window.programManagement;
    }
  }
}