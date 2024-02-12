import { Box, TextField, FormControlLabel, Checkbox } from '@mui/material';
import React from 'react';

interface AnswerFieldProps {
  i: number;
  initialText: string;
  initialIsCorrect: boolean;
  required?: boolean;
}

export default function AnswerField (props: AnswerFieldProps) {
  return (
    <Box display="flex">
      <TextField
        id = {`answer-${props.i}`}
        label = {`Answer ${props.i}`}
        type = "text"
        defaultValue = {props.initialText}
        margin = "dense"
        fullWidth
        variant = "standard"
        aria-label="Answer Field"
      />
      <FormControlLabel
        control={
          <Checkbox
            id={`is-correct-${props.i}`}
            defaultChecked = {props.initialIsCorrect}
          />
        }
        label="Correct"
        labelPlacement="end"
        aria-label="Checked"
      />
    </Box>
  );
}
