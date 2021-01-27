import React, { useEffect, useState } from 'react';
import Transactions from '../Transactions';
import UserInfo from '../UserInfo/';
import Loading from '../Loading';
import Balance from '../Balance';
import { getUserData, refreshData } from '../../services';
import './Dashboard.css';

const Dashboard = ({ setIsLoggedIn, userId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState('user');
  const [wait, setWait] = useState(true);

  const handleMetaWait = () => {
    if (userData && userData.meta.data_status.toUpperCase() === 'PROCESSING') {
      getUserData(userId, setUserData);
      return;
    }
    if (userData && userData.meta.data_status.toUpperCase() === 'AVAILABLE') {
      setWait(false);
    }
    return;
  };

  const getUpdatedData = () => {
    setIsLoading(true);
    refreshData(userId, setIsLoggedIn);
    getUserData(userId, setUserData);
    setTimeout(() => setIsLoading(false), 2000);
  };

  useEffect(() => {
    setIsLoading(true);
    getUserData(userId, setUserData);

    const interval = setInterval(() => {
      refreshData(userId, setIsLoggedIn);
      getUserData(userId, setUserData);
    }, 100000);
    setIsLoading(false);
    return () => clearInterval(interval);
  }, [userId, setIsLoggedIn]);

  const logout = () => {
    localStorage.removeItem('@auth');
    setIsLoggedIn(false);
  };

  const username = (userData && userData.account.name.split(' ')[0]) || '';

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <h1 className="dashboard-header__brand h1">Sample Company</h1>
        <button className="btn" onClick={logout}>
          Logout
        </button>
      </div>
      <main className="dashboard__content">
        {isLoading && <Loading />}
        {!isLoading && userData && (
          <div className="dashboard_content__inner">
            <div className="greetings">
              Hi <span>{username}</span>, Welcome back!
            </div>

            <div className="account-overview">
              <div className="account-overview__header">
                <h2 className="h1">Account Overview</h2>
                <button className="btn" onClick={() => getUpdatedData()}>
                  Refresh Data
                </button>
              </div>
              <Balance
                currency={userData.account.currency}
                balance={userData.account.balance}
              />
              <div className="tab-list">
                <button
                  onClick={() => setActiveTab('user')}
                  className={`tab-list__item ${
                    activeTab === 'user'
                      ? 'tab-list__item-active'
                      : 'tab-list__item-inactive'
                  }`}
                >
                  User Information
                </button>
                <button
                  onClick={() => setActiveTab('transactions')}
                  className={`tab-list__item ${
                    activeTab === 'transactions'
                      ? 'tab-list__item-active'
                      : 'tab-list__item-inactive'
                  }`}
                >
                  Recent transactions
                </button>
              </div>
              {activeTab === 'user' && <UserInfo userData={userData} />}
              {activeTab === 'transactions' && (
                <Transactions
                  currency={userData && userData.account.currency}
                  userId={userId}
                  wait={wait}
                  handleWait={handleMetaWait}
                />
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
