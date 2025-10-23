import React, { useState } from 'react';
import JsonDisplay from './JsonDisplay';

const CreateUserJson = ({ newUser, setNewUser, createUser }) => {
  const [lastResponse, setLastResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Call the original createUser function but capture response
      const response = await createUser(e);
      
      // Set the response for JSON display
      setLastResponse({
        timestamp: new Date().toISOString(),
        request: {
          method: 'POST',
          endpoint: '/newuser.php',
          parameters: {
            firstname: newUser.firstname,
            lastname: newUser.lastname
          }
        },
        response: response || {
          success: true,
          message: "User created successfully"
        },
        status: 'success'
      });
    } catch (error) {
      setLastResponse({
        timestamp: new Date().toISOString(),
        request: {
          method: 'POST',
          endpoint: '/newuser.php',
          parameters: {
            firstname: newUser.firstname,
            lastname: newUser.lastname
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
      <h2 className="card-title mb-4">Create New User - JSON Response</h2>
      
      <div className="row">
        <div className="col-md-6">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="font-weight-bold">First Name:</label>
              <input
                type="text"
                className="form-control"
                value={newUser.firstname}
                onChange={(e) => setNewUser({...newUser, firstname: e.target.value})}
                placeholder="Enter first name"
                required
              />
            </div>
            <div className="form-group">
              <label className="font-weight-bold">Last Name:</label>
              <input
                type="text"
                className="form-control"
                value={newUser.lastname}
                onChange={(e) => setNewUser({...newUser, lastname: e.target.value})}
                placeholder="Enter last name"
                required
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary btn-lg btn-block"
              disabled={isLoading}
            >
              {isLoading ? 'Creating User...' : 'Create User & Show JSON Response'}
            </button>
          </form>
          
          {newUser.firstname && newUser.lastname && (
            <div className="mt-4 p-3 bg-light rounded">
              <h6>Preview Request Data:</h6>
              <JsonDisplay 
                jsonData={{
                  firstname: newUser.firstname,
                  lastname: newUser.lastname
                }}
                title="Request Parameters"
                displayMode="raw"
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
                title="Create User API Response"
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
  "message": "User created successfully",
  "user": {
    "id": 123,
    "firstname": "John",
    "lastname": "Doe",
    "created_at": "2024-10-23T..."
  }
}`}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateUserJson;