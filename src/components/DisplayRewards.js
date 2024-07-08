import React, { useState, useEffect } from 'react'
import './DisplayRewards.css'
import { fetchCustomerData } from '../utils/calculateRewards'
import { TABLE_HEADINGS } from '../utils/constants'

const DisplayRewards = () => {
  const [finalData, setFinalData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataFetchError, setDataFetchError] = useState(false);

  useEffect(() => {
    fetchCustomerData(setFinalData, setIsLoading, setDataFetchError);
    // eslint-disable-next-line
  }, [])

  return (
    <div className="container">
      <h1>Reward points for customers</h1>
      {
        dataFetchError
          ? <div>
            <h3>Error fetching data from server !</h3>
            <p>Check if json-server is running at port 8000</p>
          </div>
          : finalData.length > 0 && !isLoading
            ? (
              <div className="table-container">
                <table className="rewards-table">
                  <thead>
                    {
                      TABLE_HEADINGS.map(item => (
                        <tr key={item.id}>
                          <th>{item.id}</th>
                          <th>{item.name}</th>
                          {
                            item.monthColumns.map((item, index) => (
                              <th key={index}>{`Reward points for month ${index + 1}`}</th>
                            ))
                          }
                          <th>{item.total}</th>
                        </tr>
                      ))
                    }
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