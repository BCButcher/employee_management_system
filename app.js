const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
const Font = require('ascii-art-font');

Font.fontPath = 'Fonts';

class Database {
    constructor(config) {
        this.connection = mysql.createConnection(config);
    }

    query(sql, args) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, args, (err, rows) => {
                if (err)
                    return reject(err);
                resolve(rows);
            });
        });
    }

    close() {
        return new Promise((resolve, reject) => {
            this.connection.end(err => {
                if (err)
                    return reject(err);
                resolve();
            });
        });
    }
}

const db = new Database({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "123456789",
    database: "employee_trackerdb"
});

async function showAssociateSummary() {
    console.log(' ');
    await db.query('SELECT e.id, e.first_name AS First_Name, e.last_name AS Last_Name, title AS Title, salary AS Salary, department_name AS Department, CONCAT(m.first_name, " ", m.last_name) AS Manager FROM associate e LEFT JOIN associate m ON e.manager_id = m.id INNER JOIN positions r ON e.position_id = r.id INNER JOIN department d ON r.department_id = d.id', (err, res) => {
        if (err) throw err;
        console.table(res);
        runApp();
    });
};

async function showPositionSummary() {
    console.log(' ');
    await db.query('SELECT r.id, title, salary, department_name AS department FROM positions r LEFT JOIN department d ON department_id = d.id', (err, res) => {
        if (err) throw err;
        console.table(res);
        runApp();
    })
};

async function showDepartments() {
    console.log(' ');
    await db.query('SELECT id, name AS department FROM department', (err, res) => {
        if (err) throw err;
        console.table(res);
        runApp();
    })
};

async function confirmStringInput(input) {
    if ((input.trim() != "") && (input.trim().length <= 30)) {
        return true;
    }
    return "Invalid input. Please limit your input to 30 characters or less."
};

async function addAssociate() {
    let position = await db.query('SELECT id, title FROM position');
    let managers = await db.query('SELECT id, CONCAT(first_name, " ", last_name) AS Manager FROM associate');
    managers.unshift({ id: null, Manager: "None" });

    inquirer.prompt([{
            name: "firstName",
            type: "input",
            message: "Enter associate's first name:",
            validate: confirmStringInput
        },
        {
            name: "lastName",
            type: "input",
            message: "Enter associate's last name:",
            validate: confirmStringInput
        },
        {
            name: "position",
            type: "list",
            message: "Choose associate position:",
            choices: position.map(obj => obj.title)
        },
        {
            name: "manager",
            type: "list",
            message: "Choose the associate's manager:",
            choices: managers.map(obj => obj.Manager)
        }
    ]).then(answers => {
        let positionDetails = position.find(obj => obj.title === answers.position);
        let manager = managers.find(obj => obj.Manager === answers.manager);
        db.query("INSERT INTO associate (first_name, last_name, position_id, manager_id) VALUES (?)", [
            [answers.firstName.trim(), answers.lastName.trim(), positionDetails.id, manager.id]
        ]);
        console.log("\x1b[32m", `${answers.firstName} was added to the associate database!`);
        runApp();
    });
};

async function removeAssociate() {
    let associate = await db.query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM associate');
    associate.push({ id: null, name: "Cancel" });

    inquirer.prompt([{
        name: "associateName",
        type: "list",
        message: "Remove which associate?",
        choices: associate.map(obj => obj.name)
    }]).then(response => {
        if (response.associateName != "Cancel") {
            let unluckyAssociate = associate.find(obj => obj.name === response.associateName);
            db.query("DELETE FROM associate WHERE id=?", unluckyAssociate.id);
            console.log("\x1b[32m", `${response.associateName} was let go...`);
        }
        runApp();
    })
};

async function updateManager() {
    let associate = await db.query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM associate');
    associate.push({ id: null, name: "Cancel" });

    inquirer.prompt([{
        name: "assocName",
        type: "list",
        message: "For which associate?",
        choices: associate.map(obj => obj.name)
    }]).then(associateInfo => {
        if (associateInfo.assocName == "Cancel") {
            runApp();
            return;
        }
        let managers = associate.filter(currentAssociate => currentAssociate.name != associateInfo.assocName);
        for (i in managers) {
            if (managers[i].name === "Cancel") {
                managers[i].name = "None";
            }
        };

        inquirer.prompt([{
            name: "mgName",
            type: "list",
            message: "Change their manager to:",
            choices: managers.map(obj => obj.name)
        }]).then(managerInfo => {
            let assocID = associate.find(obj => obj.name === associateInfo.assocName).id
            let mgID = managers.find(obj => obj.name === managerInfo.mgName).id
            db.query("UPDATE associate SET manager_id=? WHERE id=?", [mgID, assocID]);
            console.log("\x1b[32m", `${associateInfo.assocName} now reports to ${managerInfo.mgName}`);
            runApp();
        })
    })
};

