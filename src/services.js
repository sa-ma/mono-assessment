import axios from 'axios';
import { format, sub } from 'date-fns';
import { toast } from 'react-toastify';

const startDate = format(new Date(), 'dd-MM-yyyy');
const endDate = format(sub(new Date(), { days: 5 }), 'dd-MM-yyyy');

export const getUserData = (userId, cbData) => {
  axios
    .get(`https://api.withmono.com/accounts/${userId}`, {
      headers: { 'mono-sec-key': process.env.REACT_APP_SECRET_KEY },
    })
    .then(({ data }) => cbData(data))
    .catch((error) => toast.error('Error fetching user data.'));
};
export const getTransactions = (userId, cbData) => {
  axios
    .get(`https://api.withmono.com/accounts/${userId}/transactions`, {
      headers: { 'mono-sec-key': process.env.REACT_APP_SECRET_KEY },
      params: {
        startDate,
        endDate,
        pagination: false,
      },
    })
    .then(({ data }) => {
      if (data.data.length > 10) {
        cbData(data.data.splice(0, 10));
        return;
      }
      cbData(data.data);
    })
    .catch((error) => {
      toast.error('Error fetching transactions.');
    });
};

export const refreshData = (userId, cbIsLoggedIn) => {
  axios
    .post(
      `https://api.withmono.com/accounts/${userId}/sync`,
      {},
      {
        headers: { 'mono-sec-key': process.env.REACT_APP_SECRET_KEY },
      }
    )
    .then(({ data }) => {
      if (data.status === 'failed' && data.code === 'SYNC_ERROR') {
        toast.error(data.message);
        localStorage.removeItem('@auth');
        cbIsLoggedIn(false);
        return;
      }
      return;
    })
    .catch((error) => {
      toast.error('Unable to sync data. Please try again.');
    });
};
