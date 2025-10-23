// JSON to HTML parser utilities
export const jsonToHtml = {
  // Convert JSON object to formatted HTML
  parseToHtml(jsonData, options = {}) {
    const { title = 'JSON Data', className = 'json-display' } = options;
    
    if (!jsonData) return '<div class="no-data">No data available</div>';
    
    if (Array.isArray(jsonData)) {
      return this.parseArrayToHtml(jsonData, title, className);
    } else if (typeof jsonData === 'object') {
      return this.parseObjectToHtml(jsonData, title, className);
    } else {
      return `<div class="${className}"><strong>${title}:</strong> ${jsonData}</div>`;
    }
  },

  // Parse array of objects to HTML table
  parseArrayToHtml(dataArray, title, className) {
    if (!Array.isArray(dataArray) || dataArray.length === 0) {
      return `<div class="${className}"><h3>${title}</h3><p>No items found</p></div>`;
    }

    // Get all unique keys from all objects
    const allKeys = [...new Set(dataArray.flatMap(item => Object.keys(item)))];
    
    const tableHtml = `
      <div class="${className}">
        <h3 class="json-title">${title} (${dataArray.length} items)</h3>
        <div class="json-table-container">
          <table class="json-table">
            <thead>
              <tr>
                ${allKeys.map(key => `<th class="json-header">${this.formatKey(key)}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${dataArray.map(item => `
                <tr class="json-row">
                  ${allKeys.map(key => `
                    <td class="json-cell" data-label="${this.formatKey(key)}">
                      ${this.formatValue(item[key])}
                    </td>
                  `).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
    
    return tableHtml;
  },

  // Parse single object to HTML
  parseObjectToHtml(dataObject, title, className) {
    const entries = Object.entries(dataObject);
    
    const htmlContent = `
      <div class="${className}">
        <h3 class="json-title">${title}</h3>
        <div class="json-object">
          ${entries.map(([key, value]) => `
            <div class="json-property">
              <span class="json-key">${this.formatKey(key)}:</span>
              <span class="json-value">${this.formatValue(value)}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    
    return htmlContent;
  },

  // Format object keys for display
  formatKey(key) {
    return key
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  },

  // Format values for HTML display
  formatValue(value) {
    if (value === null || value === undefined) {
      return '<span class="null-value">N/A</span>';
    }
    
    if (typeof value === 'boolean') {
      return `<span class="boolean-value ${value}">${value}</span>`;
    }
    
    if (typeof value === 'number') {
      return `<span class="number-value">${value}</span>`;
    }
    
    if (typeof value === 'string') {
      // Check if it looks like a date
      if (this.isDateString(value)) {
        return `<span class="date-value">${this.formatDate(value)}</span>`;
      }
      
      // Check if it's a URL
      if (this.isUrl(value)) {
        return `<a href="${value}" target="_blank" class="url-value">${value}</a>`;
      }
      
      return `<span class="string-value">${this.escapeHtml(value)}</span>`;
    }
    
    if (typeof value === 'object') {
      return `<pre class="object-value">${JSON.stringify(value, null, 2)}</pre>`;
    }
    
    return `<span class="unknown-value">${this.escapeHtml(String(value))}</span>`;
  },

  // Check if string looks like a date
  isDateString(str) {
    const datePatterns = [
      /^\d{4}-\d{2}-\d{2}/, // YYYY-MM-DD
      /^\d{2}\/\d{2}\/\d{4}/, // MM/DD/YYYY
      /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}/ // YYYY-MM-DD HH:MM:SS
    ];
    
    return datePatterns.some(pattern => pattern.test(str)) && !isNaN(Date.parse(str));
  },

  // Check if string is a URL
  isUrl(str) {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  },

  // Format date for display
  formatDate(dateStr) {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  },

  // Escape HTML characters
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  // Generate cards layout for array data
  parseToCards(dataArray, options = {}) {
    const { cardClass = 'json-card', containerClass = 'json-cards-container' } = options;
    
    if (!Array.isArray(dataArray) || dataArray.length === 0) {
      return `<div class="${containerClass}"><p>No items to display</p></div>`;
    }

    const cardsHtml = `
      <div class="${containerClass}">
        ${dataArray.map((item, index) => `
          <div class="${cardClass}" data-index="${index}">
            ${Object.entries(item).map(([key, value]) => `
              <div class="card-field">
                <strong class="field-label">${this.formatKey(key)}:</strong>
                <span class="field-value">${this.formatValue(value)}</span>
              </div>
            `).join('')}
          </div>
        `).join('')}
      </div>
    `;
    
    return cardsHtml;
  }
};