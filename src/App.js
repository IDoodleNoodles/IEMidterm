import React, { useState, useEffect } from 'react';
import './App.css';
import { 
  Header, 
  AllNotesJson,
  UserNotesJson, 
  CreateUserJson,
  CreateNoteJson 
} from './components';
import { apiService } from './services/apiService';
import { extractUniqueUsers } from './utils/helpers';

function App() {
  const [users, setUsers] = useState([]);
  const [notes, setNotes] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [userNotes, setUserNotes] = useState([]);
  const [newUser, setNewUser] = useState({ firstname: '', lastname: '' });
  const [newNote, setNewNote] = useState({ id: '', note: '' });
  const [activeTab, setActiveTab] = useState('allNotes');

  // Fetch all notes and users
  const fetchAllNotes = async () => {
    try {
      const data = await apiService.fetchAllNotes();
      setNotes(data);
      
      // Extract unique users from notes using utility function
      const uniqueUsers = extractUniqueUsers(data);
      setUsers(uniqueUsers);
    } catch (error) {
      console.error('Error fetching all notes:', error);
    }
  };

  // Fetch notes by user ID
  const fetchUserNotesById = async (userId) => {
    try {
      const data = await apiService.fetchUserNotes(userId);
      setUserNotes(data);
    } catch (error) {
      console.error('Error fetching user notes:', error);
    }
  };

  // Create new user
  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const result = await apiService.createUser(newUser);
      console.log('User created:', result);
      
      // Reset form and refresh data
      setNewUser({ firstname: '', lastname: '' });
      fetchAllNotes();
      alert('User created successfully! Check the JSON response above.');
      
      return result;
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Error creating user');
      throw error;
    }
  };

  // Create new note
  const handleCreateNote = async (e) => {
    e.preventDefault();
    try {
      const success = await apiService.createNote(newNote);
      
      if (success) {
        console.log('Note created successfully');
        
        // Reset form and refresh data
        setNewNote({ id: '', note: '' });
        fetchAllNotes();
        if (selectedUserId) {
          fetchUserNotesById(selectedUserId);
        }
        alert('Note created successfully! Check the JSON response above.');
      }
      
      return success;
    } catch (error) {
      console.error('Error creating note:', error);
      alert('Error creating note');
      throw error;
    }
  };

  // Handle user selection for viewing notes
  const handleUserSelect = (userId) => {
    setSelectedUserId(userId);
    if (userId) {
      fetchUserNotesById(userId);
    } else {
      setUserNotes([]);
    }
  };

  // Initial load
  useEffect(() => {
    fetchAllNotes();
  }, []);

  return (
    <div className="App">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="container">
        {activeTab === 'allNotes' && (
          <AllNotesJson notes={notes} fetchAllNotes={fetchAllNotes} />
        )}

        {activeTab === 'userNotes' && (
          <UserNotesJson 
            users={users}
            selectedUserId={selectedUserId}
            userNotes={userNotes}
            handleUserSelect={handleUserSelect}
          />
        )}

        {activeTab === 'createUser' && (
          <CreateUserJson 
            newUser={newUser}
            setNewUser={setNewUser}
            createUser={handleCreateUser}
          />
        )}

        {activeTab === 'createNote' && (
          <CreateNoteJson 
            newNote={newNote}
            setNewNote={setNewNote}
            createNote={handleCreateNote}
          />
        )}
      </main>
    </div>
  );
}

export default App;
