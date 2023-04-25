require("dotenv").config();

const db = require("./db");
const cors = require("cors");
const morgan = require("morgan");
const express = require("express");

const app = express();

app.use(cors());
// app.use(morgan("combined"));

const port = process.env.PORT || 3000;

// Authentication
app.get("/users/:user", async (req, res) => {
  const { username, password } = JSON.parse(req.params.user);
  const data = await db.getUser(username, password);
  res.send(data);
});

app.get("/users", async (req, res) => {
  const users = await db.getUsers();
  console.log(users);
  res.send(users);
});


app.get("/colab/:area", async (req, res) => {
  const area = req.params.area;
  const users = await db.getColab(area);
  console.log(users);
  res.send(users);
});

app.get("/areas", async (req, res) => {
  const areas = await db.getAreas();
  console.log(areas);
  res.send(areas);
});
app.get('/activity/:user',async(req,res)=>{
  console.log('hola')
  const {id_user} = JSON.parse(req.params.user)
  const query = await db.getActivitiesByIdUser(id_user)

  res.send(query)
  
})

app.get('/activity/area/:area',async(req, res) =>{

  const id_area = req.params.area
  const query = await db.getActivitiesByIdArea(id_area)
  res.send(query)
})

app.get("/activity", async (req, res) => {
  const activities = await db.getActivities();

  res.send(activities);
});
//Create a new user
app.post("/users/:user", async (req, res) => {
  const { name, surname, email, role, area } = JSON.parse(req.params.user);
  const username = (name[0] + surname).toLowerCase() + new Date().getFullYear();
  const data = await db.createUser(
    username,
    name.toLowerCase(),
    surname.toLowerCase(),
    email.toLowerCase(),
    role,
    area
  );
  res.send(data);
});

app.post("/activity/:data", async (req, res) => {
  const { title, mandated, description, relevance, date_start, date_end,id_area } =
  JSON.parse(req.params.data);
  const activity = await db.createActivity(
    title,
    mandated,
    description,
    relevance,
    date_start,
    date_end,
    id_area
  );
  console.log(activity)
  res.send(activity);
});

// Change password
app.put("/users/role/:user", async (req, res) => {
  const { username, new_password } = JSON.parse(req.params.user);
  const data = await db.change_password(username, new_password);
  console.log(data);
  res.send(data);
});

app.put("/users/:user", async (req, res) => {
  const { id_user, username, name, surname, email, id_role, id_area } =
    JSON.parse(req.params.user);
  const query = await db.updateUser(
    id_user,
    username,
    name,
    surname,
    email,
    id_role,
    id_area
  );
  console.log(query);
  res.send(query);
});

// Change role
app.put("/users/password/:user", async (req, res) => {
  const { username, new_role } = JSON.parse(req.params.user);
  const data = await db.change_rol(username, new_role);
  console.log(data);
  res.send(data);
});

app.put("/password/:data", async (req, res) => {
  const { username, new_password } = JSON.parse(req.params.data);
  await db.changePassword(username, new_password);
  const user = await db.getUser(username, new_password);
  res.send(user);
});
app.put("/activity/:new_activity", async (req, res) => {
  console.log(req.params.new_activity);
  const {
    id_activity,
    activity_title,
    activity_mandated,
    relevance,
    activity_description,
    date_end,
    id_state,
  } = JSON.parse(req.params.new_activity);
  const query = await db.updateActivity(
    id_activity,
    activity_title,
    activity_description,
    activity_mandated,
    relevance,
    date_end,
    id_state
  );
  console.log(query)
  res.send(query);
});



app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
