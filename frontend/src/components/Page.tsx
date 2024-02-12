import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import TokenContext from '../context';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import EditQuiz from './EditQuiz';
import EditQuestion from './EditQuestion';
import ManageSession from './ManageSession';
import PlayJoin from './PlayJoin';
import PlayQuiz from './PlayQuiz';

export default function Page () {
  const { token } = React.useContext(TokenContext);

  return (token ? <PageLoggedIn /> : <PageLoggedOut />);
}

function PageLoggedIn () {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/edit-quiz/:id" element={<EditQuiz />} />
      <Route path="/edit-quiz/:quizId/:questionId" element={<EditQuestion />} />
      <Route path="/manage-session/:quizId/:sessionId" element={<ManageSession />}></Route>
      <Route path="/play" element={<PlayJoin />} />
      <Route path="/play/:playerId" element={<PlayQuiz />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

function PageLoggedOut () {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/play" element={<PlayJoin />} />
      <Route path="/play/:playerId" element={<PlayQuiz />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
