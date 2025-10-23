import React from 'react';

const CreateNote = ({ newNote, setNewNote, createNote }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    createNote(e);
  };

  const handleChange = (e) => {
    setNewNote({
      ...newNote,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="card p-4 mb-4">
      <h2 className="card-title mb-4">Create New Note</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">User ID:</label>
          <input
            type="text"
            className="form-control"
            name="id"
            value={newNote.id}
            onChange={handleChange}
            placeholder="Enter user ID"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Note:</label>
          <textarea
            className="form-control"
            name="note"
            value={newNote.note}
            onChange={handleChange}
            rows="4"
            placeholder="Enter your note"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Create Note
        </button>
      </form>
    </div>
  );
};

export default CreateNote;