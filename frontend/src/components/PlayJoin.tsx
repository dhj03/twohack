import { Button, Container, TextField } from '@mui/material';
import React from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import apiCall from '../apiCall';

export default function PlayJoin () {
  const navigate = useNavigate();
  return (
    <>
      <Container maxWidth={'lg'}>
        <h2>Join quiz session</h2>
        <form onSubmit={(event) => submit(event, navigate)}>
          <TextField
            label="Session ID" id="session-id" required
            sx={{ mb: 3 }} fullWidth
            inputProps={{ 'data-testid': 'session-id' }}
            aria-label="Session ID field"
          />
          <TextField
            label="Name" id="name" required
            sx={{ mb: 3 }} fullWidth
            inputProps={{ 'data-testid': 'name-field' }}
            aria-label="Name field"
          />
          <Button type="submit" variant="contained" aria-label="Join button">Join</Button>
        </form>
      </Container>
    </>
  )
}

const submit = async (event: React.FormEvent, navigate: NavigateFunction) => {
  event.preventDefault();

  const formItems = (event.currentTarget as HTMLFormElement).elements;
  const getItem = (name: string) => formItems.namedItem(name) as HTMLInputElement;

  const sessionId = getItem('session-id').value;
  const name = getItem('name').value;

  const { playerId } = await apiCall(`/play/join/${sessionId}`, 'POST', { name });

  if (playerId) {
    navigate(`/play/${playerId}`);
  }
}
