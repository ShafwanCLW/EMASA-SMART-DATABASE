import { BaseTab } from '../shared/BaseTab.js';
import { FormHelpers } from '../shared/FormHelpers.js';
import { DokumenService } from '../../../../../services/backend/DokumenService.js';

export class KekeluargaanTab extends BaseTab {
  constructor(kirProfile) {
    super(kirProfile);
    this.tabId = 'kekeluargaan';
  }

  render() {
    const data = this.kirProfile.kirData || {};
    
    console.log('=== Kekeluargaan Tab Render Debug ===');
    console.log('KIR data object:', data);
    console.log('Available fields:', Object.keys(data));
    console.log('=== End Kekeluargaan Debug ===');
    
    return `
      <form class="kir-form" data-tab="kekeluargaan">
        <div class="form-section">
          <h3>Kekeluargaan</h3>
          
          ${this.createMaritalStatusSection(data)}
          ${this.createSpouseSection(data)}
          ${this.createParentsSection(data)}
          ${this.createSiblingsSection(data)}
        </div>
        
        <div class="form-actions">
          <button type="button" class="btn btn-primary" onclick="kirProfile.saveTab('kekeluargaan')">Simpan</button>
        </div>
      </form>
    `;
  }

  createMaritalStatusSection(data) {
    return `
      <div class="form-group">
        <label for="status_perkahwinan">Status Perkahwinan</label>
        <select id="status_perkahwinan" name="status_perkahwinan">
          <option value="">Pilih Status</option>
          <option value="Bujang" ${data.status_perkahwinan === 'Bujang' ? 'selected' : ''}>Bujang</option>
          <option value="Berkahwin" ${data.status_perkahwinan === 'Berkahwin' ? 'selected' : ''}>Berkahwin</option>
          <option value="Bercerai" ${data.status_perkahwinan === 'Bercerai' ? 'selected' : ''}>Bercerai</option>
          <option value="Balu/Duda" ${data.status_perkahwinan === 'Balu/Duda' ? 'selected' : ''}>Balu/Duda</option>
        </select>
      </div>
    `;
  }

  createSpouseSection(data) {
    const initialCount = parseInt(data.bilangan_isteri || '1', 10) || 1;
    const isBujang = data.status_perkahwinan === 'Bujang';
    return `
      <div class="form-group" id="bilangan_isteri_group" style="${isBujang ? 'display:none;' : ''}">
        <label for="bilangan_isteri">Berapa isteri?</label>
        <select id="bilangan_isteri" name="bilangan_isteri">
          <option value="1" ${initialCount === 1 ? 'selected' : ''}>1</option>
          <option value="2" ${initialCount === 2 ? 'selected' : ''}>2</option>
          <option value="3" ${initialCount === 3 ? 'selected' : ''}>3</option>
          <option value="4" ${initialCount === 4 ? 'selected' : ''}>4</option>
        </select>
      </div>

      <div id="pasangan-container">
        ${isBujang ? '' : this.renderSpouseBlocks(initialCount, data)}
      </div>
    `;
  }

  renderSpouseBlocks(count, data) {
    const blocks = [];
    for (let i = 1; i <= count; i++) {
      blocks.push(this.getSpouseBlockHTML(i, data));
    }
    return blocks.join('');
  }

