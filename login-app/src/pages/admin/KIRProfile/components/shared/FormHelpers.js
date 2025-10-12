// Form Helper Utilities
export class FormHelpers {
  
  /**
   * Create a form group with label and input
   */
  static createFormGroup(label, inputHtml, className = 'form-group') {
    return `
      <div class="${className}">
        <label>${label}</label>
        ${inputHtml}
      </div>
    `;
  }

  /**
   * Create a text input field
   */
  static createTextInput(name, value = '', placeholder = '', required = false) {
    return `<input type="text" id="${name}" name="${name}" value="${value}" placeholder="${placeholder}" ${required ? 'required' : ''}>`;
  }

  /**
   * Create a number input field
   */
  static createNumberInput(name, value = '', min = null, max = null, step = null, required = false) {
    const minAttr = min !== null ? `min="${min}"` : '';
    const maxAttr = max !== null ? `max="${max}"` : '';
    const stepAttr = step !== null ? `step="${step}"` : '';
    
    return `<input type="number" id="${name}" name="${name}" value="${value}" ${minAttr} ${maxAttr} ${stepAttr} ${required ? 'required' : ''}>`;
  }

  /**
   * Create a select dropdown
   */
  static createSelect(name, options, selectedValue = '', required = false) {
    const optionsHtml = options.map(option => {
      const value = typeof option === 'string' ? option : option.value;
      const text = typeof option === 'string' ? option : option.text;
      const selected = value === selectedValue ? 'selected' : '';
      return `<option value="${value}" ${selected}>${text}</option>`;
    }).join('');

    return `
      <select id="${name}" name="${name}" ${required ? 'required' : ''}>
        <option value="">Pilih...</option>
        ${optionsHtml}
      </select>
    `;
  }

  /**
   * Create a textarea field
   */
  static createTextarea(name, value = '', rows = 3, placeholder = '', required = false) {
    return `<textarea id="${name}" name="${name}" rows="${rows}" placeholder="${placeholder}" ${required ? 'required' : ''}>${value}</textarea>`;
  }

  /**
   * Create a date input field
   */
  static createDateInput(name, value = '', required = false) {
    return `<input type="date" id="${name}" name="${name}" value="${value}" ${required ? 'required' : ''}>`;
  }

  /**
   * Create a radio button group
   */
  static createRadioGroup(name, options, selectedValue = '') {
    return options.map(option => {
      const value = typeof option === 'string' ? option : option.value;
      const text = typeof option === 'string' ? option : option.text;
      const checked = value === selectedValue ? 'checked' : '';
      const id = `${name}_${value.replace(/\s+/g, '_').toLowerCase()}`;
      
      return `
        <div class="radio-option">
          <input type="radio" id="${id}" name="${name}" value="${value}" ${checked}>
          <label for="${id}">${text}</label>
        </div>
      `;
    }).join('');
  }

  /**
   * Create a checkbox input
   */
  static createCheckbox(name, value = '1', checked = false, label = '') {
    const checkedAttr = checked ? 'checked' : '';
    return `
      <div class="checkbox-option">
        <input type="checkbox" id="${name}" name="${name}" value="${value}" ${checkedAttr}>
        <label for="${name}">${label}</label>
      </div>
    `;
  }

  /**
   * Create form actions (save button)
   */
  static createFormActions(tabName, additionalButtons = '') {
    return `
      <div class="form-actions">
        <button type="button" class="btn btn-primary" onclick="kirProfile.saveTab('${tabName}')">Simpan</button>
        ${additionalButtons}
      </div>
    `;
  }

  /**
   * Create a form section with title
   */
  static createFormSection(title, content, className = 'form-section') {
    return `
      <div class="${className}">
        <h3>${title}</h3>
        <div class="form-grid">
          ${content}
        </div>
      </div>
    `;
  }

  /**
   * Escape HTML to prevent XSS
   */
  static escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Format currency for display
   */
  static formatCurrency(amount) {
    if (!amount) return '';
    return new Intl.NumberFormat('ms-MY', {
      style: 'currency',
      currency: 'MYR'
    }).format(amount);
  }

  /**
   * Format date for display
   */
  static formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ms-MY');
  }

  /**
   * Validate email format
   */
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate Malaysian IC number format
   */
  static isValidIC(ic) {
    const icRegex = /^\d{6}-\d{2}-\d{4}$/;
    return icRegex.test(ic);
  }

  /**
   * Validate phone number format
   */
  static isValidPhone(phone) {
    const phoneRegex = /^(\+?6?01)[0-46-9]-*[0-9]{7,8}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
  }

  /**
   * Get form data from a form element
   */
  static getFormData(formElement) {
    const formData = new FormData(formElement);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
      // Handle multiple values (checkboxes, etc.)
      if (data[key]) {
        if (Array.isArray(data[key])) {
          data[key].push(value);
        } else {
          data[key] = [data[key], value];
        }
      } else {
        data[key] = value;
      }
    }
    
    return data;
  }

  /**
   * Show/hide form groups based on condition
   */
  static toggleFormGroups(groupIds, show = true) {
    groupIds.forEach(groupId => {
      const group = document.getElementById(groupId);
      if (group) {
        group.style.display = show ? 'block' : 'none';
      }
    });
  }

  /**
   * Clear form validation errors
   */
  static clearValidationErrors(formElement) {
    const errorElements = formElement.querySelectorAll('.error-message');
    errorElements.forEach(el => el.remove());
    
    const invalidInputs = formElement.querySelectorAll('.invalid');
    invalidInputs.forEach(input => input.classList.remove('invalid'));
  }

  /**
   * Show validation error for a field
   */
  static showFieldError(fieldName, message) {
    const field = document.getElementById(fieldName);
    if (!field) return;
    
    // Remove existing error
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) existingError.remove();
    
    // Add error class
    field.classList.add('invalid');
    
    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
  }
}