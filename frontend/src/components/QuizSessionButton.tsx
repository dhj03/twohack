import React from 'react';
import { Button, Dialog, DialogContent, Box, Typography } from '@mui/material';
import apiCall from '../apiCall';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useNavigate } from 'react-router-dom';

interface QuizPopupProps {
  quizId: string,
}

export default function QuizSessionButton (props: QuizPopupProps) {
  const [openStartQuiz, setOpenStartQuiz] = React.useState(false);
  const [openEndQuiz, setOpenEndQuiz] = React.useState(false);
  const [activeId, setActiveId] = React.useState('');
  const [isQuizStarted, setIsQuizStarted] = React.useState(false);

  React.useEffect(() => {
    const checkQuizStatus = async () => {
      const response = await apiCall(`/admin/quiz/${props.quizId}`, 'GET', {});
      setActiveId(response.active);
      setIsQuizStarted(response.active);
    }

    checkQuizStatus();

    return () => {
      setActiveId('')
      setOpenEndQuiz(false)
      setOpenStartQuiz(false)
      setIsQuizStarted(false)
    };
  }, [props.quizId]);

  const handleClose = () => {
    setOpenStartQuiz(false);
    setOpenEndQuiz(false);
  };

  const handleQuizStarted = async (quizId: string) => {
    setOpenStartQuiz(true);
    await apiCall(`/admin/quiz/${quizId}/start`, 'POST', {});
    const response = await apiCall(`/admin/quiz/${quizId}`, 'GET', {});
    setActiveId(response.active);
    setIsQuizStarted(true);
  };

  const handleQuizEnded = async (quizId: string) => {
    setOpenEndQuiz(true);
    await apiCall(`/admin/quiz/${quizId}/end`, 'POST', {});
    setIsQuizStarted(false);
    setActiveId('');
  };

  const navigate = useNavigate();

  return (
    <Box>
      <Button
        onClick={() => {
          isQuizStarted ? handleQuizEnded(props.quizId) : handleQuizStarted(props.quizId)
        }}
        variant="contained"
        color={ isQuizStarted ? 'error' : 'success' }
        aria-label="Activate Quiz"
        data-testid="activate-button"
      >
        { isQuizStarted ? 'End Quiz' : 'Activate Quiz' }
      </Button>
      <Dialog open={openStartQuiz} onClose={handleClose} maxWidth={'sm'} fullWidth>
        <DialogContent>
          <Typography variant="h5">
            Quiz Session ID: {activeId}
          </Typography>
          <Typography variant="h6">
            Waiting for players.
          </Typography>
          <CopyToClipboard text={activeId}>
            <Button aria-label="Copy Session ID to clipboard">
              Copy Session ID to clipboard
            </Button>
          </CopyToClipboard>
          <Button onClick={() => navigate(`/manage-session/${props.quizId}/${activeId}`)} aria-label="Start Quiz">Start Quiz</Button>
          <Button onClick={handleClose} aria-label="Close">Close</Button>
        </DialogContent>
      </Dialog>
      <Dialog open={openEndQuiz} onClose={handleClose} maxWidth={'sm'} fullWidth>
        <DialogContent>
          <Typography variant="h5">
            Would you like to view the results?
          </Typography>
          <Button onClick={() => navigate(`/manage-session/${props.quizId}/${activeId}`)} aria-label="Results Yes">Yes</Button>
          <Button onClick={handleClose} aria-label="Results No">No</Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
