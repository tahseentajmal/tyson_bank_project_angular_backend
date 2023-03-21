// Landing File

// import json web token

const jwt = require('jsonwebtoken')

// Import Cors (FrontEnd)

const cors = require('cors')

// Import dataservice.js

const dataService = require("./service/dataservice")

// Import Express

const express = require("express")  // Code for importing express
const { connect } = require('mongoose')
// const res = require("express/lib/response")

// Create app using express

const app = express()                // Code for creating app

// Frontend Connection String for cors (Given after app creation)

app.use(cors({ origin: 'http://localhost:4200' })) // integrates frontend port

// To parse Json data from request body
app.use(express.json())

// MiddleWare

const jwtMiddleware = (req, res, next) => {
    try {
        const token = req.headers['access_token'] // instead of req.body.token

        // Verify Token
        const data = jwt.verify(token, "supersecretkey")
        console.log("middlewarres");
        console.log(data);

        next() // to move flow of control out of the function to the api request
    }
    catch {
        res.status(422).json({
            statusCode: 422,
            status: false,
            message: "Pleage Login to continue."
        })
    }
}

// HTTP Requests

//register - post
app.post('/register', (req, res) => {

    dataService.register(req.body.acno, req.body.username, req.body.password).then(result => {
        res.status(result.statusCode).json(result)
    })
    // Convert object from js to json as response


})

//login - get
app.post('/login', (req, res) => {

    dataService.login(req.body.acno, req.body.password).then(result => {
        // Convert object from js to json as response
        res.status(result.statusCode).json(result)
    })
})

//deposit - post
app.post('/deposit', jwtMiddleware, (req, res) => {

    dataService.deposit(req.body.acno, req.body.password, req.body.amount).then(result => {
        // Convert object from js to json as response
        res.status(result.statusCode).json(result)
    })
})

//withdraw - post
app.post('/withdraw', (req, res) => {

    dataService.withdraw(req.body.acno, req.body.password, req.body.amount).then(result => {
        // Convert object from js to json as response
        res.status(result.statusCode).json(result)
    })


})

//getTransaction - get
app.post('/getTransaction', jwtMiddleware, (req, res) => {

    dataService.getTransaction(req.body.acno).then(result => {
        // Convert object from js to json as response
        res.status(result.statusCode).json(result)
    })
})

//deleteAcc - delete
app.delete('/delete/:acno', jwtMiddleware, (req, res) => { // /:acno is params
    dataService.deleteAcc(req.params.acno).then(result => {
        // Convert object from js to json as response
        res.status(result.statusCode).json(result) 
    })
})


app.listen(3001, () => { console.log("Server initiated at port:3001") })



// converts and sends (handles both tasks)
                                                // status(object.var) changes the status of message

    // if(result){
    //     res.send("Registration Success")
    // }
    // else{
    //     res.send("User alrready exists")
    // }
    // console.log(req.body);
    // res.send('Register success')


//login
//deposit
//withdraw
//getTransaction
//delete

// //GET Request
// app.get('/',(req,res)=>{
//     res.send('Get Method is called')
// })
// //post Request
// app.post('/',(req,res)=>{
//     res.send('post')
// })
// //put Request
// app.put('/',(req,res)=>{
//     res.send('put')
// })
// //put Request
// app.patch('/',(req,res)=>{
//     res.send('patch')
// })
// //put Request
// app.delete('/',(req,res)=>{
//     res.send('delete')
// })

// Assign port number