async function updateAssociatePosition() {
    let associate = await db.query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM associate');
    associate.push({ id: null, name: "Cancel" });
    let position = await db.query('SELECT id, title FROM position');

    inquirer.prompt([{
            name: "assocName",
            type: "list",
            message: "For which associate?",
            choices: associate.map(obj => obj.name)
        },
        {
            name: "newPosition",
            type: "list",
            message: "Change their position to:",
            choices: position.map(obj => obj.title)
        }
    ]).then(answers => {
        if (answers.assocName != "Cancel") {
            let assocID = associate.find(obj => obj.name === answers.assocName).id
            let positionID = position.find(obj => obj.title === answers.newPosition).id
            db.query("UPDATE associate SET position_id=? WHERE id=?", [positionID, assocID]);
            console.log("\x1b[32m", `${answers.assocName} new position is ${answers.newPosition}`);
        }
        runApp();
    })
};

async function addPosition() {
    let departments = await db.query('SELECT id, department_name FROM department');

    inquirer.prompt([{
            name: "positionName",
            type: "input",
            message: "Enter new position title:",
            validate: confirmStringInput
        },
        {
            name: "salaryNum",
            type: "input",
            message: "Enter position's salary:",
            validate: input => {
                if (!isNaN(input)) {
                    return true;
                }
                return "Please enter a valid number."
            }
        },
        {
            name: "positionDepartment",
            type: "list",
            message: "Choose the position's department:",
            choices: departments.map(obj => obj.name)
        }
    ]).then(answers => {
        let depID = departments.find(obj => obj.name === answers.positionDepartment).id
        db.query("INSERT INTO position (title, salary, department_id) VALUES (?)", [
            [answers.positionName, answers.salaryNum, depID]
        ]);
        console.log("\x1b[32m", `${answers.positionName} was added. Department: ${answers.positionDepartment}`);
        runApp();
    })
};

async function updatePosition() {
    let position = await db.query('SELECT id, title FROM position');
    position.push({ id: null, title: "Cancel" });
    let departments = await db.query('SELECT id, department_name FROM department');

    inquirer.prompt([{
        name: "positionName",
        type: "list",
        message: "Update which position?",
        choices: position.map(obj => obj.title)
    }]).then(response => {
        if (response.positionName == "Cancel") {
            runApp();
            return;
        }
        inquirer.prompt([{
                name: "salaryNum",
                type: "input",
                message: "Enter position's salary:",
                validate: input => {
                    if (!isNaN(input)) {
                        return true;
                    }
                    return "Please enter a valid number."
                }
            },
            {
                name: "positionDepartment",
                type: "list",
                message: "Choose the position's department:",
                choices: department.map(obj => obj.name)
            }
        ]).then(answers => {
            let depID = department.find(obj => obj.name === answers.positionDepartment).id
            let positionID = position.find(obj => obj.title === response.positionName).id
            db.query("UPDATE position SET title=?, salary=?, department_id=? WHERE id=?", [response.positionName, answers.salaryNum, depID, positionID]);
            console.log("\x1b[32m", `${response.positionName} was updated.`);
            runApp();
        })
    })
};

async function removePosition() {
    let position = await db.query('SELECT id, title FROM position');
    position.push({ id: null, title: "Cancel" });

    inquirer.prompt([{
        name: "positionName",
        type: "list",
        message: "Remove which position?",
        choices: position.map(obj => obj.title)
    }]).then(response => {
        if (response.positionName != "Cancel") {
            let noMorePosition = position.find(obj => obj.title === response.positionName);
            db.query("DELETE FROM position WHERE id=?", noMorePosition.id);
            console.log("\x1b[32m", `${response.positionName} was removed. Please reassign associated associates.`);
        }
        runApp();
    })
};

async function addDepartment() {
    inquirer.prompt([{
        name: "depName",
        type: "input",
        message: "Enter new department:",
        validate: confirmStringInput
    }]).then(answers => {
        db.query("INSERT INTO department (department_name) VALUES (?)", [answers.depName]);
        console.log("\x1b[32m", `${answers.depName} was added to departments.`);
        runApp();
    })
};

