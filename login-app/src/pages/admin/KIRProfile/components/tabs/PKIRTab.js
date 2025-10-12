import { BaseTab } from '../shared/BaseTab.js';

/**
 * PKIRTab - Manages PKIR (Pasangan Ketua Isi Rumah / Spouse) functionality
 * Handles spouse information including basic info, KAFA education, general education, employment, and health
 */
export class PKIRTab extends BaseTab {
  constructor(kirId, relatedData = {}) {
    super(kirId);
    this.relatedData = relatedData;
    this.pkirData = null;
    this.isPKIRModalOpen = false;
    this.currentPKIRSection = 'maklumat-asas';
    this.pkirDirtyTabs = new Set();
    this.duplicateKIRWarning = null;
  }

  /**
   * Render the PKIR tab content
   */
  render() {
    if (!this.pkirData) {
      // Empty state - show form structure
      return `
        <form class="kir-form" data-tab="pkir">
          <div class="form-section">
            <div class="section-header">
              <h3>PKIR (Pasangan Ketua Isi Rumah)</h3>
              <button type="button" class="btn btn-primary" onclick="pkirTab.openPKIRModal()">
                <i class="fas fa-plus"></i> Cipta Rekod PKIR
              </button>
            </div>
            
            <div class="empty-state-form">
              <div class="text-center py-5">
                <i class="fas fa-users text-muted mb-3" style="font-size: 3rem;"></i>
                <h5 class="text-muted mb-2">Tiada rekod PKIR untuk KIR ini</h5>
                <p class="text-muted mb-4">Belum ada maklumat pasangan yang didaftarkan untuk KIR ini.</p>
                <button type="button" class="btn btn-primary" onclick="pkirTab.openPKIRModal()">
                  <i class="fas fa-plus"></i> Cipta Rekod PKIR
                </button>
              </div>
            </div>
          </div>
          
          ${this.createPKIRModal()}
        </form>
      `;
    }

    // PKIR record exists - show form structure
    return `
      <form class="kir-form" data-tab="pkir">
        <div class="form-section">
          <div class="section-header">
            <h3>PKIR (Pasangan Ketua Isi Rumah)</h3>
            <button type="button" class="btn btn-secondary" onclick="pkirTab.deletePKIRRecord()">
              <i class="fas fa-trash"></i> Padam PKIR
            </button>
          </div>
          
          ${this.createPKIRFormContent()}
        </div>
      </form>
      
      ${this.createPKIRModal()}
    `;
  }

