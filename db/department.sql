USE employee_trackerdb;

DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS department;

CREATE TABLE department (
    deaprtment_id INT(4) NOT NULL AUTO_INCREMENT,
    department VARCHAR(30) DEFAULT NULL,
    PRIMARY KEY (department_id)
)  ENGINE=INNODB DEFAULT CHARSET=UTF8;

INSERT INTO department (name) VALUES
('Human Resources'),
('Engineering'),
('Production'),
('Accounting'),
('Sales')