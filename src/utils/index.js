import { MIN_REWARD_AMOUNT, MAX_REWARD_AMOUNT, NUMBER_OF_MONTHS } from "../utils/constants";
import { getCustomerData } from '../services/apiService.js'

// Function to calculate reward points.
export const calculateRewardPoints = (transaction, MIN_REWARD_AMOUNT, MAX_REWARD_AMOUNT) => {
  if (transaction < MIN_REWARD_AMOUNT) {
    // When transacted amount is less than MIN_REWARD_AMOUNT
    // e.g. Total transaction amount in a month is 40, reward points will be 0
    return 0;
  } else if (transaction >= MIN_REWARD_AMOUNT && transaction <= MAX_REWARD_AMOUNT) {
    // When transacted amount is more than MIN_REWARD_AMOUNT but less than MAX_REWARD_AMOUNT
    // e.g. Total transaction amount in a month is 90, 
    // reward points will be (90 - 50) * 1 = 40 * 1 = 40
    return (transaction - MIN_REWARD_AMOUNT) * 1;
  } else if (transaction > MAX_REWARD_AMOUNT) {
    // e.g. Total transaction amount in month is 120, 
    // reward points will be (120 - 100) * 2 + MIN_REWARD_AMOUNT = 20 * 2 + 50 = 90
    return (transaction - MAX_REWARD_AMOUNT) * 2 + MIN_REWARD_AMOUNT;
  }
}

export const createCustomerData = (data, NUMBER_OF_MONTHS = 3) => {
  // Current month.
  const currentMonth = new Date().getMonth() + 1;

  // Mapping over data array and creating a new array containing required customerData.
  // customerData = {id, name, monthlyTotals, total}
  return data.map(customer => {
    let { customerId, customerName, transactions } = customer;
    const monthlyTotals = new Array(NUMBER_OF_MONTHS).fill(0);

    transactions.forEach(transaction => {
      const { purchaseAmount, dateOfTransaction } = transaction;
      // Transaction month.
      const transactionMonth = new Date(dateOfTransaction).getMonth() + 1;
      // Store the transactions for a customer for a given in the monthlyTotals array.
      // value at index 0 will be for 1st previous month, 
      // value at index 1 will be for 2nd previous month and so on...
      if (currentMonth - transactionMonth - 1 < NUMBER_OF_MONTHS) {
        monthlyTotals[currentMonth - transactionMonth - 1] += purchaseAmount;
      }
    });

    return {
      id: customerId,
      name: customerName,
      monthlyTotals,
      total: 0,
    };
  });
}

export const calculateCustomerRewardPoints = (data, NUMBER_OF_MONTHS) => {
  // Converting the amount to reward points for monthly transactions and total rewards.
  data.forEach(customer => {
    customer.total = 0;
    for (let i = 0; i < NUMBER_OF_MONTHS; i++) {
      customer.monthlyTotals[i] = calculateRewardPoints(customer.monthlyTotals[i], MIN_REWARD_AMOUNT, MAX_REWARD_AMOUNT);
      customer.total = customer.total + customer.monthlyTotals[i];
    }
  });
}

// Fetch the data from json-server
export const fetchCustomerData = async (setFinalData, setIsLoading) => {
  try {
    const data = await getCustomerData();
    const transactionData = createCustomerData(data, NUMBER_OF_MONTHS);
    calculateCustomerRewardPoints(transactionData, NUMBER_OF_MONTHS);
    setFinalData(transactionData);
    setIsLoading(false);
  }
  catch (error) {
    console.log(error);
  }
}