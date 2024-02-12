import React from 'react';
import { Button, TextField, MenuItem, Grid, Box, FormControl } from '@mui/material';
import apiCall from '../apiCall';
import { Question } from '../interfaces';
import { NavigateFunction, useNavigate, useParams } from 'react-router-dom';
import { fileToDataUrl } from '../fileToDataUrl';
import AnswerField from './AnswerField';

export default function EditQuestion () {
  const { quizId, questionId } = useParams();

  const [initialQuestion, setInitialQuestion] = React.useState<Question | null>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    load(quizId ?? '', questionId ?? '', setInitialQuestion);
  }, []);

  if (!initialQuestion) {
    return <></>;
  }

  const emptyAnswer = { answer: '', isCorrect: false };

  return (
    <Box display="flex" alignItems="center" flexDirection="column">
      <h2>Edit Question</h2>
      {initialQuestion.title}
      <form
        id="form" onSubmit={(event) => save(event, quizId ?? '', questionId ?? '', navigate)}
      >
        <FormControl sx={{ maxWidth: 1200 }} fullWidth>
          <TextField
            autoFocus
            required
            id="question"
            label="Question"
            type="text"
            defaultValue={initialQuestion.title}
            fullWidth
            variant="standard"
            aria-label="Question"
          />
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <TextField
                fullWidth
                required
                margin="normal"
                id="question-type"
                name="question-type"
                select
                label="Question Type"
                defaultValue={initialQuestion.type}
                variant="standard"
                aria-label="Question Type"
              >
                <MenuItem value="single-choice">Single Choice</MenuItem>
                <MenuItem value="multiple-choice">Multiple Choice</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={4}>
              <TextField
                required
                margin="normal"
                id="points"
                label="Points"
                type="number"
                defaultValue={initialQuestion.points.toString()}
                fullWidth
                variant="standard"
                aria-label="Points"
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                required
                margin="normal"
                id="time-limit"
                label="Time Limit (MM:SS)"
                type="string"
                defaultValue={initialQuestion.timeLimit}
                fullWidth
                variant="standard"
                aria-label="Time Limit"
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={10}>
              <TextField
                id="media-url"
                label="Media URL (Optional)"
                type="text"
                defaultValue={initialQuestion.media ?? ''}
                fullWidth
                variant="standard"
                aria-label="Media URL"
              />
            </Grid>
            <Grid item xs={2}>
              <Button
                variant="contained"
                component="label"
                aria-label="Upload Thumbnail"
              >
                Upload Thumbnail
                <input
                  id="thumbnail"
                  type="file"
                  accept="image/*"
                  hidden
                  aria-label="Thumbnail"
                />
              </Button>
            </Grid>
          </Grid>
          {
            [1, 2, 3, 4, 5, 6].map((i) => {
              return (
                <AnswerField
                  key={i}
                  i={i}
                  initialText={(initialQuestion.answers[i - 1] || emptyAnswer).answer}
                  initialIsCorrect={(initialQuestion.answers[i - 1] || emptyAnswer).isCorrect}
                />
              )
            })
          }
          <Button type="submit" sx={{ mt: 2 }} variant="contained">
            Save
          </Button>
        </FormControl>
      </form>
    </Box>
  );
}

const getQuestions = async (quizId: string) => {
  return (await apiCall(`/admin/quiz/${quizId}`, 'GET', {})).questions as Question[];
};

const getQuestion = (questions: Question[], questionId: string) => {
  for (const question of questions) {
    if (question.id === questionId) {
      return question;
    }
  }
  return null;
}

const load = async (
  quizId: string, questionId: string,
  setInitialQuestion: React.Dispatch<React.SetStateAction<Question | null>>
) => {
  const questions = await getQuestions(quizId);
  const question = getQuestion(questions, questionId);
  if (question) {
    setInitialQuestion(question);
  }
}

const save = async (
  event: React.FormEvent, quizId: string, questionId: string, navigate: NavigateFunction
) => {
  event.preventDefault();

  const formItems = (event.currentTarget as HTMLFormElement).elements;
  const getItem = (name: string) => formItems.namedItem(name) as HTMLInputElement;

  const questions = await getQuestions(quizId);
  const question = getQuestion(questions, questionId);
  if (!question) {
    return;
  }

  question.title = getItem('question').value;
  question.type = getItem('question-type').value === 'single-choice'
    ? 'single-choice'
    : 'multiple-choice';
  question.points = parseInt(getItem('points').value, 10);
  question.timeLimit = getItem('time-limit').value;
  question.media = getItem('media-url').value;

  const files = getItem('thumbnail').files;
  if (files && files[0]) {
    question.thumbnail = await fileToDataUrl(files[0]) as string;
  }

  question.answers = [1, 2, 3, 4, 5, 6].map((i) => {
    return {
      answer: getItem(`answer-${i}`).value,
      isCorrect: getItem(`is-correct-${i}`).checked,
    }
  })

  await apiCall(`/admin/quiz/${quizId}`, 'PUT', { questions });
  navigate(`/edit-quiz/${quizId}`);
}
