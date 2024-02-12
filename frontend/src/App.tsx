import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import TokenContext from './context';
import Nav from './components/Nav';
import Page from './components/Page';

export default function App () {
  const [token, setToken] = React.useState<string | null>(getToken);

  const applyToken = (token: string | null) => {
    setToken(token);

    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  return (
    <BrowserRouter>
      <TokenContext.Provider value={{ token, applyToken }}>
        <Nav />
        <Page />
      </TokenContext.Provider>
    </BrowserRouter>
  );
}

const getToken = () => localStorage.getItem('token');
