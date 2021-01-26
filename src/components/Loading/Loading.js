import React from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import './Loading.css';

const Loading = () => {
  return (
    <div className="loading">
      <ClipLoader color="#182cd1" size={32} />
    </div>
  );
};

export default Loading;
