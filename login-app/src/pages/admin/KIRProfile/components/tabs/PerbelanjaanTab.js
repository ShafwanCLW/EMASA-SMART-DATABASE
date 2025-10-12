import { BaseTab } from '../shared/BaseTab.js';
import { FormHelpers } from '../shared/FormHelpers.js';

export class PerbelanjaanTab extends BaseTab {
  constructor(kirProfile) {
    super(kirProfile, 'perbelanjaan');
    this.perbelanjaanData = [];
    this.currentFilter = 'all';
  }

  render(data = {}) {
    return `
      <div class="kir-form">
        <div class="form-section">
          <h4><i class="fas fa-shopping-cart"></i> Perbelanjaan KIR</h4>
          
          <div class="form-grid">
            <div class="form-group full-width">
              <div class="summary-display">
                <div class="summary-item">
                  <span class="summary-label">Jumlah Perbelanjaan Bulanan:</span>
                  <span class="summary-value" id="total-perbelanjaan">RM 0.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="form-section">
          <h4><i class="fas fa-list"></i> Senarai Perbelanjaan</h4>
          <p class="section-description">Perbelanjaan rutin bulanan mengikut kategori</p>
          
          <div class="form-grid">
            <div class="form-group full-width">
              <div class="section-actions">
                <button class="btn btn-primary" onclick="perbelanjaanTab.openPerbelanjaanModal()">
                  <i class="fas fa-plus"></i> Tambah Perbelanjaan
                </button>
              </div>
            </div>
            
            <div class="form-group full-width">
              <label>Tapis mengikut Kategori</label>
              <div class="category-filters">
                <button class="filter-btn active" data-category="all" onclick="perbelanjaanTab.filterPerbelanjaan('all')">
                  <i class="fas fa-th"></i> Semua
                </button>
                <button class="filter-btn" data-category="Utiliti-Air" onclick="perbelanjaanTab.filterPerbelanjaan('Utiliti-Air')">
                  <i class="fas fa-tint"></i> Air
                </button>
                <button class="filter-btn" data-category="Utiliti-Elektrik" onclick="perbelanjaanTab.filterPerbelanjaan('Utiliti-Elektrik')">
                  <i class="fas fa-bolt"></i> Elektrik
                </button>
                <button class="filter-btn" data-category="Sewa" onclick="perbelanjaanTab.filterPerbelanjaan('Sewa')">
                  <i class="fas fa-home"></i> Sewa
                </button>
                <button class="filter-btn" data-category="Ansuran" onclick="perbelanjaanTab.filterPerbelanjaan('Ansuran')">
                  <i class="fas fa-credit-card"></i> Ansuran
                </button>
                <button class="filter-btn" data-category="Makanan" onclick="perbelanjaanTab.filterPerbelanjaan('Makanan')">
                  <i class="fas fa-utensils"></i> Makanan
                </button>
                <button class="filter-btn" data-category="Sekolah-Anak" onclick="perbelanjaanTab.filterPerbelanjaan('Sekolah-Anak')">
                  <i class="fas fa-school"></i> Sekolah
                </button>
                <button class="filter-btn" data-category="Rawatan" onclick="perbelanjaanTab.filterPerbelanjaan('Rawatan')">
                  <i class="fas fa-medkit"></i> Rawatan
                </button>
                <button class="filter-btn" data-category="Lain-lain" onclick="perbelanjaanTab.filterPerbelanjaan('Lain-lain')">
                   <i class="fas fa-ellipsis-h"></i> Lain-lain
                 </button>
               </div>
             </div>
             
             <div class="form-group full-width">
               <div class="perbelanjaan-table-container" id="perbelanjaan-table">
                 ${this.createPerbelanjaanTable()}
               </div>
             </div>
             
             <div class="form-group full-width">
               <div class="perbelanjaan-subtotals" id="perbelanjaan-subtotals">
                 ${this.createPerbelanjaanSubtotals()}
               </div>
             </div>
           </div>
         </div>
       </div>
       
       ${this.createPerbelanjaanModal()}
     `;
  }

