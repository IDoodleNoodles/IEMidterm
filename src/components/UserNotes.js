import React from 'react';

const UserNotes = ({ users, selectedUserId, userNotes, handleUserSelect }) => {
  return (
    <div className="card p-4 mb-4">
      <h2 className="card-title mb-4">User Notes</h2>

      <div className="mb-4">
        <label className="form-label">Select User:</label>
        <select
          className="form-control"
          value={selectedUserId}
          onChange={(e) => handleUserSelect(e.target.value)}
        >
          <option value="">Choose a user...</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.firstname} {user.lastname}
            </option>
          ))}
        </select>
      </div>

      {selectedUserId && (
        <div>
          <h3>Notes for {users.find(u => u.id === selectedUserId)?.firstname} {users.find(u => u.id === selectedUserId)?.lastname}</h3>

          <div className="row">
            {userNotes.map(note => (
              <div key={note.id} className="col-md-6 mb-3">
                <div className="card">
                  <div className="card-body">
                    <p className="card-text">{note.note}</p>
                    <small className="text-muted">{note.date}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {userNotes.length === 0 && (
            <div className="text-center text-muted">
              No notes found for this user
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserNotes;