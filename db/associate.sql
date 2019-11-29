USE employee_trackerDB;

DROP TABLE IF EXISTS associates;
DROP TABLE IF EXISTS associate; 

SET FOREIGN_KEY_CHECKS=0;

CREATE TABLE associate (
associate_id INT (4) NOT NULL AUTO_INCREMENT,
first_name VARCHAR (30) NOT NULL,
last_name VARCHAR (30) NOT NULL,
position_id INT (4) NOT NULL,
manager_id INT (4) NOT NULL,
PRIMARY KEY (associate_id),
CONSTRAINT fk_positionid
FOREIGN KEY (position_id)
	REFERENCES roles (position_id)
)ENGINE=INNODB DEFAULT CHARSET=utf8;

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