  /**
   * Create PKIR form content (combined sections)
   */
  createPKIRFormContent() {
    const asasData = this.pkirData?.asas || {};
    const kafaData = this.pkirData?.kafa || {};
    const pendidikanData = this.pkirData?.pendidikan || {};
    const pekerjaanData = this.pkirData?.pekerjaan || {};
    const kesihatanData = this.pkirData?.kesihatan || {};
    
    return `
      <!-- Maklumat Asas -->
      <div class="form-row">
        <div class="form-group">
          <label for="pkir_nama">Nama Pasangan *</label>
          <input type="text" id="pkir_nama" name="nama_pasangan" value="${this.escapeHtml(asasData.nama || '')}" required>
        </div>
        
        <div class="form-group">
          <label for="pkir_no_kp">No. KP Pasangan *</label>
          <input type="text" id="pkir_no_kp" name="no_kp_pasangan" value="${this.escapeHtml(asasData.no_kp || '')}" required>
        </div>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label for="pkir_tarikh_lahir">Tarikh Lahir *</label>
          <input type="date" id="pkir_tarikh_lahir" name="tarikh_lahir_pasangan" value="${asasData.tarikh_lahir || ''}" required>
        </div>
        
        <div class="form-group">
          <label for="pkir_jantina">Jantina *</label>
          <select id="pkir_jantina" name="jantina_pasangan" required>
            <option value="">Pilih Jantina</option>
            <option value="Lelaki" ${asasData.jantina === 'Lelaki' ? 'selected' : ''}>Lelaki</option>
            <option value="Perempuan" ${asasData.jantina === 'Perempuan' ? 'selected' : ''}>Perempuan</option>
          </select>
        </div>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label for="pkir_bangsa">Bangsa</label>
          <input type="text" id="pkir_bangsa" name="bangsa_pasangan" value="${this.escapeHtml(asasData.bangsa || '')}">
        </div>
        
        <div class="form-group">
          <label for="pkir_agama">Agama</label>
          <input type="text" id="pkir_agama" name="agama_pasangan" value="${this.escapeHtml(asasData.agama || '')}">
        </div>
      </div>
      
      <!-- Pendidikan -->
      <div class="form-row">
        <div class="form-group">
          <label for="pkir_tahap_pendidikan">Tahap Pendidikan</label>
          <select id="pkir_tahap_pendidikan" name="tahap_pendidikan">
            <option value="">Pilih Tahap</option>
            <option value="Tiada Pendidikan Formal" ${pendidikanData.tahap === 'Tiada Pendidikan Formal' ? 'selected' : ''}>Tiada Pendidikan Formal</option>
            <option value="Sekolah Rendah" ${pendidikanData.tahap === 'Sekolah Rendah' ? 'selected' : ''}>Sekolah Rendah</option>
            <option value="Sekolah Menengah" ${pendidikanData.tahap === 'Sekolah Menengah' ? 'selected' : ''}>Sekolah Menengah</option>
            <option value="SPM/SPMV" ${pendidikanData.tahap === 'SPM/SPMV' ? 'selected' : ''}>SPM/SPMV</option>
            <option value="STPM/Diploma" ${pendidikanData.tahap === 'STPM/Diploma' ? 'selected' : ''}>STPM/Diploma</option>
            <option value="Ijazah Sarjana Muda" ${pendidikanData.tahap === 'Ijazah Sarjana Muda' ? 'selected' : ''}>Ijazah Sarjana Muda</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="pkir_institusi">Institusi Pendidikan</label>
          <input type="text" id="pkir_institusi" name="institusi_pendidikan" value="${this.escapeHtml(pendidikanData.institusi || '')}">
        </div>
      </div>
      
      <!-- Pekerjaan -->
      <div class="form-row">
        <div class="form-group">
          <label for="pkir_status_pekerjaan">Status Pekerjaan</label>
          <select id="pkir_status_pekerjaan" name="status_pekerjaan">
            <option value="">Pilih Status</option>
            <option value="Bekerja" ${pekerjaanData.status === 'Bekerja' ? 'selected' : ''}>Bekerja</option>
            <option value="Menganggur" ${pekerjaanData.status === 'Menganggur' ? 'selected' : ''}>Menganggur</option>
            <option value="Pelajar" ${pekerjaanData.status === 'Pelajar' ? 'selected' : ''}>Pelajar</option>
            <option value="Pesara" ${pekerjaanData.status === 'Pesara' ? 'selected' : ''}>Pesara</option>
            <option value="Suri Rumah" ${pekerjaanData.status === 'Suri Rumah' ? 'selected' : ''}>Suri Rumah</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="pkir_jenis_pekerjaan">Jenis Pekerjaan</label>
          <input type="text" id="pkir_jenis_pekerjaan" name="jenis_pekerjaan" value="${this.escapeHtml(pekerjaanData.jenis || '')}">
        </div>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label for="pkir_pendapatan">Pendapatan Bulanan (RM)</label>
          <input type="number" id="pkir_pendapatan" name="pendapatan_bulanan" value="${pekerjaanData.pendapatan || ''}" min="0" step="0.01">
        </div>
        
        <div class="form-group">
          <label for="pkir_kumpulan_darah">Kumpulan Darah</label>
          <select id="pkir_kumpulan_darah" name="kumpulan_darah">
            <option value="">Pilih Kumpulan Darah</option>
            <option value="A+" ${kesihatanData.kumpulan_darah === 'A+' ? 'selected' : ''}>A+</option>
            <option value="A-" ${kesihatanData.kumpulan_darah === 'A-' ? 'selected' : ''}>A-</option>
            <option value="B+" ${kesihatanData.kumpulan_darah === 'B+' ? 'selected' : ''}>B+</option>
            <option value="B-" ${kesihatanData.kumpulan_darah === 'B-' ? 'selected' : ''}>B-</option>
            <option value="AB+" ${kesihatanData.kumpulan_darah === 'AB+' ? 'selected' : ''}>AB+</option>
            <option value="AB-" ${kesihatanData.kumpulan_darah === 'AB-' ? 'selected' : ''}>AB-</option>
            <option value="O+" ${kesihatanData.kumpulan_darah === 'O+' ? 'selected' : ''}>O+</option>
            <option value="O-" ${kesihatanData.kumpulan_darah === 'O-' ? 'selected' : ''}>O-</option>
          </select>
        </div>
      </div>
      
      <div class="form-actions">
        <button type="button" class="btn btn-primary" onclick="pkirTab.savePKIRForm()">
          <i class="fas fa-save"></i> Simpan Maklumat
        </button>
      </div>
    `;
  }

