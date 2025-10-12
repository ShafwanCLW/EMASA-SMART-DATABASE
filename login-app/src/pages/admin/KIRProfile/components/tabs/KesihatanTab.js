import { BaseTab } from '../shared/BaseTab.js';
import { FormHelpers } from '../shared/FormHelpers.js';

export class KesihatanTab extends BaseTab {
  constructor(kirProfile) {
    super(kirProfile, 'kesihatan');
    this.currentKesihatanSection = 'ringkasan';
    this.kesihatanDirtyTabs = new Set();
  }

  render() {
    const data = this.kirProfile.relatedData?.kesihatan || {};
    
    return `
      <div class="kesihatan-tab-content">
        <div class="kesihatan-header">
          <h3>Kesihatan KIR</h3>
          <div class="kesihatan-last-updated">
            ${data.updated_at ? `Kemaskini terakhir: ${new Date(data.updated_at).toLocaleString('ms-MY')}` : ''}
          </div>
        </div>
        
        <div class="kesihatan-sections">
          ${this.createKesihatanSectionNavigation()}
          <div class="kesihatan-section-content">
            ${this.createKesihatanSectionContent()}
          </div>
        </div>
      </div>
    `;
  }

  createKesihatanSectionNavigation() {
    const sections = [
      { id: 'ringkasan', label: 'Ringkasan Kesihatan', icon: 'heart' },
      { id: 'ubat-tetap', label: 'Ubat-ubatan Tetap', icon: 'pills' },
      { id: 'rawatan', label: 'Rawatan / Follow-up Berkala', icon: 'calendar-check' },
      { id: 'pembedahan', label: 'Sejarah Pembedahan', icon: 'cut' }
    ];

    const sectionsHTML = sections.map(section => {
      const isActive = section.id === this.currentKesihatanSection;
      const isDirty = this.kesihatanDirtyTabs?.has(section.id) || false;
      
      return `
        <button class="kesihatan-section-btn ${isActive ? 'active' : ''}" 
                data-section="${section.id}" 
                onclick="kesihatanTab.switchKesihatanSection('${section.id}')">
          <i class="fas fa-${section.icon}"></i>
          ${section.label}
          ${isDirty ? '<span class="dirty-indicator">•</span>' : ''}
        </button>
      `;
    }).join('');

    return `
      <div class="kesihatan-section-navigation">
        ${sectionsHTML}
      </div>
    `;
  }

  createKesihatanSectionContent() {
    switch (this.currentKesihatanSection) {
      case 'ringkasan':
        return this.createRingkasanKesihatanSection();
      case 'ubat-tetap':
        return this.createUbatTetapSection();
      case 'rawatan':
        return this.createRawatanSection();
      case 'pembedahan':
        return this.createPembedahanSection();
      default:
        return this.createRingkasanKesihatanSection();
    }
  }

