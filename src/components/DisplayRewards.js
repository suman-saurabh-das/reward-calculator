import React, { useState, useEffect } from 'react'
import './DisplayRewards.css'
import { getCustomerData } from '../services/apiService.js'

const DisplayRewards = () => {
  const [customerData, setCustomerData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCustomerData();
    // eslint-disable-next-line
  }, [])

  // Fetch the data from json-server
  const fetchCustomerData = async () => {
    try {
      const data = await getCustomerData();
      const transactionData = createCustomerData(data);
      calculateCustomerRewardPoints(transactionData);
      setCustomerData(transactionData);
      setIsLoading(false);
    }
    catch (error) {
      console.log(error);
    }
  }

  // Function to calculate reward points
  const calculateRewardPoints = (transaction) => {
    if (transaction < 50) {
      return 0;
    } else if (transaction >= 50 && transaction <= 100) {
      return (transaction - 50) * 1;
    } else if (transaction > 100) {
      return (transaction - 100) * 2 + 50;
    }
  }

  const createCustomerData = (data) => {
    // Array to store the transaction details for all customers.
    const customerData = [];

    data.forEach(customer => {
      const { customerId, customerName, transactions } = customer;

      // Checking if customer already exists in customerData array
      let currentCustomer = customerData.find(customer => customer.customerId === customerId);

      // If the currentCustomer doesn't exist, create a new customer in customerData array.
      if (!currentCustomer) {
        currentCustomer = {
          id: customerId,
          name: customerName,
          monthlyTotals: [0, 0, 0],
          total: 0,
        };
        customerData.push(currentCustomer);
      };

      // Computing the transaction details for current customer.
      transactions.forEach(transaction => {
        const { purchaseAmount, dateOfTransaction } = transaction;
        const date = new Date(dateOfTransaction);
        const transactionMonth = date.getMonth() + 1;
        const currentMonth = new Date().getMonth() + 1;

        // Filtering out the transactions that occurred in previous 3 months and storing the
        // sum in monthlyTotals array as per the month in which the transaction occurred.
        if (currentMonth - transactionMonth === 1) {
          currentCustomer.monthlyTotals[0] = currentCustomer.monthlyTotals[0] + purchaseAmount;
        } else if (currentMonth - transactionMonth === 2) {
          currentCustomer.monthlyTotals[1] = currentCustomer.monthlyTotals[1] + purchaseAmount;
        } else if (currentMonth - transactionMonth === 3) {
          currentCustomer.monthlyTotals[2] = currentCustomer.monthlyTotals[2] + purchaseAmount;
        }
      });
    });
    return customerData;
  }

  const calculateCustomerRewardPoints = (data) => {
    // Calculate reward points for monthly transactions and total rewards.
    data.forEach(customer => {
      for (let i = 0; i < customer.monthlyTotals.length; i++) {
        customer.monthlyTotals[i] = calculateRewardPoints(customer.monthlyTotals[i]);
        customer.total = customer.total + customer.monthlyTotals[i];
      }
    });
  }

  return (
    <div className="container">
      <h1>Reward points for customers</h1>
      {
        customerData.length > 0 && !isLoading
          ? (
            <div className="table-container">
              <table className="rewards-table">
                <thead>
                  <tr>
                    <th>Customer name</th>
                    <th>Reward points for 1st month</th>
                    <th>Reward points for 2nd month</th>
                    <th>Reward points for 3rd month</th>
                    <th>Total reward points</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    customerData.map(item => (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.monthlyTotals[0]}</td>
                        <td>{item.monthlyTotals[1]}</td>
                        <td>{item.monthlyTotals[2]}</td>
                        <td>{item.total}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          )
          : <div>Loading...</div>
      }
    </div>
  )
}

export default DisplayRewards
