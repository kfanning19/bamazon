let inquirer = require('inquirer');
let mysql = require('mysql');
require('console.table');
let config = require('./config.js');
let connection = mysql.createConnection(config);

connection.connect(function(err) {
    if (err) throw err;
});

function displayOptions() {
    connection.query("SELECT * FROM products", function(err, results) {
        inquirer.prompt([{
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
        }]).then(function(answer) {
            switch (answer.action) {
                case (answer.action = "View Products for Sale"):
                    viewProducts();
                    break;
                case (answer.action = "View Low Inventory"):
                    viewLow();
                    break;
                case (answer.action = "Add to Inventory"):
                    addInventory();
                    break;
                case (answer.action = "Add New Product"):
                    addNew();
                    break;
                default:
                    console.log("That wasn't one of the options")

            }
        })
    })
}

function viewProducts() {
    connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;
        console.table(results)
        endOptions();
    })
}

function viewLow() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, results) {
        if (err) throw err;
        console.table(results);
        endOptions();
    })
}

function addInventory() {
    connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;
        console.table(results)

        inquirer.prompt([{
            name: "item",
            type: "input",
            message: "For which item_id would you like to increase inventory?",
        }, {
            name: "quantity",
            type: "input",
            message: "How many do you want to add?",
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }]).then(function(answer) {
            let chosenItem;
            for (var i = 0; i < results.length; i++) {
                if (results[i].item_id === parseInt(answer.item)) {
                    chosenItem = results[i];
                }
            };
            let new_quantity = chosenItem.stock_quantity + parseInt(answer.quantity);
            connection.query("UPDATE products SET ? WHERE ?", [{ stock_quantity: new_quantity }, { item_id: chosenItem.item_id }], function(err, res) {
                if (err) throw err;
                console.log("Your item has been updated!");
                endOptions();
            })
        })
    })
}

function addNew() {
    inquirer.prompt([{
        name: "item",
        type: "input",
        message: "What is the item you would like to add?"
    }, {
        name: "department",
        type: "input",
        message: "What department would you like to place your item in?"
    }, {
        name: "price",
        type: "input",
        message: "What price you like your item to be?",
        validate: function(value) {
            if (isNaN(value) === false) {
                return true;
            }
            return false;
        }
    }, {
        name: "quantity",
        type: "input",
        message: "How many do you want to add?",
        validate: function(value) {
            if (isNaN(value) === false) {
                return true;
            }
            return false;
        }
    }]).then(function(answer) {
        connection.query("INSERT INTO products SET ?", {
            product_name: answer.item,
            department_name: answer.department,
            price: parseFloat(answer.price),
            stock_quantity: parseFloat(answer.quantity)
        }, function(err) {
            if (err) throw err;
            console.log("Item successfully added!");
            endOptions();

        });
    });
}

function endOptions() {
    inquirer.prompt([{
        name: "options",
        type: "list",
        message: "What would you like to do now?",
        choices: ["Go to the start screen", "Exit"]
    }]).then(function(answer) {
        if (answer.options === "Go to the start screen") {
            displayOptions();
        } else {
            connection.end();
        }
    })
}
displayOptions();
