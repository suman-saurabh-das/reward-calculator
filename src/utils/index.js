import { MIN_REWARD_AMOUNT, MAX_REWARD_AMOUNT, NUMBER_OF_MONTHS } from "../utils/constants";
import { getCustomerData } from '../services/apiService.js';
import logger from '../logger.js';

// Function to calculate reward points.
export const calculateRewardPoints = (transaction, MIN_REWARD_AMOUNT, MAX_REWARD_AMOUNT) => {
  if (transaction < MIN_REWARD_AMOUNT) {
    // When transacted amount is less than MIN_REWARD_AMOUNT
    return 0;
  } else if (transaction >= MIN_REWARD_AMOUNT && transaction <= MAX_REWARD_AMOUNT) {
    // When transacted amount is more than MIN_REWARD_AMOUNT but less than MAX_REWARD_AMOUNT
    return (transaction - MIN_REWARD_AMOUNT) * 1;
  } else if (transaction > MAX_REWARD_AMOUNT) {
    // When transacted amount is more than MAX_REWARD_AMOUNT
    return (transaction - MAX_REWARD_AMOUNT) * 2 + MIN_REWARD_AMOUNT;
  }
}

export const createCustomerData = (data, NUMBER_OF_MONTHS = 3) => {
  // Current month.
  const currentMonth = new Date().getMonth() + 1;

  // Mapping over data array and creating a new array containing required customerData.
  return data.map(customer => {
    let { customerId, customerName, transactions } = customer;
    const initialArray = new Array(NUMBER_OF_MONTHS).fill(0);

    // Calculating the sum of all reward points for a particular month.
    const updateMonthlyTotals = (transactions, currentMonth) => {
      return transactions.reduce((monthlyTotals, transaction) => {
        const { purchaseAmount, dateOfTransaction } = transaction;
        const transactionMonth = new Date(dateOfTransaction).getMonth() + 1;
        const monthDifference = currentMonth - transactionMonth - 1;
        if (monthDifference < NUMBER_OF_MONTHS) {
          monthlyTotals[monthDifference] += calculateRewardPoints(purchaseAmount, MIN_REWARD_AMOUNT, MAX_REWARD_AMOUNT);
        }
        return monthlyTotals;
      }, initialArray);
    };
    
    const monthlyTotals = updateMonthlyTotals(transactions, currentMonth);

    // Calculating total reward points for a customer.
    let totalRewards = monthlyTotals.reduce((total, amount) => {
      total = total + amount;
      return total;
    })

    return {
      id: customerId,
      name: customerName,
      monthlyTotals,
      total: totalRewards,
    };
  });
}

// Fetch the data from json-server
export const fetchCustomerData = async (setFinalData, setIsLoading) => {
  try {
    const data = await getCustomerData();
    const transactionData = createCustomerData(data, NUMBER_OF_MONTHS);
    logger.info(transactionData);
    setFinalData(transactionData);
    setIsLoading(false);
  }
  catch (error) {
    logger.error(error);
  }
}