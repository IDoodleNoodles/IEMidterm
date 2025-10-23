import React from 'react';

const CreateUser = ({ newUser, setNewUser, createUser }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    createUser(e);
  };

  const handleChange = (e) => {
    setNewUser({
      ...newUser,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="card p-4 mb-4">
      <h2 className="card-title mb-4">Create New User</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">First Name:</label>
          <input
            type="text"
            className="form-control"
            name="firstname"
            value={newUser.firstname}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Last Name:</label>
          <input
            type="text"
            className="form-control"
            name="lastname"
            value={newUser.lastname}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Create User
        </button>
      </form>
    </div>
  );
};

export default CreateUser;