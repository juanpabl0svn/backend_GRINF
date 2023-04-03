require('dotenv').config();

const db = require('./db');
const cors = require('cors')
const morgan = require('morgan')
const express = require('express');

const app = express();

app.use(cors())
app.use(morgan())

const port = process.env.PORT || 3000   


// Authentication
app.get('/users/:user', async(req, res) =>{
    const {username,password} = JSON.parse(req.params.user)
    const data = await db.get_user(username,password)
    console.log(data)
    res.send(data)
})

// Change password
app.put('/users/rol/:user', async(req, res) =>{
    const {username,new_password} = JSON.parse(req.params.user)
    const data = await db.change_password(username,new_password)
    console.log(data)
    res.send(data)
})


// Change password
app.put('/users/password/:user', async(req, res) =>{
    const {username,new_role} = JSON.parse(req.params.user)
    const data = await db.change_rol(username,new_role)
    console.log(data)
    res.send(data)
})

//Create a new user
app.post('/users/set/:user', async(req, res) =>{
    const {username,password,name,surname,email,birthdate,rol} = JSON.parse(req.params.user)
    const data = await db.set_user(username,password,name,surname,email,birthdate,rol)
    console.log(data)
    res.send(data)
})


app.listen(port, ()=>{
    console.log(`listening on port ${process.env.PORT}`)
})
