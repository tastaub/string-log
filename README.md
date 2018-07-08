![Stringr Logo](/public/images/icon.jpg)

## A Stringers Companion App

* **A MYSQL string log database using an express and node server.**
* Try it out here [Stringr](https://floating-gorge-67629.herokuapp.com/index.html)

### Search Customers and Add Customers
![Search Customers](/gifs/search.png)
* Input datalist autofilled from customers in database
* Input validation to confirm at least one field is entered and phone number is a valid number
* Search display is replaced by create customer display if no customer exists in the db
* Once created or searched customer action cards launch

### Customer Action Cards
![Customer Cards](/gifs/customer.png)
* Phone button prompts a message input modal *Requires Twilo API Key*
* Delete customer and all logs from db, alert to confirm
* Add string job displays create job input
    * Input validation requires valid phone, 

### Customer Logs
* User Actions
    * Reuse string job allows to create a new job with the same specs as a previous entry
    * If comment exist message icon appears and modal popup displays message
    * Delete entry from db with confirm prompt
    * Able to create job from this page as well

### Active Queue
* Displays all active string jobs with job description and customer info
* Mark complete updates the job in the db table to complete and removes from queue
    * Prompt to message appears, if confirm then text sent to customer alerting job completion 

## Node Dependencies 
* Twilo *Messaging*
* Express *Routing*
* Node *Server*
* Sequelize *DB Middleware*
* MYSQL *Database*

## Authors
* Jason Flick **Server Design and Testing**
* Michael Lee **U/I Design and Brand Designer**
* Thomas Staub **U/I and Server Scripting**
* Thomas Story **U/I Design and Server Authentication**
