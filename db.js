require("dotenv").config();
const { Pool } = require("pg");
const md5 = require("md5");

const pool = new Pool({
  user: process.env.DBUSER,
  password: process.env.DBPASSWORD,
  host: process.env.DBHOST,
  port: process.env.DBPORT,
  database: process.env.DATABASE,
});

const getUser = async (username, password) => {
  const user = await pool.query(
    `SELECT  us.id_user, INITCAP(us.name) as name,INITCAP(us.surname) as surname, us.email, us.username, INITCAP(ro.role_description) as role_description,INITCAP(ar.area_description) as area_description,us.id_area FROM users us, roles ro, areas ar WHERE us.username = '${username}' AND us.password='${md5(
      password
    )}' AND us.id_area = ar.id_area AND us.id_role = ro.id_role`
  );
  return user.rows[0];
};

const changePassword = async (username, new_password) => {
  const res = await pool.query(
    `UPDATE users SET password='${md5(
      new_password
    )}' WHERE username='${username}'`
  );
  return res.rowCount;
};

const change_rol = async (username, new_role) => {
  const res = await pool.query(
    `UPDATE users SET role='${new_role}' WHERE username='${username}'`
  );
  return res.rowCount;
};

const getUsers = async () => {
  const res = await pool.query(
    `SELECT  us.id_user,INITCAP(us.name) as name,INITCAP(us.surname) as surname, us.email, us.username, INITCAP(ro.role_description) as role_description, INITCAP(ar.area_description) as area_description,us.id_role,us.id_area FROM users us, roles ro, areas ar WHERE us.id_area = ar.id_area AND us.id_role = ro.id_role ORDER BY us.name`
  );
  return res.rows;
};

const getColab = async (id_area) => {
  const res = await pool.query(
    `SELECT id_user,INITCAP(CONCAT (name, ' ', surname)) AS full_name FROM users WHERE id_role = 3 AND id_area = ${id_area} ORDER BY full_name`
  );
  return res.rows;
};

const getUsersFilter = async (filter) => {
  const query =
    await pool.query(`SELECT  us.id_user,INITCAP(us.name) as name,INITCAP(us.surname) as surname, us.email, us.username, ro.role_description,ar.area_description,us.id_role,us.id_area 
	FROM users us
	JOIN roles as ro using (id_role)
	JOIN areas as ar using (id_area)
	WHERE UPPER(us.username) like '%${filter.toUpperCase()}%' ${
      isNaN(filter) ? "" : `OR us.id_user = ${filter}`
    }  ORDER BY us.name`);
  return query.rows;
};

const getActivitiesFilter = async (id_area, filter) => {
  const query =
    await pool.query(`SELECT ac.id_activity,INITCAP(ac.activity_title) as activity_title,ac.activity_description,
    INITCAP(CONCAT (us.name, ' ', us.surname)) AS full_name,ac.relevance, 
    to_char(ac.date_start,'YYYY/MM/DD') as date_start,
    to_char(ac.date_end,'YYYY/MM/DD') as date_end,INITCAP(st.state_description) as state_description, ac.activity_mandated, 
    st.id_state 
    FROM activities ac
    JOIN users AS us ON us.id_user = ac.activity_mandated
    JOIN states AS st USING (id_state)
    WHERE ac.id_area = ${id_area} 
      AND (${
        isNaN(filter) ? "" : `ac.id_activity = ${filter} OR`
      } UPPER(ac.activity_title) like '%${filter.toUpperCase()}%')
    ORDER BY ac.activity_title`);
  return query.rows;
};

const createActivity = async (
  title,
  mandated,
  description,
  relevance,
  date_start,
  date_end,
  id_area
) => {
  try {
    const res = await pool.query(
      `INSERT INTO activities (activity_title,activity_description,activity_mandated,relevance,date_start,date_end,id_area) VALUES ('${title}','${description}',${mandated},${relevance},'${date_start}','${date_end}',${id_area})`
    );
    return res;
  } catch (e) {
    return e;
  }
};

