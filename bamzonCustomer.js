var mysql = require("mysql");
var inquirer = require("inquirer");

//creating connection to the database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "bamazon"
});

//connecting to database and running functions to display products in table
connection.connect(function(err) {
  if (err) throw err;
  loadProducts();
});

//displays produts for sale, runs through table and displays all products and info
var loadProducts = function () {
    var query = 'SELECT * FROM Products'
    connection.query(query, function(err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log("Item ID: " + res[i].item_id + 
            " || Product: " + res[i].product_name + 
            " || Department: " + res[i].department_name + 
            " || Price: " + res[i].price + 
            " || Stock: " + res[i].stock_quantity);
        }
        
        //prompt that loads after products asking what item and how many to add
        buying();
      })
    };
  
//function that asks the customer what item they want to buy and then how many
  var buying = function() {
    inquirer
    .prompt([
      {
          type: "input",
          message: "What is the ID of the product you would like to buy?",
          name: "id",
          validate: function(value) {
            if (isNaN(value) == false) {
                return true;
            } else {
                return false;
            }
        }
      },
      {
          type: "input",
          message: "How many would you like to purchase?",
          name: "quantity",
          validate: function(value) {
            if (isNaN(value) == false) {
                return true;
            } else {
                return false;
            }
        }
      }
      //
    ]).then(function(answer) {
        var query = 'SELECT * FROM Products WHERE itemID=' + answer.stock_quantity;
        connection.query(query, function(err, res) {
            if (answer.stock_quantity <= res) {
                for (var i = 0; i < res.length; i++) {
                    console.log("We currently have: " + res[i].stock_quantity + " " + 
                    res[i].product_name + ".");
                    console.log("Thanks for your order! Your shipment of " + res[i].stock_quantity + " " 
                    + res[i].product_name + " will arrive soon!");
                }
            }
                else {
                    console.log("Insufficient quantity of requested product.");
                }
                //loadProducts();
        })
  })
};