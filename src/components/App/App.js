import React, { useState, useEffect } from 'react';
import Auth from '../Auth';
import Dashboard from '../Dashboard';
import Loading from '../Loading';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    checkStatus();
  }, [isLoggedIn]);

  const checkStatus = () => {
    setIsLoading(true);
    const auth = localStorage.getItem('@auth');
    if (auth) {
      setIsLoading(false);
      setIsLoggedIn(true);
      setUserId(auth);
      return;
    }
    setIsLoading(false);
    setIsLoggedIn(false);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="container">
      {isLoggedIn ? (
        <Dashboard setIsLoggedIn={setIsLoggedIn} userId={userId} />
      ) : (
        <Auth setIsLoggedIn={setIsLoggedIn} setIsLoading={setIsLoading} />
      )}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
      />
    </div>
  );
}

export default App;