  /**
   * Create PKIR modal for creating new record
   */
  createPKIRModal() {
    if (!this.isPKIRModalOpen) return '';
    
    const kekeluargaanData = this.relatedData?.keluarga || {};
    
    return `
      <div class="modal-overlay" onclick="pkirTab.closePKIRModal()">
        <div class="modal pkir-modal" onclick="event.stopPropagation()">
          <div class="modal-header">
            <h3>Cipta Rekod PKIR</h3>
            <button class="modal-close" onclick="pkirTab.closePKIRModal()">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <div class="modal-body">
            <p>Maklumat berikut akan dipra-isi dari tab Kekeluargaan. Anda boleh mengedit sebelum menyimpan.</p>
            
            <form id="pkir-creation-form">
              <div class="form-group">
                <label for="modal_nama_pasangan">Nama Pasangan *</label>
                <input type="text" id="modal_nama_pasangan" name="nama_pasangan" 
                       value="${this.escapeHtml(kekeluargaanData.nama_pasangan || '')}" required>
              </div>
              
              <div class="form-group">
                <label for="modal_no_kp_pasangan">No. KP Pasangan *</label>
                <input type="text" id="modal_no_kp_pasangan" name="no_kp_pasangan" 
                       value="${this.escapeHtml(kekeluargaanData.no_kp_pasangan || '')}" required>
              </div>
              
              <div class="form-group">
                <label for="modal_tarikh_lahir_pasangan">Tarikh Lahir *</label>
                <input type="date" id="modal_tarikh_lahir_pasangan" name="tarikh_lahir_pasangan" 
                       value="${kekeluargaanData.tarikh_lahir_pasangan || ''}" required>
              </div>
              
              <div class="form-group">
                <label for="modal_telefon_pasangan">Telefon Pasangan</label>
                <input type="tel" id="modal_telefon_pasangan" name="telefon_pasangan" 
                       value="${this.escapeHtml(kekeluargaanData.telefon_pasangan || '')}">
              </div>
            </form>
          </div>
          
          <div class="modal-footer">
            <button class="btn btn-secondary" onclick="pkirTab.closePKIRModal()">Batal</button>
            <button class="btn btn-primary" onclick="pkirTab.createPKIRRecord()">
              <i class="fas fa-save"></i> Cipta PKIR
            </button>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Open PKIR modal
   */
  openPKIRModal() {
    this.isPKIRModalOpen = true;
    this.render();
  }

  /**
   * Close PKIR modal
   */
  closePKIRModal() {
    this.isPKIRModalOpen = false;
    this.render();
  }

  /**
   * Create new PKIR record
   */
  async createPKIRRecord() {
    try {
      const form = document.querySelector('#pkir-creation-form');
      if (!form) return;

      const formData = new FormData(form);
      const pkirData = {
        asas: {}
      };
      
      for (const [key, value] of formData.entries()) {
        pkirData.asas[key] = value;
      }

      // Simulate API call - replace with actual service
      const newPKIR = await this.createPKIRAPI(this.kirId, pkirData);
      this.pkirData = { id: newPKIR.id, kir_id: this.kirId, ...pkirData };
      
      this.isPKIRModalOpen = false;
      this.currentPKIRSection = 'maklumat-asas';
      this.showToast('Rekod PKIR berjaya dicipta', 'success');
      this.render();
      
    } catch (error) {
      console.error('Error creating PKIR:', error);
      this.showToast('Ralat mencipta rekod PKIR: ' + error.message, 'error');
    }
  }

  /**
   * Save PKIR form
   */
  async savePKIRForm() {
    try {
      const form = document.querySelector('form[data-tab="pkir"]');
      if (!form) return;

      const formData = new FormData(form);
      const pkirData = {};
      
      for (const [key, value] of formData.entries()) {
        pkirData[key] = value;
      }

      // Update or create PKIR
      if (this.pkirData) {
        await this.updatePKIRAPI(this.pkirData.id, pkirData);
      } else {
        const newPKIR = await this.createPKIRAPI(this.kirId, { asas: pkirData });
        this.pkirData = { id: newPKIR.id, kir_id: this.kirId, asas: pkirData };
      }

      this.showToast('Maklumat berjaya disimpan', 'success');
      this.render();
      
    } catch (error) {
      console.error('Error saving PKIR:', error);
      this.showToast('Ralat menyimpan maklumat: ' + error.message, 'error');
    }
  }

  /**
   * Delete PKIR record
   */
  async deletePKIRRecord() {
    if (!this.pkirData || !confirm('Adakah anda pasti untuk memadam rekod PKIR ini? Tindakan ini tidak boleh dibatalkan.')) {
      return;
    }

    try {
      await this.deletePKIRAPI(this.pkirData.id);
      this.pkirData = null;
      this.showToast('Rekod PKIR berjaya dipadam', 'success');
      this.render();
    } catch (error) {
      console.error('Error deleting PKIR:', error);
      this.showToast('Ralat memadam rekod PKIR: ' + error.message, 'error');
    }
  }

  /**
   * Load PKIR data
   */
  async loadPKIRData() {
    try {
      this.pkirData = await this.getPKIRByKIRIdAPI(this.kirId);
    } catch (error) {
      console.error('Error loading PKIR data:', error);
      this.pkirData = null;
    }
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Form change detection for dirty state
    const form = document.querySelector('form[data-tab="pkir"]');
    if (form) {
      form.addEventListener('input', () => {
        this.markDirty();
      });
      
      form.addEventListener('change', () => {
        this.markDirty();
      });
    }
  }

  /**
   * Save method for tab integration
   */
  async save() {
    if (!this.isDirty) return true;
    
    try {
      await this.savePKIRForm();
      this.clearDirty();
      return true;
    } catch (error) {
      console.error('Error saving PKIR tab:', error);
      return false;
    }
  }

  /**
   * Load method for tab integration
   */
  async load() {
    await this.loadPKIRData();
  }

  /**
   * Validate method for tab integration
   */
  validate() {
    const form = document.querySelector('form[data-tab="pkir"]');
    if (!form) return true;
    
    return form.checkValidity();
  }

  /**
   * Cleanup method for tab integration
   */
  cleanup() {
    this.isPKIRModalOpen = false;
    this.pkirDirtyTabs.clear();
    this.duplicateKIRWarning = null;
  }

  // API Methods (to be replaced with actual service calls)
  async createPKIRAPI(kirId, data) {
    // Simulate API call
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ id: Date.now(), kir_id: kirId, ...data });
      }, 500);
    });
  }

  async updatePKIRAPI(pkirId, data) {
    // Simulate API call
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ success: true });
      }, 500);
    });
  }

  async deletePKIRAPI(pkirId) {
    // Simulate API call
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ success: true });
      }, 500);
    });
  }

  async getPKIRByKIRIdAPI(kirId) {
    // Simulate API call
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(null); // No PKIR data by default
      }, 500);
    });
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