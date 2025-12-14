import { BaseTab } from '../shared/BaseTab.js';

export class PendapatanTab extends BaseTab {
  constructor(kirProfile) {
    super(kirProfile);
    this.tabId = 'pendapatan';
  }

  render() {
    const data = this.data || {};
    
    return `
      <form class="kir-form" data-tab="pendapatan">
        <div class="form-section">
          <h3>Pendapatan</h3>
          
          <div class="form-row">
            <div class="form-group">
              <label for="pendapatan_utama">Sumber Pendapatan Utama</label>
              <input type="text" id="pendapatan_utama" name="pendapatan_utama" value="${data.pendapatan_utama || ''}" placeholder="Contoh: Gaji, Perniagaan, Pencen">
            </div>
            
            <div class="form-group">
              <label for="jumlah_pendapatan_utama">Jumlah Pendapatan Utama (RM)</label>
              <input type="number" id="jumlah_pendapatan_utama" name="jumlah_pendapatan_utama" value="${data.jumlah_pendapatan_utama || ''}" step="0.01" min="0">
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="pendapatan_sampingan">Sumber Pendapatan Sampingan (Sekiranya ada)</label>
              <input type="text" id="pendapatan_sampingan" name="pendapatan_sampingan" value="${data.pendapatan_sampingan || ''}" placeholder="Contoh: Kerja sambilan, Komisyen">
            </div>
            
            <div class="form-group">
              <label for="jumlah_pendapatan_sampingan">Jumlah Pendapatan Sampingan (RM)</label>
              <input type="number" id="jumlah_pendapatan_sampingan" name="jumlah_pendapatan_sampingan" value="${data.jumlah_pendapatan_sampingan || ''}" step="0.01" min="0">
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="pendapatan_lain">Sumber Pendapatan Lain (Sekiranya ada)</label>
              <input type="text" id="pendapatan_lain" name="pendapatan_lain" value="${data.pendapatan_lain || ''}" placeholder="Contoh: Dividen, Sewa">
            </div>
            
            <div class="form-group">
              <label for="jumlah_pendapatan_lain">Jumlah Pendapatan Lain (RM)</label>
              <input type="number" id="jumlah_pendapatan_lain" name="jumlah_pendapatan_lain" value="${data.jumlah_pendapatan_lain || ''}" step="0.01" min="0">
            </div>
          </div>
          
          <div class="form-group">
            <label for="jumlah_keseluruhan_pendapatan">Jumlah Keseluruhan Pendapatan Bulanan (RM)</label>
            <input type="number" id="jumlah_keseluruhan_pendapatan" name="jumlah_keseluruhan_pendapatan" value="${data.jumlah_keseluruhan_pendapatan || ''}" step="0.01" min="0" readonly>
          </div>
          
          <div class="form-group">
            <label for="catatan_pendapatan">Catatan Tambahan (Sekiranya ada)</label>
            <textarea id="catatan_pendapatan" name="catatan_pendapatan" rows="3" placeholder="Sebarang maklumat tambahan mengenai pendapatan">${data.catatan_pendapatan || ''}</textarea>
          </div>
        </div>
        
        <div class="form-actions">
          <button type="button" class="btn btn-primary" onclick="kirProfile.saveTab('pendapatan')">Simpan</button>
        </div>
      </form>
    `;
  }

  async save() {
    try {
      const formData = this.getFormData();
      
      // Calculate total income automatically
      const utama = parseFloat(formData.jumlah_pendapatan_utama) || 0;
      const sampingan = parseFloat(formData.jumlah_pendapatan_sampingan) || 0;
      const lain = parseFloat(formData.jumlah_pendapatan_lain) || 0;
      
      formData.jumlah_keseluruhan_pendapatan = utama + sampingan + lain;

      // Save via KIRService
      await this.kirProfile.kirService.updateRelatedDocument(this.kirProfile.kirId, 'pendapatan', formData);
      
      // Update local cache
      this.updateRelatedDataCache(formData);
      
      // Clear dirty state
      this.clearDirty();
      
      this.showToast('Data pendapatan berjaya disimpan', 'success');
      return true;
      
    } catch (error) {
      console.error('Error saving pendapatan data:', error);
      this.showToast('Ralat menyimpan data pendapatan: ' + error.message, 'error');
      return false;
    }
  }

  validate() {
    return true;
  }

  setupEventListeners() {
    // Auto-calculate total when individual amounts change
    const amountFields = ['jumlah_pendapatan_utama', 'jumlah_pendapatan_sampingan', 'jumlah_pendapatan_lain'];
    
    amountFields.forEach(fieldName => {
      const field = document.getElementById(fieldName);
      if (field) {
        field.addEventListener('input', () => {
          this.calculateAndUpdateTotal();
        });
      }
    });

    // Mark as dirty when form changes
    const form = document.querySelector(`[data-tab="${this.tabId}"]`);
    if (form) {
      form.addEventListener('input', () => {
        this.markDirty();
      });
    }
  }

  calculateAndUpdateTotal() {
    const utama = parseFloat(document.getElementById('jumlah_pendapatan_utama')?.value) || 0;
    const sampingan = parseFloat(document.getElementById('jumlah_pendapatan_sampingan')?.value) || 0;
    const lain = parseFloat(document.getElementById('jumlah_pendapatan_lain')?.value) || 0;
    
    const total = utama + sampingan + lain;
    
    const totalField = document.getElementById('jumlah_keseluruhan_pendapatan');
    if (totalField) {
      totalField.value = total.toFixed(2);
    }
  }
}
