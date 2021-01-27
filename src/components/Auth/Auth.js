import React, { useMemo } from 'react';
import axios from 'axios';
import MonoConnect from '@mono.co/connect.js';
import { toast } from 'react-toastify';
import './Auth.css';

const Auth = ({ setIsLoggedIn, setIsLoading }) => {
  const monoConnect = useMemo(() => {
    const monoInstance = new MonoConnect({
      onClose: () => console.log('Widget closed'),
      onLoad: () => console.log('Widget loaded successfully'),
      onSuccess: async ({ code }) => {
        try {
          const { data } = await axios.post(
            'https://api.withmono.com/account/auth',
            {
              code,
            },
            {
              headers: {
                'mono-sec-key': process.env.REACT_APP_SECRET_KEY,
              },
            }
          );
          localStorage.setItem('@auth', data.id);
          setIsLoading(true);
          setIsLoggedIn(true);
        } catch (error) {
          toast.error('Error authenticating user.');
        }
      },
      key: process.env.REACT_APP_PUBLIC_KEY,
    });

    monoInstance.setup();

    return monoInstance;
  }, [setIsLoggedIn, setIsLoading]);

  return (
    <div className="auth">
      <h1 className="auth__brand">Welcome to Sample Company</h1>
      <button className="auth__btn" onClick={() => monoConnect.open()}>
        Authenticate with Mono
      </button>
    </div>
  );
};

export default Auth;
