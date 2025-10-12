// Pekerjaan Tab Component
import { BaseTab } from '../shared/BaseTab.js';

export class PekerjaanTab extends BaseTab {
  constructor(kirProfile) {
    super(kirProfile);
    this.tabId = 'pekerjaan';
  }

  render() {
    const data = this.data;
    
    console.log('=== Pekerjaan Tab Render Debug ===');
    console.log('Pekerjaan data object:', data);
    console.log('Pekerjaan data keys:', Object.keys(data));
    console.log('=== End Pekerjaan Debug ===');
    
    // Use correct field names with fallbacks
    const statusPekerjaan = data.status_pekerjaan || '';
    const jenisPekerjaan = data.jenis_pekerjaan || '';
    const namaMajikan = data.nama_majikan || '';
    const gajiBulanan = data.gaji_bulanan || '';
    const alamatKerja = data.alamat_kerja || '';
    const pengalamanKerja = data.pengalaman_kerja || '';
    const kemahiran = data.kemahiran || '';
    
    return `
      <form class="kir-form" data-tab="pekerjaan">
        <div class="form-section">
          <h3>Maklumat Pekerjaan</h3>
          
          <div class="form-grid">
            <div class="form-group">
              <label for="status_pekerjaan">Status Pekerjaan</label>
              <select id="status_pekerjaan" name="status_pekerjaan">
                <option value="">Pilih Status</option>
                <option value="Bekerja" ${statusPekerjaan === 'Bekerja' ? 'selected' : ''}>Bekerja</option>
                <option value="Tidak Bekerja" ${statusPekerjaan === 'Tidak Bekerja' ? 'selected' : ''}>Tidak Bekerja</option>
                <option value="Bersara" ${statusPekerjaan === 'Bersara' ? 'selected' : ''}>Bersara</option>
                <option value="OKU" ${statusPekerjaan === 'OKU' ? 'selected' : ''}>OKU</option>
              </select>
            </div>
            
            <div class="form-group" id="jenis_pekerjaan_group">
              <label for="jenis_pekerjaan">Jenis Pekerjaan</label>
              <input type="text" id="jenis_pekerjaan" name="jenis_pekerjaan" value="${jenisPekerjaan}">
            </div>
            
            <div class="form-group" id="nama_majikan_group">
              <label for="nama_majikan">Nama Majikan</label>
              <input type="text" id="nama_majikan" name="nama_majikan" value="${namaMajikan}">
            </div>
            
            <div class="form-group" id="gaji_bulanan_group">
              <label for="gaji_bulanan">Gaji Bulanan (RM)</label>
              <input type="number" id="gaji_bulanan" name="gaji_bulanan" value="${gajiBulanan}" step="0.01" min="0">
            </div>
            
            <div class="form-group" id="alamat_kerja_group">
              <label for="alamat_kerja">Alamat Kerja</label>
              <textarea id="alamat_kerja" name="alamat_kerja" rows="3">${alamatKerja}</textarea>
            </div>
            
            <div class="form-group">
              <label for="pengalaman_kerja">Pengalaman Kerja (Tahun)</label>
              <input type="number" id="pengalaman_kerja" name="pengalaman_kerja" value="${pengalamanKerja}" min="0">
            </div>
            
            <div class="form-group full-width">
              <label for="kemahiran">Kemahiran</label>
              <textarea id="kemahiran" name="kemahiran" rows="3" placeholder="Senaraikan kemahiran yang dimiliki">${kemahiran}</textarea>
            </div>
          </div>
        </div>
        
        <div class="form-actions">
          <button type="button" class="btn btn-primary" onclick="kirProfile.saveTab('pekerjaan')">Simpan</button>
        </div>
      </form>
    `;
  }

  async save() {
    try {
      const formData = this.getFormData();
      
      // Validate salary if provided
      if (formData.gaji_bulanan && parseFloat(formData.gaji_bulanan) < 0) {
        this.showToast('Gaji bulanan tidak boleh negatif', 'error');
        return false;
      }
      
      // Validate experience years if provided
      if (formData.pengalaman_kerja && parseInt(formData.pengalaman_kerja) < 0) {
        this.showToast('Pengalaman kerja tidak boleh negatif', 'error');
        return false;
      }

      // Save via KIRService
      await this.kirProfile.kirService.updateKIR(this.kirProfile.kirId, formData);
      
      // Update local data
      if (!this.kirProfile.relatedData) {
        this.kirProfile.relatedData = {};
      }
      this.kirProfile.relatedData.pekerjaan = { ...this.kirProfile.relatedData.pekerjaan, ...formData };
      
      // Clear dirty state
      this.clearDirty();
      
      this.showToast('Data pekerjaan berjaya disimpan', 'success');
      return true;
      
    } catch (error) {
      console.error('Error saving Pekerjaan data:', error);
      this.showToast('Ralat menyimpan data pekerjaan: ' + error.message, 'error');
      return false;
    }
  }

  validate() {
    // Pekerjaan tab has no required fields, so always valid
    return true;
  }

  setupEventListeners() {
    // Add event listener for status_pekerjaan change to show/hide relevant fields
    const statusSelect = document.getElementById('status_pekerjaan');
    if (statusSelect) {
      statusSelect.addEventListener('change', (e) => {
        const value = e.target.value;
        const workRelatedGroups = [
          'jenis_pekerjaan_group',
          'nama_majikan_group', 
          'gaji_bulanan_group',
          'alamat_kerja_group'
        ];
        
        // Show/hide work-related fields based on employment status
        if (value === 'Bekerja') {
          workRelatedGroups.forEach(groupId => {
            const group = document.getElementById(groupId);
            if (group) group.style.display = 'block';
          });
        } else {
          workRelatedGroups.forEach(groupId => {
            const group = document.getElementById(groupId);
            if (group) group.style.display = 'none';
          });
        }
        
        this.markDirty();
      });
      
      // Trigger initial state
      statusSelect.dispatchEvent(new Event('change'));
    }
  }
}