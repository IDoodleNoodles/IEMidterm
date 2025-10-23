import React, { useState } from 'react';
import JsonDisplay from './JsonDisplay';

const AllNotesJson = ({ notes, fetchAllNotes }) => {
  const [displayMode, setDisplayMode] = useState('table');
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState('');

  const handleRefresh = async () => {
    setIsLoading(true);
    setApiStatus('🔄 Fetching from API...');
    
    try {
      await fetchAllNotes();
      setApiStatus('✅ Data loaded successfully!');
      setTimeout(() => setApiStatus(''), 3000);
    } catch (error) {
      setApiStatus('❌ Error loading data');
      setTimeout(() => setApiStatus(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const testApiDirectly = () => {
    window.open('http://hyeumine.com/notesposted.php', '_blank');
  };

  return (
    <div className="card p-4 mb-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="card-title mb-0">All Notes - JSON Display ({notes.length})</h2>
          {apiStatus && <small className="text-muted">{apiStatus}</small>}
        </div>
        <div className="d-flex gap-2 align-items-center">
          <button onClick={testApiDirectly} className="btn btn-outline-info btn-sm">
            View Raw API
          </button>
          <select 
            className="form-control form-control-sm"
            value={displayMode}
            onChange={(e) => setDisplayMode(e.target.value)}
            style={{width: 'auto'}}
          >
            <option value="table">Table View</option>
            <option value="cards">Cards View</option>
            <option value="raw">Raw JSON</option>
          </select>
          <button 
            onClick={handleRefresh} 
            className="btn btn-success"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Refresh API Data'}
          </button>
        </div>
      </div>
      
      {/* Data Source Status */}
      <div className="alert alert-info mb-3">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <strong>📡 API Source:</strong> 
            <code className="ml-2">http://hyeumine.com/notesposted.php</code>
          </div>
          <div className="small">
            {notes.some(n => n.id && n.user_id) ? 
              <span className="badge badge-success">✅ Real API Data</span> : 
              <span className="badge badge-warning">⚠️ Mock Data (CORS Issue)</span>
            }
          </div>
        </div>
      </div>

      <JsonDisplay 
        jsonData={notes}
        title="Notes and Users Data"
        displayMode={displayMode}
        className="notes-json-display"
      />
      
      {notes.length > 0 && (
        <div className="mt-3 p-3 bg-light rounded">
          <h5>JSON Data Summary:</h5>
          <ul className="mb-0">
            <li><strong>Total Records:</strong> {notes.length}</li>
            <li><strong>Unique Users:</strong> {[...new Set(notes.map(n => n.user_id))].length}</li>
            <li><strong>Data Fields:</strong> {Object.keys(notes[0] || {}).join(', ')}</li>
            <li><strong>Data Source:</strong> {notes.some(n => n.id > 100) ? 'Live API' : 'Mock Data'}</li>
            <li><strong>Last Updated:</strong> {new Date().toLocaleString()}</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default AllNotesJson;