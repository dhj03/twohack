import React from 'react';
import { nanoid } from 'nanoid';
import { Button } from '@mui/material';
import apiCall from '../apiCall';
import { Question, defaultQuestion } from '../interfaces';

interface NewQuestionButtonProps {
  quizId: string;
  onQuestionCreated: () => void;
}

export default function NewQuestionButton (props: NewQuestionButtonProps) {
  const [, setSubmitted] = React.useState(false);

  const initialQuestion: Question = { ...defaultQuestion };
  initialQuestion.id = nanoid();

  const [question, setQuestion] = React.useState<Question>(initialQuestion);

  const handleQuestionSubmit = async () => {
    const { questions } = await apiCall(`/admin/quiz/${props.quizId}`, 'GET', {});
    questions.push(question);

    await apiCall(`/admin/quiz/${props.quizId}`, 'PUT', { questions });
    props.onQuestionCreated();

    setSubmitted(true);
    setQuestion(defaultQuestion);
  }

  return (
    <Button onClick={handleQuestionSubmit} aria-label="Create new question">
      Create new question
    </Button>
  );
}
