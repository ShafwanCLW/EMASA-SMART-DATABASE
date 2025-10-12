import { BaseTab } from '../shared/BaseTab.js';

export class AIRTab extends BaseTab {
  constructor(kirProfile) {
    super(kirProfile);
    this.tabId = 'air';
    this.airData = [];
    this.isDrawerOpen = false;
    this.currentAIR = null;
    this.currentDrawerTab = 'maklumat-asas';
    this.drawerDirtyTabs = new Set();
  }

  render() {
    return `
      <div class="air-tab">
        <div class="air-header">
          <div class="air-title">
            <h3>Ahli Isi Rumah (AIR)</h3>
            <button type="button" class="btn btn-primary" onclick="airTab.openAIRDrawer()">
              <i class="fas fa-plus"></i> Tambah AIR
            </button>
          </div>
        </div>
        
        <div class="air-content">
          ${this.createAIRContent()}
        </div>
        
        ${this.createAIRDrawer()}
      </div>
    `;
  }

  createAIRContent() {
    if (!this.airData || this.airData.length === 0) {
      return `
        <div class="empty-state">
          <div class="empty-icon">
            <i class="fas fa-users"></i>
          </div>
          <h4>Tiada Ahli Isi Rumah</h4>
          <p>Klik butang "Tambah AIR" untuk menambah ahli isi rumah.</p>
          <button class="btn btn-primary" onclick="airTab.openAIRDrawer()">
            <i class="fas fa-plus"></i> Tambah AIR
          </button>
        </div>
      `;
    }

    return `
      <div class="air-list">
        ${this.airData.map(air => this.createAIRCard(air)).join('')}
      </div>
      ${this.createAIRTable()}
    `;
  }

  createAIRCard(air) {
    const age = this.calculateAge(air.tarikh_lahir);
    
    return `
      <div class="air-card">
        <div class="air-card-header">
          <div class="air-info">
            <h4>${this.escapeHtml(air.nama)}</h4>
            <span class="air-relation">${this.escapeHtml(air.hubungan)}</span>
          </div>
          <div class="air-actions">
            <button class="btn btn-sm btn-outline" onclick="airTab.editAIR('${air.id}')" title="Edit">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-sm btn-danger" onclick="airTab.deleteAIR('${air.id}')" title="Padam">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
        
        <div class="air-card-body">
          <div class="air-details">
            <div class="detail-item">
              <span class="label">No. KP:</span>
              <span class="value">${air.no_kp || 'Tiada'}</span>
            </div>
            <div class="detail-item">
              <span class="label">Umur:</span>
              <span class="value">${age} tahun</span>
            </div>
            ${air.tahap_semasa ? `
              <div class="detail-item">
                <span class="label">Pendidikan:</span>
                <span class="value">${this.escapeHtml(air.tahap_semasa)}</span>
              </div>
            ` : ''}
            ${air.status ? `
              <div class="detail-item">
                <span class="label">Pekerjaan:</span>
                <span class="value">${this.escapeHtml(air.status)}</span>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }

  createAIRTable() {
    return `
      <div class="air-table-container">
        <h4>Senarai Ahli Isi Rumah</h4>
        <div class="table-responsive">
          <table class="air-table">
            <thead>
              <tr>
                <th>Nama</th>
                <th>Hubungan</th>
                <th>No. KP</th>
                <th>Umur</th>
                <th>Pendidikan</th>
                <th>Pekerjaan</th>
                <th>Tindakan</th>
              </tr>
            </thead>
            <tbody>
              ${this.airData.map(air => `
                <tr>
                  <td>${this.escapeHtml(air.nama)}</td>
                  <td>${this.escapeHtml(air.hubungan)}</td>
                  <td>${air.no_kp || '-'}</td>
                  <td>${this.calculateAge(air.tarikh_lahir)} tahun</td>
                  <td>${air.tahap_semasa || '-'}</td>
                  <td>${air.status || '-'}</td>
                  <td>
                    <div class="action-menu">
                      <button class="action-menu-btn" title="Edit AIR" onclick="airTab.editAIR('${air.id}')">
                        <i class="fas fa-edit"></i>
                      </button>
                      <button class="action-menu-btn" title="Padam AIR" onclick="airTab.deleteAIR('${air.id}')">
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // AIR Drawer Methods
  createAIRDrawer() {
    return `
      <div class="air-drawer ${this.isDrawerOpen ? 'open' : ''}" id="airDrawer">
        <div class="drawer-overlay" onclick="airTab.closeAIRDrawer()"></div>
        <div class="drawer-content">
          <div class="drawer-header">
            <h3>${this.currentAIR?.id ? 'Edit' : 'Tambah'} Ahli Isi Rumah</h3>
            <button class="drawer-close" onclick="airTab.closeAIRDrawer()">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <div class="drawer-body">
            <div class="drawer-tabs">
              ${this.createDrawerTabNavigation()}
            </div>
            
            <div class="drawer-tab-content">
              ${this.createDrawerTabContent()}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  createDrawerTabNavigation() {
    const tabs = [
      { id: 'maklumat-asas', label: 'Maklumat Asas', icon: 'user' },
      { id: 'pendidikan', label: 'Pendidikan', icon: 'graduation-cap' },
      { id: 'pekerjaan', label: 'Pekerjaan', icon: 'briefcase' },
      { id: 'kesihatan', label: 'Kesihatan', icon: 'heartbeat' }
    ];

    return tabs.map(tab => {
      const isActive = this.currentDrawerTab === tab.id;
      const isDirty = this.drawerDirtyTabs.has(tab.id);
      
      return `
        <button class="drawer-tab ${isActive ? 'active' : ''}" 
                onclick="airTab.switchDrawerTab('${tab.id}')">
          <i class="fas fa-${tab.icon}"></i>
          ${tab.label}
          ${isDirty ? '<span class="dirty-indicator">•</span>' : ''}
        </button>
      `;
    }).join('');
  }

  createDrawerTabContent() {
    switch (this.currentDrawerTab) {
      case 'maklumat-asas':
        return this.createAIRMaklumatAsasTab();
      case 'pendidikan':
        return this.createAIRPendidikanTab();
      case 'pekerjaan':
        return this.createAIRPekerjaanTab();
      case 'kesihatan':
        return this.createAIRKesihatanTab();
      default:
        return this.createAIRMaklumatAsasTab();
    }
  }

  createAIRMaklumatAsasTab() {
    const data = this.currentAIR || {};
    
    return `
      <form class="air-form" data-drawer-tab="maklumat-asas">
        <div class="form-section">
          <h4>Maklumat Asas</h4>
          
          <div class="form-group">
            <label for="air_gambar">Gambar</label>
            <input type="file" id="air_gambar" name="gambar" accept="image/*">
            ${data.gambar ? `<div class="current-image"><img src="${data.gambar}" alt="Gambar AIR" style="max-width: 100px;"></div>` : ''}
          </div>
          
          <div class="form-group">
            <label for="air_nama">Nama Penuh *</label>
            <input type="text" id="air_nama" name="nama" value="${data.nama || ''}" required>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="air_no_kp">No. KP</label>
              <input type="text" id="air_no_kp" name="no_kp" value="${data.no_kp || ''}" placeholder="123456-12-1234">
            </div>
            
            <div class="form-group">
              <label for="air_sijil_lahir">Sijil Lahir</label>
              <input type="text" id="air_sijil_lahir" name="sijil_lahir" value="${data.sijil_lahir || ''}">
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="air_tarikh_lahir">Tarikh Lahir *</label>
              <input type="date" id="air_tarikh_lahir" name="tarikh_lahir" value="${data.tarikh_lahir || ''}" required>
            </div>
            
            <div class="form-group">
              <label for="air_hubungan">Hubungan *</label>
              <select id="air_hubungan" name="hubungan" required>
                <option value="">Pilih Hubungan</option>
                <option value="Suami" ${data.hubungan === 'Suami' ? 'selected' : ''}>Suami</option>
                <option value="Isteri" ${data.hubungan === 'Isteri' ? 'selected' : ''}>Isteri</option>
                <option value="Anak" ${data.hubungan === 'Anak' ? 'selected' : ''}>Anak</option>
                <option value="Ibu" ${data.hubungan === 'Ibu' ? 'selected' : ''}>Ibu</option>
                <option value="Bapa" ${data.hubungan === 'Bapa' ? 'selected' : ''}>Bapa</option>
                <option value="Adik Beradik" ${data.hubungan === 'Adik Beradik' ? 'selected' : ''}>Adik Beradik</option>
                <option value="Datuk/Nenek" ${data.hubungan === 'Datuk/Nenek' ? 'selected' : ''}>Datuk/Nenek</option>
                <option value="Lain-lain" ${data.hubungan === 'Lain-lain' ? 'selected' : ''}>Lain-lain</option>
              </select>
            </div>
          </div>
        </div>
        
        <div class="form-actions">
          <button type="button" class="btn btn-primary" onclick="airTab.saveAIRTab('maklumat-asas')">Simpan</button>
        </div>
      </form>
    `;
  }

  createAIRPendidikanTab() {
    const data = this.currentAIR || {};
    
    return `
      <form class="air-form" data-drawer-tab="pendidikan">
        <div class="form-section">
          <h4>Pendidikan</h4>
          
          <div class="form-row">
            <div class="form-group">
              <label for="air_tahap_semasa">Tahap Pendidikan Semasa</label>
              <select id="air_tahap_semasa" name="tahap_semasa">
                <option value="">Pilih Tahap</option>
                <option value="Tadika" ${data.tahap_semasa === 'Tadika' ? 'selected' : ''}>Tadika</option>
                <option value="Sekolah Rendah" ${data.tahap_semasa === 'Sekolah Rendah' ? 'selected' : ''}>Sekolah Rendah</option>
                <option value="Sekolah Menengah" ${data.tahap_semasa === 'Sekolah Menengah' ? 'selected' : ''}>Sekolah Menengah</option>
                <option value="Sijil/Diploma" ${data.tahap_semasa === 'Sijil/Diploma' ? 'selected' : ''}>Sijil/Diploma</option>
                <option value="Ijazah" ${data.tahap_semasa === 'Ijazah' ? 'selected' : ''}>Ijazah</option>
                <option value="Pascasiswazah" ${data.tahap_semasa === 'Pascasiswazah' ? 'selected' : ''}>Pascasiswazah</option>
                <option value="Tidak Bersekolah" ${data.tahap_semasa === 'Tidak Bersekolah' ? 'selected' : ''}>Tidak Bersekolah</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="air_sekolah_ipt">Sekolah/IPT</label>
              <input type="text" id="air_sekolah_ipt" name="sekolah_ipt" value="${data.sekolah_ipt || ''}">
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="air_keperluan_sokongan">Keperluan Sokongan</label>
              <textarea id="air_keperluan_sokongan" name="keperluan_sokongan" rows="3">${data.keperluan_sokongan || ''}</textarea>
            </div>
            
            <div class="form-group">
              <label for="air_keputusan">Keputusan</label>
              <input type="text" id="air_keputusan" name="keputusan" value="${data.keputusan || ''}">
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="air_sekolah_kafa">Sekolah KAFA</label>
              <input type="text" id="air_sekolah_kafa" name="sekolah_kafa" value="${data.sekolah_kafa || ''}">
            </div>
            
            <div class="form-group">
              <label for="air_keputusan_kafa">Keputusan KAFA</label>
              <input type="text" id="air_keputusan_kafa" name="keputusan_kafa" value="${data.keputusan_kafa || ''}">
            </div>
          </div>
        </div>
        
        <div class="form-actions">
          <button type="button" class="btn btn-primary" onclick="airTab.saveAIRTab('pendidikan')">Simpan</button>
        </div>
      </form>
    `;
  }

  createAIRPekerjaanTab() {
    const data = this.currentAIR || {};
    
    return `
      <form class="air-form" data-drawer-tab="pekerjaan">
        <div class="form-section">
          <h4>Pekerjaan (Opsyenal)</h4>
          
          <div class="form-row">
            <div class="form-group">
              <label for="air_status_pekerjaan">Status Pekerjaan</label>
              <select id="air_status_pekerjaan" name="status">
                <option value="">Pilih Status</option>
                <option value="Bekerja" ${data.status === 'Bekerja' ? 'selected' : ''}>Bekerja</option>
                <option value="Tidak Bekerja" ${data.status === 'Tidak Bekerja' ? 'selected' : ''}>Tidak Bekerja</option>
                <option value="Pelajar" ${data.status === 'Pelajar' ? 'selected' : ''}>Pelajar</option>
                <option value="Pesara" ${data.status === 'Pesara' ? 'selected' : ''}>Pesara</option>
                <option value="Suri Rumah" ${data.status === 'Suri Rumah' ? 'selected' : ''}>Suri Rumah</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="air_jenis_pekerjaan">Jenis Pekerjaan</label>
              <input type="text" id="air_jenis_pekerjaan" name="jenis" value="${data.jenis || ''}">
            </div>
          </div>
          
          <div class="form-group">
            <label for="air_pendapatan">Pendapatan Bulanan (RM)</label>
            <input type="number" id="air_pendapatan" name="pendapatan" value="${data.pendapatan || ''}" min="0" step="0.01">
          </div>
        </div>
        
        <div class="form-actions">
          <button type="button" class="btn btn-primary" onclick="airTab.saveAIRTab('pekerjaan')">Simpan</button>
        </div>
      </form>
    `;
  }

  createAIRKesihatanTab() {
    const data = this.currentAIR || {};
    const statusMerokok = data.status_merokok === 'Ya';
    
    return `
      <form class="air-form" data-drawer-tab="kesihatan">
        <div class="form-section">
          <h4>Kesihatan</h4>
          
          <div class="form-row">
            <div class="form-group">
              <label for="air_status_kesihatan">Status Kesihatan</label>
              <select id="air_status_kesihatan" name="status_kesihatan">
                <option value="">Pilih Status</option>
                <option value="Sihat" ${data.status_kesihatan === 'Sihat' ? 'selected' : ''}>Sihat</option>
                <option value="Kurang Sihat" ${data.status_kesihatan === 'Kurang Sihat' ? 'selected' : ''}>Kurang Sihat</option>
                <option value="Sakit Kronik" ${data.status_kesihatan === 'Sakit Kronik' ? 'selected' : ''}>Sakit Kronik</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="air_diagnosis">Diagnosis</label>
              <input type="text" id="air_diagnosis" name="diagnosis" value="${data.diagnosis || ''}">
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="air_rawatan_berterusan">Rawatan Berterusan</label>
              <textarea id="air_rawatan_berterusan" name="rawatan_berterusan" rows="3">${data.rawatan_berterusan || ''}</textarea>
            </div>
            
            <div class="form-group">
              <label for="air_ubat">Ubat</label>
              <textarea id="air_ubat" name="ubat" rows="3">${data.ubat || ''}</textarea>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="air_oku">Status OKU</label>
              <select id="air_oku" name="oku">
                <option value="">Pilih Status</option>
                <option value="Ya" ${data.oku === 'Ya' ? 'selected' : ''}>Ya</option>
                <option value="Tidak" ${data.oku === 'Tidak' ? 'selected' : ''}>Tidak</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="air_status_merokok">Status Merokok</label>
              <select id="air_status_merokok" name="status_merokok" onchange="airTab.toggleSmokingFields(this.value)">
                <option value="">Pilih Status</option>
                <option value="Ya" ${data.status_merokok === 'Ya' ? 'selected' : ''}>Ya</option>
                <option value="Tidak" ${data.status_merokok === 'Tidak' ? 'selected' : ''}>Tidak</option>
              </select>
            </div>
          </div>
          
          <div class="smoking-fields" style="display: ${statusMerokok ? 'block' : 'none'}">
            <div class="form-row">
              <div class="form-group">
                <label for="air_mula_merokok">Mula Merokok (Umur)</label>
                <input type="number" id="air_mula_merokok" name="mula_merokok" value="${data.mula_merokok || ''}" min="1" max="100">
              </div>
              
              <div class="form-group">
                <label for="air_kekerapan_sehari">Kekerapan Sehari (Batang)</label>
                <input type="number" id="air_kekerapan_sehari" name="kekerapan_sehari" value="${data.kekerapan_sehari || ''}" min="1">
              </div>
            </div>
            
            <div class="form-group">
              <label for="air_jenis_rokok">Jenis Rokok</label>
              <input type="text" id="air_jenis_rokok" name="jenis_rokok" value="${data.jenis_rokok || ''}">
            </div>
          </div>
        </div>
        
        <div class="form-actions">
          <button type="button" class="btn btn-primary" onclick="airTab.saveAIRTab('kesihatan')">Simpan</button>
        </div>
      </form>
    `;
  }

  // AIR Event Handlers
  openAIRDrawer(airId = null) {
    // Validate that KIR ID is available
    if (!this.kirProfile.kirId || this.kirProfile.kirId === 'null' || this.kirProfile.kirId === 'undefined') {
      console.error('Cannot open AIR drawer: KIR ID is not available');
      this.kirProfile.showToast('Ralat: ID KIR tidak tersedia. Sila muat semula halaman.', 'error');
      return;
    }
    
    this.isDrawerOpen = true;
    this.currentDrawerTab = 'maklumat-asas';
    this.drawerDirtyTabs.clear();
    
    if (airId) {
      this.currentAIR = this.airData.find(air => air.id === airId) || {};
    } else {
      this.currentAIR = {};
    }
    
    // Re-render the tab to show the drawer
    const tabContent = document.querySelector('[data-tab="air"]');
    if (tabContent) {
      tabContent.innerHTML = this.render();
      this.setupEventListeners();
    }
  }

  closeAIRDrawer() {
    // Removed confirm dialog - always allow closing
    
    this.isDrawerOpen = false;
    this.currentAIR = null;
    this.currentDrawerTab = 'maklumat-asas';
    this.drawerDirtyTabs.clear();
    
    // Refresh AIR data and re-render
    this.loadAIRData().then(() => {
      const tabContent = document.querySelector('[data-tab="air"]');
      if (tabContent) {
        tabContent.innerHTML = this.render();
        this.setupEventListeners();
      }
    });
  }

  switchDrawerTab(tabId) {
    this.currentDrawerTab = tabId;
    
    // Re-render just the drawer content
    const drawerTabContent = document.querySelector('.drawer-tab-content');
    if (drawerTabContent) {
      drawerTabContent.innerHTML = this.createDrawerTabContent();
    }
    
    // Update tab navigation
    const drawerTabs = document.querySelector('.drawer-tabs');
    if (drawerTabs) {
      drawerTabs.innerHTML = this.createDrawerTabNavigation();
    }
  }

  editAIR(airId) {
    this.openAIRDrawer(airId);
  }

  async deleteAIR(airId) {
    const air = this.airData.find(a => a.id === airId);
    if (!air) return;
    
    if (!confirm(`Adakah anda pasti mahu memadam ${air.nama}?`)) {
      return;
    }
    
    try {
      await this.kirProfile.AIRService.deleteAIR(airId);
      this.kirProfile.showToast('AIR berjaya dipadam', 'success');
      await this.loadAIRData();
      
      // Re-render the tab
      const tabContent = document.querySelector('[data-tab="air"]');
      if (tabContent) {
        tabContent.innerHTML = this.render();
        this.setupEventListeners();
      }
    } catch (error) {
      console.error('Error deleting AIR:', error);
      this.kirProfile.showToast('Ralat memadam AIR: ' + error.message, 'error');
    }
  }

  async saveAIRTab(tabId) {
    // Validate that KIR ID is available
    if (!this.kirProfile.kirId) {
      console.error('Cannot save AIR: KIR ID is not available');
      this.kirProfile.showToast('Ralat: ID KIR tidak tersedia. Sila muat semula halaman.', 'error');
      return;
    }
    
    const form = document.querySelector(`form[data-drawer-tab="${tabId}"]`);
    if (!form) return;
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Remove empty values
    Object.keys(data).forEach(key => {
      if (data[key] === '') {
        delete data[key];
      }
    });
    
    try {
      this.showDrawerSaveLoading(tabId);
      
      if (this.currentAIR?.id) {
        // Update existing AIR
        await this.kirProfile.AIRService.updateAIR(this.currentAIR.id, data);
        this.kirProfile.showToast('AIR berjaya dikemaskini', 'success');
      } else {
        // Create new AIR
        const newAIR = await this.kirProfile.AIRService.createAIR(this.kirProfile.kirId, data);
        this.currentAIR = newAIR;
        this.kirProfile.showToast('AIR berjaya ditambah', 'success');
      }
      
      this.drawerDirtyTabs.delete(tabId);
      
      // Update drawer navigation to reflect saved state
      const drawerTabs = document.querySelector('.drawer-tabs');
      if (drawerTabs) {
        drawerTabs.innerHTML = this.createDrawerTabNavigation();
      }
      
    } catch (error) {
      console.error('Error saving AIR:', error);
      this.kirProfile.showToast('Ralat menyimpan AIR: ' + error.message, 'error');
    } finally {
      this.hideDrawerSaveLoading(tabId);
    }
  }

  showDrawerSaveLoading(tabId) {
    const saveBtn = document.querySelector(`form[data-drawer-tab="${tabId}"] .btn-primary`);
    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menyimpan...';
    }
  }

  hideDrawerSaveLoading(tabId) {
    const saveBtn = document.querySelector(`form[data-drawer-tab="${tabId}"] .btn-primary`);
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.innerHTML = 'Simpan';
    }
  }

  toggleSmokingFields(value) {
    const smokingFields = document.querySelector('.smoking-fields');
    if (smokingFields) {
      smokingFields.style.display = value === 'Ya' ? 'block' : 'none';
    }
  }

  // Data Management Methods
  async loadAIRData() {
    try {
      if (!this.kirProfile.kirId) {
        this.airData = [];
        return;
      }
      
      this.airData = await this.kirProfile.AIRService.getAIRByKIRId(this.kirProfile.kirId) || [];
    } catch (error) {
      console.error('Error loading AIR data:', error);
      this.airData = [];
      this.kirProfile.showToast('Ralat memuatkan data AIR: ' + error.message, 'error');
    }
  }

  // Utility Methods
  calculateAge(birthDate) {
    if (!birthDate) return 0;
    
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }

  escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  setupEventListeners() {
    // Make the tab instance globally accessible for onclick handlers
    window.airTab = this;
    
    // Load initial data
    this.loadAIRData().then(() => {
      // Re-render if needed after data load
      if (!this.isDrawerOpen) {
        const tabContent = document.querySelector('[data-tab="air"]');
        if (tabContent) {
          tabContent.innerHTML = this.render();
          // Re-setup event listeners after re-render
          window.airTab = this;
        }
      }
    });
    
    // Set up form change tracking for drawer forms
    const drawerForms = document.querySelectorAll('.air-form');
    drawerForms.forEach(form => {
      const tabId = form.dataset.drawerTab;
      
      form.addEventListener('input', () => {
        this.drawerDirtyTabs.add(tabId);
        // Update navigation to show dirty indicator
        const drawerTabs = document.querySelector('.drawer-tabs');
        if (drawerTabs) {
          drawerTabs.innerHTML = this.createDrawerTabNavigation();
        }
      });
      
      form.addEventListener('change', () => {
        this.drawerDirtyTabs.add(tabId);
        // Update navigation to show dirty indicator
        const drawerTabs = document.querySelector('.drawer-tabs');
        if (drawerTabs) {
          drawerTabs.innerHTML = this.createDrawerTabNavigation();
        }
      });
    });
  }

  async save() {
    // AIR data is managed through individual CRUD operations in the drawer
    // This method can be used for any general tab-level operations
    try {
      // Refresh data to ensure consistency
      await this.loadAIRData();
      
      this.kirProfile.showToast('Data AIR berjaya disegerakkan', 'success');
      return true;
      
    } catch (error) {
      console.error('Error syncing AIR data:', error);
      this.kirProfile.showToast('Ralat menyegerakkan data AIR: ' + error.message, 'error');
      return false;
    }
  }
}