  createRingkasanKesihatanSection() {
    const data = this.kirProfile.relatedData?.kesihatan || {};
    
    const kumpulanDarah = data.kumpulan_darah || data.blood_type || '';
    const penyakitKronik = data.penyakit_kronik || data.chronic_diseases || [];
    const ringkasanKesihatan = data.ringkasan_kesihatan || data.health_summary || '';
    const catatanKesihatan = data.catatan_kesihatan || '';
    
    return `
      <form class="kesihatan-form" data-section="ringkasan">
        <div class="form-section">
          <h4>Ringkasan Kesihatan</h4>
          
          <div class="form-row">
            <div class="form-group">
              <label for="kumpulan_darah">Kumpulan Darah</label>
              <select id="kumpulan_darah" name="kumpulan_darah">
                <option value="">Pilih Kumpulan Darah</option>
                <option value="A+" ${kumpulanDarah === 'A+' ? 'selected' : ''}>A+</option>
                <option value="A-" ${kumpulanDarah === 'A-' ? 'selected' : ''}>A-</option>
                <option value="B+" ${kumpulanDarah === 'B+' ? 'selected' : ''}>B+</option>
                <option value="B-" ${kumpulanDarah === 'B-' ? 'selected' : ''}>B-</option>
                <option value="AB+" ${kumpulanDarah === 'AB+' ? 'selected' : ''}>AB+</option>
                <option value="AB-" ${kumpulanDarah === 'AB-' ? 'selected' : ''}>AB-</option>
                <option value="O+" ${kumpulanDarah === 'O+' ? 'selected' : ''}>O+</option>
                <option value="O-" ${kumpulanDarah === 'O-' ? 'selected' : ''}>O-</option>
              </select>
            </div>
          </div>
          
          <div class="form-group">
            <label>Penyakit Kronik</label>
            <div class="checkbox-group">
              <label class="checkbox-item">
                <input type="checkbox" name="penyakit_kronik" value="Diabetes" ${penyakitKronik.includes('Diabetes') ? 'checked' : ''}>
                <span>Diabetes</span>
              </label>
              <label class="checkbox-item">
                <input type="checkbox" name="penyakit_kronik" value="Hipertensi" ${penyakitKronik.includes('Hipertensi') ? 'checked' : ''}>
                <span>Hipertensi</span>
              </label>
              <label class="checkbox-item">
                <input type="checkbox" name="penyakit_kronik" value="Jantung" ${penyakitKronik.includes('Jantung') ? 'checked' : ''}>
                <span>Penyakit Jantung</span>
              </label>
              <label class="checkbox-item">
                <input type="checkbox" name="penyakit_kronik" value="Asma" ${penyakitKronik.includes('Asma') ? 'checked' : ''}>
                <span>Asma</span>
              </label>
              <label class="checkbox-item">
                <input type="checkbox" name="penyakit_kronik" value="Buah Pinggang" ${penyakitKronik.includes('Buah Pinggang') ? 'checked' : ''}>
                <span>Penyakit Buah Pinggang</span>
              </label>
              <label class="checkbox-item">
                <input type="checkbox" name="penyakit_kronik" value="Lain-lain" ${penyakitKronik.includes('Lain-lain') ? 'checked' : ''}>
                <span>Lain-lain</span>
              </label>
            </div>
          </div>
          
          <div class="form-group">
            <label for="ringkasan_kesihatan">Ringkasan Kesihatan</label>
            <textarea id="ringkasan_kesihatan" name="ringkasan_kesihatan" rows="3" placeholder="Ringkasan keseluruhan kesihatan...">${FormHelpers.escapeHtml(ringkasanKesihatan)}</textarea>
          </div>
          
          <div class="form-group">
            <label for="catatan_kesihatan">Catatan Kesihatan</label>
            <textarea id="catatan_kesihatan" name="catatan_kesihatan" rows="4" placeholder="Catatan tambahan mengenai kesihatan...">${FormHelpers.escapeHtml(catatanKesihatan)}</textarea>
          </div>
          
          <div class="form-actions">
            <button type="submit" class="btn btn-primary">
              <i class="fas fa-save"></i> Simpan Ringkasan Kesihatan
            </button>
          </div>
        </div>
      </form>
    `;
  }

