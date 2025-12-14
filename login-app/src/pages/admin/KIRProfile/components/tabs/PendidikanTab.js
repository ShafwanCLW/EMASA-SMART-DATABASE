// Pendidikan Tab Component
import { BaseTab } from '../shared/BaseTab.js';

export class PendidikanTab extends BaseTab {
  constructor(kirProfile) {
    super(kirProfile);
    this.tabId = 'pendidikan';
  }

  render() {
    const data = this.data;
    
    console.log('=== Pendidikan Tab Render Debug ===');
    console.log('Pendidikan data object:', data);
    console.log('Pendidikan data keys:', Object.keys(data));
    console.log('=== End Pendidikan Debug ===');
    
    // Use correct field names with fallbacks
    const tahapPendidikan = data.tahap_pendidikan || '';
    const namaSekolah = data.nama_sekolah || '';
    const bidangPengajian = data.bidang_pengajian || '';
    const tahunTamat = data.tahun_tamat || '';

    return `
      <form class="kir-form" data-tab="pendidikan">
        <div class="form-section">
          <h3>Pendidikan Tertinggi</h3>
          
          <div class="form-row">
            <div class="form-group">
              <label for="tahap_pendidikan">Tahap Pendidikan Tertinggi</label>
              <select id="tahap_pendidikan" name="tahap_pendidikan">
                <option value="">Pilih Tahap</option>
                <option value="Tidak Bersekolah" ${tahapPendidikan === 'Tidak Bersekolah' ? 'selected' : ''}>Tidak Bersekolah</option>
                <option value="Sekolah Rendah" ${tahapPendidikan === 'Sekolah Rendah' ? 'selected' : ''}>Sekolah Rendah</option>
                <option value="Sekolah Menengah" ${tahapPendidikan === 'Sekolah Menengah' ? 'selected' : ''}>Sekolah Menengah</option>
                <option value="SPM/SPMV" ${tahapPendidikan === 'SPM/SPMV' ? 'selected' : ''}>SPM/SPMV</option>
                <option value="STPM/Diploma" ${tahapPendidikan === 'STPM/Diploma' ? 'selected' : ''}>STPM/Diploma</option>
                <option value="Ijazah Sarjana Muda" ${tahapPendidikan === 'Ijazah Sarjana Muda' ? 'selected' : ''}>Ijazah Sarjana Muda</option>
                <option value="Ijazah Sarjana" ${tahapPendidikan === 'Ijazah Sarjana' ? 'selected' : ''}>Ijazah Sarjana</option>
                <option value="PhD" ${tahapPendidikan === 'PhD' ? 'selected' : ''}>PhD</option>
                <option value="Sijil Kemahiran Malaysia 1" ${tahapPendidikan === 'Sijil Kemahiran Malaysia 1' ? 'selected' : ''}>Sijil Kemahiran Malaysia 1</option>
                <option value="Sijil Kemahiran Malaysia 2" ${tahapPendidikan === 'Sijil Kemahiran Malaysia 2' ? 'selected' : ''}>Sijil Kemahiran Malaysia 2</option>
                <option value="Sijil Kemahiran Malaysia 3" ${tahapPendidikan === 'Sijil Kemahiran Malaysia 3' ? 'selected' : ''}>Sijil Kemahiran Malaysia 3</option>
                <option value="Asasi" ${tahapPendidikan === 'Asasi' ? 'selected' : ''}>Asasi</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="nama_sekolah">Nama Sekolah/Institusi</label>
              <input type="text" id="nama_sekolah" name="nama_sekolah" value="${namaSekolah}">
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="tahun_tamat">Tahun Tamat</label>
              <input type="number" id="tahun_tamat" name="tahun_tamat" value="${tahunTamat}" min="1950" max="2030" placeholder="YYYY">
            </div>
            
            <div class="form-group">
              <label for="bidang_pengajian">Bidang Pengajian</label>
              <input type="text" id="bidang_pengajian" name="bidang_pengajian" value="${bidangPengajian}">
            </div>
          </div>
        </div>
        
        <div class="form-actions">
          <button type="button" class="btn btn-primary" onclick="kirProfile.saveTab('pendidikan')">Simpan</button>
        </div>
      </form>
    `;
  }

  async save() {
    try {
      const formData = this.getFormData();
      
      // Validate year if provided
      if (formData.tahun_tamat) {
        const year = parseInt(formData.tahun_tamat);
        const currentYear = new Date().getFullYear();
        
        if (year < 1950 || year > currentYear + 10) {
          this.showToast('Tahun tamat tidak sah', 'error');
          return false;
        }
      }

      // Save via KIRService
      await this.kirProfile.kirService.updateRelatedDocument(this.kirProfile.kirId, 'pendidikan', formData);
      
      // Update local data
      if (!this.kirProfile.relatedData) {
        this.kirProfile.relatedData = {};
      }
      this.kirProfile.relatedData.pendidikan = { ...this.kirProfile.relatedData.pendidikan, ...formData };
      
      // Clear dirty state
      this.clearDirty();
      
      this.showToast('Data pendidikan berjaya disimpan', 'success');
      return true;
      
    } catch (error) {
      console.error('Error saving Pendidikan data:', error);
      this.showToast('Ralat menyimpan data pendidikan: ' + error.message, 'error');
      return false;
    }
  }

  validate() {
    // Pendidikan tab has no required fields, so always valid
    return true;
  }

  setupEventListeners() {
    // Add event listener for tahap_pendidikan change to show/hide relevant fields
    const tahapSelect = document.getElementById('tahap_pendidikan');
    if (tahapSelect) {
      tahapSelect.addEventListener('change', (e) => {
        const value = e.target.value;
        const namaSekolahGroup = document.querySelector('#nama_sekolah').closest('.form-group');
        const bidangGroup = document.querySelector('#bidang_pengajian').closest('.form-group');
        const tahunGroup = document.querySelector('#tahun_tamat').closest('.form-group');
        
        // Show/hide fields based on education level
        if (value === 'Tidak Bersekolah') {
          namaSekolahGroup.style.display = 'none';
          bidangGroup.style.display = 'none';
          tahunGroup.style.display = 'none';
        } else {
          namaSekolahGroup.style.display = 'block';
          tahunGroup.style.display = 'block';
          
          // Only show bidang pengajian for higher education
          if (['STPM/Diploma', 'Ijazah Sarjana Muda', 'Ijazah Sarjana', 'PhD'].includes(value)) {
            bidangGroup.style.display = 'block';
          } else {
            bidangGroup.style.display = 'none';
          }
        }
        
        this.markDirty();
      });
    }
  }
}