const createUser = async (username, name, surname, email, role, area) => {
  const query = await pool.query(
    `INSERT INTO users (username,password,name,surname,email,id_role,id_area) VALUES ('${username}','${md5(
      username
    )}','${name}','${surname}','${email}','${role}','${area}')`
  );
  return query;
};

const getActivities = async () => {
  const activities = await pool.query(
    `SELECT ac.id_activity,ac.activity_title,INITCAP(ac.activity_title) as activity_title,INITCAP(CONCAT (us.name, ' ', us.surname)) AS full_name,ac.relevance, to_char(ac.date_start,'YYYY/MM/DD') as date_start,to_char(ac.date_end,'YYYY/MM/DD') as date_end,st.state_description, ac.activity_mandated, st.id_state FROM activities ac, users us, states st where ac.activity_mandated = us.id_user AND ac.id_state = st.id_state ORDER BY ac.activity_title`
  );
  return activities.rows;
};

const getActivitiesByIdUser = async (id_user) => {
  const activities =
    await pool.query(`SELECT id_activity,activity_title,activity_mandated FROM activities WHERE activity_mandated = ${id_user} ORDER BY activity_title
  `);
  return activities.rows;
};

const getActivitiesByIdArea = async (id_area) => {
  const activities =
    await pool.query(`SELECT ac.id_activity,INITCAP(ac.activity_title) as activity_title,ac.activity_description,
    INITCAP(CONCAT (us.name, ' ', us.surname)) AS full_name,ac.relevance, 
    to_char(ac.date_start,'YYYY/MM/DD') as date_start,
    to_char(ac.date_end,'YYYY/MM/DD') as date_end,INITCAP(st.state_description) as state_description, ac.activity_mandated, 
    st.id_state 
    FROM activities ac
    JOIN users AS us ON us.id_user = ac.activity_mandated
    JOIN states AS st USING (id_state)
    WHERE ac.id_area = ${id_area}
    ORDER BY ac.activity_title`);
  return activities.rows;
};

const newSubactivity = async (
  id_user,
  id_activity,
  description,
  date_start,
  date_end,
  time_worked,
  paid_time
) => {
  const query = await pool.query(`INSERT INTO
  subactivities (id_user,id_activity,subactivity_description,date_start,date_end,time_worked,paid_time,unpaid_time)
  VALUES ('${id_user}','${id_activity}','${description}','${date_start}','${date_end}',${time_worked},${paid_time},${
    time_worked - paid_time
  })`);

  return query.rowCount;
};

const getAreas = async () => {
  const areas = await pool.query(
    "SELECT id_area, INITCAP(area_description) as area_description FROM areas"
  );
  return areas.rows;
};

const updateUser = async (
  id_user,
  username,
  name,
  surname,
  email,
  id_role,
  id_area
) => {
  const query = await pool.query(
    `UPDATE users SET name ='${name}', surname ='${surname}', email ='${email}', id_role =${id_role} , id_area=${id_area}, username='${username}' WHERE id_user = ${id_user}`
  );
  return query;
};

const updateActivity = async (
  id_activity,
  activity_title,
  activity_description,
  activity_mandated,
  relevance,
  date_end,
  id_state
) => {
  const query = await pool.query(
    `UPDATE activities SET activity_title = '${activity_title}', activity_description = '${activity_description}', activity_mandated = ${activity_mandated}, relevance = ${relevance}, date_end = '${date_end}', id_state = ${id_state} WHERE id_activity = ${id_activity}`
  );
  return query;
};

const getDataStatistics = async () => {
  const query = await pool.query(
    "SELECT time_worked, paid_time, unpaid_time FROM subactivities "
  );
  return query.rows;
};

module.exports = {
  getUser,
  getUsers,
  changePassword,
  change_rol,
  createActivity,
  createUser,
  getActivities,
  getActivitiesByIdUser,
  getAreas,
  getColab,
  updateUser,
  updateActivity,
  getActivitiesByIdArea,
  getUsersFilter,
  getActivitiesFilter,
  newSubactivity,
  getDataStatistics,
};
