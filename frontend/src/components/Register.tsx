import React from 'react';
import { TextField, Button, Container } from '@mui/material';
import apiCall from '../apiCall';
import TokenContext from '../context';

export default function Register () {
  const { applyToken } = React.useContext(TokenContext);

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();

    const { token } = await apiCall('/admin/auth/register', 'POST', { email, password, name });
    if (token) {
      applyToken(token);
    }
  }

  return (
    <>
      <Container maxWidth={'lg'}>
        <h2>Register</h2>
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
          <TextField
            label="Name" required
            value={name} onChange={e => setName(e.target.value)}
            sx={{ mb: 3 }} fullWidth aria-label='Name' inputProps={{ 'data-testid': 'name-input' }}
          />
          <Button type="submit" variant="contained" aria-label='Register'>Register</Button>
        </form>
      </Container>
    </>
  );
}
