const bcrypt = require("bcrypt");

const findUserByEmail = (emailID, users) => {
  for (const userID in users) {
    const userEmail = users[userID].email;
    if (userEmail === emailID) {
      return users[userID];
    }
  }
  return false;
};

const checkPassword = (userObj, email, passwordToCheck) => {
  const userEmail = userObj.email;

  if (
    userEmail === email &&
    bcrypt.compareSync(passwordToCheck, userObj.password)
  ) {
    return true;
  }
  return false;
};

module.exports = {
  findUserByEmail,
  checkPassword,
};
