DROP DATABASE IF EXISTS company;
CREATE DATABASE company;
USE company;

DROP TABLE IF EXISTS department;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    department VARCHAR(30) DEFAULT NULL
);

DROP TABLE IF EXISTS associate;

SET FOREIGN_KEY_CHECKS=0;

CREATE TABLE associate (
id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
first_name VARCHAR (30),
last_name VARCHAR (30),
position_id INT,
manager_id INT,
FOREIGN KEY (position_id) REFERENCES position(id),
FOREIGN KEY (manager_id) REFERENCES position(id)
);

DROP TABLE IF EXISTS poisiton;

SET FOREIGN_KEY_CHECKS=0;

CREATE TABLE  position (
id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
title VARCHAR (30),
salary DECIMAL,
department_id INT,
FOREIGN KEY (department_id) REFERENCES department(id)
);