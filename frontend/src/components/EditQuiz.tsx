import { Box, Button, Card, CardActions, CardContent, CardMedia, Grid } from '@mui/material';
import React, { useState, useEffect, ChangeEvent, SetStateAction } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiCall from '../apiCall';
import NewQuestionButton from './NewQuestionButton';
import QuizNameForm from './QuizNameForm';
import { fileToDataUrl } from '../fileToDataUrl';
import { Question } from '../interfaces';

function EditQuiz () {
  const { id } = useParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');

  useEffect(() => {
    fetchQuiz();
  }, []);

  const fetchQuiz = async () => {
    const quiz = await apiCall(`/admin/quiz/${id}`, 'GET', {});
    setQuestions(quiz.questions);
    setThumbnailUrl(quiz.thumbnail)
  };

  const handleQuestionCreated = () => {
    fetchQuiz();
  }

  const handleQuestionDeleted = async (question: Question) => {
    console.log(question.id);

    const updatedQuestions = questions.filter((q: Question) => q.id !== question.id);
    const data = { questions: updatedQuestions };

    console.log(data);

    await apiCall(`/admin/quiz/${id}`, 'PUT', data);
    fetchQuiz();
  };

  const handleEditQuizName = () => {
    fetchQuiz();
  }

  const handleFileInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);

    const data = { thumbnail: dataUrl }
    await apiCall(`/admin/quiz/${id}`, 'PUT', data);

    setThumbnailUrl(dataUrl as SetStateAction<string>);
  };

  return (
    <>
      <h2>Edit quiz</h2>
      <hr />
      <Box display="flex" justifyContent="space-between">
        <Box>
          <NewQuestionButton
            quizId={id || ''}
            onQuestionCreated={handleQuestionCreated}
          />
        </Box>
        <Box>
          <QuizNameForm
            endpoint={`/admin/quiz/${id}`}
            method="PUT"
            onNewCreated={handleEditQuizName}
            name="Edit Quiz Name"
          />
          <Button
            component="label"
            aria-label="Edit Quiz Thumbnail"
          >
            Edit Quiz Thumbnail
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleFileInputChange}
            />
          </Button>
        </Box>
      </Box>
      <hr />
      <Box display="flex" justifyContent="center" >
        <Box
          mb={10}
          maxWidth={350}
          maxHeight={350}
          sx={{ '& img': { width: '100%', height: '100%' } }
        }>
          {thumbnailUrl && <img src={thumbnailUrl} alt="Quiz thumbnail" aria-label="Quiz thumbnail" />}
        </Box>
      </Box>
      {renderQuestions(questions, handleQuestionDeleted, id ? parseInt(id) : 0)}
    </>
  );
}

const renderQuestions = (questions: Question[], handleQuestionDeleted: (q: Question) => void, quizId: number) => {
  const navigate = useNavigate();

  return (
    <Box display="flex" justifyContent="center">
      <Grid container spacing={2} sx={{ maxWidth: 1200 }}>
        {questions.map((question: Question, index: number) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardMedia
                component="img"
                alt="question image"
                height="180"
                image={question.thumbnail ? question.thumbnail : 'question thumbnail'}
              />
              <Box display="flex" flexDirection='column' justifyContent='center' alignItems='center'>
                <CardContent>
                  {question.title !== '' ? question.title : 'Untitled '}
                  {question.media ? <a href={question.media}>Video</a> : ''}
                </CardContent>
                <CardActions >
                    <Button size="small" variant='contained' onClick={() => navigate(`/edit-quiz/${quizId}/${question.id}`)} aria-label="Edit question">Edit</Button>
                    <Button size="small" variant='contained' color="error" onClick={() => handleQuestionDeleted(question)} aria-label="Delete question">Delete</Button>
                </CardActions>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default EditQuiz;
