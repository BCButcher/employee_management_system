USE employee_trackerdb;

INSERT INTO department (department_name) VALUES
('Human Resources'),
('Engineering'),
('Production'),
('Accounting'),
('Sales');

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

INSERT INTO associate (first_name, last_name, position_id, manager_id) VALUES
('Terry', 'Plant', 0200, 0013),
('Jeff', 'Bozo', 0500, 0008),
('Marilyn', 'Dennis', 0400, 0010),
('Marshall', 'Mathers', 0100, 0011),
('Geroge', 'Washington', 0301, 0006),
('Chris', 'Oakley', 0302, 0007),
('Mary', 'Barr', 0303, 0000),
('Dimitri', 'Brozlovik', 0501, 0009),
('Jeffrey', 'Orr', 0502, 0000),
('Rocky', 'Krzysztofek', 0401, 0000),
('Darlene', 'Connor', 0101, 0012),
('David', 'Hoad', 0102, 0000),
('Peter', 'North', 0201, 0007),
('Dolph', 'Lundgren', 1111, 0000);

SET FOREIGN_KEY_CHECKS=1;