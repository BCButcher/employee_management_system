USE employee_trackerDB;

DROP TABLE IF EXISTS positions;
DROP TABLE IF EXISTS position;

SET FOREIGN_KEY_CHECKS=0;

CREATE TABLE  position (
position_id INT (4) NOT NULL AUTO_INCREMENT,
title VARCHAR (30) NOT NULL,
salary DEC (10,2) NOT NULL,
department_id INT (4) NOT NULL,
PRIMARY KEY (position_id),
CONSTRAINT fk_departmentid
FOREIGN KEY (department_id)
	REFERENCES departments (department_id)
)ENGINE=INNODB DEFAULT CHARSET=utf8;

INSERT INTO position (title, salary, department_id) VALUES
('Process Engineer', 98000, 2000),
('Accounting Manager', 85000, 4000),
('Executive Sales Manager', 107500, 5000),
('Operational Associate', 42000, 3000),
('HR Coordinator', 48000, 1000),
('Production Manager', 75000, 3000),
('Plant Manager', 122000, 3000),
('Director, Operations', 175000, 3000),
('Regional Sales Manager', 158000, 5000),
('Vice-President Sales', 248000, 5000),
('Vice-President Accounting', 248000, 4000),
('Human Resources Manager', 90000, 1000),
('Vice-President Human Resources', 235000, 1000);