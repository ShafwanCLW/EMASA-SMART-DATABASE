import { BaseTab } from '../shared/BaseTab.js';

/**
 * ProgramTab - Manages Program & Kehadiran (Program & Attendance) functionality
 * Handles program attendance tracking, filtering, and notes management
 */
export class ProgramTab extends BaseTab {
  constructor(kirId) {
    super(kirId);
    this.programData = [];
  }

  /**
   * Render the Program tab content
   */
  render() {
    return `
      <div class="program-tab-content">
        <div class="program-header">
          <h3>Program & Kehadiran</h3>
          <div class="program-filters">
            <input type="date" id="program-date-from" placeholder="Tarikh Mula">
            <input type="date" id="program-date-to" placeholder="Tarikh Akhir">
            <select id="program-kategori">
              <option value="">Semua Kategori</option>
              <option value="Kemahiran">Kemahiran</option>
              <option value="Kesihatan">Kesihatan</option>
              <option value="Pendidikan">Pendidikan</option>
              <option value="Keagamaan">Keagamaan</option>
            </select>
            <input type="text" id="program-search" placeholder="Cari nama program...">
          </div>
        </div>
        
        <div class="program-table-container">
          <div class="loading-skeleton" id="program-loading">
            <div class="skeleton-row"></div>
            <div class="skeleton-row"></div>
            <div class="skeleton-row"></div>
          </div>
          <div id="program-table"></div>
        </div>
      </div>
    `;
  }

  /**
   * Load program data from API
   */
  async loadProgramData() {
    try {
      const loadingElement = document.getElementById('program-loading');
      const tableElement = document.getElementById('program-table');
      
      if (loadingElement) loadingElement.style.display = 'block';
      if (tableElement) tableElement.style.display = 'none';
      
      this.programData = await this.getProgramsByKIRIdAPI(this.kirId);
      this.renderProgramTable();
      
      if (loadingElement) loadingElement.style.display = 'none';
      if (tableElement) tableElement.style.display = 'block';
    } catch (error) {
      console.error('Error loading program data:', error);
      this.showToast('Gagal memuat data program: ' + error.message, 'error');
    }
  }

