import BaseTab from '../shared/BaseTab.js';

export default class BantuanBulananTab extends BaseTab {
  constructor(kirProfile) {
    super(kirProfile);
    this.bantuanBulananData = [];
  }

  render() {
    return `
      <div class="info-card">
        <h3><i class="fas fa-hand-holding-usd"></i> Bantuan Bulanan</h3>
        
        <div class="form-container">
          <div class="form-grid">
            <div class="form-group full-width">
              <div class="total-display">
                <div class="total-card">
                  <div class="total-label">Jumlah Bantuan Bulanan</div>
                  <div class="total-amount" id="total-bantuan-bulanan">RM 0.00</div>
                </div>
              </div>
            </div>
            
            <div class="form-group full-width">
              <div class="section-header">
                <h4>Senarai Bantuan Bulanan</h4>
                <button type="button" class="btn btn-primary btn-sm" onclick="bantuanBulananTab.openBantuanBulananModal()">
                  <i class="fas fa-plus"></i> Tambah Bantuan
                </button>
              </div>
            </div>
            
            <div class="form-group full-width">
              <div class="bantuan-bulanan-table-container" id="bantuan-bulanan-table">
                ${this.createBantuanBulananTable()}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      ${this.createBantuanBulananModal()}
    `;
  }

  createBantuanBulananTable() {
    if (!this.bantuanBulananData || this.bantuanBulananData.length === 0) {
      return `
        <div class="empty-state">
          <i class="fas fa-hand-holding-usd"></i>
          <p>Tiada bantuan bulanan direkodkan</p>
          <button type="button" class="btn btn-primary" onclick="bantuanBulananTab.openBantuanBulananModal()">
            <i class="fas fa-plus"></i> Tambah Bantuan Pertama
          </button>
        </div>
      `;
    }

    const tableRows = this.bantuanBulananData.map(item => `
      <tr>
        <td>${this.formatDate(item.tarikh_mula)}</td>
        <td>${this.escapeHtml(item.agensi)}</td>
        <td>${this.formatCurrency(item.kadar)}</td>
        <td>
          <span class="frequency-badge frequency-${item.kekerapan.toLowerCase()}">
            ${this.getFrequencyBadge(item.kekerapan)}
          </span>
        </td>
        <td>${this.escapeHtml(item.cara_terima)}</td>
        <td>${this.formatCurrency(this.calculateMonthlyValue(item.kadar, item.kekerapan))}</td>
        <td>
          <div class="action-buttons">
            <button class="btn btn-sm btn-edit" onclick="bantuanBulananTab.editBantuanBulanan('${item.id}')" title="Edit">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-sm btn-delete" onclick="bantuanBulananTab.deleteBantuanBulanan('${item.id}')" title="Padam">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');

    return `
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Tarikh Mula</th>
              <th>Agensi</th>
              <th>Kadar</th>
              <th>Kekerapan</th>
              <th>Cara Terima</th>
              <th>Nilai Bulanan</th>
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

  createBantuanBulananModal() {
    return `
      <div id="bantuan-bulanan-modal" class="modal" style="display: none;">
        <div class="modal-content">
          <div class="modal-header">
            <h4 id="bantuan-bulanan-modal-title">Tambah Bantuan Bulanan</h4>
            <button class="modal-close" onclick="bantuanBulananTab.closeBantuanBulananModal()">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <form id="bantuan-bulanan-form" onsubmit="bantuanBulananTab.saveBantuanBulanan(event)">
            <div class="modal-body">
              <div class="form-row">
                <div class="form-group">
                  <label for="tarikh_mula">Tarikh Mula *</label>
                  <input type="date" id="tarikh_mula" name="tarikh_mula" required>
                </div>
                
                <div class="form-group">
                  <label for="agensi">Agensi *</label>
                  <input type="text" id="agensi" name="agensi" required placeholder="Nama agensi pemberi bantuan">
                </div>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="kadar">Kadar (RM) *</label>
                  <input type="number" id="kadar" name="kadar" step="0.01" min="0" required placeholder="0.00">
                </div>
                
                <div class="form-group">
                  <label for="kekerapan">Kekerapan *</label>
                  <select id="kekerapan" name="kekerapan" required>
                    <option value="">Pilih kekerapan</option>
                    <option value="Mingguan">Mingguan</option>
                    <option value="Bulanan">Bulanan</option>
                    <option value="Tahunan">Tahunan</option>
                    <option value="Sekali">Sekali</option>
                  </select>
                </div>
              </div>
              
              <div class="form-group">
                <label for="cara_terima">Cara Terima *</label>
                <input type="text" id="cara_terima" name="cara_terima" required placeholder="Contoh: Tunai, Bank, Cek">
              </div>
              
              <div class="form-group">
                <label for="catatan">Catatan</label>
                <textarea id="catatan" name="catatan" rows="3" placeholder="Catatan tambahan (pilihan)"></textarea>
              </div>
            </div>
            
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" onclick="bantuanBulananTab.closeBantuanBulananModal()">
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

  // Modal Methods
  openBantuanBulananModal(editData = null) {
    const modal = document.getElementById('bantuan-bulanan-modal');
    const form = document.getElementById('bantuan-bulanan-form');
    const title = document.getElementById('bantuan-bulanan-modal-title');
    
    if (editData) {
      title.textContent = 'Edit Bantuan Bulanan';
      form.dataset.editId = editData.id;
      form.elements.tarikh_mula.value = editData.tarikh_mula;
      form.elements.agensi.value = editData.agensi;
      form.elements.kadar.value = editData.kadar;
      form.elements.kekerapan.value = editData.kekerapan;
      form.elements.cara_terima.value = editData.cara_terima;
      form.elements.catatan.value = editData.catatan || '';
    } else {
      title.textContent = 'Tambah Bantuan Bulanan';
      form.removeAttribute('data-edit-id');
      form.reset();
    }
    
    modal.style.display = 'block';
    form.elements.tarikh_mula.focus();
  }

  closeBantuanBulananModal() {
    const modal = document.getElementById('bantuan-bulanan-modal');
    const form = document.getElementById('bantuan-bulanan-form');
    modal.style.display = 'none';
    form.reset();
    form.removeAttribute('data-edit-id');
  }

  // CRUD Methods
  async saveBantuanBulanan(event) {
    event.preventDefault();
    
    try {
      const formData = new FormData(event.target);
      const data = {
        tarikh_mula: formData.get('tarikh_mula'),
        agensi: formData.get('agensi').trim(),
        kadar: parseFloat(formData.get('kadar')) || 0,
        kekerapan: formData.get('kekerapan'),
        cara_terima: formData.get('cara_terima').trim(),
        catatan: formData.get('catatan')?.trim() || ''
      };

      // Validation
      if (!data.tarikh_mula) {
        this.kirProfile.showToast('Tarikh mula diperlukan', 'error');
        return;
      }
      if (!data.agensi) {
        this.kirProfile.showToast('Agensi diperlukan', 'error');
        return;
      }
      if (data.kadar < 0) {
        this.kirProfile.showToast('Kadar tidak boleh negatif', 'error');
        return;
      }
      if (!data.kekerapan) {
        this.kirProfile.showToast('Kekerapan diperlukan', 'error');
        return;
      }
      if (!data.cara_terima) {
        this.kirProfile.showToast('Cara terima diperlukan', 'error');
        return;
      }

      const editId = event.target.dataset.editId;
      if (editId) {
        await this.kirProfile.kirService.updateBantuanBulanan(editId, data);
        this.kirProfile.showToast('Bantuan bulanan berjaya dikemas kini', 'success');
      } else {
        await this.kirProfile.kirService.addBantuanBulanan(this.kirProfile.kirId, data);
        this.kirProfile.showToast('Bantuan bulanan berjaya ditambah', 'success');
      }
      
      this.closeBantuanBulananModal();
      await this.loadBantuanBulananData();
      this.refreshTable();
      this.updateTotalBantuanBulanan();
      
    } catch (error) {
      console.error('Error saving bantuan bulanan:', error);
      const message = error.message.includes('permission') ? 
        'Akses ditolak: sila semak peranan dan peraturan pangkalan data.' : 
        'Ralat menyimpan data bantuan bulanan';
      this.kirProfile.showToast(message, 'error');
    }
  }

  async editBantuanBulanan(id) {
    try {
      const item = this.bantuanBulananData.find(item => item.id === id);
      if (!item) {
        this.kirProfile.showToast('Bantuan bulanan tidak dijumpai', 'error');
        return;
      }
      
      this.openBantuanBulananModal(item);
      
    } catch (error) {
      console.error('Error editing bantuan bulanan:', error);
      this.kirProfile.showToast('Ralat membuka borang edit', 'error');
    }
  }

  async deleteBantuanBulanan(id) {
    if (!confirm('Adakah anda pasti untuk memadam bantuan bulanan ini?')) {
      return;
    }

    try {
      await this.kirProfile.kirService.deleteBantuanBulanan(id);
      this.kirProfile.showToast('Bantuan bulanan berjaya dipadam', 'success');
      await this.loadBantuanBulananData();
      this.refreshTable();
      this.updateTotalBantuanBulanan();
      
    } catch (error) {
      console.error('Error deleting bantuan bulanan:', error);
      const message = error.message.includes('permission') ? 
        'Akses ditolak: sila semak peranan dan peraturan pangkalan data.' : 
        'Ralat memadam data bantuan bulanan';
      this.kirProfile.showToast(message, 'error');
    }
  }

  // Data Management
  async loadBantuanBulananData() {
    try {
      this.bantuanBulananData = await this.kirProfile.kirService.getBantuanBulananByKIR(this.kirProfile.kirId) || [];
    } catch (error) {
      console.error('Error loading bantuan bulanan data:', error);
      this.bantuanBulananData = [];
    }
  }

  refreshTable() {
    const tableContainer = document.getElementById('bantuan-bulanan-table');
    if (tableContainer) {
      tableContainer.innerHTML = this.createBantuanBulananTable();
    }
  }

  // Calculation Methods
  calculateTotalBantuanBulanan() {
    return this.bantuanBulananData.reduce((total, item) => {
      return total + this.calculateMonthlyValue(item.kadar, item.kekerapan);
    }, 0);
  }

  updateTotalBantuanBulanan() {
    const totalElement = document.getElementById('total-bantuan-bulanan');
    if (totalElement) {
      const total = this.calculateTotalBantuanBulanan();
      totalElement.textContent = this.formatCurrency(total);
    }
  }

  calculateMonthlyValue(kadar, kekerapan) {
    const amount = parseFloat(kadar) || 0;
    
    switch (kekerapan?.toLowerCase()) {
      case 'mingguan':
        return amount * 4.33; // Average weeks per month
      case 'bulanan':
        return amount;
      case 'tahunan':
        return amount / 12;
      case 'sekali':
        return 0; // One-time payment doesn't contribute to monthly
      default:
        return amount; // Default to monthly
    }
  }

  // Utility Methods
  formatCurrency(amount) {
    const num = parseFloat(amount) || 0;
    return `RM ${num.toLocaleString('ms-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  formatDate(dateString) {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ms-MY');
    } catch (error) {
      return dateString;
    }
  }

  getFrequencyBadge(kekerapan) {
    const badges = {
      'Mingguan': 'Mingguan',
      'Bulanan': 'Bulanan', 
      'Tahunan': 'Tahunan',
      'Sekali': 'Sekali'
    };
    return badges[kekerapan] || kekerapan;
  }

  escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  setupEventListeners() {
    // Make the tab instance globally accessible for onclick handlers
    window.bantuanBulananTab = this;
    
    // Load initial data
    this.loadBantuanBulananData().then(() => {
      this.refreshTable();
      this.updateTotalBantuanBulanan();
    });
    
    // Set up modal close on outside click
    const modal = document.getElementById('bantuan-bulanan-modal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeBantuanBulananModal();
        }
      });
    }
  }

  async save() {
    // Bantuan Bulanan data is managed through individual CRUD operations
    // No form-level save needed as data is already persisted
    return {};
  }
}