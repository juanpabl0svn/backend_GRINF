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

const getUser = async(username,password) =>{
    const user = await pool.query(`SELECT  us.id_user, us.name,us.surname, us.email, us.username, ro.role_description,ar.area_description FROM users us, roles ro, areas ar WHERE us.username = '${username}' AND us.password='${md5(password)}' AND us.id_area = ar.id_area AND us.id_role = ro.id_role`)
    // const user = await pool.query(`SELECT us.id_user,us.username,us.password,us.name,us.surname,us.email,us.birthdate,ro.role_name FROM users us, roles ro WHERE us.username='${username}' AND us.password='${md5(password)}' AND us.role = ro.id_role `)
    return user.rows[0]
}

const changePassword = async(username,new_password) =>{
    const res = await pool.query(`UPDATE users SET password='${md5(new_password)}' WHERE username='${username}'`)
    return res
}

const change_rol = async(username,new_role) =>{
    const res = await pool.query(`UPDATE users SET role='${new_role}' WHERE username='${username}'`)
    return res.rowCount
}

const getUsers = async() =>{
    const res = await pool.query(`SELECT  us.id_user,us.name,us.surname, us.email, us.username, ro.role_description,ar.area_description FROM users us, roles ro, areas ar WHERE us.id_area = ar.id_area AND us.id_role = ro.id_role`)
    console.log(res.rows)
    return res.rows
}

const get_users_by = async({id,username,name,surname,email,role}) =>{
    const res = await pool.query(`SELECT id_user,username,name,surname,email,role FROM users WHERE username`)
    return res.rows
}

const create_activity = async()=>{

}

const createUser = async(username,name,surname,email,role,area)=>{
    const query = await pool.query(`INSERT INTO users (username,password,name,surname,email,id_role,id_area) VALUES ('${username}','${md5(username)}','${name}','${surname}','${email}','${role}','${area}')`)
    return query
}


const get_activities = async(state) =>{
    const activities = await pool.query(`SELECT * FROM activities WHERE state=${state}`)
}

const get_activities_by = async(state) =>{
    const activities = await pool.query(`SELECT * FROM activities`)
}

const getAreas = async() => {
    const areas = await pool.query('SELECT * FROM areas')
    return areas.rows

}

module.exports = {
    getUser,
    getUsers,
    changePassword,
    change_rol,
    create_activity,
    createUser,
    get_activities,
    get_activities_by,
    get_users_by,
    getAreas
}