  getSpouseBlockHTML(index, data) {
    const name = data[`nama_pasangan_${index}`] || '';
    const noKp = data[`no_kp_pasangan_${index}`] || '';
    const alamat = data[`alamat_pasangan_${index}`] || '';
    const tarikhNikah = data[`tarikh_nikah_${index}`] || '';
    const status = data[`status_pasangan_${index}`] || '';
    const ceraiSelected = status === 'Sudah Bercerai';
    return `
      <div class="spouse-block" data-index="${index}">
        <h4>Pasangan ${index}</h4>
        <div class="form-row">
          <div class="form-group">
            <label for="tarikh_nikah_${index}">Tarikh Nikah</label>
            <input type="date" id="tarikh_nikah_${index}" name="tarikh_nikah_${index}" value="${tarikhNikah}">
          </div>
          <div class="form-group">
            <label for="nama_pasangan_${index}">Nama Pasangan</label>
            <input type="text" id="nama_pasangan_${index}" name="nama_pasangan_${index}" value="${FormHelpers.escapeHtml(name)}">
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="no_kp_pasangan_${index}">No. KP Pasangan</label>
            <input type="text" id="no_kp_pasangan_${index}" name="no_kp_pasangan_${index}" value="${FormHelpers.escapeHtml(noKp)}">
          </div>
          <div class="form-group">
            <label for="status_pasangan_${index}">Status Pasangan</label>
            <select id="status_pasangan_${index}" name="status_pasangan_${index}">
              <option value="">Pilih Status</option>
              <option value="Masih berkahwin" ${status === 'Masih berkahwin' ? 'selected' : ''}>Masih berkahwin</option>
              <option value="Sudah Bercerai" ${status === 'Sudah Bercerai' ? 'selected' : ''}>Sudah Bercerai</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label for="alamat_pasangan_${index}" id="alamat_label_${index}">${ceraiSelected ? 'Alamat Bekas Pasangan' : 'Alamat Pasangan'}</label>
          <textarea id="alamat_pasangan_${index}" name="alamat_pasangan_${index}" rows="3">${FormHelpers.escapeHtml(alamat)}</textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="sijil_nikah_${index}">Sijil Nikah (PDF/JPG/PNG)</label>
            <input type="file" id="sijil_nikah_${index}" name="sijil_nikah_${index}" accept=".pdf,image/*">
          </div>
          <div class="form-group" id="cerai_group_${index}" style="${ceraiSelected ? '' : 'display:none;'}">
            <label for="sijil_cerai_${index}">Sijil Cerai (wajib jika bercerai)</label>
            <input type="file" id="sijil_cerai_${index}" name="sijil_cerai_${index}" accept=".pdf,image/*">
          </div>
        </div>
        <hr>
      </div>
    `;
  }

  createSiblingsSection(data) {
    return `
      <div class="form-group">
        <label for="bilangan_adik_beradik">Bilangan Adik Beradik</label>
        <input type="number" id="bilangan_adik_beradik" name="bilangan_adik_beradik" min="0" step="1" value="${typeof data.bilangan_adik_beradik !== 'undefined' ? data.bilangan_adik_beradik : ''}" placeholder="Contoh: 3">
      </div>
    `;
  }

  createParentsSection(data) {
    const statusIbu = data.status_ibu || '';
    const statusAyah = data.status_ayah || '';
    return `
      <div class="form-row">
        <div class="form-group">
          <label for="ibu_nama">Nama Ibu</label>
          <input type="text" id="ibu_nama" name="ibu_nama" value="${data.ibu_nama || ''}">
        </div>
        
        <div class="form-group">
          <label for="status_ibu">Hidup atau Meninggal Dunia</label>
          <select id="status_ibu" name="status_ibu">
            <option value="">Pilih Status</option>
            <option value="Masih Hidup" ${statusIbu === 'Masih Hidup' ? 'selected' : ''}>Masih Hidup</option>
            <option value="Sudah Meninggal Dunia" ${statusIbu === 'Sudah Meninggal Dunia' ? 'selected' : ''}>Sudah Meninggal Dunia</option>
          </select>
        </div>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label for="ayah_nama">Nama Ayah</label>
          <input type="text" id="ayah_nama" name="ayah_nama" value="${data.ayah_nama || ''}">
        </div>
        
        <div class="form-group">
          <label for="status_ayah">Hidup atau Meninggal Dunia</label>
          <select id="status_ayah" name="status_ayah">
            <option value="">Pilih Status</option>
            <option value="Masih Hidup" ${statusAyah === 'Masih Hidup' ? 'selected' : ''}>Masih Hidup</option>
            <option value="Sudah Meninggal Dunia" ${statusAyah === 'Sudah Meninggal Dunia' ? 'selected' : ''}>Sudah Meninggal Dunia</option>
          </select>
        </div>
      </div>
    `;
  }