  /**
   * Render the program table
   */
  renderProgramTable() {
    const tableContainer = document.getElementById('program-table');
    if (!tableContainer) return;
    
    if (!this.programData || this.programData.length === 0) {
      tableContainer.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-calendar-alt"></i>
          <h4>Tiada program berkaitan</h4>
          <p>Belum ada program yang didaftarkan atau tiada program yang berkaitan dengan KIR ini.</p>
        </div>
      `;
      return;
    }
    
    const tableHTML = `
      <table class="program-table">
        <thead>
          <tr>
            <th>Tarikh Program</th>
            <th>Nama Program</th>
            <th>Kategori</th>
            <th>Kehadiran</th>
            <th>Catatan</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          ${this.programData.map(program => `
            <tr data-program-id="${program.id}">
              <td>${this.formatDate(program.tarikh)}</td>
              <td>${this.escapeHtml(program.nama_program || 'Tidak dinyatakan')}</td>
              <td><span class="kategori-badge kategori-${(program.kategori || '').toLowerCase()}">${this.escapeHtml(program.kategori || 'Lain-lain')}</span></td>
              <td>
                <label class="toggle-switch">
                  <input type="checkbox" ${program.hadir ? 'checked' : ''} 
                         onchange="programTab.toggleKehadiran('${program.id}', this.checked)">
                  <span class="toggle-slider"></span>
                </label>
                <span class="kehadiran-status ${program.hadir ? 'hadir' : 'tidak-hadir'}">
                  ${program.hadir ? 'Hadir' : 'Tidak Hadir'}
                </span>
              </td>
              <td>
                <input type="text" class="catatan-input" 
                       value="${this.escapeHtml(program.catatan || '')}" 
                       placeholder="Catatan (pilihan)"
                       onblur="programTab.updateCatatan('${program.id}', this.value)">
              </td>
              <td>
                <button class="btn btn-sm btn-secondary" onclick="programTab.viewProgramDetails('${program.id}')">
                  <i class="fas fa-eye"></i>
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    
    tableContainer.innerHTML = tableHTML;
  }

  /**
   * Toggle attendance for a program
   */
  async toggleKehadiran(programId, hadir) {
    try {
      const program = this.programData.find(p => p.id === programId);
      if (!program) return;
      
      // Optimistic update
      program.hadir = hadir;
      this.renderProgramTable();
      
      // Get catatan from input
      const catatanInput = document.querySelector(`tr[data-program-id="${programId}"] .catatan-input`);
      const catatan = catatanInput ? catatanInput.value : '';
      
      await this.setKehadiranAPI(this.kirId, programId, hadir, catatan);
      
      // Log audit trail
      await this.logProgramChangeAPI(
        this.kirId, 
        'kehadiran', 
        !hadir, 
        hadir, 
        'user'
      );
      
      this.showToast(`Kehadiran ${hadir ? 'direkod' : 'dibatalkan'} berjaya`, 'success');
    } catch (error) {
      console.error('Error toggling kehadiran:', error);
      // Rollback optimistic update
      const program = this.programData.find(p => p.id === programId);
      if (program) {
        program.hadir = !hadir;
        this.renderProgramTable();
      }
      this.showToast('Gagal mengemas kini kehadiran: ' + error.message, 'error');
    }
  }

  /**
   * Update notes for a program
   */
  async updateCatatan(programId, catatan) {
    try {
      const program = this.programData.find(p => p.id === programId);
      if (!program) return;
      
      const oldCatatan = program.catatan;
      program.catatan = catatan;
      
      await this.setKehadiranAPI(this.kirId, programId, program.hadir, catatan);
      
      // Log audit trail if catatan changed
      if (oldCatatan !== catatan) {
        await this.logProgramChangeAPI(
          this.kirId, 
          'catatan', 
          oldCatatan, 
          catatan, 
          'user'
        );
      }
    } catch (error) {
      console.error('Error updating catatan:', error);
      this.showToast('Gagal mengemas kini catatan: ' + error.message, 'error');
    }
  }

  /**
   * View program details
   */
  viewProgramDetails(programId) {
    const program = this.programData.find(p => p.id === programId);
    if (!program) return;
    
    // Simple alert for now - can be enhanced with modal
    const details = [
      `Program: ${program.nama_program}`,
      `Kategori: ${program.kategori}`,
      `Tarikh: ${this.formatDate(program.tarikh)}`,
      `Lokasi: ${program.lokasi || 'Tidak dinyatakan'}`,
      `Penerangan: ${program.penerangan || 'Tiada penerangan'}`
    ].join('\n');
    
    alert(details);
  }

  /**
   * Filter programs based on criteria
   */
  filterPrograms() {
    // Simple client-side filtering for now
    const dateFrom = document.getElementById('program-date-from')?.value;
    const dateTo = document.getElementById('program-date-to')?.value;
    const kategori = document.getElementById('program-kategori')?.value;
    const search = document.getElementById('program-search')?.value?.toLowerCase();
    
    if (!this.programData) return;
    
    let filteredData = [...this.programData];
    
    if (dateFrom) {
      filteredData = filteredData.filter(p => new Date(p.tarikh) >= new Date(dateFrom));
    }
    if (dateTo) {
      filteredData = filteredData.filter(p => new Date(p.tarikh) <= new Date(dateTo));
    }
    if (kategori) {
      filteredData = filteredData.filter(p => p.kategori === kategori);
    }
    if (search) {
      filteredData = filteredData.filter(p => 
        p.nama_program?.toLowerCase().includes(search) ||
        p.penerangan?.toLowerCase().includes(search)
      );
    }
    
    // Temporarily replace data for rendering
    const originalData = this.programData;
    this.programData = filteredData;
    this.renderProgramTable();
    this.programData = originalData;
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Filter event listeners
    const dateFromInput = document.getElementById('program-date-from');
    const dateToInput = document.getElementById('program-date-to');
    const kategoriSelect = document.getElementById('program-kategori');
    const searchInput = document.getElementById('program-search');
    
    [dateFromInput, dateToInput, kategoriSelect, searchInput].forEach(element => {
      if (element) {
        element.addEventListener('change', () => this.filterPrograms());
        if (element.type === 'text') {
          element.addEventListener('input', () => this.filterPrograms());
        }
      }
    });
  }

  /**
   * Save method for tab integration
   */
  async save() {
    // Program tab doesn't have a traditional save - changes are saved immediately
    return true;
  }

  /**
   * Load method for tab integration
   */
  async load() {
    await this.loadProgramData();
  }

  /**
   * Validate method for tab integration
   */
  validate() {
    // Program tab doesn't require validation
    return true;
  }

  /**
   * Cleanup method for tab integration
   */
  cleanup() {
    // Clear any temporary data or states
    this.programData = [];
  }

  // API Methods (to be replaced with actual service calls)
  async getProgramsByKIRIdAPI(kirId) {
    // Simulate API call
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          {
            id: '1',
            nama_program: 'Program Kemahiran Menjahit',
            kategori: 'Kemahiran',
            tarikh: '2024-01-15',
            lokasi: 'Dewan Komuniti',
            penerangan: 'Program kemahiran menjahit untuk ibu tunggal',
            hadir: true,
            catatan: 'Sangat aktif'
          },
          {
            id: '2',
            nama_program: 'Kelas Kesihatan Mental',
            kategori: 'Kesihatan',
            tarikh: '2024-01-20',
            lokasi: 'Klinik Kesihatan',
            penerangan: 'Sesi kaunseling dan sokongan kesihatan mental',
            hadir: false,
            catatan: 'Tidak dapat hadir kerana sakit'
          }
        ]);
      }, 500);
    });
  }

  async setKehadiranAPI(kirId, programId, hadir, catatan) {
    // Simulate API call
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ success: true });
      }, 300);
    });
  }

  async logProgramChangeAPI(kirId, changeType, oldValue, newValue, userId) {
    // Simulate API call
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ success: true });
      }, 200);
    });
  }

  /**
   * Format date for display
   */
  formatDate(dateString) {
    if (!dateString) return 'Tidak dinyatakan';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ms-MY', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  }

  /**
   * Escape HTML to prevent XSS
   */
  escapeHtml(text) {
    if (typeof text !== 'string') return text;
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }
}