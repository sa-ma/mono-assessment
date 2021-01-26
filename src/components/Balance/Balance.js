import React from 'react';
import { formatMoney } from '../../utils';
import './Balance.css';

const Balance = ({ currency, balance }) => {
  return (
    <div className="balance-card">
      <h3 className="balance-card__title">Balance</h3>
      <div className="balance-card__amount">
        {`${currency} ${formatMoney(Number.parseFloat(balance / 100))}`}
      </div>
    </div>
  );
};

export default Balance;
