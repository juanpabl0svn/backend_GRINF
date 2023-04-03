const {Pool} = require('pg');
const md5 = require('md5');

const pool = new Pool({
    user: 'root',
    password: 'root',
    host: '127.0.0.1',
    port: 5432,
    database: 'root'
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

const change_rol = async(username,new_rol) =>{
    const res = await pool.query(`UPDATE users SET rol='${new_rol}' WHERE username='${username}'`)
    return res.rowCount
}




module.exports = {
    pool,
    get_user,
    change_password,
    change_rol
}
