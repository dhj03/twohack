import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Button, Toolbar, Typography } from '@mui/material';
import TokenContext from '../context';
import apiCall from '../apiCall';

export default function Nav () {
  const { token } = React.useContext(TokenContext);
  const navigate = useNavigate();

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography
            onClick={() => navigate('/dashboard')}
            variant="h6" component="div" sx={{ flexGrow: 1, cursor: 'pointer' }}>
            TwoHack
          </Typography>
          <Button onClick={() => navigate('/play')} color="inherit">Play</Button>
          {token ? <NavButtonsLoggedIn /> : <NavButtonsLoggedOut />}
        </Toolbar>
      </AppBar>
    </>
  )
}

function NavButtonsLoggedIn () {
  const { applyToken } = React.useContext(TokenContext);

  const logout = () => {
    apiCall('/admin/auth/logout', 'POST', {});

    applyToken(null);
  }

  return (
    <>
      <Button onClick={logout} color="inherit">Logout</Button>
    </>
  )
}

function NavButtonsLoggedOut () {
  const navigate = useNavigate();

  return (
    <>
      <Button onClick={() => navigate('/register')} color="inherit" aria-label="Register">Register</Button>
      <Button onClick={() => navigate('/login')} color="inherit" aria-label="Login">Login</Button>
    </>
  )
}