  createPKIRIntegrationPanel() {
    return `
      <!-- PKIR Integration Panel -->
      <div class="pkir-integration-panel">
        <div class="integration-card">
          <div class="integration-header">
            <h4><i class="fas fa-users"></i> PKIR (Pasangan Ketua Isi Rumah)</h4>
          </div>
          <div class="integration-content">
            ${this.kirProfile.pkirData ? 
              `<p>Rekod PKIR telah wujud untuk pasangan ini.</p>
               <button type="button" class="btn btn-secondary" onclick="window.location.hash = '#/admin/kir/${this.kirProfile.kirId}?tab=pkir'">
                 <i class="fas fa-eye"></i> Lihat/Urus PKIR
               </button>` :
              `<p>Cipta rekod PKIR lengkap untuk pasangan berdasarkan maklumat di atas.</p>
               <button type="button" class="btn btn-outline-primary" onclick="kekeluargaanTab.openPKIRModal()">
                 <i class="fas fa-arrow-up"></i> Promosi ke PKIR
               </button>`
            }
          </div>
        </div>
      </div>
    `;
  }

  createSiblingsHTML(siblings) {
    if (!siblings || siblings.length === 0) {
      return '<p class="no-siblings">Tiada adik beradik didaftarkan</p>';
    }
    
    return siblings.map((sibling, index) => `
      <div class="sibling-item" data-index="${index}">
        <input type="text" name="sibling_${index}" value="${FormHelpers.escapeHtml(sibling)}" placeholder="Nama adik beradik">
        <button type="button" class="btn btn-danger btn-sm" onclick="kekeluargaanTab.removeSibling(${index})">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `).join('');
  }

