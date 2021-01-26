import React from 'react';

const UserInfo = ({ userData }) => {
  return (
    <div className="user-info">
      <ul className="card">
        <li className="card__item">
          <span>Account Name</span>
          <span>{userData && userData.account.name}</span>
        </li>
        <li className="card__item">
          <span>Account Number</span>
          <span>{userData && userData.account.accountNumber}</span>
        </li>
        <li className="card__item">
          <span>BVN (Last 4 digits)</span>
          <span>{userData && userData.account.bvn}</span>
        </li>
      </ul>
    </div>
  );
};

export default UserInfo;
