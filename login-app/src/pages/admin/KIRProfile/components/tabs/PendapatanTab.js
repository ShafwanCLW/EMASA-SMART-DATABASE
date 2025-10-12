import { BaseTab } from '../shared/BaseTab.js';
import { FormHelpers } from '../shared/FormHelpers.js';

export class PendapatanTab extends BaseTab {
  constructor(kirProfile) {
    super(kirProfile, 'pendapatan');
    this.pendapatanData = [];
  }

  render() {
    return `
      <div class="kir-form">
        <div class="form-section">
          <h4><i class="fas fa-money-bill-wave"></i> Pendapatan KIR</h4>
          
          <div class="form-grid">
            <div class="form-group full-width">
              <div class="summary-display">
                <div class="summary-item">
                  <span class="summary-label">Jumlah Keseluruhan Pendapatan Bulanan:</span>
                  <span class="summary-value" id="total-pendapatan">${this.formatCurrency(this.calculateTotalPendapatan())}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="form-section">
          <h4><i class="fas fa-chart-line"></i> Pendapatan Tetap</h4>
          <p class="section-description">Pendapatan yang diterima secara tetap setiap bulan (Contoh: Gaji, Pencen, Elaun Tetap, Dividen)</p>
          
          <div class="form-grid">
            <div class="form-group full-width">
              <div class="section-actions">
                <button class="btn btn-primary" onclick="pendapatanTab.openPendapatanModal('Tetap')">
                  <i class="fas fa-plus"></i> Tambah Pendapatan Tetap
                </button>
              </div>
            </div>
            
            <div class="form-group full-width">
              <div class="pendapatan-table-container" id="pendapatan-tetap-table">
                ${this.createPendapatanTable('Tetap')}
              </div>
            </div>
          </div>
        </div>
        
        <div class="form-section">
          <h4><i class="fas fa-chart-bar"></i> Pendapatan Tidak Tetap</h4>
          <p class="section-description">Pendapatan yang tidak tetap atau berubah-ubah (Contoh: Kerja Sambilan, Bonus, Komisyen, Freelance)</p>
          
          <div class="form-grid">
            <div class="form-group full-width">
              <div class="section-actions">
                <button class="btn btn-primary" onclick="pendapatanTab.openPendapatanModal('Tidak Tetap')">
                  <i class="fas fa-plus"></i> Tambah Pendapatan Tidak Tetap
                </button>
              </div>
            </div>
            
            <div class="form-group full-width">
              <div class="pendapatan-table-container" id="pendapatan-tidak-tetap-table">
                ${this.createPendapatanTable('Tidak Tetap')}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      ${this.createPendapatanModal()}
    `;
  }

