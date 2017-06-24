# Bamazon
An Amazon-like storefront application implemented with MySQL DB, the inquirer and the mysql npm packages. 

The application will first display all of the items available for sale, then prompt the customer with two messages:
* Which product you would like to order 
* How many units of the product you would like to order
where the product selection list is provided for the customer to pick for the first question.

After the customer has selected the product and entered the quantity, the application checks if the store has enough of the product to meet the customer's request.  If the store does have enough of the product, it would update the SQL database to reflect the remaining quantity. Once the update goes through, it will show the customer the total cost of their purchase.  If not, it will tell the customer it has insufficient quantity and then prevent the order from going through.

After each order has been handled, the application displays the sale items and prompt for order again.

User case 1:
The customer wants to order 6 bowls at Bamazon, the application shows the order is made successfully and the total price is $25 .
![User Case 1](/images/usercase1.png)

User case 2 :
The customer wants to order 200 'cool chairs' at Bamazon, the application shows the order could not be proceeded due to insufficient quantity of the item.
![User Case 2](/images/usercase2.png)