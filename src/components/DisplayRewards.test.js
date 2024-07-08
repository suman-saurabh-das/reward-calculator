import { render, screen, act } from '@testing-library/react';
import DisplayRewards from './DisplayRewards';
import { getCustomerData } from '../services/apiService';

jest.mock("../services/apiService");

const mockData = [
  {
    "customerId": 1,
    "customerName": "Tony Stark",
    "transactions": [
      {
        "transactionId": 101,
        "purchaseAmount": 150,
        "dateOfTransaction": "06/25/2024"
      },
      {
        "transactionId": 102,
        "purchaseAmount": 200,
        "dateOfTransaction": "06/20/2024"
      },
      {
        "transactionId": 103,
        "purchaseAmount": 300,
        "dateOfTransaction": "05/15/2024"
      },
      {
        "transactionId": 104,
        "purchaseAmount": 250,
        "dateOfTransaction": "04/17/2024"
      }
    ]
  },
  {
    "customerId": 2,
    "customerName": "Steve Rogers",
    "transactions": [
      {
        "transactionId": 201,
        "purchaseAmount": 55,
        "dateOfTransaction": "04/24/2024"
      },
      {
        "transactionId": 202,
        "purchaseAmount": 120,
        "dateOfTransaction": "05/08/2024"
      },
      {
        "transactionId": 203,
        "purchaseAmount": 320,
        "dateOfTransaction": "06/17/2024"
      },
      {
        "transactionId": 204,
        "purchaseAmount": 270,
        "dateOfTransaction": "05/10/2024"
      }
    ]
  },
]

describe("Display rewards component", () => {
  beforeEach(() => {
    getCustomerData.mockResolvedValue(mockData);
  });

  test("Renders correctly", async () => {
    await act(async () => {
      render(<DisplayRewards />)
    }
    );

    const headingText = screen.getByText("Reward points for customers");
    expect(headingText).toBeInTheDocument();

    // Check if customer names render correctly.
    expect(screen.getByText("Tony Stark")).toBeInTheDocument();
    expect(screen.getByText("Steve Rogers")).toBeInTheDocument();

    // Check if customer reward points data renders correctly.
    const customer1Row = screen.getByText("Tony Stark").closest("tr");
    // 1st month: Total transactions = 350, hence reward points = (350 – 100) * 2 + 50 = 550
    expect(customer1Row).toHaveTextContent(550);
    // 2nd month: Total transactions = 300, hence reward points = (300 – 100) * 2 + 50 = 450
    expect(customer1Row).toHaveTextContent(450);
    // 3rd month: Total transactions = 250, hence reward points = (250 – 100) * 2 + 50 = 350
    expect(customer1Row).toHaveTextContent(350);
    // Total reward points = 550 + 450 + 350 = 1350
    expect(customer1Row).toHaveTextContent(1350);

    // Check if customer reward points data renders correctly.
    const customer2Row = screen.getByText("Steve Rogers").closest("tr");
    // 1st month: Total transactions = 320, hence reward points = (320 – 100) * 2 + 50 = 490
    expect(customer2Row).toHaveTextContent(490);
    // 2nd month: Total transactions = 390, hence reward points = (390 – 100) * 2 + 50 = 630
    expect(customer2Row).toHaveTextContent(630);
    // 3rd month: Total transactions = 55, hence reward points = (55 – 50) * 1 = 5
    expect(customer2Row).toHaveTextContent(5);
    // Total reward points = 490 + 630 + 5 = 1125
    expect(customer2Row).toHaveTextContent(1125);
  })
})