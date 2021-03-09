const findUserByEmail = (emailID, users) => {
  for (const userID in users) {
    const userEmail = users[userID].email;
    if (userEmail === emailID) {
      return users[userID];
    }
  }
  return false;
};
module.exports = {
  findUserByEmail,
};
