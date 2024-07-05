# Reward points calculator

Project created using [Create React App](https://github.com/facebook/create-react-app).

## Problem statement

A retailer offers a rewards program to its customers, awarding points based on each recorded purchase.  

A customer receives 2 points for every dollar spent over $100 in each transaction, plus 1 point for every dollar spent between $50 and $100 in each transaction. 

(e.g. a $120 purchase = 2x$20 + 1x$50 = 90 points). 
  
Given a record of every transaction during a three month period, calculate the reward points earned for each customer per month and total. 

## Running the project

### Clone the project from github repository

`https://github.com/suman-saurabh-das/`

### Install the dependencies

`npm install`

### Start the json-server

`npx json-server --watch ./src/data/db.json --port 8000`

### Run the app in development mode.

`npm run start`

### Launch the test runner in interactive watch mode.

`npm test`

### Build the app for production to the `build` folder.

`npm run build`

## Sample data

To modify the json-server data, make changes to the file in src/data/db.json

## Approach

- Step 1 - Fetch the data using axios from static server.
- Step 2 - Calculate the points for given transactions for last 3 months.
- Step 3 - Display the data in tabular format.

## Credits
List of contributors:
- [Saurabh Das - Developer](dsumansaurabh@gmail.com)