// Utility functions for the notes app

// Extract unique users from notes data
export const extractUniqueUsers = (notes) => {
  const userMap = new Map();

  notes.forEach(note => {
    // Create a unique key from firstname and lastname since user_id might not be available
    const userKey = `${note.firstname}_${note.lastname}`;

    if (!userMap.has(userKey)) {
      userMap.set(userKey, {
        id: userKey, // Use the key as id for now
        firstname: note.firstname,
        lastname: note.lastname
      });
    }
  });

  return Array.from(userMap.values());
};