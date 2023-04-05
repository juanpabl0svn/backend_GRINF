require('dotenv').config();
const {Pool} = require('pg');
const md5 = require('md5');

const pool = new Pool({
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    host: process.env.DBHOST,
    port: process.env.DBPORT,
    database: process.env.DATABASE
})

const get_user = async(username,password) =>{
    const user = await pool.query(`SELECT * FROM users WHERE username='${username}' AND password='${md5(password)}'`)
    return user.rows[0]
}

const change_password = async(username,new_password) =>{
    const res = await pool.query(`UPDATE users SET password='${new_password}' WHERE username='${username}'`)
    console.log(res.rowCount)
    return res.rowCount
}

const change_rol = async(username,new_role) =>{
    const res = await pool.query(`UPDATE users SET role='${new_role}' WHERE username='${username}'`)
    return res.rowCount
}

const get_users = async() =>{
    const res = await pool.query(`SELECT id_user,username,name,surname,email,role FROM users`)
    console.log(res.rows)
    return res.rows
}

const get_users_by = async({id,username,name,surname,email,role}) =>{
    const res = await pool.query(`SELECT id_user,username,name,surname,email,role FROM users WHERE username`)
    return res.rows
}

const create_activity = async()=>{

}

const create_user = async(username,name,surname,email,birthdate,role)=>{
    const query = await pool.query(`INSERT INTO users (username,password,name,surname,email,birthdate,role) VALUES ('${username}','${md5(username)}','${name}','${surname}','${email}','${birthdate}','${role}')`)
    return query
}


const get_activities = async(state) =>{
    const activities = await pool.query(`SELECT * FROM activities WHERE state=${state}`)
}

const get_activities_by = async(state) =>{
    const activities = await pool.query(`SELECT * FROM activities`)
}



module.exports = {
    get_user,
    get_users,
    change_password,
    change_rol,
    create_activity,
    create_user,
    get_activities,
    get_activities_by,
    get_users_by
}
