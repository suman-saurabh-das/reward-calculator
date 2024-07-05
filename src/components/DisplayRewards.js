import React, { useState, useEffect } from 'react'
import './DisplayRewards.css'
import { fetchCustomerData } from '../utils'
import { TABLE_HEADINGS } from '../utils/constants'

const DisplayRewards = () => {
  const [finalData, setFinalData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCustomerData(setFinalData, setIsLoading);
    // eslint-disable-next-line
  }, [])

  return (
    <div className="container">
      <h1>Reward points for customers</h1>
      {
        finalData.length > 0 && !isLoading
          ? (
            <div className="table-container">
              <table className="rewards-table">
                <thead>
                  <tr>
                    <th>Customer id</th>
                    <th>Customer name</th>
                    {
                      TABLE_HEADINGS.map((item, index) => (
                        <th key={index}>{`Reward points for month ${index + 1}`}</th>
                      ))
                    }
                    <th>Total reward points</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    finalData.map(item => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                        {
                          item.monthlyTotals.map((monthlyAmount, index) => (
                            <td key={index}>{monthlyAmount}</td>
                          ))
                        }
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