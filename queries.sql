CREATE TABLE IF NOT EXISTS ROLES(
	id_role SERIAL PRIMARY KEY,
	role_description VARCHAR (50) NOT NULL
);

CREATE TABLE IF NOT EXISTS AREAS(
	id_area SERIAL PRIMARY KEY,
	area_description VARCHAR (50) NOT NULL
);

CREATE TABLE IF NOT EXISTS USERS (
	id_user SERIAL PRIMARY KEY,
	name VARCHAR (50) NOT NULL,
	surname VARCHAR (50) NOT NULL,
	email VARCHAR (100) NOT NULL UNIQUE,
	username VARCHAR (70) NOT NULL UNIQUE,
	password VARCHAR (200) NOT NULL,
	id_role INT NOT NULL REFERENCES ROLES(id_role),
	id_area INT REFERENCES AREAS(id_area)
);

CREATE TABLE IF NOT EXISTS STATES(
	id_state SERIAL PRIMARY KEY,
	state_description VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS ACTIVITIES (
	id_activity SERIAL PRIMARY KEY,
	activity_title VARCHAR (50) NOT NULL,
	activity_description TEXT NOT NULL,
	activity_mandated INT REFERENCES USERS(id_user),
	relevance INT NOT NULL CHECK (
		relevance >= 0
		AND relevance <= 5
	),
	date_start DATE NOT NULL,
	date_end DATE NOT NULL,
	id_state INT REFERENCES STATES(id_state) DEFAULT 1,
	id_area INT REFERENCES AREAS(id_area)
);

CREATE TABLE IF NOT EXISTS subactivities(
	id_subactivity SERIAL PRIMARY KEY,
	id_activity INT NOT NULL REFERENCES activities(id_activity),
	id_user INT NOT NULL REFERENCES USERS(id_user),
	subactivity_description TEXT,
	actual_date DATE DEFAULT CURRENT_DATE,
	time_worked INT,
	paid_time INT,
	unpaid_time INT
);

INSERT INTO ROLES (role_description) values ('admin'),('jefe'),('colaborador');

INSERT INTO AREAS (area_description) values ('administracion'),('diseño'),('comercial')

-- password 1234
INSERT INTO USERS (name,surname,email,username,password,id_role,id_area) 
VALUES ('miguel','herazo','miguel@gmail.com','mherazo2023','81dc9bdb52d04dc20036dbd8313ed055',1,1)

INSERT INTO states (state_description) VALUES ('activo'),('pendiente'),('inactivo');