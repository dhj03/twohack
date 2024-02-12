import React from 'react';
import { TextField, Button, Container } from '@mui/material';
import apiCall from '../apiCall';
import TokenContext from '../context';

export default function Login () {
  const { applyToken } = React.useContext(TokenContext);

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();

    const { token } = await apiCall('/admin/auth/login', 'POST', { email, password });
    if (token) {
      applyToken(token);
    }
  }

  return (
    <>
      <Container maxWidth={'lg'}>
        <h2>Login</h2>
          <form onSubmit={submit}>
            <TextField
              label="Email" type="email" required
              value={email} onChange={e => setEmail(e.target.value)}
              sx={{ mb: 3 }} fullWidth aria-label='Email Address' inputProps={{ 'data-testid': 'email-input' }}
            />
            <TextField
              label="Password" type="password" required
              value={password} onChange={e => setPassword(e.target.value)}
              sx={{ mb: 3 }} fullWidth aria-label='Password' inputProps={{ 'data-testid': 'password-input' }}
            />
            <Button type="submit" variant="contained" aria-label='Login'>Login</Button>
          </form>
      </Container>
    </>
  );
}
