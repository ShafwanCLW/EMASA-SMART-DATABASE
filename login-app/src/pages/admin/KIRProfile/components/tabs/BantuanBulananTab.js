import { BaseTab } from '../shared/BaseTab.js';

export class BantuanBulananTab extends BaseTab {
  constructor(kirProfile) {
    super(kirProfile);
    this.tabId = 'bantuan_bulanan';
  }

  render() {
    const data = this.data || {};
    
    return `
      <form class="kir-form" data-tab="bantuan_bulanan">
        <div class="form-section">
          <h3>Bantuan Bulanan</h3>
          
          <div class="form-row">
            <div class="form-group">
              <label for="bantuan_jkm">Bantuan JKM (RM)</label>
              <input type="number" id="bantuan_jkm" name="bantuan_jkm" value="${data.bantuan_jkm || ''}" step="0.01" min="0" placeholder="0.00">
            </div>
            
            <div class="form-group">
              <label for="bantuan_zakat">Bantuan Zakat (RM)</label>
              <input type="number" id="bantuan_zakat" name="bantuan_zakat" value="${data.bantuan_zakat || ''}" step="0.01" min="0" placeholder="0.00">
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="bantuan_oku">Bantuan OKU (RM)</label>
              <input type="number" id="bantuan_oku" name="bantuan_oku" value="${data.bantuan_oku || ''}" step="0.01" min="0" placeholder="0.00">
            </div>
            
            <div class="form-group">
              <label for="bantuan_warga_emas">Bantuan Warga Emas (RM)</label>
              <input type="number" id="bantuan_warga_emas" name="bantuan_warga_emas" value="${data.bantuan_warga_emas || ''}" step="0.01" min="0" placeholder="0.00">
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="bantuan_baitulmal">Bantuan Baitulmal (RM)</label>
              <input type="number" id="bantuan_baitulmal" name="bantuan_baitulmal" value="${data.bantuan_baitulmal || ''}" step="0.01" min="0" placeholder="0.00">
            </div>
            
            <div class="form-group">
              <label for="bantuan_ngo">Bantuan NGO (RM)</label>
              <input type="number" id="bantuan_ngo" name="bantuan_ngo" value="${data.bantuan_ngo || ''}" step="0.01" min="0" placeholder="0.00">
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="bantuan_kerajaan_negeri">Bantuan Kerajaan Negeri (RM)</label>
              <input type="number" id="bantuan_kerajaan_negeri" name="bantuan_kerajaan_negeri" value="${data.bantuan_kerajaan_negeri || ''}" step="0.01" min="0" placeholder="0.00">
            </div>
            
            <div class="form-group">
              <label for="bantuan_lain">Bantuan Lain (RM)</label>
              <input type="number" id="bantuan_lain" name="bantuan_lain" value="${data.bantuan_lain || ''}" step="0.01" min="0" placeholder="0.00">
            </div>
          </div>
          
          <div class="form-group">
            <label for="jumlah_keseluruhan_bantuan">Jumlah Keseluruhan Bantuan Bulanan (RM)</label>
            <input type="number" id="jumlah_keseluruhan_bantuan" name="jumlah_keseluruhan_bantuan" value="${data.jumlah_keseluruhan_bantuan || ''}" step="0.01" min="0" readonly>
          </div>
          
          <div class="form-group">
            <label for="catatan_bantuan">Catatan Tambahan (Opsional)</label>
            <textarea id="catatan_bantuan" name="catatan_bantuan" rows="3" placeholder="Sebarang maklumat tambahan mengenai bantuan yang diterima">${data.catatan_bantuan || ''}</textarea>
          </div>
        </div>
        
        <div class="form-actions">
          <button type="button" class="btn btn-primary" onclick="kirProfile.saveTab('bantuan_bulanan')">Simpan</button>
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
      
      // Calculate total assistance automatically
      const bantuan_jkm = parseFloat(formData.bantuan_jkm) || 0;
      const bantuan_zakat = parseFloat(formData.bantuan_zakat) || 0;
      const bantuan_oku = parseFloat(formData.bantuan_oku) || 0;
      const bantuan_warga_emas = parseFloat(formData.bantuan_warga_emas) || 0;
      const bantuan_baitulmal = parseFloat(formData.bantuan_baitulmal) || 0;
      const bantuan_ngo = parseFloat(formData.bantuan_ngo) || 0;
      const bantuan_kerajaan_negeri = parseFloat(formData.bantuan_kerajaan_negeri) || 0;
      const bantuan_lain = parseFloat(formData.bantuan_lain) || 0;
      
      formData.jumlah_keseluruhan_bantuan = bantuan_jkm + bantuan_zakat + bantuan_oku + 
                                           bantuan_warga_emas + bantuan_baitulmal + bantuan_ngo + 
                                           bantuan_kerajaan_negeri + bantuan_lain;

      // Save via KIRService
      await this.kirProfile.kirService.updateRelatedDocument(this.kirProfile.kirId, 'bantuan_bulanan', formData);
      
      // Update local data
      if (!this.kirProfile.relatedData) {
        this.kirProfile.relatedData = {};
      }
      this.kirProfile.relatedData.bantuan_bulanan = { ...this.kirProfile.relatedData.bantuan_bulanan, ...formData };
      
      // Clear dirty state
      this.clearDirty();
      
      this.showToast('Data bantuan bulanan berjaya disimpan', 'success');
      return true;
      
    } catch (error) {
      console.error('Error saving bantuan bulanan data:', error);
      this.showToast('Ralat menyimpan data bantuan bulanan: ' + error.message, 'error');
      return false;
    }
  }

  validate() {
    const form = document.querySelector(`[data-tab="${this.tabId}"]`);
    if (!form) return false;

    // Basic validation - at least one assistance should be provided
    const assistanceFields = [
      'bantuan_jkm', 'bantuan_zakat', 'bantuan_oku', 'bantuan_warga_emas',
      'bantuan_baitulmal', 'bantuan_ngo', 'bantuan_kerajaan_negeri', 'bantuan_lain'
    ];
    
    const hasAnyAssistance = assistanceFields.some(fieldName => {
      const value = form.querySelector(`[name="${fieldName}"]`)?.value;
      return value && parseFloat(value) > 0;
    });
    
    if (!hasAnyAssistance) {
      this.showToast('Sila masukkan sekurang-kurangnya satu bantuan', 'error');
      return false;
    }

    return true;
  }

  setupEventListeners() {
    // Auto-calculate total when individual amounts change
    const assistanceFields = [
      'bantuan_jkm', 'bantuan_zakat', 'bantuan_oku', 'bantuan_warga_emas',
      'bantuan_baitulmal', 'bantuan_ngo', 'bantuan_kerajaan_negeri', 'bantuan_lain'
    ];
    
    assistanceFields.forEach(fieldName => {
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
    const assistanceFields = [
      'bantuan_jkm', 'bantuan_zakat', 'bantuan_oku', 'bantuan_warga_emas',
      'bantuan_baitulmal', 'bantuan_ngo', 'bantuan_kerajaan_negeri', 'bantuan_lain'
    ];
    
    const total = assistanceFields.reduce((sum, fieldName) => {
      const value = parseFloat(document.getElementById(fieldName)?.value) || 0;
      return sum + value;
    }, 0);
    
    const totalField = document.getElementById('jumlah_keseluruhan_bantuan');
    if (totalField) {
      totalField.value = total.toFixed(2);
    }
  }
}
