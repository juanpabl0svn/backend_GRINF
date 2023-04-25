require("dotenv").config();

const db = require("./db");
const cors = require("cors");
const morgan = require("morgan");
const express = require("express");

const app = express();

app.use(cors());
app.use(morgan("combined"));

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

app.get("/colab/:area", async (req, res) => {
  const area = req.params.area;
  const users = await db.getColab(area);
  console.log(users);
  res.send(users);
});

app.post("/activity/:data", async (req, res) => {
  const { title, mandated, description, relevance, date_start, date_end } =
    JSON.parse(req.params.data);
  const activity = await db.createActivity(
    title,
    mandated,
    description,
    relevance,
    date_start,
    date_end
  );
  res.send(activity);
});

app.get("/activity", async (req, res) => {
  const activities = await db.getActivities();
  console.log(activities);
  res.send(activities);
});

// Change password
app.put("/users/role/:user", async (req, res) => {
  const { username, new_password } = JSON.parse(req.params.user);
  const data = await db.change_password(username, new_password);
  console.log(data);
  res.send(data);
});

// Change role
app.put("/users/password/:user", async (req, res) => {
  const { username, new_role } = JSON.parse(req.params.user);
  const data = await db.change_rol(username, new_role);
  console.log(data);
  res.send(data);
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

app.put("/password/:data", async (req, res) => {
  const { username, new_password } = JSON.parse(req.params.data);
  await db.changePassword(username, new_password);
  const user = await db.getUser(username, new_password);
  res.send(user);
});

app.get("/areas", async (req, res) => {
  const areas = await db.getAreas();
  console.log(areas);
  res.send(areas);
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