  addSibling() {
    const container = document.getElementById('siblings-container');
    if (!container) return;
    
    const siblings = container.querySelectorAll('.sibling-item');
    const index = siblings.length;
    
    const siblingHTML = `
      <div class="sibling-item" data-index="${index}">
        <input type="text" name="sibling_${index}" placeholder="Nama adik beradik">
        <button type="button" class="btn btn-danger btn-sm" onclick="kekeluargaanTab.removeSibling(${index})">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;
    
    // Remove "no siblings" message if exists
    const noSiblings = container.querySelector('.no-siblings');
    if (noSiblings) {
      noSiblings.remove();
    }
    
    container.insertAdjacentHTML('beforeend', siblingHTML);
    this.markTabDirty();
  }

  removeSibling(index) {
    const siblingItem = document.querySelector(`.sibling-item[data-index="${index}"]`);
    if (siblingItem) {
      siblingItem.remove();
      this.markTabDirty();
      
      // Show "no siblings" message if no siblings left
      const container = document.getElementById('siblings-container');
      const remainingSiblings = container.querySelectorAll('.sibling-item');
      if (remainingSiblings.length === 0) {
        container.innerHTML = '<p class="no-siblings">Tiada adik beradik didaftarkan</p>';
      }
    }
  }

  openPKIRModal() {
    this.kirProfile.isPKIRModalOpen = true;
    this.kirProfile.render();
  }

  setupEventListeners() {
    // Make the tab instance globally accessible for onclick handlers
    window.kekeluargaanTab = this;
    
    // Set up form change tracking
    const form = document.querySelector('form.kir-form[data-tab="kekeluargaan"]');
    if (form) {
      form.addEventListener('input', () => {
        this.markTabDirty();
      });
      
      form.addEventListener('change', () => {
        this.markTabDirty();
      });
    }

    // Bind dynamic spouse events
    const bilanganIsteri = document.getElementById('bilangan_isteri');
    if (bilanganIsteri) {
      bilanganIsteri.addEventListener('change', (e) => {
        const count = parseInt(e.target.value, 10) || 1;
        const container = document.getElementById('pasangan-container');
        if (container) {
          container.innerHTML = this.renderSpouseBlocks(count, this.kirProfile.kirData || {});
          // After re-render, rebind status change events
          this.bindSpouseStatusEvents(count);
        }
      });
      // Initial binding for default count when visible
      this.bindSpouseStatusEvents(parseInt(bilanganIsteri.value || '1', 10));
    }

    // Toggle pasangan visibility if status changes in this tab
    const statusPerkahwinanEl = document.getElementById('status_perkahwinan');
    if (statusPerkahwinanEl) {
      statusPerkahwinanEl.addEventListener('change', (e) => {
        const isBujang = e.target.value === 'Bujang';
        const pasanganContainer = document.getElementById('pasangan-container');
        const bilanganIsteriGroup = document.getElementById('bilangan_isteri_group');
        const bilanganIsteriSelect = document.getElementById('bilangan_isteri');
        if (isBujang) {
          // Hide pasangan section entirely
          if (bilanganIsteriGroup) bilanganIsteriGroup.style.display = 'none';
          if (pasanganContainer) pasanganContainer.innerHTML = '';
        } else {
          // Show pasangan section with at least one block
          if (bilanganIsteriGroup) bilanganIsteriGroup.style.display = '';
          const count = parseInt(bilanganIsteriSelect?.value || '1', 10);
          if (pasanganContainer) {
            pasanganContainer.innerHTML = this.renderSpouseBlocks(count, this.kirProfile.kirData || {});
            this.bindSpouseStatusEvents(count);
          }
        }
      });
    }
  }

  bindSpouseStatusEvents(count) {
    for (let i = 1; i <= count; i++) {
      const statusEl = document.getElementById(`status_pasangan_${i}`);
      const ceraiGroup = document.getElementById(`cerai_group_${i}`);
      const ceraiInput = document.getElementById(`sijil_cerai_${i}`);
      const alamatLabel = document.getElementById(`alamat_label_${i}`);
      if (statusEl) {
        statusEl.addEventListener('change', (e) => {
          const isCerai = e.target.value === 'Sudah Bercerai';
          if (ceraiGroup) {
            ceraiGroup.style.display = isCerai ? '' : 'none';
          }
          if (ceraiInput) {
            ceraiInput.required = false;
          }
          if (alamatLabel) {
            alamatLabel.textContent = isCerai ? 'Alamat Bekas Pasangan' : 'Alamat Pasangan';
          }
        });
      }
    }
  }

  async save() {
    const form = document.querySelector('form.kir-form[data-tab="kekeluargaan"]');
    if (!form) {
      throw new Error('Form tidak dijumpai');
    }

    // Collect form data
    const formData = new FormData(form);
    const data = {};

    // Basic form fields (excluding dynamic spouse and sibling fields)
    for (const [key, value] of formData.entries()) {
      if (!key.startsWith('sibling_') && !key.match(/^(.+)_\d+$/)) {
        data[key] = value;
      }
    }

    // Validate dynamic spouse blocks and upload documents
    const statusPerkahwinan = (formData.get('status_perkahwinan') || '').toString();
    const bilanganIsteri = statusPerkahwinan === 'Bujang'
      ? 0
      : parseInt(formData.get('bilangan_isteri') || '0', 10) || 0;

    for (let i = 1; i <= bilanganIsteri; i++) {
      const tarikhNikah = (formData.get(`tarikh_nikah_${i}`) || '').toString();
      const nama = (formData.get(`nama_pasangan_${i}`) || '').toString();
      const noKp = (formData.get(`no_kp_pasangan_${i}`) || '').toString();
      const alamat = (formData.get(`alamat_pasangan_${i}`) || '').toString();
      const status = (formData.get(`status_pasangan_${i}`) || '').toString();
      const sijilNikah = formData.get(`sijil_nikah_${i}`);
      const sijilCerai = formData.get(`sijil_cerai_${i}`);

      if (sijilNikah && sijilNikah.name) {
        try {
          await DokumenService.uploadDokumen(this.kirProfile.kirId, sijilNikah, 'Sijil Nikah');
        } catch (err) {
          console.error('Upload Sijil Nikah gagal:', err);
          throw new Error(`Gagal muat naik Sijil Nikah untuk Pasangan ${i}: ${err.message}`);
        }
      }

      if (sijilCerai && sijilCerai.name) {
        try {
          await DokumenService.uploadDokumen(this.kirProfile.kirId, sijilCerai, 'Sijil Cerai');
        } catch (err) {
          console.error('Upload Sijil Cerai gagal:', err);
          throw new Error(`Gagal muat naik Sijil Cerai untuk Pasangan ${i}: ${err.message}`);
        }
      }
    }

    // Save via KIR service (scalar fields only)
    await this.kirProfile.kirService.updateKIR(this.kirProfile.kirId, data);
    
    // Update local data
    Object.assign(this.kirProfile.kirData, data);
    
    this.clearDirty();
    this.showToast('Data kekeluargaan berjaya disimpan', 'success');
    return true;
  }
}
