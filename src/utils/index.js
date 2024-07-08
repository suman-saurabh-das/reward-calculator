import { MIN_REWARD, MAX_REWARD, NUMBER_OF_MONTHS } from "../utils/constants";
import { getCustomerData } from '../services/apiService.js';
import logger from '../logger.js';

// Function to calculate reward points.
export const calculateRewardPoints = (transaction, MIN_REWARD = 50, MAX_REWARD = 100) => {
  if (transaction < MIN_REWARD) {
    // When transacted amount is less than MIN_REWARD
    return 0;
  } else if (transaction >= MIN_REWARD && transaction <= MAX_REWARD) {
    // When transacted amount is more than MIN_REWARD but less than MAX_REWARD
    return (transaction - MIN_REWARD) * 1;
  } else if (transaction > MAX_REWARD) {
    // When transacted amount is more than MAX_REWARD
    return (transaction - MAX_REWARD) * 2 + MIN_REWARD;
  }
}

// Function to calculate the sum of transactions for a particular month.
const calculateMonthlyTotals = (transactions, initialArray) => {
  const currentMonth = new Date().getMonth() + 1;   // Current month.
  return transactions.reduce((monthlyTotals, transaction) => {
    const { purchaseAmount, dateOfTransaction } = transaction;
    const transactionMonth = new Date(dateOfTransaction).getMonth() + 1;
    // Index in monthlyTotals array where we need to store the transactions sum.
    const monthDifference = currentMonth - transactionMonth - 1;
    if (monthDifference < NUMBER_OF_MONTHS) {
      monthlyTotals[monthDifference] += purchaseAmount;
    }
    return monthlyTotals;
  }, initialArray);
};

// Function to calculate the reward points for each month.
const calculateMonthlyRewardPoints = (monthlyTotals) => {
  return monthlyTotals.map(value => calculateRewardPoints(value));
}

export const createCustomerData = (data, NUMBER_OF_MONTHS = 3) => {
  // Mapping over data array and creating a new array containing required customerData.
  return data.map(customer => {
    let { customerId, customerName, transactions } = customer;
    const initialArray = new Array(NUMBER_OF_MONTHS).fill(0);
    
    // Calculating monthly transactions sum.
    let monthlyTotals = calculateMonthlyTotals(transactions, initialArray);
    
    // Calculating monthly reward points.
    monthlyTotals = calculateMonthlyRewardPoints(monthlyTotals, MIN_REWARD, MAX_REWARD);

    // Calculating total reward points.
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
export const fetchCustomerData = async (setFinalData, setIsLoading, setDataFetchError) => {
  try {
    const data = await getCustomerData();
    const transactionData = createCustomerData(data, NUMBER_OF_MONTHS);
    // logger.info(transactionData);
    setFinalData(transactionData);
    setIsLoading(false);
  }
  catch (error) {
    setDataFetchError(true);
    logger.error(error);
  }
}