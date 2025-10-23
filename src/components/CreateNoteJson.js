import React, { useState } from 'react';
import JsonDisplay from './JsonDisplay';

const CreateNoteJson = ({ newNote, setNewNote, createNote }) => {
  const [lastResponse, setLastResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Call the original createNote function but capture response
      const response = await createNote(e);
      
      // Set the response for JSON display
      setLastResponse({
        timestamp: new Date().toISOString(),
        request: {
          method: 'POST',
          endpoint: '/newnote.php',
          parameters: {
            id: parseInt(newNote.id),
            note: newNote.note
          }
        },
        response: response || {
          success: true,
          message: "Note created successfully"
        },
        status: 'success'
      });
    } catch (error) {
      setLastResponse({
        timestamp: new Date().toISOString(),
        request: {
          method: 'POST',
          endpoint: '/newnote.php',
          parameters: {
            id: parseInt(newNote.id),
            note: newNote.note
          }
        },
        error: {
          message: error.message,
          type: 'API_ERROR'
        },
        status: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card p-4 mb-4">
      <h2 className="card-title mb-4">Create New Note - JSON Response</h2>
      
      <div className="row">
        <div className="col-md-6">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="font-weight-bold">User ID (Integer):</label>
              <input
                type="number"
                className="form-control"
                value={newNote.id}
                onChange={(e) => setNewNote({...newNote, id: e.target.value})}
                placeholder="Enter user ID number"
                required
              />
              <small className="form-text text-muted">
                Enter the numeric ID of an existing user
              </small>
            </div>
            <div className="form-group">
              <label className="font-weight-bold">Note:</label>
              <textarea
                className="form-control"
                value={newNote.note}
                onChange={(e) => setNewNote({...newNote, note: e.target.value})}
                rows="4"
                placeholder="Enter your note here..."
                required
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-success btn-lg btn-block"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Note...' : 'Create Note & Show JSON Response'}
            </button>
          </form>
          
          {newNote.id && newNote.note && (
            <div className="mt-4 p-3 bg-light rounded">
              <h6>Preview Request Data:</h6>
              <JsonDisplay 
                jsonData={{
                  user_id: parseInt(newNote.id) || 0,
                  note_content: newNote.note,
                  content_length: newNote.note.length
                }}
                title="Request Parameters"
                displayMode="table"
              />
            </div>
          )}
        </div>
        
        <div className="col-md-6">
          {lastResponse && (
            <>
              <h5 className="text-success">API Response - JSON Format</h5>
              <JsonDisplay 
                jsonData={lastResponse}
                title="Create Note API Response"
                displayMode="table"
                className="api-response-display"
              />
            </>
          )}
          
          {!lastResponse && (
            <div className="text-center text-muted p-4 border rounded">
              <h6>JSON Response Preview</h6>
              <p>Submit the form to see the API response parsed as JSON and displayed in HTML format</p>
              <div className="small">
                <strong>Expected Response Structure:</strong>
                <pre className="text-left mt-2 bg-white p-2 rounded">
{`{
  "success": true,
  "message": "Note created successfully", 
  "note": {
    "id": 456,
    "user_id": 101,
    "note": "Sample note content",
    "created_at": "2024-10-23T..."
  }
}`}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {lastResponse && lastResponse.status === 'success' && (
        <div className="mt-4 alert alert-success">
          <h6>✅ JSON Data Successfully Parsed!</h6>
          <p className="mb-0">The API response has been converted from JSON format to structured HTML display above.</p>
        </div>
      )}
    </div>
  );
};

export default CreateNoteJson;