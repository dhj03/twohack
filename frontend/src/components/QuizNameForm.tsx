import React from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Box } from '@mui/material';
import apiCall from '../apiCall';

interface QuizNameFormProps {
  name: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  onNewCreated: () => void;
}

export default function QuizNameForm (props: QuizNameFormProps) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleCreateNewQuiz = async () => {
    const data = { name }
    await apiCall(props.endpoint, props.method, data);
    props.onNewCreated();
    handleClose();
  }

  return (
    <Box sx={{ display: 'inline' }}>
      <Button onClick={handleClickOpen} aria-label={props.name}>
        {props.name}
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth={'sm'} fullWidth>
        <DialogTitle>{props.name}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="name"
            fullWidth
            variant="standard"
            value={name}
            onChange={handleNameChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} aria-label="Cancel">Cancel</Button>
          <Button onClick={handleCreateNewQuiz} aria-label="Create">Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
