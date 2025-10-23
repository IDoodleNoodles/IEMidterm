import React, { useState, useEffect } from 'react';
import { jsonToHtml } from '../utils/jsonToHtml';

const JsonDisplay = ({ 
  jsonData, 
  title = 'Data Display', 
  displayMode = 'table', // 'table', 'cards', 'raw'
  className = 'json-display-component' 
}) => {
  const [htmlContent, setHtmlContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (jsonData) {
      setLoading(true);
      try {
        let html = '';
        
        switch (displayMode) {
          case 'cards':
            html = jsonToHtml.parseToCards(jsonData, { 
              containerClass: 'json-cards-container',
              cardClass: 'json-card'
            });
            break;
          case 'raw':
            html = `<pre class="json-raw">${JSON.stringify(jsonData, null, 2)}</pre>`;
            break;
          case 'table':
          default:
            html = jsonToHtml.parseToHtml(jsonData, { title, className: 'json-table-display' });
            break;
        }
        
        setHtmlContent(html);
      } catch (error) {
        console.error('Error parsing JSON to HTML:', error);
        setHtmlContent(`<div class="error">Error displaying data: ${error.message}</div>`);
      } finally {
        setLoading(false);
      }
    } else {
      setHtmlContent('<div class="no-data">No data available</div>');
    }
  }, [jsonData, title, displayMode, className]);

  if (loading) {
    return (
      <div className={`${className} loading`}>
        <div className="spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div 
        className="json-html-content"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
      
      <style jsx>{`
        .json-display-component {
          width: 100%;
          margin: 1rem 0;
        }

        .json-html-content {
          width: 100%;
        }

        .json-title {
          color: #333;
          margin-bottom: 1rem;
          font-size: 1.5rem;
          font-weight: 500;
          border-bottom: 2px solid #667eea;
          padding-bottom: 0.5rem;
        }

        .json-table-container {
          overflow-x: auto;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        .json-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 8px;
          overflow: hidden;
        }

        .json-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          border: none;
        }

        .json-row {
          transition: background-color 0.3s ease;
        }

        .json-row:nth-child(even) {
          background-color: #f8f9fa;
        }

        .json-row:hover {
          background-color: #e9ecef;
        }

        .json-cell {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid #e9ecef;
          vertical-align: top;
        }

        .json-cards-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-top: 1rem;
        }

        .json-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
          border: 1px solid #e9ecef;
        }

        .json-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        }

        .card-field {
          margin-bottom: 0.75rem;
          display: flex;
          flex-direction: column;
        }

        .field-label {
          color: #667eea;
          font-weight: 600;
          margin-bottom: 0.25rem;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .field-value {
          color: #333;
          font-size: 1rem;
          line-height: 1.5;
        }

        .string-value {
          color: #28a745;
        }

        .number-value {
          color: #007bff;
          font-weight: 500;
        }

        .date-value {
          color: #6f42c1;
          font-style: italic;
        }

        .boolean-value {
          font-weight: bold;
          text-transform: uppercase;
          font-size: 0.9rem;
        }

        .boolean-value.true {
          color: #28a745;
        }

        .boolean-value.false {
          color: #dc3545;
        }

        .null-value {
          color: #6c757d;
          font-style: italic;
        }

        .url-value {
          color: #007bff;
          text-decoration: none;
        }

        .url-value:hover {
          text-decoration: underline;
        }

        .json-raw {
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          padding: 1.5rem;
          overflow-x: auto;
          font-family: 'Courier New', monospace;
          font-size: 0.9rem;
          line-height: 1.5;
          color: #333;
        }

        .no-data {
          text-align: center;
          padding: 2rem;
          color: #6c757d;
          font-style: italic;
        }

        .error {
          background: #f8d7da;
          color: #721c24;
          padding: 1rem;
          border-radius: 8px;
          border: 1px solid #f5c6cb;
        }

        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 2rem;
        }

        .spinner {
          color: #667eea;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .json-table-container {
            font-size: 0.9rem;
          }

          .json-header,
          .json-cell {
            padding: 0.5rem;
          }

          .json-cards-container {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .json-card {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default JsonDisplay;