  createPendapatanTable(kategori) {
    const data = this.pendapatanData?.filter(item => item.kategori === kategori) || [];
    
    if (data.length === 0) {
      return `
        <div class="empty-state">
          <div class="empty-state-icon">
            <i class="fas fa-money-bill-wave"></i>
          </div>
          <h4>Tiada Pendapatan ${kategori}</h4>
          <p>Belum ada pendapatan ${kategori.toLowerCase()} yang didaftarkan.</p>
          <button class="btn btn-primary" onclick="pendapatanTab.openPendapatanModal('${kategori}')">
            <i class="fas fa-plus"></i> Tambah Pendapatan ${kategori}
          </button>
        </div>
      `;
    }
    
    // Calculate subtotal for this category
    const subtotal = data.reduce((sum, item) => sum + (parseFloat(item.jumlah) || 0), 0);
    
    const tableRows = data.map((item, index) => `
      <tr class="data-row">
        <td class="row-number">${index + 1}</td>
        <td class="source-cell">${FormHelpers.escapeHtml(item.sumber)}</td>
        <td class="amount-cell">${this.formatCurrency(item.jumlah)}</td>
        <td class="notes-cell">${FormHelpers.escapeHtml(item.catatan) || '-'}</td>
        <td class="actions-cell">
          <div class="action-buttons">
            <button class="btn btn-sm btn-edit" onclick="pendapatanTab.editPendapatan('${item.id}')" title="Edit">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-sm btn-delete" onclick="pendapatanTab.deletePendapatan('${item.id}')" title="Padam">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
    
    return `
      <div class="professional-table-container">
        <table class="professional-data-table pendapatan-table">
          <thead>
            <tr class="table-header">
              <th class="col-number">#</th>
              <th class="col-source">Sumber Pendapatan</th>
              <th class="col-amount">Jumlah (RM)</th>
              <th class="col-notes">Catatan</th>
              <th class="col-actions">Tindakan</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
            <tr class="subtotal-row">
              <td colspan="2" class="subtotal-label"><strong>Jumlah ${kategori}:</strong></td>
              <td class="subtotal-amount"><strong>${this.formatCurrency(subtotal)}</strong></td>
              <td colspan="2"></td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  }

  createPendapatanModal() {
    return `
      <div id="pendapatan-modal" class="modal" style="display: none;">
        <div class="modal-content">
          <div class="modal-header">
            <h3 id="pendapatan-modal-title">Tambah Pendapatan</h3>
            <button class="modal-close" onclick="pendapatanTab.closePendapatanModal()">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <form id="pendapatan-form" onsubmit="pendapatanTab.savePendapatan(event)">
            <div class="modal-body">
              <input type="hidden" id="pendapatan-id" name="id">
              <input type="hidden" id="pendapatan-kategori" name="kategori">
              
              <div class="form-group">
                <label for="pendapatan-sumber">Sumber *</label>
                <input type="text" id="pendapatan-sumber" name="sumber" required>
              </div>
              
              <div class="form-group">
                <label for="pendapatan-jumlah">Jumlah (RM) *</label>
                <input type="number" id="pendapatan-jumlah" name="jumlah" step="0.01" min="0" required>
              </div>
              
              <div class="form-group">
                <label for="pendapatan-catatan">Catatan</label>
                <input type="text" id="pendapatan-catatan" name="catatan">
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" onclick="pendapatanTab.closePendapatanModal()">
                Batal
              </button>
              <button type="submit" class="btn btn-primary">
                <i class="fas fa-save"></i> Simpan
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  openPendapatanModal(kategori = 'Tetap', editData = null) {
    const modal = document.getElementById('pendapatan-modal');
    const form = document.getElementById('pendapatan-form');
    const title = document.getElementById('pendapatan-modal-title');
    
    if (editData) {
      title.textContent = 'Edit Pendapatan';
      form.dataset.editId = editData.id;
      form.elements.kategori.value = editData.kategori;
      form.elements.sumber.value = editData.sumber;
      form.elements.jumlah.value = editData.jumlah;
      form.elements.catatan.value = editData.catatan || '';
    } else {
      title.textContent = 'Tambah Pendapatan';
      form.removeAttribute('data-edit-id');
      form.reset();
      form.elements.kategori.value = kategori;
    }
    
    modal.style.display = 'block';
    form.elements.sumber.focus();
  }

  closePendapatanModal() {
    const modal = document.getElementById('pendapatan-modal');
    const form = document.getElementById('pendapatan-form');
    modal.style.display = 'none';
    form.reset();
    form.removeAttribute('data-edit-id');
  }

  async savePendapatan(event) {
    event.preventDefault();
    
    try {
      const form = event.target;
      const formData = new FormData(form);
      const editId = form.dataset.editId;
      
      const pendapatanData = {
        sumber: formData.get('sumber'),
        jumlah: parseFloat(formData.get('jumlah')),
        kategori: formData.get('kategori'),
        catatan: formData.get('catatan') || ''
      };
      
      // Validate data
      if (!pendapatanData.sumber || !pendapatanData.jumlah || !pendapatanData.kategori) {
        this.kirProfile.showToast('Sila lengkapkan semua medan yang diperlukan', 'error');
        return;
      }
      
      if (pendapatanData.jumlah < 0) {
        this.kirProfile.showToast('Jumlah pendapatan tidak boleh negatif', 'error');
        return;
      }
      
      let result;
      if (editId) {
        // Update existing pendapatan
        result = await this.kirProfile.KIRService.updatePendapatan(editId, pendapatanData);
      } else {
        // Add new pendapatan
        pendapatanData.kir_id = this.kirProfile.kirId;
        result = await this.kirProfile.KIRService.addPendapatan(pendapatanData);
      }
      
      this.kirProfile.showToast(`Pendapatan berjaya ${editId ? 'dikemaskini' : 'ditambah'}`, 'success');
      
      // Refresh data and UI
      await this.loadPendapatanData();
      this.refreshTables();
      this.updateTotalPendapatan();
      
      this.closePendapatanModal();
      
    } catch (error) {
      console.error('Error saving pendapatan:', error);
      const message = error.message.includes('permission') ? 
        'Akses ditolak: sila semak peranan dan peraturan pangkalan data.' : 
        'Ralat menyimpan data pendapatan';
      this.kirProfile.showToast(message, 'error');
    }
  }

  async editPendapatan(id) {
    const pendapatan = this.pendapatanData.find(item => item.id === id);
    if (!pendapatan) {
      this.kirProfile.showToast('Data pendapatan tidak dijumpai', 'error');
      return;
    }
    
    this.openPendapatanModal(pendapatan.kategori, pendapatan);
  }

  async deletePendapatan(id) {
    if (!confirm('Adakah anda pasti untuk memadam pendapatan ini?')) {
      return;
    }

    try {
      await this.kirProfile.KIRService.deletePendapatan(id);
      this.kirProfile.showToast('Pendapatan berjaya dipadam', 'success');
      
      // Refresh data and UI
      await this.loadPendapatanData();
      this.refreshTables();
      this.updateTotalPendapatan();
      
    } catch (error) {
      console.error('Error deleting pendapatan:', error);
      const message = error.message.includes('permission') ? 
        'Akses ditolak: sila semak peranan dan peraturan pangkalan data.' : 
        'Ralat memadam data pendapatan';
      this.kirProfile.showToast(message, 'error');
    }
  }

  async loadPendapatanData() {
    try {
      this.pendapatanData = await this.kirProfile.KIRService.getPendapatanByKIR(this.kirProfile.kirId) || [];
    } catch (error) {
      console.error('Error loading pendapatan data:', error);
      this.pendapatanData = [];
    }
  }

  refreshTables() {
    // Refresh Tetap table
    const tetapContainer = document.getElementById('pendapatan-tetap-table');
    if (tetapContainer) {
      tetapContainer.innerHTML = this.createPendapatanTable('Tetap');
    }
    
    // Refresh Tidak Tetap table
    const tidakTetapContainer = document.getElementById('pendapatan-tidak-tetap-table');
    if (tidakTetapContainer) {
      tidakTetapContainer.innerHTML = this.createPendapatanTable('Tidak Tetap');
    }
  }

  calculateTotalPendapatan() {
    return this.pendapatanData.reduce((total, item) => total + (parseFloat(item.jumlah) || 0), 0);
  }

  updateTotalPendapatan() {
    const totalElement = document.getElementById('total-pendapatan');
    if (totalElement) {
      totalElement.textContent = this.formatCurrency(this.calculateTotalPendapatan());
    }
  }

  formatCurrency(amount) {
    const num = parseFloat(amount) || 0;
    return `RM ${num.toLocaleString('ms-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  setupEventListeners() {
    // Make the tab instance globally accessible for onclick handlers
    window.pendapatanTab = this;
    
    // Load initial data
    this.loadPendapatanData().then(() => {
      this.refreshTables();
      this.updateTotalPendapatan();
    });
    
    // Set up modal close on outside click
    const modal = document.getElementById('pendapatan-modal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closePendapatanModal();
        }
      });
    }
  }

  async save() {
    // For Pendapatan tab, data is saved through individual add/edit operations
    // This method can be used for any general tab-level operations
    try {
      // Refresh data to ensure consistency
      await this.loadPendapatanData();
      this.refreshTables();
      this.updateTotalPendapatan();
      
      this.kirProfile.showToast('Data pendapatan berjaya disegerakkan', 'success');
      return true;
      
    } catch (error) {
      console.error('Error syncing pendapatan data:', error);
      this.kirProfile.showToast('Ralat menyegerakkan data pendapatan: ' + error.message, 'error');
      return false;
    }
  }
}