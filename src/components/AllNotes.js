import React, { useState } from 'react';

const AllNotes = ({ notes, fetchAllNotes }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      await fetchAllNotes();
    } catch (error) {
      console.error('Error refreshing notes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card p-4 mb-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="card-title mb-0">All Notes ({notes.length})</h2>
        <button
          onClick={handleRefresh}
          className="btn btn-primary"
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      <div className="row">
        {notes.map(note => (
          <div key={note.id} className="col-md-6 mb-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{note.firstname} {note.lastname}</h5>
                <p className="card-text">{note.note}</p>
                <small className="text-muted">{note.date}</small>
              </div>
            </div>
          </div>
        ))}
      </div>

      {notes.length === 0 && (
        <div className="text-center text-muted">
          No notes available
        </div>
      )}
    </div>
  );
};

export default AllNotes;