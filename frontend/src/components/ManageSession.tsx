import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import apiCall from '../apiCall';
import { Answer } from '../interfaces';

interface Player {
  name: string,
  answers: Answer[],
}

function ManageSession () {
  const { quizId, sessionId } = useParams();
  console.log(quizId);
  console.log(sessionId);

  const [sessionStarted, setSessionStarted] = React.useState(false);
  const [topPlayers, setTopPlayers] = React.useState<Player[]>([]);

  const getSessionStatus = async () => {
    const response = await apiCall(`/admin/session/${sessionId}/status`, 'GET', {});
    if (response.results.position === response.results.questions.length) {
      handleSessionEnd();
    } else {
      setSessionStarted(true);
    }
  }

  React.useEffect(() => {
    getSessionStatus();
  }, [sessionId]);

  const handleAdvanceQuiz = async () => {
    await apiCall(`/admin/quiz/${quizId}/advance/`, 'POST', {});
    getSessionStatus()
  }

  const handleSessionEnd = async () => {
    setSessionStarted(false);
    await apiCall(`/admin/quiz/${quizId}/end`, 'POST', {});
    getSessionResults()
  }

  const getSessionResults = async () => {
    const players: Player[] = await apiCall(`/admin/session/${sessionId}/results`, 'GET', {});

    // should sort the players by score
    const sortedPlayers = players.sort((a: Player, b: Player) => {
      const aScore = a.answers.filter((answer: Answer) => answer.correct).length;
      const bScore = b.answers.filter((answer: Answer) => answer.correct).length;
      return bScore - aScore;
    });
    setTopPlayers(sortedPlayers.slice(0, 5));
    console.log(JSON.stringify(sortedPlayers));

    // get average response/answer time for each question
    // for each question, calculate the difference questionStartedAt - answeredAt
  }

  return (
    <Box>
      { sessionStarted
        ? (
        <Box>
          <Button onClick={handleAdvanceQuiz} aria-label="Advance to Next Question">Advance to Next Question</Button>
          <Button onClick={handleSessionEnd} aria-label="Stop the Quiz">Stop the Quiz</Button>
        </Box>
          )
        : (
        <Box>
          <p>Session Ended</p>
          <Table aria-label="Top Players">
          <TableHead>
            <TableRow>
              <TableCell>Player Name</TableCell>
              <TableCell>Score</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {topPlayers.map((player) => (
              <TableRow key={player.name}>
                <TableCell>{player.name}</TableCell>
                <TableCell>{player.answers.filter((answer: Answer) => answer.correct).length}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
          <p>Bar/Line chart showing a breakdown of what percentage of people (Y axis) got certain questions (X axis) correct</p>
          <p>Some chart showing the average response/answer time for each question</p>
          <p>Any other interesting information you see fit</p>
        </Box>
          )}
    </Box>
  )
}

export default ManageSession;
