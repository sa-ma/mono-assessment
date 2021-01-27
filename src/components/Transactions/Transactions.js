import React, { useState, useEffect } from 'react';
import Loading from '../Loading';
import { formatMoney } from '../../utils';
import { getTransactions } from '../../services';
import './Transactions.css';

const Transactions = ({ currency, userId, wait, handleWait }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    getTransactions(userId, setTransactions);
    // Check meta data status every 5 seconds if status === 'PROCESSING'
    if (wait) {
      setTimeout(() => {
        handleWait();
      }, 5000);
    }
    setIsLoading(false);
  }, [userId, wait, handleWait]);

  return (
    <div className="transaction-info">
      <ul className="card">
        {(isLoading || wait) && <Loading />}
        {!isLoading &&
          !wait &&
          transactions &&
          transactions.length > 0 &&
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
        {!isLoading && !wait && transactions && transactions.length <= 0 && (
          <li className="card__item">
            {' '}
            No data to display. Please refresh data.
          </li>
        )}
      </ul>
    </div>
  );
};

export default Transactions;
