const findUser = (emailID, users) => {
  for (const userID in users) {
    const userEmail = users[userID].email;
    if (userEmail === emailID) {
      return users[userID];
    }
  }
  return false;
};

const findUserName = (username, users) => {
  for (const userID in users) {
    const userEmail = users[userID].username;
    if (userEmail === username) {
      return users[userID];
    }
  }
  return false;
};
