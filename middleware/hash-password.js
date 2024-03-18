const bcrypt = require('bcrypt')
const saltRounds = process.env.SALT
const asyncWrapper = require('./async-wrapper')

async function hashPassword(password, saltRounds) {
    try {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      return hashedPassword;
    } catch (err) {
      // Handle error
      console.error(err);
      throw err;
    }
  }
async function checkPassword(password,hash){
  try {
    const hashedPassword = await bcrypt.compare(password, hash);
    return hashedPassword;
  } catch (err) {
    // Handle error
    console.error(err);
    throw err;
  }
} 

module.exports = {hashPassword,checkPassword}