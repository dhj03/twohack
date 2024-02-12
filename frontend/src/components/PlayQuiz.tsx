import { Box } from '@mui/material';
import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import apiCall from '../apiCall';
import PlayQuizActive from './PlayQuizActive';

export default function PlayQuiz () {
  const { playerId } = useParams();

  if (playerId === undefined) {
    return <Navigate to="/play" />;
  }

  const [hasStarted, setHasStarted] = React.useState<boolean | null>(false);
  const timer = React.useRef<ReturnType<typeof setInterval>>();

  React.useEffect(() => {
    timer.current = setInterval(() => {
      fetchStatus(playerId, setHasStarted);
    }, 1000)
    return () => clearInterval(timer.current);
  }, [])

  switch (hasStarted) {
    case false:
      return (
        <Box display="flex" justifyContent="center">
          <h4>Quiz has not yet started, please wait...</h4>
        </Box>
      )
    case true:
      clearInterval(timer.current);
      return <PlayQuizActive playerId={playerId}/>
    default:
      clearInterval(timer.current);
      return <Navigate to="/play" />;
  }
}

const fetchStatus = async (
  playerId: string,
  setHasStarted: React.Dispatch<React.SetStateAction<boolean | null>>
) => {
  try {
    const { started } = await apiCall(`/play/${playerId}/status`, 'GET', {});
    setHasStarted(started);
  } catch {
    alert('Invalid player ID');
    setHasStarted(null);
  }
}
