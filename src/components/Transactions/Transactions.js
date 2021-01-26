import React, { useState, useEffect } from 'react';
import Loading from '../Loading';
import { formatMoney } from '../../utils';
import { getTransactions, refreshData } from '../../services';
import './Transactions.css';

const Transactions = ({ currency, userId, setIsLoggedIn }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    getTransactions(userId, setTransactions);

    const transactionInterval = setInterval(() => {
      console.log('This will run every 1 minute');
      getTransactions(userId, setTransactions);
    }, 100000);
    const refreshDataInterval = setInterval(() => {
      console.log('This will run every 4 minutes');
      refreshData(userId, setIsLoggedIn);
    }, 400000);
    setIsLoading(false);
    return () => {
      clearInterval(transactionInterval);
      clearInterval(refreshDataInterval);
    };
  }, [userId, setIsLoggedIn]);

  return (
    <div className="transaction-info">
      <ul className="card">
        {isLoading && <Loading />}
        {!isLoading &&
          transactions &&
          transactions.map((item) => (
            <li className="card__item" key={item._id}>
              <span>
                {item.narration.length > 25
                  ? `${item.narration.substr(0, 25)}...`
                  : item.narration}
              </span>
              <span className={item.type === 'debit' ? 'debit' : 'credit'}>
                {`${currency} ${formatMoney(
                  Number.parseFloat(item.amount / 100)
                )}`}
              </span>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Transactions;
