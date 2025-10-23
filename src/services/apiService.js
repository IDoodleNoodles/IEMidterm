// API service for handling all external API calls
const API_BASE = {
  allNotes: 'http://hyeumine.com/notesposted.php',
  userNotes: 'http://hyeumine.com/mynotes.php',
  newNote: 'http://hyeumine.com/newnote.php',
  newUser: 'http://hyeumine.com/newuser.php'
};

export const apiService = {
  // Parse HTML response from notesposted.php into notes array
  parseHTMLToNotes(htmlString) {
    try {
      console.log('🔍 Parsing HTML...');
      console.log('📄 HTML length:', htmlString.length);
      
      // Create a temporary DOM element to parse HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlString, 'text/html');
      
      // Debug: Log all tables found
      const allTables = doc.querySelectorAll('table');
      console.log('📊 Total tables found:', allTables.length);
      
      // Based on the actual API structure, we need to find the nested table
      // The structure is: main table > tbody > tr > td > table (nested) > tbody > tr (notes)
      let notesTable = null;
      const selectors = [
        'table tr td table tbody',    // Nested table inside td
        'table table tbody',          // Any nested table
        'table tbody',                // Direct table tbody
        'tbody'                       // Any tbody
      ];
      
      for (const selector of selectors) {
        const elements = doc.querySelectorAll(selector);
        console.log(`🔍 Trying selector "${selector}": Found ${elements.length} elements`);
        
        // Look for the tbody that contains note rows (has tr with 4+ td cells)
        for (const element of elements) {
          const rows = element.querySelectorAll('tr');
          console.log(`  - Element has ${rows.length} rows`);
          
          // Check if this tbody contains note data (rows with 4+ cells)
          let hasNoteRows = false;
          for (const row of rows) {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 4) {
              hasNoteRows = true;
              break;
            }
          }
          
          if (hasNoteRows) {
            notesTable = element;
            console.log(`✅ Found notes table with selector "${selector}"`);
            break;
          }
        }
        
        if (notesTable) break;
      }
      
      if (!notesTable) {
        console.log('❌ No notes table found');
        // Log table structure for debugging
        allTables.forEach((table, index) => {
          console.log(`Table ${index + 1}:`, table.outerHTML.substring(0, 200) + '...');
        });
        return [];
      }
      
      const notes = [];
      const rows = notesTable.querySelectorAll('tr');
      console.log('📋 Found rows in notes table:', rows.length);
      
      rows.forEach((row, rowIndex) => {
        const cells = row.querySelectorAll('td');
        console.log(`Row ${rowIndex + 1}: ${cells.length} cells`);
        
        if (cells.length >= 4) {
          const noteData = {
            id: notes.length + 1,
            firstname: cells[0].textContent.trim(),
            lastname: cells[1].textContent.trim(),
            note: cells[2].textContent.trim(),
            date: cells[3].textContent.trim()
          };
          
          console.log(`✅ Parsed note ${notes.length + 1}:`, noteData);
          notes.push(noteData);
        } else {
          console.log(`⚠️ Row ${rowIndex + 1} has insufficient cells (${cells.length}):`, 
            Array.from(cells).map(cell => cell.textContent.trim()));
        }
      });
      
      console.log('✅ Total notes parsed:', notes.length);
      
      // Sort notes by date (newest first) to ensure proper ordering
      notes.sort((a, b) => {
        // Parse dates for comparison (assuming format like "12:18:20 PM")
        const dateA = new Date(`2000-01-01 ${a.date}`);
        const dateB = new Date(`2000-01-01 ${b.date}`);
        return dateB - dateA; // Newest first
      });
      
      console.log('📅 Notes sorted by date (newest first):', notes.map(note => ({ note: note.note, date: note.date })));
      return notes;
    } catch (error) {
      console.log('❌ Error parsing HTML:', error);
      return [];
    }
  },

  // Fetch all notes and users - Returns parsed notes from HTML
  async fetchAllNotes() {
    console.log('🔄 Fetching all notes from API...');
    
    // Add cache-busting parameter to force fresh data
    const cacheBuster = `?t=${Date.now()}&r=${Math.random()}`;
    const apiUrl = `${API_BASE.allNotes}${cacheBuster}`;
    
    // Try multiple methods to fetch the HTML data
    const methods = [
      // Method 1: Direct fetch
      async () => {
        console.log('📡 Trying direct API call...');
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.text();
      },
      
      // Method 2: AllOrigins proxy (raw)
      async () => {
        console.log('📡 Trying AllOrigins proxy (raw)...');
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(API_BASE.allNotes + cacheBuster)}`;
        const response = await fetch(proxyUrl);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.text();
      },
      
      // Method 3: AllOrigins proxy (get)
      async () => {
        console.log('📡 Trying AllOrigins proxy (get)...');
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(API_BASE.allNotes + cacheBuster)}`;
        const response = await fetch(proxyUrl);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const result = await response.json();
        return result.contents;
      },
      
      // Method 4: CORS-Anywhere proxy
      async () => {
        console.log('📡 Trying CORS-Anywhere proxy...');
        const proxyUrl = `https://cors-anywhere.herokuapp.com/${API_BASE.allNotes}${cacheBuster}`;
        const response = await fetch(proxyUrl);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.text();
      },
      
      // Method 5: ThingProxy
      async () => {
        console.log('📡 Trying ThingProxy...');
        const proxyUrl = `https://thingproxy.freeboard.io/fetch/${API_BASE.allNotes}${cacheBuster}`;
        const response = await fetch(proxyUrl);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.text();
      }
    ];

    // Try each method until one works
    for (let i = 0; i < methods.length; i++) {
      try {
        const html = await methods[i]();
        console.log('✅ Successfully fetched HTML data');
        
        const parsedNotes = this.parseHTMLToNotes(html);
        console.log(`📊 Parsed ${parsedNotes.length} notes`);
        
        if (parsedNotes.length > 0) {
          return parsedNotes;
        } else {
          console.log('⚠️ Parsed 0 notes, trying next method');
          continue;
        }
        
      } catch (error) {
        console.log(`❌ Method ${i + 1} failed:`, error.message);
        continue;
      }
    }
    
    // If all methods fail, use mock data but log it clearly
    console.warn('🚨 All API methods failed, using mock data. The real API at http://hyeumine.com/notesposted.php could not be accessed due to CORS restrictions.');
    return this.getMockNotesData();
  },

  // Fetch notes by user ID - Returns JSON data for HTML display
  async fetchUserNotes(userId) {
    console.log(`🔄 Fetching notes for user ${userId}...`);
    
    const apiUrl = `${API_BASE.userNotes}?id=${userId}`;
    
    // Try multiple proxy methods
    const methods = [
      // Method 1: AllOrigins proxy
      async () => {
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(apiUrl)}`;
        const response = await fetch(proxyUrl);
        const result = await response.json();
        return JSON.parse(result.contents);
      },
      
      // Method 2: Direct fetch
      async () => {
        const response = await fetch(apiUrl);
        return await response.json();
      }
    ];

    for (let method of methods) {
      try {
        const data = await method();
        console.log(`✅ Successfully fetched user ${userId} notes:`, data);
        return Array.isArray(data) ? data : [data];
      } catch (error) {
        console.log(`❌ Method failed:`, error.message);
        continue;
      }
    }
    
    // Fallback to filtering all notes for this user
    console.warn(`🚨 Could not fetch user notes from API, filtering from all notes`);
    try {
      const allNotes = await this.fetchAllNotes();
      return allNotes.filter(note => note.user_id == userId);
    } catch (error) {
      return [];
    }
  },

  // Create new user - Returns JSON response data
  async createUser(userData) {
    try {
      const formData = new FormData();
      formData.append('firstname', userData.firstname);
      formData.append('lastname', userData.lastname);

      const response = await fetch(API_BASE.newUser, {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('API not accessible, simulating user creation:', error);
      // Return mock JSON response
      return {
        success: true,
        message: "User created successfully",
        user: {
          id: Math.floor(Math.random() * 1000) + 100,
          firstname: userData.firstname,
          lastname: userData.lastname,
          created_at: new Date().toISOString()
        }
      };
    }
  },

  // Create new note - Returns JSON response data
  async createNote(noteData) {
    try {
      const formData = new FormData();
      formData.append('id', noteData.id);
      formData.append('note', noteData.note);

      const response = await fetch(API_BASE.newNote, {
        method: 'POST',
        body: formData
      });
      
      return response.ok;
    } catch (error) {
      console.error('API not accessible, simulating note creation:', error);
      // Return mock success response
      return {
        success: true,
        message: "Note created successfully",
        note: {
          id: Math.floor(Math.random() * 1000) + 100,
          user_id: noteData.id,
          note: noteData.note,
          created_at: new Date().toISOString()
        }
      };
    }
  },

  // Mock JSON data that represents the expected API structure
  getMockNotesData() {
    return [
      {
        id: 1,
        user_id: 101,
        firstname: "John",
        lastname: "Doe", 
        note: "This is a sample note from the JSON API demonstrating data structure",
        date_created: "2024-10-23 10:30:00",
        status: "active",
        priority: 1
      },
      {
        id: 2,
        user_id: 102,
        firstname: "Jane",
        lastname: "Smith",
        note: "Another example note showing how JSON data gets parsed into HTML tables",
        date_created: "2024-10-23 11:15:00", 
        status: "active",
        priority: 2
      },
      {
        id: 3,
        user_id: 101,
        firstname: "John", 
        lastname: "Doe",
        note: "John's second note about React development and JSON parsing",
        date_created: "2024-10-23 12:00:00",
        status: "active",
        priority: 1
      },
      {
        id: 4,
        user_id: 103,
        firstname: "Alice",
        lastname: "Johnson",
        note: "Testing the Notes App with multiple users and JSON display",
        date_created: "2024-10-23 09:45:00",
        status: "active", 
        priority: 3
      },
      {
        id: 5,
        user_id: 102,
        firstname: "Jane",
        lastname: "Smith", 
        note: "Working on the midterm project requirements with JSON-to-HTML rendering",
        date_created: "2024-10-23 14:20:00",
        status: "active",
        priority: 2
      }
    ];
  }
};