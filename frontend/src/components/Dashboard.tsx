import { Box, Button, Card, CardActions, CardMedia, Grid, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import apiCall from '../apiCall';
import { Quiz } from '../interfaces';
import QuizNameForm from './QuizNameForm';
import QuizSessionButton from './QuizSessionButton';

export default function Dashboard () {
  const [quizzes, setQuizzes] = React.useState<Quiz[]>([]);

  const fetchQuizzes = async () => {
    const quizzes = await getQuizzes();
    setQuizzes(quizzes);
  }

  React.useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleQuizCreated = () => {
    fetchQuizzes();
  }

  const handleQuizDeleted = async (quiz: Quiz) => {
    await apiCall(`/admin/quiz/${quiz.id}`, 'DELETE', {});
    fetchQuizzes();
  };

  return (
    <>
      <h2>Dashboard</h2>
      <hr />
      <QuizNameForm
        endpoint="/admin/quiz/new"
        method="POST"
        onNewCreated={handleQuizCreated}
        name="Create New Quiz"
      />
      <hr />
      {renderQuizzes(quizzes, handleQuizDeleted)}
    </>
  );
}

const getQuizzes = async () => {
  const { quizzes } = await apiCall('/admin/quiz', 'GET', {});
  for (const i in quizzes) {
    const quizId = quizzes[i].id;
    quizzes[i] = await apiCall(`/admin/quiz/${quizId}`, 'GET', {});
    quizzes[i].id = quizId;
  }
  return quizzes;
}

const renderQuizzes = (quizzes: Quiz[], handleQuizDeleted: (quiz: Quiz) => void) => {
  const sortedQuizzes = [...quizzes].sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  const timedQuizzes = sortedQuizzes.map((quiz: Quiz) => {
    const questions = quiz.questions || [];
    const totalSeconds = questions.reduce((acc, curr) => {
      const [minutes = 0, seconds = 0] = curr.timeLimit.split(':').map(Number);
      return acc + minutes * 60 + seconds;
    }, 0);

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const totalTime = `${minutes}:${String(seconds).padStart(2, '0')}`;

    return {
      ...quiz,
      totalTime
    };
  });

  const navigate = useNavigate();

  return (
    <Box display="flex" justifyContent="center">
      <Grid container spacing={2} sx={{ maxWidth: 1280 }}>
        {timedQuizzes.map((quiz: Quiz, index: number) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ textAlign: 'center' }}>
              <h3 aria-label="Quiz name">{quiz.name}</h3>
              <CardMedia
                component="img"
                alt="Quiz thumbnail"
                height="180"
                image={quiz.thumbnail ? quiz.thumbnail : 'question thumbnail'}
                aria-label="Quiz thumbnail"
              />
              <Typography aria-label="Quiz details">
                Questions: {quiz.questions?.length ?? 0} • Time: {quiz.totalTime}
              </Typography>
              <CardActions>
                <Grid container justifyContent="center" spacing={1}>
                  <Grid item>
                    <QuizSessionButton quizId={quiz.id} aria-label="Start quiz session" />
                  </Grid>
                  <Grid item>
                    <Button variant="contained" onClick={() => navigate(`/edit-quiz/${quiz.id}`)} aria-label="Edit quiz">
                      Edit Quiz
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button variant="contained" color="error" onClick={() => handleQuizDeleted(quiz)} aria-label="Delete quiz">
                      Delete Quiz
                    </Button>
                  </Grid>
                </Grid>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
