import React from 'react';

const Header = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'allNotes', label: 'All Notes' },
    { id: 'userNotes', label: 'User Notes' },
    { id: 'createUser', label: 'Create User' },
    { id: 'createNote', label: 'Create Note' }
  ];

  return (
    <header className="bg-light border-bottom py-3 mb-4">
      <div className="container">
        <h1 className="h3 mb-3 text-primary">Notes App</h1>
        <nav>
          <div className="nav nav-pills" role="tablist">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                type="button"
              >
                {tab.label}
              </button>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;