async function removeDepartment() {
    let departments = await db.query('SELECT id, department_name FROM department');
    departments.push({ id: null, name: "Cancel" });

    inquirer.prompt([{
        name: "depName",
        type: "list",
        message: "Remove which department?",
        choices: departments.map(obj => obj.name)
    }]).then(response => {
        if (response.depName != "Cancel") {
            let uselessDepartment = departments.find(obj => obj.name === response.depName);
            db.query("DELETE FROM department WHERE id=?", uselessDepartment.id);
            console.log("\x1b[32m", `${response.depName} was removed. Please reassign associated positions.`);
        }
        runApp();
    })
};

function editAssociateOptions() {
    inquirer.prompt({
        name: "editChoice",
        type: "list",
        message: "What would you like to update?",
        choices: [
            "Add A New Associate",
            "Change Associate Position",
            "Change Associate Manager",
            "Remove An Associate",
            "Return To Main Menu"
        ]
    }).then(response => {
        switch (response.editChoice) {
            case "Add A New Associate":
                addAssociate();
                break;
            case "Change Associate Position":
                updateAssociatePosition();
                break;
            case "Change Associate Manager":
                updateManager();
                break;
            case "Remove An Associate":
                removeAssociate();
                break;
            case "Return To Main Menu":
                runApp();
                break;
        }
    })
};

function editPositionOptions() {
    inquirer.prompt({
        name: "editPositions",
        type: "list",
        message: "What would you like to update?",
        choices: [
            "Add A New Position",
            "Update A Position",
            "Remove A Position",
            "Return To Main Menu"
        ]
    }).then(responses => {
        switch (responses.editPositionss) {
            case "Add A New Position":
                addPosition();
                break;
            case "Update A Position":
                updatePosition();
                break;
            case "Remove A Position":
                removePosition();
                break;
            case "Return To Main Menu":
                runApp();
                break;
        }
    })
};

function editDepartmentOptions() {
    inquirer.prompt({
        name: "editDeps",
        type: "list",
        message: "What would you like to update?",
        choices: [
            "Add A New Department",
            "Remove A Department",
            "Return To Main Menu"
        ]
    }).then(responses => {
        switch (responses.editDeps) {
            case "Add A New Department":
                addDepartment();
                break;
            case "Remove A Department":
                removeDepartment();
                break;
            case "Return To Main Menu":
                runApp();
                break;
        }
    })
};

// Main interface loop. Called after pretty much every function completes
function runApp() {
    inquirer.prompt({
        name: "mainmenu",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "View All Associates",
            "Edit Associate Info",
            "View Positions",
            "Edit Positions",
            "View Departments",
            "Edit Departments"
        ]
    }).then(responses => {
        switch (responses.mainmenu) {
            case "View All Associates":
                showAssociateSummary();
                break;
            case "Edit Associate Info":
                editAssociateOptions();
                break;
            case "View Positions":
                showPositionSummary();
                break;
            case "Edit Positions":
                editPositionOptions();
                break;
            case "View Departments":
                showDepartments();
                break;
            case "Edit Departments":
                editDepartmentOptions();
                break;
        }
    });
}

console.log(
    `
          ________   ____   ____   ________   __        ________   __    __   ________   ________                                                                                                           
         |   _____| |    | |    | |   __   | |  |      |   __   | |  |  |  | |   _____| |   _____|                                                                                            
         |  |___    |  |  |  |  | |  |__|  | |  |      |  |  |  |  |  ||  |  |  |___    |  |___                                                                                              
         |   ___|   |  ||   ||  | |   _____| |  |      |  |  |  |   |    |   |   ___|   |   ___|                                                                                          
         |  |_____  |  | | | |  | |  |       |  |____  |  |__|  |    |  |    |  |_____  |  |_____                                                                                               
         |________| |__|  |  |__| |__|       |_______| |________|    |__|    |________| |________|                                                                                                        
                 _________   _____         ___       ________   __   __   ________   _____                                                   
                |___   ___| |  _  |       | _ |     |   _____| |  | |  | |   _____| |  _  |                               
                    | |     | |_|  |     | |_| |    |  |       |  ||  |  |  |___    | |_|  |                        
                    | |     |     |     |   _   |   |  |       |     |   |   ___|   |     |                                    
                    | |     |  ||  |   |   | |   |  |  |_____  |  ||  |  |  |_____  |  ||  |                                           
                    |_|     |__| |__| |___|   |__ | |________| |__| |__| |________| |__| |__|                                                                 
    `);


runApp();