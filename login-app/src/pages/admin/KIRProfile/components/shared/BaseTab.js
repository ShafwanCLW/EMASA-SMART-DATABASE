// Base class for all KIR Profile tabs
// Provides common functionality and interface that all tabs must implement

export class BaseTab {
  constructor(kirProfile) {
    this.kirProfile = kirProfile;
    this.kirData = kirProfile.kirData;
    this.relatedData = kirProfile.relatedData;
    this.tabId = null; // Must be set by subclasses
  }

  // Get current tab data from kirData or relatedData
  get data() {
    if (this.tabId === 'maklumat-asas') {
      return this.kirData || {};
    }
    return this.relatedData?.[this.tabId] || {};
  }

  // Mark this tab as having unsaved changes
  markDirty() {
    if (this.tabId) {
      this.kirProfile.markTabDirty(this.tabId);
    }
  }

  // Clear dirty state for this tab
  clearDirty() {
    if (this.tabId) {
      this.kirProfile.clearTabDirty(this.tabId);
    }
  }

  // Show toast notification
  showToast(message, type = 'info') {
    this.kirProfile.showToast(message, type);
  }

  // Format date for display
  formatDate(date) {
    return this.kirProfile.formatDate(date);
  }

  // Format currency for display
  formatCurrency(amount) {
    return this.kirProfile.formatCurrency(amount);
  }

  // Get form data from the current tab
  getFormData() {
    const form = document.querySelector(`[data-tab="${this.tabId}"]`);
    if (!form) return {};
    
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
      data[key] = value;
    }
    
    return data;
  }

  // Validate form fields
  validateForm() {
    const form = document.querySelector(`[data-tab="${this.tabId}"]`);
    if (!form) return true;
    
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        field.classList.add('error');
        isValid = false;
      } else {
        field.classList.remove('error');
      }
    });
    
    return isValid;
  }

  // Create form group HTML helper
  createFormGroup(config) {
    const {
      id,
      name = id,
      label,
      type = 'text',
      value = '',
      required = false,
      options = [],
      placeholder = '',
      readonly = false,
      className = ''
    } = config;

    const requiredAttr = required ? 'required' : '';
    const readonlyAttr = readonly ? 'readonly' : '';
    const classAttr = className ? `class="${className}"` : '';

    if (type === 'select') {
      const optionsHTML = options.map(option => {
        const optionValue = typeof option === 'string' ? option : option.value;
        const optionLabel = typeof option === 'string' ? option : option.label;
        const selected = value === optionValue ? 'selected' : '';
        return `<option value="${optionValue}" ${selected}>${optionLabel}</option>`;
      }).join('');

      return `
        <div class="form-group">
          <label for="${id}">${label} ${required ? '*' : ''}</label>
          <select id="${id}" name="${name}" ${requiredAttr} ${classAttr}>
            <option value="">Pilih ${label}</option>
            ${optionsHTML}
          </select>
        </div>
      `;
    }

    if (type === 'textarea') {
      return `
        <div class="form-group">
          <label for="${id}">${label} ${required ? '*' : ''}</label>
          <textarea id="${id}" name="${name}" ${requiredAttr} ${readonlyAttr} ${classAttr} placeholder="${placeholder}">${value}</textarea>
        </div>
      `;
    }

    return `
      <div class="form-group">
        <label for="${id}">${label} ${required ? '*' : ''}</label>
        <input type="${type}" id="${id}" name="${name}" value="${value}" ${requiredAttr} ${readonlyAttr} ${classAttr} placeholder="${placeholder}">
      </div>
    `;
  }

  // Create form row with multiple form groups
  createFormRow(formGroups) {
    const groupsHTML = formGroups.map(group => this.createFormGroup(group)).join('');
    return `<div class="form-row">${groupsHTML}</div>`;
  }

  // Abstract methods that must be implemented by subclasses
  render() {
    throw new Error(`render() method must be implemented by ${this.constructor.name}`);
  }

  async save() {
    throw new Error(`save() method must be implemented by ${this.constructor.name}`);
  }

  // Optional methods that can be overridden by subclasses
  async load() {
    // Default implementation - do nothing
    // Subclasses can override to load specific data
  }

  validate() {
    // Default implementation - validate form
    return this.validateForm();
  }

  // Setup event listeners specific to this tab
  setupEventListeners() {
    // Default implementation - do nothing
    // Subclasses can override to add specific event listeners
  }

  // Cleanup when tab is destroyed or switched away
  cleanup() {
    // Default implementation - do nothing
    // Subclasses can override to cleanup resources
  }
}