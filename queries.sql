-- DROP TABLE IF EXISTS SUBACTIVITY;	
-- DROP TABLE IF EXISTS ACTIVITY_GRI;
-- DROP TABLE IF EXISTS GRI;
-- DROP TABLE IF EXISTS ACTIVITY;
-- DROP TABLE IF EXISTS NOTPAY_REASON;
-- DROP TABLE IF EXISTS STATES;
-- DROP TABLE IF EXISTS AREA_HEAD;
-- DROP TABLE IF EXISTS AREA;
-- DROP TABLE IF EXISTS USERS;
-- DROP TABLE IF EXISTS ROLES;
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
	email VARCHAR (100) NOT NULL,
	username VARCHAR (70) NOT NULL,
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
	id_area REFERENCES AREAS(id_area)
);

CREATE TABLE IF NOT EXISTS unpaid_reasons(
	id_unpaid SERIAL PRIMARY KEY,
	unpaid_description VARCHAR(1000)
);

CREATE TABLE IF NOT EXISTS SUBACTIVITIES(
	id_subactivity SERIAL PRIMARY KEY,
	id_activity INT NOT NULL REFERENCES ACTIVITY(id_activity),
	id_user INT NOT NULL REFERENCES USERS(id_user),
	subactivity_title VARCHAR (50) NOT NULL,
	subactivity_description TEXT,
	date_start DATE NOT NULL,
	date_end DATE,
	time_worked INT,
	paid_time INT,
	unpaid_time INT
);