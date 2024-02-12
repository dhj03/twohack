import { Container } from '@mui/material';
import React from 'react';
import apiCall from '../apiCall';
import { Question, defaultQuestion } from '../interfaces';

interface props {
  playerId: string
}

export default function PlayQuizActive ({ playerId }: props) {
  const [question, setQuestion] = React.useState<Question>(defaultQuestion);
  const [timeLeft, setTimeLeft] = React.useState(5);
  const [hasFinished, setHasFinished] = React.useState(false);

  const updateQuestionTimer = React.useRef<ReturnType<typeof setInterval>>();
  const decrementTimeTimer = React.useRef<ReturnType<typeof setInterval>>();

  // Poll backend to update question
  React.useEffect(() => {
    updateQuestionTimer.current = setInterval(async () => {
      const { question } = await apiCall(`/play/${playerId}/question`, 'GET', {});
      if (!question) {
        setHasFinished(true);
      } else {
        setQuestion(question);
      }
    }, 1000)
    return () => clearInterval(updateQuestionTimer.current);
  }, [])

  // Decrement timeLeft every second
  React.useEffect(() => {
    decrementTimeTimer.current = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000)
    return () => clearInterval(decrementTimeTimer.current);
  }, [timeLeft])

  // Update timeLeft when the question is updated
  React.useEffect(() => {
    const [mins, secs] = question.timeLimit.split(':').map(Number);
    setTimeLeft((mins || 0) * 60 + (secs || 0));
  }, [question.id])

  if (hasFinished) {
    clearInterval(updateQuestionTimer.current);
    clearInterval(decrementTimeTimer.current);
    return (
      <Container maxWidth={'lg'}>
        <h4>Quiz over!</h4>
        <hr />
        You scored 0 points.
      </Container>
    )
  } else if (timeLeft > 0) {
    return (
      <Container maxWidth={'lg'}>
        <h4>Time remaining: {timeLeft}</h4>
        <hr />
        <h3>{question.title}</h3>
        Points: {question.points}<br />
        {question.media || ''}<br />
        {question.answers.map((answer) => {
          return <>- {answer.answer}<br /></>
        })}
      </Container>
    )
  } else {
    return (
      <Container maxWidth={'lg'}>
        <h4>Time&apos;s up!</h4>
        <hr />
        <h3>Correct answers:</h3>
        {question.answers.map((answer) => {
          if (answer.isCorrect) {
            return <>- {answer.answer}<br /></>
          } else {
            return <></>
          }
        })}
      </Container>
    )
  }
}
