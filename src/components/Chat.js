import React from 'react';

export default function Chat({input}) {

  const {loadingSocket, ...rest} = input;

  return (
    loadingSocket ? 
    <div>Loading</div>
    :
    <div>
      <h1>Chat: {input.value}</h1>
      <input {...rest} />
    </div>
  );
};