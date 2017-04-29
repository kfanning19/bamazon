let inquirer = require('inquirer');
let mysql = require('mysql');
require('console.table');

let config = require('./config.js');
let connection = mysql.createConnection(config);

connection.connect(function(err) {
    if (err) throw err;
});

function displayProducts() {
    connection.query("SELECT item_id, product_name, price FROM products", function(err, results) {
        if (err) throw err;
        console.table(results)
        inquirer.prompt([{
            name: "selectProduct",
            type: "input",
            message: "What is the item_id of the product you would like to buy?"
        }, {
            name: "numberPurchased",
            type: "input",
            message: "How many would you like?",
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }]).then(function(answer) {
            let orderQuantity = parseInt(answer.numberPurchased);
            let chosenProduct;
            for (var i = 0; i < results.length; i++) {
                if (results[i].item_id === parseInt(answer.selectProduct)) {
                    chosenProduct = results[i];
                }
            };

            let newQuantity = chosenProduct.stock_quantity - orderQuantity;

            if (chosenProduct.stock_quantity < orderQuantity) {
                console.log("Insufficient Quantity")
                connection.end();
            } else {
                let purchaseTotal = orderQuantity * chosenProduct.price;

                connection.query("UPDATE products SET ? WHERE ?", [{ stock_quantity: newQuantity }, { item_id: chosenProduct.item_id }], function(err, res) {
                    console.log("Your total purchase is $" + purchaseTotal);
                    connection.end();
                })

            }

        })
    })
}
displayProducts();