  createPerbelanjaanTable() {
    let data = this.perbelanjaanData || [];
    
    // Apply filter
    if (this.currentFilter !== 'all') {
      data = data.filter(item => item.kategori === this.currentFilter);
    }

    if (data.length === 0) {
      const filterText = this.currentFilter === 'all' ? '' : ` kategori ${this.formatKategoriPerbelanjaan(this.currentFilter)}`;
      return `
        <div class="empty-state">
          <div class="empty-state-icon">
            <i class="fas fa-shopping-cart"></i>
          </div>
          <h4>Tiada Perbelanjaan${filterText}</h4>
          <p>Belum ada perbelanjaan${filterText.toLowerCase()} yang didaftarkan.</p>
          <button class="btn btn-primary" onclick="perbelanjaanTab.openPerbelanjaanModal()">
            <i class="fas fa-plus"></i> Tambah Perbelanjaan
          </button>
        </div>
      `;
    }

    const tableRows = data.map((item, index) => `
      <tr class="data-row">
        <td class="row-number">${index + 1}</td>
        <td class="category-cell">
          <div class="category-display">
            <i class="fas fa-${this.getCategoryIcon(item.kategori)}"></i>
            ${this.formatKategoriPerbelanjaan(item.kategori)}
          </div>
        </td>
        <td class="amount-cell">${this.formatCurrency(item.jumlah)}</td>
        <td class="notes-cell">${FormHelpers.escapeHtml(item.catatan) || '-'}</td>
        <td class="actions-cell">
          <div class="action-buttons">
            <button class="btn btn-sm btn-edit" onclick="perbelanjaanTab.editPerbelanjaan('${item.id}')" title="Edit">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-sm btn-delete" onclick="perbelanjaanTab.deletePerbelanjaan('${item.id}')" title="Padam">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');

    return `
      <div class="professional-table-container">
        <table class="professional-data-table perbelanjaan-table">
          <thead>
            <tr class="table-header">
              <th class="col-number">#</th>
              <th class="col-category">Kategori</th>
              <th class="col-amount">Jumlah (RM)</th>
              <th class="col-notes">Catatan</th>
              <th class="col-actions">Tindakan</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </div>
    `;
  }

  createPerbelanjaanSubtotals() {
    const data = this.perbelanjaanData || [];
    const categories = {
      'Utiliti-Air': 'Air',
      'Utiliti-Elektrik': 'Elektrik',
      'Sewa': 'Sewa',
      'Ansuran': 'Ansuran',
      'Makanan': 'Makanan',
      'Sekolah-Anak': 'Sekolah Anak',
      'Rawatan': 'Rawatan',
      'Lain-lain': 'Lain-lain'
    };
    
    const subtotals = Object.keys(categories).map(kategori => {
      const categoryData = data.filter(item => item.kategori === kategori);
      const total = categoryData.reduce((sum, item) => sum + (parseFloat(item.jumlah) || 0), 0);
      
      return {
        kategori: categories[kategori],
        total: total
      };
    }).filter(item => item.total > 0);
    
    if (subtotals.length === 0) {
      return '';
    }
    
    const subtotalRows = subtotals.map(item => `
      <div class="subtotal-row">
        <span class="subtotal-label">${item.kategori}:</span>
        <span class="subtotal-amount">${this.formatCurrency(item.total)}</span>
      </div>
    `).join('');
    
    return `
      <div class="subtotals-container">
        <h4>Subtotal mengikut Kategori</h4>
        ${subtotalRows}
      </div>
    `;
  }

  createPerbelanjaanModal() {
    return `
      <div id="perbelanjaan-modal" class="modal" style="display: none;">
        <div class="modal-content">
          <div class="modal-header">
            <h3 id="perbelanjaan-modal-title">Tambah Perbelanjaan</h3>
            <span class="close" onclick="perbelanjaanTab.closePerbelanjaanModal()">&times;</span>
          </div>
          <form id="perbelanjaan-form" onsubmit="perbelanjaanTab.savePerbelanjaan(event)">
            <div class="modal-body">
              <div class="form-group">
                <label for="kategori">Kategori Perbelanjaan *</label>
                <select id="kategori" name="kategori" required>
                  <option value="">Pilih Kategori</option>
                  <option value="Utiliti-Air">Utiliti - Air</option>
                  <option value="Utiliti-Elektrik">Utiliti - Elektrik</option>
                  <option value="Sewa">Sewa</option>
                  <option value="Ansuran">Ansuran</option>
                  <option value="Makanan">Makanan</option>
                  <option value="Sekolah-Anak">Sekolah Anak</option>
                  <option value="Rawatan">Rawatan</option>
                  <option value="Lain-lain">Lain-lain</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="jumlah">Jumlah (RM) *</label>
                <input type="number" id="jumlah" name="jumlah" step="0.01" min="0" required>
              </div>
              
              <div class="form-group">
                <label for="catatan">Catatan</label>
                <textarea id="catatan" name="catatan" rows="3" placeholder="Catatan tambahan (pilihan)"></textarea>
              </div>
            </div>
            
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" onclick="perbelanjaanTab.closePerbelanjaanModal()">
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
  openPerbelanjaanModal(editData = null) {
    const modal = document.getElementById('perbelanjaan-modal');
    const form = document.getElementById('perbelanjaan-form');
    const title = document.getElementById('perbelanjaan-modal-title');
    
    if (editData) {
      title.textContent = 'Edit Perbelanjaan';
      form.dataset.editId = editData.id;
      form.elements.kategori.value = editData.kategori;
      form.elements.jumlah.value = editData.jumlah;
      form.elements.catatan.value = editData.catatan || '';
    } else {
      title.textContent = 'Tambah Perbelanjaan';
      form.removeAttribute('data-edit-id');
      form.reset();
    }
    
    modal.style.display = 'block';
    form.elements.kategori.focus();
  }

  closePerbelanjaanModal() {
    const modal = document.getElementById('perbelanjaan-modal');
    const form = document.getElementById('perbelanjaan-form');
    modal.style.display = 'none';
    form.reset();
    form.removeAttribute('data-edit-id');
  }

  async savePerbelanjaan(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    const data = {
      kategori: formData.get('kategori'),
      jumlah: parseFloat(formData.get('jumlah')) || 0,
      catatan: formData.get('catatan')?.trim() || ''
    };

    // Validation
    if (!data.kategori) {
      this.kirProfile.showToast('Kategori perbelanjaan diperlukan', 'error');
      return;
    }
    if (data.jumlah < 0) {
      this.kirProfile.showToast('Jumlah tidak boleh negatif', 'error');
      return;
    }

    try {
      const editId = form.dataset.editId;
      
      if (editId) {
        // Update existing perbelanjaan
        await this.kirProfile.KIRService.updatePerbelanjaan(editId, data);
        this.kirProfile.showToast('Perbelanjaan berjaya dikemaskini', 'success');
      } else {
        // Add new perbelanjaan
        data.kir_id = this.kirProfile.kirId;
        await this.kirProfile.KIRService.addPerbelanjaan(data);
        this.kirProfile.showToast('Perbelanjaan berjaya ditambah', 'success');
      }
      
      this.closePerbelanjaanModal();
      await this.loadPerbelanjaanData();
      this.refreshTable();
      this.updateTotalPerbelanjaan();
      
    } catch (error) {
      console.error('Error saving perbelanjaan:', error);
      const message = error.message.includes('permission') ? 
        'Akses ditolak: sila semak peranan dan peraturan pangkalan data.' : 
        'Ralat menyimpan data perbelanjaan';
      this.kirProfile.showToast(message, 'error');
    }
  }

  async editPerbelanjaan(id) {
    const item = this.perbelanjaanData.find(p => p.id === id);
    if (item) {
      this.openPerbelanjaanModal(item);
    }
  }

  async deletePerbelanjaan(id) {
    if (!confirm('Adakah anda pasti untuk memadam perbelanjaan ini?')) {
      return;
    }

    try {
      await this.kirProfile.KIRService.deletePerbelanjaan(id);
      this.kirProfile.showToast('Perbelanjaan berjaya dipadam', 'success');
      await this.loadPerbelanjaanData();
      this.refreshTable();
      this.updateTotalPerbelanjaan();
    } catch (error) {
      console.error('Error deleting perbelanjaan:', error);
      const message = error.message.includes('permission') ? 
        'Akses ditolak: sila semak peranan dan peraturan pangkalan data.' : 
        'Ralat memadam data perbelanjaan';
      this.kirProfile.showToast(message, 'error');
    }
  }

  // Filter Methods
  filterPerbelanjaan(category) {
    this.currentFilter = category;
    
    // Update filter button states
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.category === category) {
        btn.classList.add('active');
      }
    });
    
