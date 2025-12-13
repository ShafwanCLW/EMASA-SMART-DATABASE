// Standalone Program & Kehadiran (Modul Terkini) module
// This module mirrors the original Program & Kehadiran tab but is self-contained.
import { ProgramService } from '../../services/backend/ProgramService.js';

const STYLE_ID = 'program-kehadiran-newest-styles';

export class ProgramKehadiranNewest {
  constructor() {
    this.root = null;
    this.sections = {};
    this.elements = {};
    this.state = {
      programs: [],
      attendance: [],
      filters: {
        programId: '',
        date: '',
        search: ''
      },
      reportSelection: null
    };
  }

  createContent() {
    return `
      <div class="program-newest-wrapper">
        <div class="section-header">
          <h3 class="section-title">Program & Kehadiran (Modul Terkini)</h3>
          <p class="section-description">
            Pengurusan program dan kehadiran generasi terkini dengan antaramuka seragam.
          </p>
        </div>

        <div class="program-newest-section active" data-section="overview">
          <div class="program-newest-grid">
            <article class="program-newest-card">
              <header class="card-header">
                <h4>Pengurusan Program</h4>
                <span class="card-icon">&#128736;</span>
              </header>
              <p class="card-description">
                Cipta dan urus program komuniti dengan pantas.
              </p>
              <button class="btn btn-primary" data-action="open-management">
                Masuk Modul
              </button>
            </article>
            <article class="program-newest-card">
              <header class="card-header">
                <h4>Jejak Kehadiran</h4>
                <span class="card-icon">&#128338;</span>
              </header>
              <p class="card-description">
                Pantau kehadiran peserta secara langsung.
              </p>
              <button class="btn btn-primary" data-action="open-attendance">
                Jejak Kehadiran
              </button>
            </article>
            <article class="program-newest-card">
              <header class="card-header">
                <h4>Laporan Program</h4>
                <span class="card-icon">&#128202;</span>
              </header>
              <p class="card-description">
                Jana ringkasan dan statistik kehadiran.
              </p>
              <button class="btn btn-primary" data-action="open-reports">
                Lihat Laporan
              </button>
            </article>
          </div>
        </div>

        <div class="program-newest-section" data-section="management">
          <div class="section-header">
            <div class="section-header-start">
              <button class="back-btn" data-action="back-to-overview">
                <span>&larr;</span>
                Kembali
              </button>
              <h3 class="section-title">Pengurusan Program</h3>
            </div>
            <p class="section-description">
              Cipta, kemas kini dan pantau program komuniti secara menyeluruh.
            </p>
          </div>

          <div class="program-action-bar">
            <div class="program-action-buttons">
              <button class="btn btn-secondary" data-action="create-test-program">
                <span>&#10133;</span> Program Ujian
              </button>
              <button class="btn btn-primary" data-action="add-program">
                <span>&#9998;</span> Tambah Program
              </button>
            </div>
            <div class="program-refresh">
              <button class="btn btn-outline" data-action="refresh-programs">
                Segar Semula
              </button>
            </div>
          </div>

          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Nama Program</th>
                  <th>Penerangan</th>
                  <th>Tarikh Mula</th>
                  <th>Tarikh Tamat</th>
                  <th>Kategori</th>
                  <th>Status</th>
                  <th>Tindakan</th>
                </tr>
              </thead>
              <tbody data-role="program-table-body">
                <tr>
                  <td colspan="7" class="placeholder-text">
                    Klik "Masuk Modul" untuk memuatkan senarai program.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="program-newest-section" data-section="attendance">
        <div class="section-card">
          <div class="section-header">
            <div class="section-header-left">
              <div class="header-icon">&#128197;</div>
              <div>
                <h3 class="section-title">Jejak Kehadiran</h3>
                <p class="section-description">Pantau kehadiran peserta mengikut program atau tarikh.</p>
              </div>
            </div>
            <div class="section-header-actions">
              <button class="btn btn-ghost" data-action="back-to-overview">&larr; Kembali</button>
              <button class="btn btn-ghost" data-action="export-attendance">&#8681; Export</button>
            </div>
          </div>

          <div class="filters-container">
            <label class="filter-group" style="flex:1">
              <span>Tarikh:</span>
              <input type="date" class="form-input" data-role="attendance-date">
            </label>
            <button class="btn btn-secondary" data-action="apply-attendance-filters">
              Tapis
            </button>
            <button class="btn btn-outline" data-action="reset-attendance-filters">
              Set Semula
            </button>
          </div>

          <div class="attendance-program-list" data-role="attendance-program-list"></div>

          <div class="search-bar">
            <input type="text" class="form-input" placeholder="Cari nama atau NO KP..." data-role="attendance-search" />
          </div>

          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>No KP</th>
                  <th>Sumber</th>
                  <th>Hadir</th>
                  <th>Catatan</th>
                  <th>Tindakan</th>
                </tr>
              </thead>
              <tbody data-role="attendance-table-body">
                <tr>
                  <td colspan="6" class="placeholder-text">
                    Pilih "Jejak Kehadiran" untuk memuatkan rekod.
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="table-footer" data-role="attendance-footer"></div>
          </div>
        </div>
        </div>

        <div class="program-newest-section" data-section="reports">
          <div class="section-header">
            <div class="section-header-start">
              <button class="back-btn" data-action="back-to-overview">
                <span>&larr;</span>
                Kembali
              </button>
              <h3 class="section-title">Laporan Program</h3>
            </div>
            <p class="section-description">
              Lihat ringkasan prestasi program dan statistik kehadiran.
            </p>
          </div>

          <div class="reports-grid">
            <section class="report-card">
              <header class="report-header">
                <h4>Ringkasan Kehadiran</h4>
                <span class="report-icon">&#128202;</span>
              </header>
              <div class="report-content" data-role="attendance-summary">
                <p class="placeholder-text">Tekan "Lihat Laporan" untuk memuatkan data.</p>
              </div>
            </section>
            <section class="report-card">
              <header class="report-header">
                <h4>Peserta Terbaik</h4>
                <span class="report-icon">&#11088;</span>
              </header>
              <div class="report-content" data-role="top-participants">
                <p class="placeholder-text">Tekan "Lihat Laporan" untuk memuatkan data.</p>
              </div>
            </section>
            <section class="report-card">
              <header class="report-header">
                <h4>Penyertaan Program</h4>
                <span class="report-icon">&#128200;</span>
              </header>
              <div class="report-content" data-role="program-participation">
                <p class="placeholder-text">Tekan "Lihat Laporan" untuk memuatkan data.</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    `;
  }

  async initialize() {
    this.root = document.getElementById('program-kehadiran-newest-content');
    if (!this.root) {
      console.error('ProgramKehadiranNewest: container not found');
      return;
    }

    this.injectStyles();
    this.cacheDom();
    this.bindOverviewNavigation();
    this.bindManagementActions();
    this.bindAttendanceActions();
    this.bindReportActions();
  }

