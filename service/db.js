//Server Database Inntegration

// Import Mongoose
// const { default: mongoose } = require("mongoose")
const mongoose = require("mongoose")

// State connection string

mongoose.connect('mongodb://127.0.0.1:27017/bankServer', { useNewUrlParser: true })


// Create Scheme or Model(class) for integration. 
// Model Name is singular form of collection name (ie. users)
// Schema represents field and its values

const User = mongoose.model('User', {
    acno: Number,
    username: String,
    password: String,
    balance: Number,
    transaction: []
})

// Export Module

module.exports = {
    User
}