  createUbatTetapSection() {
    const data = this.kirProfile.relatedData?.kesihatan?.ubat_tetap || [];
    
    if (data.length === 0) {
      return `
        <div class="empty-state">
          <div class="empty-state-icon">
            <i class="fas fa-pills"></i>
          </div>
          <h4>Tiada Ubat-ubatan Tetap</h4>
          <p>Belum ada maklumat ubat-ubatan tetap yang didaftarkan.</p>
          <button class="btn btn-primary" onclick="kesihatanTab.addUbatTetapKIR()">
            <i class="fas fa-plus"></i> Tambah Ubat Pertama
          </button>
        </div>
      `;
    }
    
    const tableRows = data.map((ubat, index) => `
      <tr>
        <td>${FormHelpers.escapeHtml(ubat.nama_ubat || '')}</td>
        <td>${FormHelpers.escapeHtml(ubat.dos || '')}</td>
        <td>${FormHelpers.escapeHtml(ubat.kekerapan || '')}</td>
        <td>${FormHelpers.escapeHtml(ubat.catatan || '')}</td>
        <td>
          <div class="action-menu">
            <button class="action-menu-btn" title="Edit" onclick="kesihatanTab.editUbatTetapKIR(${index})">
              <i class="fas fa-edit"></i>
            </button>
            <button class="action-menu-btn" title="Padam" onclick="kesihatanTab.deleteUbatTetapKIR(${index})">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
    
    return `
      <div class="section-header">
        <h4>Ubat-ubatan Tetap</h4>
        <button class="btn btn-primary" onclick="kesihatanTab.addUbatTetapKIR()">
          <i class="fas fa-plus"></i> Tambah Ubat
        </button>
      </div>
      
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Nama Ubat</th>
              <th>Dos</th>
              <th>Kekerapan</th>
              <th>Catatan</th>
              <th>Tindakan</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </div>
    `;
  }

  createRawatanSection() {
    const data = this.kirProfile.relatedData?.kesihatan?.rawatan || [];
    
    if (data.length === 0) {
      return `
        <div class="empty-state">
          <div class="empty-state-icon">
            <i class="fas fa-calendar-check"></i>
          </div>
          <h4>Tiada Rawatan / Follow-up</h4>
          <p>Belum ada maklumat rawatan atau follow-up berkala yang didaftarkan.</p>
          <button class="btn btn-primary" onclick="kesihatanTab.addRawatanKIR()">
            <i class="fas fa-plus"></i> Tambah Rawatan Pertama
          </button>
        </div>
      `;
    }
    
    const tableRows = data.map((rawatan, index) => `
      <tr>
        <td>${FormHelpers.escapeHtml(rawatan.fasiliti || '')}</td>
        <td>${rawatan.tarikh ? new Date(rawatan.tarikh).toLocaleDateString('ms-MY') : ''}</td>
        <td>${FormHelpers.escapeHtml(rawatan.catatan || '')}</td>
        <td>
          <div class="action-menu">
            <button class="action-menu-btn" title="Edit" onclick="kesihatanTab.editRawatanKIR(${index})">
              <i class="fas fa-edit"></i>
            </button>
            <button class="action-menu-btn" title="Padam" onclick="kesihatanTab.deleteRawatanKIR(${index})">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
    
    return `
      <div class="section-header">
        <h4>Rawatan / Follow-up Berkala</h4>
        <button class="btn btn-primary" onclick="kesihatanTab.addRawatanKIR()">
          <i class="fas fa-plus"></i> Tambah Rawatan
        </button>
      </div>
      
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Fasiliti</th>
              <th>Tarikh</th>
              <th>Catatan</th>
              <th>Tindakan</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </div>
    `;
  }

  createPembedahanSection() {
    const data = this.kirProfile.relatedData?.kesihatan?.pembedahan || [];
    
    if (data.length === 0) {
      return `
        <div class="empty-state">
          <div class="empty-state-icon">
            <i class="fas fa-cut"></i>
          </div>
          <h4>Tiada Sejarah Pembedahan</h4>
          <p>Belum ada maklumat sejarah pembedahan yang didaftarkan.</p>
          <button class="btn btn-primary" onclick="kesihatanTab.addPembedahanKIR()">
            <i class="fas fa-plus"></i> Tambah Pembedahan Pertama
          </button>
        </div>
      `;
    }
    
    const timelineItems = data
      .sort((a, b) => new Date(b.tarikh) - new Date(a.tarikh))
      .map(pembedahan => `
        <div class="timeline-item">
          <div class="timeline-marker"></div>
          <div class="timeline-content">
            <div class="timeline-header">
              <h5>${FormHelpers.escapeHtml(pembedahan.jenis_pembedahan || 'Pembedahan')}</h5>
              <span class="timeline-date">${pembedahan.tarikh ? new Date(pembedahan.tarikh).toLocaleDateString('ms-MY') : ''}</span>
            </div>
            <div class="timeline-body">
              <p><strong>Hospital:</strong> ${FormHelpers.escapeHtml(pembedahan.hospital || 'Tidak dinyatakan')}</p>
              <span class="status-badge ${pembedahan.status === 'Selesai' ? 'status-success' : 'status-warning'}">
                ${FormHelpers.escapeHtml(pembedahan.status || 'Perlu Follow-up')}
              </span>
            </div>
          </div>
        </div>
      `).join('');
    
    const tableRows = data.map((pembedahan, index) => `
      <tr>
        <td>${pembedahan.tarikh ? new Date(pembedahan.tarikh).toLocaleDateString('ms-MY') : ''}</td>
        <td>${FormHelpers.escapeHtml(pembedahan.jenis_pembedahan || '')}</td>
        <td>${FormHelpers.escapeHtml(pembedahan.hospital || '')}</td>
        <td>
          <span class="status-badge ${pembedahan.status === 'Selesai' ? 'status-success' : 'status-warning'}">
            ${FormHelpers.escapeHtml(pembedahan.status || 'Perlu Follow-up')}
          </span>
        </td>
        <td>
          <div class="action-menu">
            <button class="action-menu-btn" title="Edit" onclick="kesihatanTab.editPembedahanKIR(${index})">
              <i class="fas fa-edit"></i>
            </button>
            <button class="action-menu-btn" title="Padam" onclick="kesihatanTab.deletePembedahanKIR(${index})">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
    
    return `
      <div class="section-header">
        <h4>Sejarah Pembedahan</h4>
        <button class="btn btn-primary" onclick="kesihatanTab.addPembedahanKIR()">
          <i class="fas fa-plus"></i> Tambah Pembedahan
        </button>
      </div>
      
      <div class="pembedahan-content">
        <div class="timeline-container">
          <h5>Timeline Pembedahan</h5>
          <div class="timeline">
            ${timelineItems}
          </div>
        </div>
        
        <div class="table-container">
          <h5>Senarai Pembedahan</h5>
          <table class="data-table">
            <thead>
              <tr>
                <th>Tarikh</th>
                <th>Jenis Pembedahan</th>
                <th>Hospital</th>
                <th>Status</th>
                <th>Tindakan</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  async switchKesihatanSection(sectionId) {
    if (sectionId === this.currentKesihatanSection) return;
    
    // Check for unsaved changes
    if (this.kesihatanDirtyTabs.has(this.currentKesihatanSection)) {
      const confirmed = await this.confirmUnsavedChanges();
      if (!confirmed) return;
    }
    
    this.currentKesihatanSection = sectionId;
    
    // Update section content
    const sectionContent = document.querySelector('.kesihatan-section-content');
    if (sectionContent) {
      sectionContent.innerHTML = this.createKesihatanSectionContent();
    }
    
    // Update active section navigation
    this.updateKesihatanSectionNavigation();
  }

  updateKesihatanSectionNavigation() {
    const sectionNav = document.querySelector('.kesihatan-section-navigation');
    if (sectionNav) {
      sectionNav.innerHTML = this.createKesihatanSectionNavigation().replace('<div class="kesihatan-section-navigation">', '').replace('</div>', '');
    }
  }

  async confirmUnsavedChanges() {
    return confirm('Anda mempunyai perubahan yang belum disimpan. Adakah anda pasti mahu meninggalkan bahagian ini?');
  }

  // Ubat Tetap Methods
  addUbatTetapKIR() {
    const modal = this.createUbatTetapModal();
    document.body.insertAdjacentHTML('beforeend', modal);
  }

  editUbatTetapKIR(index) {
    const ubat = this.kirProfile.relatedData?.kesihatan?.ubat_tetap?.[index];
    if (!ubat) return;
    
    const modal = this.createUbatTetapModal(ubat, index);
    document.body.insertAdjacentHTML('beforeend', modal);
  }

  async deleteUbatTetapKIR(index) {
    if (!confirm('Adakah anda pasti mahu memadam ubat ini?')) return;
    
    try {
      const ubatTetap = [...(this.kirProfile.relatedData?.kesihatan?.ubat_tetap || [])];
      ubatTetap.splice(index, 1);
      
      const kesihatanData = { ...this.kirProfile.relatedData?.kesihatan };
      kesihatanData.ubat_tetap = ubatTetap;
      kesihatanData.updated_at = new Date().toISOString();
      
      await this.kirProfile.KIRService.updateRelatedDocument(this.kirProfile.kirId, 'kesihatan', kesihatanData);
      
      // Update local data
      if (!this.kirProfile.relatedData.kesihatan) this.kirProfile.relatedData.kesihatan = {};
      this.kirProfile.relatedData.kesihatan.ubat_tetap = ubatTetap;
      this.kirProfile.relatedData.kesihatan.updated_at = kesihatanData.updated_at;
      
      this.kirProfile.showToast('Ubat berjaya dipadam', 'success');
      this.refreshKesihatanSection();
      
    } catch (error) {
      console.error('Error deleting ubat tetap:', error);
      this.kirProfile.showToast('Ralat memadam ubat: ' + error.message, 'error');
    }
  }

  createUbatTetapModal(ubat = null, index = null) {
    const isEdit = ubat !== null;
    
    return `
      <div class="modal-overlay" onclick="this.remove()">
        <div class="modal-content" onclick="event.stopPropagation()">
          <div class="modal-header">
            <h4>${isEdit ? 'Edit' : 'Tambah'} Ubat Tetap</h4>
            <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <form class="modal-form" onsubmit="kesihatanTab.saveUbatTetapKIR(event, ${index})">
            <div class="form-group">
              <label for="nama_ubat">Nama Ubat *</label>
              <input type="text" id="nama_ubat" name="nama_ubat" value="${FormHelpers.escapeHtml(ubat?.nama_ubat || '')}" required>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="dos">Dos</label>
                <input type="text" id="dos" name="dos" value="${FormHelpers.escapeHtml(ubat?.dos || '')}" placeholder="Contoh: 500mg">
              </div>
              
              <div class="form-group">
                <label for="kekerapan">Kekerapan</label>
                <input type="text" id="kekerapan" name="kekerapan" value="${FormHelpers.escapeHtml(ubat?.kekerapan || '')}" placeholder="Contoh: 2 kali sehari">
              </div>
            </div>
            
            <div class="form-group">
              <label for="catatan">Catatan</label>
              <textarea id="catatan" name="catatan" rows="3" placeholder="Catatan tambahan...">${FormHelpers.escapeHtml(ubat?.catatan || '')}</textarea>
            </div>
            
            <div class="modal-actions">
              <button type="button" class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">
                Batal
              </button>
              <button type="submit" class="btn btn-primary">
                <i class="fas fa-save"></i> ${isEdit ? 'Kemaskini' : 'Simpan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  async saveUbatTetapKIR(event, index = null) {
    event.preventDefault();
    
    try {
      const formData = new FormData(event.target);
      const ubatData = {
        nama_ubat: formData.get('nama_ubat'),
        dos: formData.get('dos'),
        kekerapan: formData.get('kekerapan'),
        catatan: formData.get('catatan')
      };
      
      const ubatTetap = [...(this.kirProfile.relatedData?.kesihatan?.ubat_tetap || [])];
      
      if (index !== null) {
        ubatTetap[index] = ubatData;
      } else {
        ubatTetap.push(ubatData);
      }
      
      const kesihatanData = { ...this.kirProfile.relatedData?.kesihatan };
      kesihatanData.ubat_tetap = ubatTetap;
      kesihatanData.updated_at = new Date().toISOString();
      
      await this.kirProfile.KIRService.updateRelatedDocument(this.kirProfile.kirId, 'kesihatan', kesihatanData);
      
      // Update local data
      if (!this.kirProfile.relatedData.kesihatan) this.kirProfile.relatedData.kesihatan = {};
      this.kirProfile.relatedData.kesihatan.ubat_tetap = ubatTetap;
      this.kirProfile.relatedData.kesihatan.updated_at = kesihatanData.updated_at;
      
      this.kirProfile.showToast(`Ubat berjaya ${index !== null ? 'dikemaskini' : 'ditambah'}`, 'success');
      this.refreshKesihatanSection();
      
      document.querySelector('.modal-overlay').remove();
      
    } catch (error) {
      console.error('Error saving ubat tetap:', error);
      this.kirProfile.showToast('Ralat menyimpan ubat: ' + error.message, 'error');
    }
  }

  // Rawatan Methods
  addRawatanKIR() {
    // Implementation for adding rawatan
    console.log('Add rawatan - to be implemented');
  }

  editRawatanKIR(index) {
    // Implementation for editing rawatan
    console.log('Edit rawatan - to be implemented');
  }

  async deleteRawatanKIR(index) {
    // Implementation for deleting rawatan
    console.log('Delete rawatan - to be implemented');
  }

  // Pembedahan Methods
  addPembedahanKIR() {
    // Implementation for adding pembedahan
    console.log('Add pembedahan - to be implemented');
  }

  editPembedahanKIR(index) {
    // Implementation for editing pembedahan
    console.log('Edit pembedahan - to be implemented');
  }

  async deletePembedahanKIR(index) {
    // Implementation for deleting pembedahan
    console.log('Delete pembedahan - to be implemented');
  }

  refreshKesihatanSection() {
    const sectionContent = document.querySelector('.kesihatan-section-content');
    if (sectionContent) {
      sectionContent.innerHTML = this.createKesihatanSectionContent();
    }
    this.updateKesihatanHeader();
  }

  updateKesihatanHeader() {
    const header = document.querySelector('.kesihatan-last-updated');
    if (header && this.kirProfile.relatedData?.kesihatan?.updated_at) {
      header.innerHTML = `Kemaskini terakhir: ${new Date(this.kirProfile.relatedData.kesihatan.updated_at).toLocaleString('ms-MY')}`;
    }
  }

  setupEventListeners() {
    // Make the tab instance globally accessible for onclick handlers
    window.kesihatanTab = this;
    
    // Set up form change tracking for the current section
    const form = document.querySelector('.kesihatan-form');
    if (form) {
      form.addEventListener('input', () => {
        this.kesihatanDirtyTabs.add(this.currentKesihatanSection);
        this.updateKesihatanSectionNavigation();
      });
      
      form.addEventListener('change', () => {
        this.kesihatanDirtyTabs.add(this.currentKesihatanSection);
        this.updateKesihatanSectionNavigation();
      });
    }
  }

  async save() {
    // For Kesihatan tab, we save per section, not the entire tab
    // This method can be used to save the current section
    const form = document.querySelector('.kesihatan-form');
    if (!form) {
      throw new Error('Form tidak dijumpai');
    }

    const formData = new FormData(form);
    const sectionId = form.dataset.section;
    
    let sectionData = {};
    
    if (sectionId === 'ringkasan') {
      // Handle checkbox array for penyakit_kronik
      const penyakitKronik = [];
      const checkboxes = document.querySelectorAll('input[name="penyakit_kronik"]:checked');
      checkboxes.forEach(checkbox => {
        penyakitKronik.push(checkbox.value);
      });
      
      sectionData = {
        kumpulan_darah: formData.get('kumpulan_darah'),
        penyakit_kronik: penyakitKronik,
        ringkasan_kesihatan: formData.get('ringkasan_kesihatan'),
        catatan_kesihatan: formData.get('catatan_kesihatan')
      };
    } else {
      // Handle other sections normally
      for (const [key, value] of formData.entries()) {
        sectionData[key] = value;
      }
    }
    
    // Update KIR with kesihatan data
    const kesihatanData = { ...this.kirProfile.relatedData?.kesihatan };
    kesihatanData[sectionId] = sectionData;
    kesihatanData.updated_at = new Date().toISOString();
    
    await this.kirProfile.KIRService.updateRelatedDocument(this.kirProfile.kirId, 'kesihatan', kesihatanData);
    
    // Update local data
    if (!this.kirProfile.relatedData) this.kirProfile.relatedData = {};
    if (!this.kirProfile.relatedData.kesihatan) this.kirProfile.relatedData.kesihatan = {};
    this.kirProfile.relatedData.kesihatan[sectionId] = sectionData;
    this.kirProfile.relatedData.kesihatan.updated_at = kesihatanData.updated_at;
    
    this.kesihatanDirtyTabs.delete(sectionId);
    this.updateKesihatanSectionNavigation();
    this.updateKesihatanHeader();
    
    return sectionData;
  }
}