  cacheDom() {
    this.sections = {
      overview: this.root.querySelector('[data-section="overview"]'),
      management: this.root.querySelector('[data-section="management"]'),
      attendance: this.root.querySelector('[data-section="attendance"]'),
      reports: this.root.querySelector('[data-section="reports"]')
    };

    this.elements = {
      programsTableBody: this.root.querySelector('[data-role="program-table-body"]'),
      attendanceTableBody: this.root.querySelector('[data-role="attendance-table-body"]'),
      attendanceDate: this.root.querySelector('[data-role="attendance-date"]'),
      attendanceSummary: this.root.querySelector('[data-role="attendance-summary"]'),
      topParticipants: this.root.querySelector('[data-role="top-participants"]'),
      programParticipation: this.root.querySelector('[data-role="program-participation"]'),
      attendanceProgramList: this.root.querySelector('[data-role="attendance-program-list"]'),
      attendanceSearch: this.root.querySelector('[data-role="attendance-search"]'),
      attendanceFooter: this.root.querySelector('[data-role="attendance-footer"]')
    };
  }

  bindOverviewNavigation() {
    this.root.querySelectorAll('[data-action="open-management"]').forEach(btn => {
      btn.addEventListener('click', async () => {
        this.showSection('management');
        await this.loadPrograms();
      });
    });

    this.root.querySelectorAll('[data-action="open-attendance"]').forEach(btn => {
      btn.addEventListener('click', async () => {
        this.showSection('attendance');
        if (!this.state.programs || this.state.programs.length === 0) {
          await this.loadPrograms();
        } else {
          this.renderAttendanceProgramList();
        }
        await this.loadAttendanceData();
      });
    });

    this.root.querySelectorAll('[data-action="open-reports"]').forEach(btn => {
      btn.addEventListener('click', async () => {
        this.showSection('reports');
        await this.loadReports();
      });
    });

    this.root.querySelectorAll('[data-action="back-to-overview"]').forEach(btn => {
      btn.addEventListener('click', () => this.showSection('overview'));
    });
  }