    // Refresh table with filter
    this.refreshTable();
  }

  // Data Methods
  async loadPerbelanjaanData() {
    try {
      this.perbelanjaanData = await this.kirProfile.KIRService.getPerbelanjaanByKIR(this.kirProfile.kirId);
    } catch (error) {
      console.error('Error loading perbelanjaan data:', error);
      this.perbelanjaanData = [];
    }
  }

  refreshTable() {
    const tableContainer = document.getElementById('perbelanjaan-table');
    const subtotalsContainer = document.getElementById('perbelanjaan-subtotals');
    
    if (tableContainer) {
      tableContainer.innerHTML = this.createPerbelanjaanTable();
    }
    
    if (subtotalsContainer) {
      subtotalsContainer.innerHTML = this.createPerbelanjaanSubtotals();
    }
  }

  calculateTotalPerbelanjaan() {
    return this.perbelanjaanData.reduce((total, item) => total + (parseFloat(item.jumlah) || 0), 0);
  }

  updateTotalPerbelanjaan() {
    const totalElement = document.getElementById('total-perbelanjaan');
    if (totalElement) {
      totalElement.textContent = this.formatCurrency(this.calculateTotalPerbelanjaan());
    }
  }

  // Utility Methods
  formatCurrency(amount) {
    const num = parseFloat(amount) || 0;
    return `RM ${num.toLocaleString('ms-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  formatKategoriPerbelanjaan(kategori) {
    const mapping = {
      'Utiliti-Air': 'Utiliti - Air',
      'Utiliti-Elektrik': 'Utiliti - Elektrik',
      'Sewa': 'Sewa',
      'Ansuran': 'Ansuran',
      'Makanan': 'Makanan',
      'Sekolah-Anak': 'Sekolah Anak',
      'Rawatan': 'Rawatan',
      'Lain-lain': 'Lain-lain'
    };
    return mapping[kategori] || kategori;
  }

  getCategoryIcon(kategori) {
    const iconMap = {
      'Utiliti-Air': 'tint',
      'Utiliti-Elektrik': 'bolt',
      'Sewa': 'home',
      'Ansuran': 'credit-card',
      'Makanan': 'utensils',
      'Sekolah-Anak': 'graduation-cap',
      'Rawatan': 'medkit',
      'Lain-lain': 'ellipsis-h'
    };
    return iconMap[kategori] || 'receipt';
  }

  setupEventListeners() {
    // Make the tab instance globally accessible for onclick handlers
    window.perbelanjaanTab = this;
    
    // Load initial data
    this.loadPerbelanjaanData().then(() => {
      this.refreshTable();
      this.updateTotalPerbelanjaan();
    });
    
    // Set up modal close on outside click
    const modal = document.getElementById('perbelanjaan-modal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closePerbelanjaanModal();
        }
      });
    }
  }

  async save() {
    // Perbelanjaan data is managed through individual CRUD operations
    // No form-level save needed as data is already persisted
    return {};
  }
}