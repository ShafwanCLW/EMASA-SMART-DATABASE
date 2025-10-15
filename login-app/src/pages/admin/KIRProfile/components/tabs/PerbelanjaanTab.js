import { BaseTab } from '../shared/BaseTab.js';

export class PerbelanjaanTab extends BaseTab {
  constructor(kirProfile) {
    super(kirProfile);
    this.tabId = 'perbelanjaan';
  }

  render() {
    const data = this.data || {};
    
    return `
      <form class="kir-form" data-tab="perbelanjaan">
        <div class="form-section">
          <h3>Perbelanjaan</h3>
          
          <div class="form-row">
            <div class="form-group">
              <label for="utiliti_air">Utiliti - Air (RM)</label>
              <input type="number" id="utiliti_air" name="utiliti_air" value="${data.utiliti_air || ''}" step="0.01" min="0" placeholder="0.00">
            </div>
            
            <div class="form-group">
              <label for="utiliti_elektrik">Utiliti - Elektrik (RM)</label>
              <input type="number" id="utiliti_elektrik" name="utiliti_elektrik" value="${data.utiliti_elektrik || ''}" step="0.01" min="0" placeholder="0.00">
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="sewa_rumah">Sewa Rumah (RM)</label>
              <input type="number" id="sewa_rumah" name="sewa_rumah" value="${data.sewa_rumah || ''}" step="0.01" min="0" placeholder="0.00">
            </div>
            
            <div class="form-group">
              <label for="ansuran_kenderaan">Ansuran Kenderaan (RM)</label>
              <input type="number" id="ansuran_kenderaan" name="ansuran_kenderaan" value="${data.ansuran_kenderaan || ''}" step="0.01" min="0" placeholder="0.00">
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="makanan">Makanan (RM)</label>
              <input type="number" id="makanan" name="makanan" value="${data.makanan || ''}" step="0.01" min="0" placeholder="0.00">
            </div>
            
            <div class="form-group">
              <label for="sekolah_anak">Perbelanjaan Sekolah Anak (RM)</label>
              <input type="number" id="sekolah_anak" name="sekolah_anak" value="${data.sekolah_anak || ''}" step="0.01" min="0" placeholder="0.00">
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="rawatan_kesihatan">Rawatan Kesihatan (RM)</label>
              <input type="number" id="rawatan_kesihatan" name="rawatan_kesihatan" value="${data.rawatan_kesihatan || ''}" step="0.01" min="0" placeholder="0.00">
            </div>
            
            <div class="form-group">
              <label for="perbelanjaan_lain">Perbelanjaan Lain (RM)</label>
              <input type="number" id="perbelanjaan_lain" name="perbelanjaan_lain" value="${data.perbelanjaan_lain || ''}" step="0.01" min="0" placeholder="0.00">
            </div>
          </div>
          
          <div class="form-group">
            <label for="jumlah_keseluruhan_perbelanjaan">Jumlah Keseluruhan Perbelanjaan Bulanan (RM)</label>
            <input type="number" id="jumlah_keseluruhan_perbelanjaan" name="jumlah_keseluruhan_perbelanjaan" value="${data.jumlah_keseluruhan_perbelanjaan || ''}" step="0.01" min="0" readonly>
          </div>
          
          <div class="form-group">
            <label for="catatan_perbelanjaan">Catatan Tambahan (Opsional)</label>
            <textarea id="catatan_perbelanjaan" name="catatan_perbelanjaan" rows="3" placeholder="Sebarang maklumat tambahan mengenai perbelanjaan">${data.catatan_perbelanjaan || ''}</textarea>
          </div>
        </div>
        
        <div class="form-actions">
          <button type="button" class="btn btn-primary" onclick="kirProfile.saveTab('perbelanjaan')">Simpan</button>
        </div>
      </form>
    `;
  }

  async save() {
    // Validate form first
    if (!this.validate()) {
      this.showToast('Sila lengkapkan semua medan yang diperlukan', 'error');
      return false;
    }

    try {
      const formData = this.getFormData();
      
      // Calculate total expenses automatically
      const utiliti_air = parseFloat(formData.utiliti_air) || 0;
      const utiliti_elektrik = parseFloat(formData.utiliti_elektrik) || 0;
      const sewa_rumah = parseFloat(formData.sewa_rumah) || 0;
      const ansuran_kenderaan = parseFloat(formData.ansuran_kenderaan) || 0;
      const makanan = parseFloat(formData.makanan) || 0;
      const sekolah_anak = parseFloat(formData.sekolah_anak) || 0;
      const rawatan_kesihatan = parseFloat(formData.rawatan_kesihatan) || 0;
      const perbelanjaan_lain = parseFloat(formData.perbelanjaan_lain) || 0;
      
      formData.jumlah_keseluruhan_perbelanjaan = utiliti_air + utiliti_elektrik + sewa_rumah + 
                                                ansuran_kenderaan + makanan + sekolah_anak + 
                                                rawatan_kesihatan + perbelanjaan_lain;

      // Save via KIRService
      await this.kirProfile.kirService.updateRelatedDocument(this.kirProfile.kirId, 'perbelanjaan', formData);
      
      // Update local data
      if (!this.kirProfile.relatedData) {
        this.kirProfile.relatedData = {};
      }
      this.kirProfile.relatedData.perbelanjaan = { ...this.kirProfile.relatedData.perbelanjaan, ...formData };
      
      // Clear dirty state
      this.clearDirty();
      
      this.showToast('Data perbelanjaan berjaya disimpan', 'success');
      return true;
      
    } catch (error) {
      console.error('Error saving perbelanjaan data:', error);
      this.showToast('Ralat menyimpan data perbelanjaan: ' + error.message, 'error');
      return false;
    }
  }

  validate() {
    const form = document.querySelector(`[data-tab="${this.tabId}"]`);
    if (!form) return false;

    // Basic validation - at least one expense should be provided
    const expenseFields = [
      'utiliti_air', 'utiliti_elektrik', 'sewa_rumah', 'ansuran_kenderaan',
      'makanan', 'sekolah_anak', 'rawatan_kesihatan', 'perbelanjaan_lain'
    ];
    
    const hasAnyExpense = expenseFields.some(fieldName => {
      const value = form.querySelector(`[name="${fieldName}"]`)?.value;
      return value && parseFloat(value) > 0;
    });
    
    if (!hasAnyExpense) {
      this.showToast('Sila masukkan sekurang-kurangnya satu perbelanjaan', 'error');
      return false;
    }

    return true;
  }

  setupEventListeners() {
    // Auto-calculate total when individual amounts change
    const expenseFields = [
      'utiliti_air', 'utiliti_elektrik', 'sewa_rumah', 'ansuran_kenderaan',
      'makanan', 'sekolah_anak', 'rawatan_kesihatan', 'perbelanjaan_lain'
    ];
    
    expenseFields.forEach(fieldName => {
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
    const expenseFields = [
      'utiliti_air', 'utiliti_elektrik', 'sewa_rumah', 'ansuran_kenderaan',
      'makanan', 'sekolah_anak', 'rawatan_kesihatan', 'perbelanjaan_lain'
    ];
    
    const total = expenseFields.reduce((sum, fieldName) => {
      const value = parseFloat(document.getElementById(fieldName)?.value) || 0;
      return sum + value;
    }, 0);
    
    const totalField = document.getElementById('jumlah_keseluruhan_perbelanjaan');
    if (totalField) {
      totalField.value = total.toFixed(2);
    }
  }
}
