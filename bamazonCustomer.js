var mysql = require("mysql");
var inquirer = require("inquirer");
require('console.table');
var productsInStore = [];

//get the MySQL DB connection
var dbconn = mysql.createConnection({
		host: 'localhost',
		port:3306,
		user:'root',
		password:'welcome1',
		database:'bamazon'
	}
);

//connect to the DB and start to prompt the user to order the products
dbconn.connect(function(err) {
  if (err) {
  	throw err;
  } else {
  	makeOrder();
  }
});


function makeOrder(){
	//first display all of the items available for sale. 
	//Include the ids, names, and prices of products for sale. DEPARTMENT_NAME, 
    var query = "SELECT ITEM_ID, PRODUCT_NAME, PRICE, STOCK_QUANTITY from PRODUCTS";
    dbconn.query(query, function(err, res) {
    	if (err) 
  			throw err;

    	console.table(res);
    	//empty productsInStore array for reset
    	productsInStore.length = 0; 
        for (var i = 0; i < res.length; i++) {
          productsInStore.push({
			  name: res[i].PRODUCT_NAME,
			  value: res[i].ITEM_ID,
			  //short: 'The long option'
			});
     	}

		// then prompt users with two messages.
		// The first should ask them the ID of the product they would like to buy.
		// The second message should ask how many units of the product they would like to buy.
		inquirer
	    .prompt([
	    	{
			    name: "itemId",
			    type: "list",
			    message: 'Which product you would like to order:',
			    choices: productsInStore
			},
			{
		      name: "quantity",
		      type: "input",
		      message: "How many units of the product you would like to order:"
		    }]
	    )
	    .then(function(answers) {
	    	//console.log(answers.itemId + ' ' + answers.quantity);
	      	var query = "SELECT PRODUCT_NAME, PRICE, STOCK_QUANTITY from PRODUCTS WHERE ITEM_ID = ?";
	      	dbconn.query(query, [answers.itemId], function(err, res) {
	      		    if (err) 
  						throw err;
  					
			        var stockQuantity = res[0].STOCK_QUANTITY;
			        var price = res[0].PRICE;
			        //console.log(stockQuantity + ' ' + price);
			        // check if the store has enough of the product to meet the customer's request.
			       	if(stockQuantity > answers.quantity) {
			       		// if your store does have enough of the product,
						// updating the SQL database to reflect the remaining quantity.
						// Once the update goes through, show the customer the total cost of their purchase.
						var updateQuery = 'UPDATE PRODUCTS SET STOCK_QUANTITY = ? WHERE ITEM_ID = ?';
						dbconn.query(updateQuery, [stockQuantity-answers.quantity, answers.itemId], 
							function (updateQueryErr, res){
								if(updateQueryErr) {
									throw updateQueryErr;
								}
								console.log("Thank you!  Your total price is: $" + price * answers.quantity + "\n");
								makeOrder();
						});
			       	} else {
			       		// If not, log a phrase like Insufficient quantity!, and then prevent the order from going through.
			       		console.log("We are sorry. We have insufficient quantity of '" + res[0].PRODUCT_NAME + "'' for your order.\n");
			       		makeOrder();
			       	}
	      	});

	    });
    });
}