  bindManagementActions() {
    const createTestBtn = this.root.querySelector('[data-action="create-test-program"]');
    const addProgramBtn = this.root.querySelector('[data-action="add-program"]');
    const refreshBtn = this.root.querySelector('[data-action="refresh-programs"]');

    if (createTestBtn) {
      createTestBtn.addEventListener('click', () => this.createTestProgram());
    }
    if (addProgramBtn) {
      addProgramBtn.addEventListener('click', () => this.handleAddProgram());
    }
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => this.loadPrograms());
    }
  }

  bindAttendanceActions() {
    const applyBtn = this.root.querySelector('[data-action="apply-attendance-filters"]');
    const resetBtn = this.root.querySelector('[data-action="reset-attendance-filters"]');
    const exportBtn = this.root.querySelector('[data-action="export-attendance"]');

    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        this.state.filters.date = this.elements.attendanceDate?.value || '';
        if (!this.state.filters.programId) {
          this.showToast('Sila pilih program dari senarai.', 'error');
          return;
        }
        this.loadAttendanceData(true);
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (this.elements.attendanceDate) {
          this.elements.attendanceDate.value = '';
        }
        if (this.elements.attendanceSearch) {
          this.elements.attendanceSearch.value = '';
        }
        this.state.filters = { programId: '', date: '', search: '' };
        this.renderAttendanceProgramList();
        this.loadAttendanceData();
      });
    }

    if (this.elements.attendanceSearch) {
      this.elements.attendanceSearch.addEventListener('input', () => {
        this.state.filters.search = this.elements.attendanceSearch.value || '';
        this.renderAttendanceTable();
      });
    }

    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportAttendance());
    }
  }

  bindReportActions() {
    // Reports load automatically when the section opens, so no extra listeners are required here.
  }

  showSection(sectionKey) {
    Object.entries(this.sections).forEach(([key, section]) => {
      if (!section) {
        return;
      }
      if (key === sectionKey) {
        section.classList.add('active');
      } else {
        section.classList.remove('active');
      }
    });
  }

  async loadPrograms() {
    const target = this.elements.programsTableBody;
    if (!target) return;

    target.innerHTML = `
      <tr>
        <td colspan="7" class="loading-text">Memuatkan senarai program...</td>
      </tr>
    `;

    try {
      const programs = await ProgramService.listProgram();
      this.state.programs = programs;

      if (!programs || programs.length === 0) {
        target.innerHTML = `
          <tr>
            <td colspan="7" class="empty-text">
              Tiada program ditemui. Gunakan butang "Program Ujian" untuk menambah contoh.
            </td>
          </tr>
        `;
        this.populateProgramFilter([]);
        return;
      }

      const rows = programs.map(program => this.buildProgramRow(program)).join('');
      target.innerHTML = rows;
      this.populateProgramFilter(programs);
      this.bindProgramActions();
      this.renderAttendanceProgramList();
    } catch (error) {
      console.error('ProgramKehadiranNewest: gagal memuat program', error);
      target.innerHTML = `
        <tr>
          <td colspan="7" class="error-text">
            ${error.message || 'Gagal memuat program.'}
          </td>
        </tr>
      `;
    }
  }

  renderAttendanceProgramList() {
    const container = this.elements.attendanceProgramList;
    if (!container) return;

    if (!this.state.programs || this.state.programs.length === 0) {
      container.innerHTML = `<div class="empty-text">Tiada program ditemui.</div>`;
      return;
    }

    const selectedProgram = this.state.programs.find(p => p.id === this.state.filters.programId);
    const options = this.state.programs.map(program => {
      const active = this.state.filters.programId === program.id ? 'active' : '';
      const start = this.formatDate(program.tarikh_mula || program.startDate);
      const end = this.formatDate(program.tarikh_tamat || program.endDate);
      return `
        <button class="program-option ${active}" data-program-id="${program.id}">
          <div class="option-title">${this.escapeHtml(program.nama_program || program.nama || 'Program')}</div>
          <div class="option-meta">${start}${end ? ' - ' + end : ''}</div>
        </button>
      `;
    }).join('');

    container.innerHTML = `
      <div class="program-dropdown">
        <button class="program-dropdown-toggle" data-role="program-dropdown-toggle">
          <div>
            <div class="toggle-label">${selectedProgram ? 'Program dipilih' : 'Pilih program'}</div>
            <div class="toggle-value">${selectedProgram ? this.escapeHtml(selectedProgram.nama_program || selectedProgram.nama) : 'Tiada pilihan'}</div>
          </div>
          <span class="toggle-icon">⌄</span>
        </button>
        <div class="program-dropdown-menu" data-role="program-dropdown-menu">${options}</div>
      </div>
    `;

    const dropdownToggle = container.querySelector('[data-role="program-dropdown-toggle"]');
    const dropdownMenu = container.querySelector('[data-role="program-dropdown-menu"]');

    const closeMenu = (event) => {
      if (!dropdownMenu.contains(event.target) && !dropdownToggle.contains(event.target)) {
        dropdownMenu.classList.remove('open');
        document.removeEventListener('click', closeMenu);
      }
    };

    dropdownToggle.addEventListener('click', (event) => {
      event.stopPropagation();
      dropdownMenu.classList.toggle('open');
      if (dropdownMenu.classList.contains('open')) {
        document.addEventListener('click', closeMenu);
      } else {
        document.removeEventListener('click', closeMenu);
      }
    });

    dropdownMenu.querySelectorAll('.program-option').forEach(btn => {
      btn.addEventListener('click', async () => {
        const programId = btn.getAttribute('data-program-id');
        this.state.filters.programId = programId;
        dropdownMenu.classList.remove('open');
        document.removeEventListener('click', closeMenu);
        this.renderAttendanceProgramList();
        await this.loadAttendanceData(true);
      });
    });
  }

  buildProgramRow(program) {
    const startDate = this.formatDate(program.tarikh_mula || program.startDate);
    const endDate = this.formatDate(program.tarikh_tamat || program.endDate);
    const status = this.resolveStatus(program);

    return `
      <tr data-program-id="${program.id}">
        <td>${program.nama_program || program.nama || 'Tidak dinyatakan'}</td>
        <td>${program.penerangan || program.deskripsi || '-'}</td>
        <td>${startDate}</td>
        <td>${endDate}</td>
        <td>${program.kategori || '-'}</td>
        <td>
          <span class="status-badge ${status.classNama}">${status.label}</span>
        </td>
        <td>
          <div class="program-row-actions">
            <button class="btn btn-sm btn-outline" data-action="view-program" data-program-id="${program.id}">
              Butiran
            </button>
            <button class="btn btn-sm btn-primary" data-action="edit-program" data-program-id="${program.id}">
              Sunting
            </button>
            <button class="btn btn-sm btn-danger" data-action="delete-program" data-program-id="${program.id}">
              Padam
            </button>
            <button class="btn btn-sm btn-secondary" data-action="qr-program" data-program-id="${program.id}">
              Kod QR
            </button>
          </div>
        </td>
      </tr>
    `;
  }

  bindProgramActions() {
    this.root.querySelectorAll('[data-action="view-program"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const programId = btn.getAttribute('data-program-id');
        const program = this.state.programs.find(item => item.id === programId);
        if (!program) {
          this.showToast('Program tidak ditemui', 'error');
          return;
        }

        this.openProgramDetailsModal(program);
      });
    });

    this.root.querySelectorAll('[data-action="edit-program"]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const programId = btn.getAttribute('data-program-id');
        await this.openSuntingProgramModal(programId);
      });
    });

    this.root.querySelectorAll('[data-action="qr-program"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const programId = btn.getAttribute('data-program-id');
        const program = this.state.programs.find(item => item.id === programId);
        if (!program) {
          this.showToast('Program tidak ditemui', 'error');
          return;
        }
        this.openQRModal(program);
      });
    });

    this.root.querySelectorAll('[data-action="delete-program"]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const programId = btn.getAttribute('data-program-id');
        await this.deleteProgram(programId);
      });
    });
  }

  openProgramDetailsModal(program) {
    const existing = document.getElementById('program-newest-details-modal');
    if (existing) existing.remove();

    const start = this.formatDate(program.tarikh_mula || program.startDate);
    const end = this.formatDate(program.tarikh_tamat || program.endDate);
    const status = this.resolveStatus(program);

    const modal = document.createElement('div');
    modal.id = 'program-newest-details-modal';
    modal.classNama = 'program-newest-modal visible';
    modal.innerHTML = `
      <div class="modal-panel program-details-panel">
        <div class="modal-header">
          <h3>Butiran Program</h3>
          <button type="button" class="modal-close" data-action="close-modal">&times;</button>
        </div>
        <div class="program-details-grid">
          <div class="detail-item">
            <span class="detail-label">Nama Program</span>
            <span class="detail-value">${program.nama_program || program.nama || '-'}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Kategori</span>
            <span class="detail-value">${program.kategori || '-'}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Status</span>
            <span class="status-badge ${status.classNama}">${status.label}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Lokasi</span>
            <span class="detail-value">${program.lokasi || '-'}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Skala Masa</span>
            <span class="detail-value">${program.time_scale || program.timeScale || '-'}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Tempoh</span>
            <span class="detail-value">${start} - ${end}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Co-organizer</span>
            <span class="detail-value">${program.co_organizer || program.coOrganizer || '-'}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Perbelanjaan</span>
            <span class="detail-value">${program.expenses || program.perbelanjaan || '-'}</span>
          </div>
          <div class="detail-item detail-span">
            <span class="detail-label">Penerangan</span>
            <p class="detail-value description">${program.penerangan || program.deskripsi || '-'}</p>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn btn-primary" data-action="close-modal">Tutup</button>
        </div>
      </div>
    `;

    modal.addEventListener('click', (event) => {
      if (event.target === modal || event.target.dataset.action === 'close-modal') {
        modal.remove();
      }
    });

    document.body.appendChild(modal);
  }

  openQRModal(program) {
    const existing = document.getElementById('program-newest-qr-modal');
    if (existing) existing.remove();

    const checkinLink = `${window.location.origin}/#/checkin?programId=${program.id}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(checkinLink)}`;

    const modal = document.createElement('div');
    modal.id = 'program-newest-qr-modal';
    modal.classNama = 'program-newest-modal visible';
    modal.innerHTML = `
      <div class="modal-panel program-details-panel">
        <div class="modal-header">
          <h3>Kod QR</h3>
          <button type="button" class="modal-close" data-action="close-modal">&times;</button>
        </div>
        <p><strong>${program.nama_program || program.nama || 'Program'}</strong></p>
        <div class="qr-container">
          <img src="${qrUrl}" alt="QR code for check-in" />
        </div>
        <div class="qr-link">${checkinLink}</div>
        <div class="modal-actions">
          <button class="btn btn-primary" data-action="close-modal">Tutup</button>
        </div>
      </div>
    `;

    modal.addEventListener('click', (event) => {
      if (event.target === modal || event.target.dataset.action === 'close-modal') {
        modal.remove();
      }
    });

    document.body.appendChild(modal);
  }

  async createTestProgram() {
    try {
      const timestamp = new Date().toISOString();
      await ProgramService.createProgram({
        name: `Demo Program ${timestamp.slice(0, 10)}`,
        description: 'Program contoh yang dijana secara automatik.',
        startDate: timestamp,
        endDate: timestamp,
        category: 'Demo',
        status: 'Upcoming',
        location: 'Ibu Pejabat'
      });
      this.showToast('Program contoh berjaya dicipta.', 'success');
      await this.loadPrograms();
    } catch (error) {
      console.error('ProgramKehadiranNewest: gagal cipta program contoh', error);
      this.showToast(error.message || 'Gagal mencipta program contoh.', 'error');
    }
  }

  handleAddProgram() {
    this.openCreateProgramModal();
  }

  openCreateProgramModal() {
    if (document.getElementById("program-newest-create-modal")) {
      return;
    }

    const modal = document.createElement("div");
    modal.id = "program-newest-create-modal";
    modal.classNama = "program-newest-modal";
    modal.innerHTML = `
      <div class="modal-panel">
        <div class="modal-header">
          <h3>Cipta Program Baharu</h3>
          <button type="button" class="modal-close" data-action="close-modal">&times;</button>
        </div>
        <form id="program-newest-create-form">
          <div class="form-group">
            <label for="program-newest-name">Nama Program</label>
            <input id="program-newest-name" name="name" type="text" class="form-input" placeholder="Contoh: Program Komuniti" required>
          </div>
          <div class="form-group">
            <label for="program-newest-description">Penerangan</label>
            <textarea id="program-newest-description" name="description" class="form-input" rows="3" required></textarea>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="program-newest-start">Tarikh Mula</label>
              <input id="program-newest-start" name="startDate" type="date" class="form-input" required>
            </div>
            <div class="form-group">
              <label for="program-newest-end">Tarikh Tamat</label>
              <input id="program-newest-end" name="endDate" type="date" class="form-input" required>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="program-newest-category">Kategori</label>
              <input id="program-newest-category" name="category" type="text" class="form-input" placeholder="Contoh: Pendidikan" required>
            </div>
            <div class="form-group">
              <label for="program-newest-status">Status</label>
              <select id="program-newest-status" name="status" class="form-input" required>
                <option value="Upcoming" selected>Upcoming</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="program-newest-time-scale">Skala Masa</label>
              <select id="program-newest-time-scale" name="time_scale" class="form-input">
                <option value="">Pilih skala masa</option>
                <option value="One Off">One Off</option>
                <option value="Daily">Daily</option>
                <option value="Monthly">Monthly</option>
                <option value="Berkala">Berkala</option>
              </select>
            </div>
            <div class="form-group">
              <label for="program-newest-location">Lokasi (Pilihan)</label>
              <input id="program-newest-location" name="location" type="text" class="form-input" placeholder="Contoh: Dewan Komuniti">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="program-newest-co-organizer">Co-organizer (Pilihan)</label>
              <input id="program-newest-co-organizer" name="co_organizer" type="text" class="form-input" placeholder="Contoh: NGO Tempatan">
            </div>
            <div class="form-group">
              <label for="program-newest-expenses">Perbelanjaan (Pilihan)</label>
              <input id="program-newest-expenses" name="expenses" type="text" class="form-input" placeholder="Contoh: RM 5000">
            </div>
          </div>
          <div class="modal-actions">
            <button type="button" class="btn btn-outline" data-action="close-modal">Batal</button>
            <button type="submit" class="btn btn-primary">Simpan Program</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(modal);
    requestAnimationFrame(() => modal.classList.add("visible"));

    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        this.closeCreateProgramModal();
      }
    });

    modal.querySelectorAll('[data-action="close-modal"]').forEach(btn => {
      btn.addEventListener("click", () => this.closeCreateProgramModal());
    });

    const form = modal.querySelector("#program-newest-create-form");
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      await this.submitCreateProgram(form);
    });
  }

  closeCreateProgramModal() {
    const modal = document.getElementById("program-newest-create-modal");
    if (modal) {
      modal.classList.remove("visible");
      setTimeout(() => {
        if (modal.parentNode) {
          modal.parentNode.removeChild(modal);
        }
      }, 200);
    }
  }

  async submitCreateProgram(form) {
    if (!form) {
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalLabel = submitBtn ? submitBtn.textContent : "";

    try {
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Menyimpan...";
      }

      const formData = new FormData(form);
      const name = (formData.get("name") || "").toString().trim();
      const description = (formData.get("description") || "").toString().trim();
      const startDate = formData.get("startDate");
      const endDate = formData.get("endDate");
      const category = (formData.get("category") || "").toString();
      const status = (formData.get("status") || "").toString();
      const location = (formData.get("location") || "").toString().trim();
      const timeScale = (formData.get("time_scale") || "").toString();
      const coOrganizer = (formData.get("co_organizer") || "").toString().trim();
      const expenses = (formData.get("expenses") || "").toString().trim();

      if (!name || !description || !startDate || !endDate || !category || !status) {
        this.showToast("Sila lengkapkan semua maklumat wajib.", "error");
        return;
      }

      const payload = {
        name,
        description,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        category,
        status,
        location,
        time_scale: timeScale,
        co_organizer: coOrganizer,
        expenses
      };

      await ProgramService.createProgram(payload);
      this.showToast("Program baharu berjaya dicipta.", "success");
      this.closeCreateProgramModal();
      await this.loadPrograms();
    } catch (error) {
      console.error("ProgramKehadiranNewest: gagal mencipta program baharu", error);
      this.showToast(error.message || "Gagal mencipta program baharu.", "error");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
      }
    }
  }

  formatDateForInput(value) {
    if (!value) {
      return "";
    }

    try {
      if (typeof value === "string") {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
          return "";
        }
        return date.toISOString().slice(0, 10);
      }

      if (value.seconds) {
        const date = new Date(value.seconds * 1000);
        return date.toISOString().slice(0, 10);
      }

      const date = new Date(value);
      return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
    } catch (error) {
      console.warn("ProgramKehadiranNewest: tidak dapat memformat tarikh input", value, error);
      return "";
    }
  }

  async openSuntingProgramModal(programId) {
    if (!programId) {
      return;
    }

    if (document.getElementById("program-newest-edit-modal")) {
      this.closeSuntingProgramModal();
    }

    let program = this.state.programs.find(item => item.id === programId);

    if (!program) {
      try {
        program = await ProgramService.getProgramById(programId);
      } catch (error) {
        console.error("ProgramKehadiranNewest: gagal mendapatkan program", error);
      }
    }

    if (!program) {
      this.showToast("Program tidak ditemui.", "error");
      return;
    }

    const startValue = this.formatDateForInput(program.tarikh_mula || program.startDate);
    const endValue = this.formatDateForInput(program.tarikh_tamat || program.endDate);
    const currentKategori = program.kategori || program.category || "Education";
    const currentStatus = (program.status || this.resolveStatus(program).label || "Upcoming").toLowerCase();
    const currentTimeScale = (program.time_scale || program.timeScale || "").toLowerCase();
    const currentLocation = program.lokasi || program.location || "";
    const currentCoOrganizer = program.co_organizer || program.coOrganizer || "";
    const currentExpenses = program.expenses || program.perbelanjaan || "";

    const modal = document.createElement("div");
    modal.id = "program-newest-edit-modal";
    modal.classNama = "program-newest-modal";
    modal.innerHTML = `
      <div class="modal-panel">
        <div class="modal-header">
          <h3>Kemas Kini Program</h3>
          <button type="button" class="modal-close" data-action="close-modal">&times;</button>
        </div>
        <form id="program-newest-edit-form">
          <div class="form-group">
            <label for="program-newest-edit-name">Nama Program</label>
            <input id="program-newest-edit-name" name="name" type="text" class="form-input" value="${program.nama_program || program.nama || ""}" required>
          </div>
          <div class="form-group">
            <label for="program-newest-edit-description">Penerangan</label>
            <textarea id="program-newest-edit-description" name="description" class="form-input" rows="3" required>${program.penerangan || program.deskripsi || ""}</textarea>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="program-newest-edit-start">Tarikh Mula</label>
              <input id="program-newest-edit-start" name="startDate" type="date" class="form-input" value="${startValue}" required>
            </div>
            <div class="form-group">
              <label for="program-newest-edit-end">Tarikh Tamat</label>
              <input id="program-newest-edit-end" name="endDate" type="date" class="form-input" value="${endValue}" required>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="program-newest-edit-category">Kategori</label>
              <input id="program-newest-edit-category" name="category" type="text" class="form-input" value="${currentKategori}" required>
            </div>
            <div class="form-group">
              <label for="program-newest-edit-status">Status</label>
              <select id="program-newest-edit-status" name="status" class="form-input" required>
                <option value="Upcoming" ${currentStatus === "upcoming" ? "selected" : ""}>Upcoming</option>
                <option value="Active" ${currentStatus === "active" ? "selected" : ""}>Active</option>
                <option value="Completed" ${currentStatus === "completed" ? "selected" : ""}>Completed</option>
                <option value="Cancelled" ${currentStatus === "cancelled" ? "selected" : ""}>Cancelled</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="program-newest-edit-time-scale">Skala Masa</label>
              <select id="program-newest-edit-time-scale" name="time_scale" class="form-input">
                <option value="" ${currentTimeScale === "" ? "selected" : ""}>Pilih skala masa</option>
                <option value="One Off" ${currentTimeScale === "one off" ? "selected" : ""}>One Off</option>
                <option value="Daily" ${currentTimeScale === "daily" ? "selected" : ""}>Daily</option>
                <option value="Monthly" ${currentTimeScale === "monthly" ? "selected" : ""}>Monthly</option>
                <option value="Berkala" ${currentTimeScale === "berkala" ? "selected" : ""}>Berkala</option>
              </select>
            </div>
            <div class="form-group">
              <label for="program-newest-edit-location">Lokasi (Pilihan)</label>
              <input id="program-newest-edit-location" name="location" type="text" class="form-input" value="${currentLocation}">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="program-newest-edit-co-organizer">Co-organizer (Pilihan)</label>
              <input id="program-newest-edit-co-organizer" name="co_organizer" type="text" class="form-input" value="${currentCoOrganizer}">
            </div>
            <div class="form-group">
              <label for="program-newest-edit-expenses">Perbelanjaan (Pilihan)</label>
              <input id="program-newest-edit-expenses" name="expenses" type="text" class="form-input" value="${currentExpenses}">
            </div>
          </div>
          <div class="modal-actions">
            <button type="button" class="btn btn-outline" data-action="close-modal">Batal</button>
            <button type="submit" class="btn btn-primary">Simpan Perubahan</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(modal);
    requestAnimationFrame(() => modal.classList.add("visible"));

    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        this.closeSuntingProgramModal();
      }
    });

    modal.querySelectorAll('[data-action="close-modal"]').forEach(btn => {
      btn.addEventListener("click", () => this.closeSuntingProgramModal());
    });

    const form = modal.querySelector("#program-newest-edit-form");
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      await this.submitSuntingProgram(form, programId);
    });
  }

  closeSuntingProgramModal() {
    const modal = document.getElementById("program-newest-edit-modal");
    if (modal) {
      modal.classList.remove("visible");
      setTimeout(() => {
        if (modal.parentNode) {
          modal.parentNode.removeChild(modal);
        }
      }, 200);
    }
  }

  async submitSuntingProgram(form, programId) {
    if (!form || !programId) {
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalLabel = submitBtn ? submitBtn.textContent : "";

    try {
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Menyimpan...";
      }

      const formData = new FormData(form);
      const name = (formData.get("name") || "").toString().trim();
      const description = (formData.get("description") || "").toString().trim();
      const startDate = formData.get("startDate");
      const endDate = formData.get("endDate");
      const category = (formData.get("category") || "").toString();
      const status = (formData.get("status") || "").toString();
      const location = (formData.get("location") || "").toString().trim();
      const timeScale = (formData.get("time_scale") || "").toString();
      const coOrganizer = (formData.get("co_organizer") || "").toString().trim();
      const expenses = (formData.get("expenses") || "").toString().trim();

      if (!name || !description || !startDate || !endDate || !category || !status) {
        this.showToast("Sila lengkapkan semua maklumat wajib.", "error");
        return;
      }

      const payload = {
        name,
        description,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        category,
        status,
        location,
        time_scale: timeScale,
        co_organizer: coOrganizer,
        expenses
      };

      await ProgramService.updateProgram(programId, payload);
      this.showToast("Program dikemas kini.", "success");
      this.closeSuntingProgramModal();
      await this.loadPrograms();
    } catch (error) {
      console.error("ProgramKehadiranNewest: gagal mengemas kini program", error);
      this.showToast(error.message || "Gagal mengemas kini program.", "error");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
      }
    }
  }

  async deleteProgram(programId) {
    if (!programId) {
      return;
    }

    const confirmPadam = window.confirm("Padam program ini? Tindakan ini tidak boleh diundur.");
    if (!confirmPadam) {
      return;
    }

    try {
      await ProgramService.deleteProgram(programId);
      this.showToast("Program berjaya dipadam.", "success");
      await this.loadPrograms();
    } catch (error) {
      console.error("ProgramKehadiranNewest: gagal memadam program", error);
      this.showToast(error.message || "Gagal memadam program.", "error");
    }
  }

  populateProgramFilter(programs) {
    const select = this.elements.programFilter;
    if (!select) return;

    const current = select.value;
    select.innerHTML = '<option value="">All Programs</option>';

    programs.forEach(program => {
      const option = document.createElement('option');
      option.value = program.id;
      option.textContent = program.nama_program || program.nama || 'Tanpa Nama';
      select.appendChild(option);
    });

    if (current && Array.from(select.options).some(opt => opt.value === current)) {
      select.value = current;
    }
  }

  async loadAttendanceData(userTriggered = false) {
    const target = this.elements.attendanceTableBody;
    if (!target) return;

    const { programId, date } = this.state.filters;
    if (!programId) {
      target.innerHTML = `
        <tr>
          <td colspan="6" class="empty-text">Sila pilih program untuk melihat kehadiran.</td>
        </tr>
      `;
      return;
    }

    target.innerHTML = `
      <tr>
        <td colspan="6" class="loading-text">Memuatkan rekod kehadiran...</td>
      </tr>
    `;

    try {
      const records = await (await import('../../services/backend/AttendanceService.js')).listAttendanceByProgram(programId, date || null);
      this.state.attendance = records || [];
      this.renderAttendanceTable();

    } catch (error) {
      console.error('ProgramKehadiranNewest: gagal memuat kehadiran', error);
      target.innerHTML = `
        <tr>
          <td colspan="6" class="error-text">
            ${error.message || 'Gagal memuat rekod kehadiran.'}
          </td>
        </tr>
      `;
    }
  }

  renderAttendanceTable() {
    const target = this.elements.attendanceTableBody;
    if (!target) return;

    const search = (this.state.filters.search || '').toLowerCase();
    const records = (this.state.attendance || []).filter(rec => {
      if (!search) return true;
      const name = (rec.participant_name || '').toLowerCase();
      const kp = (rec.no_kp_display || rec.participant_id || '').toLowerCase();
      return name.includes(search) || kp.includes(search);
    });

    if (!records || records.length === 0) {
      target.innerHTML = `
        <tr>
          <td colspan="6" class="empty-text">Tiada rekod kehadiran ditemui.</td>
        </tr>
      `;
      if (this.elements.attendanceFooter) {
        this.elements.attendanceFooter.textContent = '';
      }
      return;
    }

    const rows = records.map(record => this.buildAttendanceRow(record)).join('');
    target.innerHTML = rows;
    this.bindAttendanceRowEvents();

    if (this.elements.attendanceFooter) {
      const presentCount = records.filter(r => r.hadir).length;
      this.elements.attendanceFooter.innerHTML = `
        <div class="footer-meta">
          <span>Showing ${records.length} attendees</span>
          <span>Total Hadir: ${presentCount} &nbsp; Attendance Rate: ${records.length ? Math.round((presentCount / records.length) * 100) : 0}%</span>
        </div>
      `;
    }
  }

  buildAttendanceRow(record) {
    const checked = record.hadir ? 'checked' : '';
    const notes = record.catatan || '-';
    return `
      <tr data-attendance-id="${record.id}">
        <td>${record.participant_name || '-'}</td>
        <td>${record.no_kp_display || record.participant_id || '-'}</td>
        <td>${record.source || '-'}</td>
        <td>
          <input type="checkbox" data-role="attendance-checkbox" data-id="${record.id}" ${checked}>
        </td>
        <td>${notes}</td>
        <td>
          <button class="btn btn-sm btn-outline" data-role="edit-attendance-note" data-id="${record.id}">
            Sunting Catatan
          </button>
        </td>
      </tr>
    `;
  }

  bindAttendanceRowEvents() {
    this.root.querySelectorAll('[data-role="attendance-checkbox"]').forEach(input => {
      input.addEventListener('change', (event) => {
        const attendanceId = event.target.getAttribute('data-id');
        const present = event.target.checked;
        this.updateAttendanceStatus(attendanceId, present);
      });
    });

    this.root.querySelectorAll('[data-role="edit-attendance-note"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const attendanceId = btn.getAttribute('data-id');
        const current = this.state.attendance.find(item => item.id === attendanceId);
        const existingCatatan = current?.catatan || '';
        const newCatatan = prompt('Kemas kini catatan kehadiran:', existingCatatan);
        if (newCatatan !== null) {
          this.updateAttendanceCatatan(attendanceId, newCatatan);
        }
      });
    });
  }

  async updateAttendanceStatus(attendanceId, present) {
    try {
      const { updateAttendanceStatus } = await import('../../services/backend/AttendanceService.js');
      await updateAttendanceStatus(attendanceId, present);
      this.showToast('Status kehadiran dikemas kini.', 'success');
    } catch (error) {
      console.error('ProgramKehadiranNewest: gagal kemas kini kehadiran', error);
      this.showToast(error.message || 'Gagal mengemas kini status kehadiran.', 'error');
      await this.loadAttendanceData(Boolean(this.state.filters.programId || this.state.filters.date));
    }
  }

  async updateAttendanceCatatan(attendanceId, notes) {
    try {
      const { updateAttendanceCatatan } = await import('../../services/backend/AttendanceService.js');
      await updateAttendanceCatatan(attendanceId, notes);
      this.showToast('Catatan kehadiran dikemas kini.', 'success');
      await this.loadAttendanceData(Boolean(this.state.filters.programId || this.state.filters.date));
    } catch (error) {
      console.error('ProgramKehadiranNewest: gagal kemas kini catatan', error);
      this.showToast(error.message || 'Gagal mengemas kini catatan.', 'error');
    }
  }

  async loadReports() {
    if (!this.elements.attendanceSummary || !this.elements.topParticipants || !this.elements.programParticipation) {
      return;
    }

    this.elements.attendanceSummary.innerHTML = '<p class="loading-text">Memuatkan ringkasan...</p>';
    this.elements.topParticipants.innerHTML = '<p class="loading-text">Memuatkan peserta terbaik...</p>';
    this.elements.programParticipation.innerHTML = '<p class="loading-text">Memuatkan statistik program...</p>';

    try {
      const { listAttendanceByProgram } = await import('../../services/backend/AttendanceService.js');
      const programs = await ProgramService.listProgram();

      const programResults = await Promise.all(
        programs.map(async (program) => {
          const records = await listAttendanceByProgram(program.id, null);
          const participantCount = records.length;
          const presentCount = records.filter(r => r.hadir).length;
          return { program, records, participantCount, presentCount };
        })
      );

      const allRecords = programResults.flatMap(r => r.records);
      const totalPrograms = programs.length;
      const totalParticipantsSet = new Set();
      allRecords.forEach(r => totalParticipantsSet.add(r.participant_id || r.no_kp_display || r.id));
      const totalParticipants = totalParticipantsSet.size;
      const totalRecords = allRecords.length;
      const totalHadir = allRecords.filter(r => r.hadir).length;
      const averageAttendance = programResults.length
        ? Math.round(
          (programResults.reduce((sum, item) => {
            if (!item.participantCount) return sum;
            return sum + (item.presentCount / item.participantCount);
          }, 0) / programResults.length) * 100
        )
        : 0;

      const participantMap = new Map();
      allRecords.forEach(r => {
        const id = r.participant_id || r.no_kp_display || r.id;
        if (!participantMap.has(id)) {
          participantMap.set(id, {
            id,
            name: r.participant_name || 'Unknown',
            type: r.participant_type || '-',
            present: 0,
            total: 0
          });
        }
        const p = participantMap.get(id);
        p.total += 1;
        if (r.hadir) p.present += 1;
      });

      const topParticipants = Array.from(participantMap.values())
        .map(p => ({
          ...p,
          attendanceCount: p.present,
          attendancePercentage: p.total ? Math.round((p.present / p.total) * 100) : 0
        }))
        .sort((a, b) => b.attendanceCount - a.attendanceCount || b.attendancePercentage - a.attendancePercentage)
        .slice(0, 5);

      const participation = programResults.map(({ program, participantCount, presentCount }) => ({
        id: program.id || program.programId || program.nama_program || program.nama || 'program',
        name: program.nama_program || program.nama || 'Unknown',
        startDate: program.tarikh_mula || program.startDate,
        endDate: program.tarikh_tamat || program.endDate,
        participantCount,
        attendancePercentage: participantCount ? Math.round((presentCount / participantCount) * 100) : 0
      }));

      this.renderAttendanceSummary({ totalPrograms, totalParticipants, averageAttendance, totalHadir });
      this.renderTopParticipants(topParticipants);
      this.renderProgramParticipation(participation);
    } catch (error) {
      console.error('ProgramKehadiranNewest: gagal memuat laporan', error);
      const message = `<p class="error-text">${error.message || 'Gagal memuat laporan.'}</p>`;
      this.elements.attendanceSummary.innerHTML = message;
      this.elements.topParticipants.innerHTML = message;
      this.elements.programParticipation.innerHTML = message;
    }
  }

  renderAttendanceSummary(summary) {
    if (!summary) {
      this.elements.attendanceSummary.innerHTML = '<p class="empty-text">Tiada data ringkasan.</p>';
      return;
    }

    this.elements.attendanceSummary.innerHTML = `
      <div class="stat-grid">
        <div class="stat-card">
          <span class="stat-value">${summary.totalPrograms ?? 0}</span>
          <span class="stat-label">Jumlah Program</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">${summary.totalParticipants ?? 0}</span>
          <span class="stat-label">Jumlah Peserta</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">${summary.averageAttendance ?? 0}%</span>
          <span class="stat-label">Purata Kehadiran</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">${summary.totalHadir ?? 0}</span>
          <span class="stat-label">Jumlah Hadir</span>
        </div>
      </div>
    `;
  }

  renderTopParticipants(participants) {
    if (!participants || participants.length === 0) {
      this.elements.topParticipants.innerHTML = '<p class="empty-text">Tiada peserta direkodkan.</p>';
      return;
    }

    const items = participants.map(participant => `
      <div class="participant-item">
        <div>
          <div class="participant-name">${participant.name || '-'}</div>
          <div class="participant-type">${participant.type || '-'}</div>
        </div>
        <div class="participant-score">
          ${participant.attendanceCount ?? 0} hadir
        </div>
      </div>
    `).join('');

    this.elements.topParticipants.innerHTML = items;
  }

  renderProgramParticipation(programs) {
    if (!programs || programs.length === 0) {
      this.elements.programParticipation.innerHTML = '<p class="empty-text">Tiada statistik program.</p>';
      return;
    }

    const resolveProgramId = (program) => program?.id || program?.programId || program?.name || program?.nama_program || program?.nama || '';

    const hasValidSelection = this.state.reportSelection && programs.some(p => resolveProgramId(p) === this.state.reportSelection);
    if (!hasValidSelection) {
      this.state.reportSelection = resolveProgramId(programs[0]);
    }

    const selectedProgram = programs.find(p => resolveProgramId(p) === this.state.reportSelection) || programs[0];
    const dropdownOptions = programs.map(program => {
      const programId = resolveProgramId(program);
      const active = programId === this.state.reportSelection ? 'active' : '';
      return `
        <button class="program-option ${active}" data-program-report-id="${programId}">
          <div class="option-title">${program.name || '-'}</div>
          <div class="option-meta">${this.formatDate(program.startDate)} - ${this.formatDate(program.endDate)}</div>
        </button>
      `;
    }).join('');

    const selectedStats = `
      <div class="program-item">
        <div class="program-name">${selectedProgram.name || '-'}</div>
        <div class="program-dates">${this.formatDate(selectedProgram.startDate)} - ${this.formatDate(selectedProgram.endDate)}</div>
        <div class="program-stats">
          <div>
            <span class="stat-label">Peserta</span>
            <span class="stat-value">${selectedProgram.participantCount ?? 0}</span>
          </div>
          <div>
            <span class="stat-label">Kehadiran</span>
            <span class="stat-value">${selectedProgram.attendancePercentage ?? 0}%</span>
          </div>
        </div>
      </div>
    `;

    this.elements.programParticipation.innerHTML = `
      <div class="program-dropdown">
        <button class="program-dropdown-toggle" data-role="program-report-toggle">
          <div>
            <div class="toggle-label">Program dipilih</div>
            <div class="toggle-value">${selectedProgram.name || '-'}</div>
          </div>
          <span class="toggle-icon">⌄</span>
        </button>
        <div class="program-dropdown-menu" data-role="program-report-menu">${dropdownOptions}</div>
      </div>
      <div class="program-participation-grid">${selectedStats}</div>
    `;

    const toggle = this.elements.programParticipation.querySelector('[data-role="program-report-toggle"]');
    const menu = this.elements.programParticipation.querySelector('[data-role="program-report-menu"]');

    const closeMenu = (event) => {
      if (!menu.contains(event.target) && !toggle.contains(event.target)) {
        menu.classList.remove('open');
        document.removeEventListener('click', closeMenu);
      }
    };

    toggle.addEventListener('click', (event) => {
      event.stopPropagation();
      menu.classList.toggle('open');
      if (menu.classList.contains('open')) {
        document.addEventListener('click', closeMenu);
      } else {
        document.removeEventListener('click', closeMenu);
      }
    });

    menu.querySelectorAll('.program-option').forEach(btn => {
      btn.addEventListener('click', () => {
        const programId = btn.getAttribute('data-program-report-id');
        this.state.reportSelection = programId;
        menu.classList.remove('open');
        document.removeEventListener('click', closeMenu);
        this.renderProgramParticipation(programs);
      });
    });
  }

  formatDate(value) {
    if (!value) return 'N/A';

    try {
      if (typeof value === 'string') {
        return new Date(value).toLocaleDateString('ms-MY', { year: 'numeric', month: 'short', day: 'numeric' });
      }

      if (value.seconds) {
        return new Date(value.seconds * 1000).toLocaleDateString('ms-MY', { year: 'numeric', month: 'short', day: 'numeric' });
      }

      return new Date(value).toLocaleDateString('ms-MY', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (error) {
      console.warn('ProgramKehadiranNewest: tidak dapat memformat tarikh', value, error);
      return 'N/A';
    }
  }

  resolveStatus(program) {
    const now = new Date();
    const start = program.tarikh_mula || program.startDate;
    const end = program.tarikh_tamat || program.endDate;
    const status = (program.status || '').toLowerCase();

    const normalizeDate = (input) => {
      if (!input) return null;
      if (typeof input === 'string') return new Date(input);
      if (input.seconds) return new Date(input.seconds * 1000);
      return new Date(input);
    };

    const startDate = normalizeDate(start);
    const endDate = normalizeDate(end);

    let label = 'Upcoming';
    let classNama = 'upcoming';

    if (status === 'active' || status === 'ongoing') {
      label = 'Active';
      classNama = 'active';
    } else if (status === 'completed') {
      label = 'Completed';
      classNama = 'completed';
    } else if (status === 'cancelled') {
      label = 'Cancelled';
      classNama = 'cancelled';
    } else if (startDate && endDate) {
      if (now > endDate) {
        label = 'Completed';
        classNama = 'completed';
      } else if (now >= startDate && now <= endDate) {
        label = 'Active';
        classNama = 'active';
      }
    }

    return { label, classNama };
  }

  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.classNama = `program-newest-toast ${type}`;
    toast.textContent = message;

    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('visible'));

    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 300);
    }, 2600);
  }

  escapeHtml(text = '') {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  exportAttendance() {
    if (!this.state.attendance || this.state.attendance.length === 0) {
      this.showToast('Tiada rekod kehadiran untuk dieksport.', 'info');
      return;
    }

    const program = this.state.programs.find(p => p.id === this.state.filters.programId);
    const programNama = program?.nama_program || program?.nama || 'program';

    const header = ['Nama', 'No KP', 'Sumber', 'Status', 'Catatan'];
    const rows = this.state.attendance.map(rec => ([
      rec.participant_name || '',
      rec.no_kp_display || rec.participant_id || '',
      rec.source || '',
      rec.hadir ? 'Hadir' : 'Tidak',
      rec.catatan || ''
    ]));

    const toCsv = (value) => `"${(value ?? '').toString().replace(/"/g, '""')}"`;
    const csv = [header, ...rows].map(row => row.map(toCsv).join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `attendance-${programNama.replace(/\s+/g, '-').toLowerCase()}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    this.showToast('Fail CSV dimuat turun.', 'success');
  }

  injectStyles() {
    if (document.getElementById(STYLE_ID)) {
      return;
    }

    const style = document.createElement('style');
    style.id = STYLE_ID;
    
style.textContent = `
  .program-newest-wrapper {
    display: flex;
    flex-direction: column;
    gap: 18px;
    padding: 0;
  }

  .program-newest-wrapper .program-newest-section {
    display: none;
  }

  .program-newest-wrapper .program-newest-section.active {
    display: block;
  }

  .program-newest-wrapper .program-newest-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 16px;
  }

  .program-newest-wrapper .program-newest-card {
    border-radius: 18px;
    border: 1px solid var(--warna-sempadan);
    background: #fff;
    padding: 20px;
    box-shadow: 0 20px 35px rgba(15, 23, 42, 0.08);
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .program-newest-wrapper .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .program-newest-wrapper .card-icon {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: linear-gradient(135deg, var(--warna-utama), #8b5cf6);
    color: #fff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 12px 24px rgba(109, 40, 217, 0.3);
  }

  .program-newest-wrapper .card-description {
    margin: 0;
    color: var(--warna-teks-sekunder);
    line-height: 1.5;
  }

  .program-newest-wrapper .program-newest-card .btn {
    align-self: flex-start;
  }

  .program-newest-wrapper .section-card {
    background: #fff;
    border-radius: 20px;
    border: 1px solid var(--warna-sempadan);
    padding: clamp(18px, 2vw, 26px);
    box-shadow: 0 24px 45px rgba(15, 23, 42, 0.08);
  }

  .program-newest-wrapper .section-header {
    margin-bottom: 14px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .program-newest-wrapper .section-header-start,
  .program-newest-wrapper .section-header-left {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .program-newest-wrapper .header-icon {
    width: 44px;
    height: 44px;
    border-radius: 14px;
    background: linear-gradient(135deg, var(--warna-utama), #a855f7);
    color: #fff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
  }

  .program-newest-wrapper .section-header-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .program-newest-wrapper .section-description {
    margin: 0;
    max-width: min(620px, 100%);
    color: var(--warna-teks-sekunder);
  }

  .program-newest-wrapper .btn-ghost {
    background: #f6f0ff;
    color: var(--warna-utama);
    border: 1px solid var(--warna-sempadan);
    box-shadow: none;
  }

  .program-newest-wrapper .btn-ghost:hover {
    background: var(--warna-utama-muda);
  }

  .program-newest-wrapper .filters-container {
    background: #fdfcff;
    border: 1px solid var(--warna-sempadan);
    border-radius: 14px;
    padding: 16px;
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 16px;
  }

  .program-newest-wrapper .filter-group {
    flex: 1 1 200px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .program-newest-wrapper .attendance-program-list {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    margin-bottom: 12px;
  }

  .program-newest-wrapper .program-dropdown {
    position: relative;
    width: 100%;
  }

  .program-newest-wrapper .program-dropdown-toggle {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 14px;
    border: 1px solid var(--warna-sempadan);
    background: #fff;
    padding: 14px 18px;
    box-shadow: 0 14px 30px rgba(15, 23, 42, 0.08);
    font-weight: 600;
    cursor: pointer;
  }

  .program-newest-wrapper .toggle-label {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--warna-teks-sekunder);
  }

  .program-newest-wrapper .toggle-value {
    font-size: 16px;
    color: var(--warna-teks-utama);
  }

  .program-newest-wrapper .toggle-icon {
    font-size: 18px;
    color: var(--warna-teks-sekunder);
  }

  .program-newest-wrapper .program-dropdown-menu {
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    width: 100%;
    max-height: min(70vh, 600px);
    min-height: 180px;
    overflow-y: auto;
    border: 1px solid var(--warna-sempadan);
    border-radius: 16px;
    background: #fff;
    box-shadow: 0 24px 45px rgba(15, 23, 42, 0.14);
    padding: 12px;
    display: none;
    z-index: 30;
    overscroll-behavior: contain;
  }

  .program-newest-wrapper .program-dropdown-menu.open {
    display: block;
  }

  .program-newest-wrapper .program-option {
    width: 100%;
    text-align: left;
    border: 1px solid transparent;
    background: #f9fafc;
    border-radius: 12px;
    padding: 10px 12px;
    margin-bottom: 8px;
    transition: all 0.2s ease;
  }

  .program-newest-wrapper .program-option:last-child {
    margin-bottom: 0;
  }

  .program-newest-wrapper .program-option:hover {
    border-color: var(--warna-sempadan);
    background: #fff;
  }

  .program-newest-wrapper .program-option.active {
    border-color: var(--warna-utama);
    background: var(--warna-utama-muda);
    color: var(--warna-utama);
  }

  .program-newest-wrapper .option-title {
    font-weight: 600;
    color: var(--warna-teks-utama);
  }

  .program-newest-wrapper .option-meta {
    font-size: 12px;
    color: var(--warna-teks-sekunder);
  }

  .program-newest-wrapper .attendance-program-card {
    border-radius: 14px;
    border: 1px solid var(--warna-sempadan);
    background: #fff;
    padding: 12px 14px;
    box-shadow: 0 14px 30px rgba(15, 23, 42, 0.07);
    transition: all 0.2s ease;
    text-align: left;
  }

  .program-newest-wrapper .attendance-program-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 18px 32px rgba(109, 40, 217, 0.16);
  }

  .program-newest-wrapper .attendance-program-card.active {
    border-color: var(--warna-utama);
    background: linear-gradient(135deg, rgba(109, 40, 217, 0.08), rgba(99, 102, 241, 0.08));
  }

  .program-newest-wrapper .attendance-program-card .card-title {
    font-weight: 700;
    color: var(--warna-teks-utama);
    margin-bottom: 6px;
  }

  .program-newest-wrapper .attendance-program-card .pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    border-radius: 999px;
    background: var(--warna-utama-muda);
    color: var(--warna-utama);
    font-size: 11px;
    font-weight: 700;
  }

  .program-newest-wrapper .search-bar input {
    border: 1px solid var(--warna-sempadan);
    border-radius: 12px;
    padding: 12px;
    background: #fff;
  }

  .program-newest-wrapper .program-action-bar {
    background: #f8f7ff;
    border: 1px solid var(--warna-sempadan);
    border-radius: 14px;
    padding: 12px;
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    justify-content: space-between;
    align-items: center;
  }

  .program-newest-wrapper .program-row-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .program-newest-wrapper .program-row-actions .btn {
    flex: 1 1 120px;
    height: 36px;
    border-radius: 10px;
    border: 1px solid var(--warna-sempadan);
    color: var(--warna-teks-utama);
    box-shadow: none;
  }

  .program-newest-wrapper .program-row-actions .btn.btn-primary {
    background: linear-gradient(135deg, var(--warna-utama), #8b5cf6);
    color: #fff;
    border: none;
  }

  .program-newest-wrapper .program-row-actions .btn.btn-danger {
    border-color: #fecdd3;
    color: #b91c1c;
  }

  .program-newest-wrapper .program-row-actions .btn.btn-secondary {
    background: #fff;
    border: 1px solid var(--warna-sempadan);
  }

  .program-newest-wrapper .program-newest-section .table-container {
    background: #fff;
    border-radius: 18px;
    border: 1px solid var(--warna-sempadan);
    box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
    margin-top: 12px;
  }

  .program-newest-wrapper .program-newest-section .data-table {
    width: 100%;
    border-collapse: collapse;
  }

  .program-newest-wrapper .program-newest-section .data-table th {
    background: #f5f3ff;
    color: var(--warna-teks-utama);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .program-newest-wrapper .program-newest-section .data-table th,
  .program-newest-wrapper .program-newest-section .data-table td {
    padding: 12px 14px;
    border-bottom: 1px solid #edf2f7;
  }

  .program-newest-wrapper .program-newest-section .data-table tbody tr:hover {
    background: #f8f7ff;
  }

  .program-newest-wrapper .table-footer {
    font-size: 12px;
    color: var(--warna-teks-sekunder);
    padding: 10px 14px;
  }

  .program-newest-wrapper .reports-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 18px;
    align-items: stretch;
  }

  @media (min-width: 1400px) {
    .program-newest-wrapper .reports-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  .program-newest-wrapper .report-card {
    border: 1px solid var(--warna-sempadan);
    border-radius: 16px;
    background: #fff;
    box-shadow: 0 20px 40px rgba(15, 23, 42, 0.08);
    padding: 18px;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .program-newest-wrapper .stat-grid {
    display: grid;
    gap: 14px;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  }

  .program-newest-wrapper .stat-card {
    background: #f9f7ff;
    border-radius: 12px;
    padding: 14px;
  }

  .program-newest-wrapper .participant-item {
    border-bottom: 1px solid var(--warna-sempadan);
    padding: 10px 0;
  }

  .program-newest-wrapper .participant-item:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  .program-newest-wrapper .report-content {
    margin-top: 10px;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .program-newest-wrapper .program-participation-grid {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .program-newest-wrapper .program-item {
    background: #f9fafc;
    border-radius: 12px;
    padding: 14px;
  }
`;


    document.head.appendChild(style);
  }
}
