import React, { useState } from 'react';
import JsonDisplay from './JsonDisplay';

const UserNotesJson = ({ users, selectedUserId, userNotes, handleUserSelect }) => {
  const [displayMode, setDisplayMode] = useState('cards');

  return (
    <div className="card p-4 mb-4">
      <h2 className="card-title mb-4">User Notes - JSON Display</h2>
      
      <div className="row mb-4">
        <div className="col-md-8">
          <label className="font-weight-bold">Select User:</label>
          <select 
            className="form-control"
            value={selectedUserId} 
            onChange={(e) => handleUserSelect(e.target.value)}
          >
            <option value="">-- Select a User --</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.firstname} {user.lastname} (ID: {user.id})
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <label className="font-weight-bold">Display Mode:</label>
          <select 
            className="form-control"
            value={displayMode}
            onChange={(e) => setDisplayMode(e.target.value)}
          >
            <option value="cards">Cards View</option>
            <option value="table">Table View</option>
            <option value="raw">Raw JSON</option>
          </select>
        </div>
      </div>
      
      {selectedUserId && userNotes.length > 0 && (
        <>
          <div className="alert alert-info">
            <h5 className="mb-2">User Data - JSON Structure</h5>
            <p className="mb-1"><strong>User ID:</strong> {selectedUserId}</p>
            <p className="mb-1"><strong>Notes Found:</strong> {userNotes.length}</p>
            <p className="mb-0"><strong>Data Source:</strong> API Response converted to HTML</p>
          </div>
          
          <JsonDisplay 
            jsonData={userNotes}
            title={`Notes for User ID: ${selectedUserId}`}
            displayMode={displayMode}
            className="user-notes-json-display"
          />
        </>
      )}
      
      {selectedUserId && userNotes.length === 0 && (
        <div className="alert alert-warning">
          <h5>No Notes Found</h5>
          <p className="mb-0">No notes found for User ID: {selectedUserId}</p>
        </div>
      )}
      
      {!selectedUserId && (
        <div className="text-center text-muted p-4">
          <h5>Select a user to view their notes in JSON format</h5>
          <p>The JSON data will be parsed and displayed as formatted HTML</p>
        </div>
      )}
    </div>
  );
};

export default UserNotesJson;