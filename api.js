require('dotenv').config();

const db = require('./db');
const cors = require('cors')
const morgan = require('morgan')
const express = require('express');

const app = express();

app.use(cors())
app.use(morgan('combined'))

const port = process.env.PORT || 3000   


// Authentication
app.get('/users/:user', async(req, res) =>{
    const {username,password} = JSON.parse(req.params.user)
    const data = await db.getUser(username,password)
    res.send(data)
})

app.get('/users', async(req, res) => {
    const users = await db.getUsers()
    console.log(users)
    res.send(users)
})

// Change password
app.put('/users/role/:user', async(req, res) =>{
    const {username,new_password} = JSON.parse(req.params.user)
    const data = await db.change_password(username,new_password)
    console.log(data)
    res.send(data)
})


// Change role
app.put('/users/password/:user', async(req, res) =>{
    const {username,new_role} = JSON.parse(req.params.user)
    const data = await db.change_rol(username,new_role)
    console.log(data)
    res.send(data)
})

//Create a new user
app.post('/users/:user', async(req, res) =>{
    const {name,surname,email,role,area} = JSON.parse(req.params.user)
    const username = (name[0] + surname).toLowerCase() + new Date().getFullYear()
    const data = await db.createUser(username,name.toLowerCase(),surname.toLowerCase(),email.toLowerCase(),role,area)
    res.send(data)
})
app.put('/users/:data',async (req,res) => {
    const {username,new_password} = JSON.parse(req.params.data)
    await db.changePassword(username,new_password)
    const user = await db.get_user(username,new_password)
    res.send(user)
})

app.get('/areas',async (req,res) =>{
    const areas = await db.getAreas()
    console.log(areas)
    res.send(areas)
})

app.listen(port, ()=>{
    console.log(`listening on port ${port}`)
})
