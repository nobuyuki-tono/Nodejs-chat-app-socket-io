const users = [];

// add user
const addUser = ({ id, username, room }) => {
  // Clean the data
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  // Validate data
  if (!username || !room) {
    return {
      error: "username and room required"
    };
  }

  // Check for existing user
  const existingUser = users.find(user => {
    return user.room === room && user.username === username;
  });

  // Validate username
  if (existingUser) {
    return {
      error: "Sorry, username is alreay in use, please try another username"
    };
  }

  // Store user
  const user = { id, username, room };
  users.push(user);
  return { user };
};

//---- remove user-----//
const removeUser = id => {
  const index = users.findIndex(user => {
    return user.id === id;
  });

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

//----- getUser from array ------//
const getUser = id => {
  return users.find(user => {
    return user.id === id;
  });
};

//------getUserInRoom ------------//

const getUsersInRoom = room => {
  return users.filter(user => {
    return user.room === room;
  });
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom
};
