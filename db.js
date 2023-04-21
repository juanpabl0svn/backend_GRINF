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
    const res = await pool.query(`SELECT  us.id_user,us.name,us.surname, us.email, us.username, ro.role_description,ar.area_description FROM users us, roles ro, areas ar WHERE us.id_area = ar.id_area AND us.id_role = ro.id_role ORDER BY us.name`)
    console.log(res.rows)
    return res.rows
}


const getColab = async() => {
    const res = await pool.query("SELECT id_user,INITCAP(CONCAT (name, ' ', surname)) AS full_name FROM users WHERE id_role = 3 ORDER BY full_name")
    return res.rows
}

const get_users_by = async({id,username,name,surname,email,role}) =>{
    const res = await pool.query(`SELECT id_user,username,name,surname,email,role FROM users WHERE username ORDER BY name`)
    return res.rows
}

const createActivity = async(title,mandated,description,relevance,date_start,date_end) => {
    const res = await pool.query(`INSERT INTO activities (activity_title,activity_description,activity_mandated,relevance,date_start,date_end) VALUES ('${title}','${description}',${mandated},${relevance},'${date_start}','${date_end}')`)
    return res

}

const createUser = async(username,name,surname,email,role,area)=>{
    const query = await pool.query(`INSERT INTO users (username,password,name,surname,email,id_role,id_area) VALUES ('${username}','${md5(username)}','${name}','${surname}','${email}','${role}','${area}')`)
    return query
}


const getActivities = async() =>{
    const activities = await pool.query(`SELECT ac.id_activity,ac.activity_title,ac.activity_description,INITCAP(CONCAT (us.name, ' ', us.surname)) AS full_name,ac.relevance,ac.date_start,ac.date_end,st.state_description from activities ac, users us, states st where ac.activity_mandated = us.id_user AND ac.id_state = st.id_state ORDER BY ac.activity_title`)
    return activities.rows
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
    createActivity,
    createUser,
    getActivities,
    get_activities_by,
    get_users_by,
    getAreas,
    getColab
}
