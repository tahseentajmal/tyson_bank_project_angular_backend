const jwt = require('jsonwebtoken')

const db = require('./db.js') // Imported db.js into data service

// userdetails = {
//     1000: { acno: 1000, username: "anu", password: "abc123", balance: 10000 ,transaction:[] },
//     1001: { acno: 1001, username: "manu", password: "abc123", balance: 20000,transaction:[] },
//     1002: { acno: 1002, username: "tanu", password: "abc123", balance: 30000,transaction:[] },
//     1003: { acno: 1003, username: "fanu", password: "abc123", balance: 40000,transaction:[] },
// }

register = (acno, username, password) => { // Async Function

  return db.User.findOne({ acno }).then(user => { // Function within function 2*return (Recursion)
    if (user) { // If user exists ie. (user===true)
      return {
        status: false,
        message: "User Exists",
        statusCode: 401
      }
    }
    else {
      // creates a new user object in db
      const newUser = new db.User({
        acno, username, password, balance: 0, transaction: []
      })
      // Saving object is mandatory for creation in db
      newUser.save()

      return {
        status: true,
        message: "User Registered Successfully",
        statusCode: 200
      }
    }
  })
}



login = (acno, password) => {

  return db.User.findOne({ acno, password }).then(user => {
    if (user) {
      user = user.username
      current_acno = acno

      const token = jwt.sign({ current_acno }, 'supersecretkey')

      return {
        status: true,
        message: "User logged in Successfully",
        statusCode: 200,
        acno: current_acno,
        username: user,
        token
      }
    }
    else {
      return {
        status: false,
        message: "Password or Account Number incorrect.",
        statusCode: 401
      }
    }
  })
}


deposit = (acno, password, amount) => {


  return db.User.findOne({ acno, password }).then(user => {
    if (user) {
      // Update balance
      user.balance += amount
      // Store transaction data
      user.transaction.push({ type: "CREDIT", tr_amount: amount })
      // Save Data onto the Database
      user.save()
      // Return Balance
      return {
        status: true,
        message: `${amount} is credited to your account,your balance is ${user.balance}`,
        statusCode: 200
      }
    }
    else {
      return {
        status: false,
        message: "Error (Incorrect Account No. or Password)",
        statusCode: 401
      }
    }
  })
}

withdraw = (acno, password, amount) => {


  return db.User.findOne({ acno, password }).then(user => {
    if (user) {
      if (amount < user.balance) { // Update balance
        user.balance -= amount
        // Store transaction data
        user.transaction.push({ type: "DEBIT", tr_amount: amount })
        // Save Data onto the Database
        user.save()
        // Return Balance
        return {
          status: true,
          message: `${amount} is debited from your account,your balance is ${user.balance}`,
          statusCode: 200
        }
      }
      else {
        return {
          status: false,
          message: "Insufficient Balance",
          statusCode: 401
        }
      }
    }
    else {
      return {
        status: false,
        message: "Error (Incorrect Account No. or Password)",
        statusCode: 401
      }
    }
  })
}

getTransaction = (acno) => {

  return db.User.findOne({ acno }).then(user => {
    if (user) {
      return {
        status: true,
        transaction: user.transaction,
        statusCode: 200
      }
    }
    else {
      return {
        status: false,
        message: "Invalid  request",
        statusCode: 401
      }
    }
  })

}

deleteAcc = (acno) => {
  return db.User.deleteOne({ acno }).then(user => {
    if (user) {
      return {
        status: true,
        statusCode: 200,
        message: "Account has been deleted successfully"
      }
    }
    else {
      return {
        status: false,
        statusCode: 401,
        message: "Error , user do not exist"
      }
    }
  })
}

module.exports = {
  register, login, deposit, withdraw, getTransaction, deleteAcc
}