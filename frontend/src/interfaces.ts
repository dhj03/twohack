export interface Question {
  id: string;
  title: string;
  type: 'single-choice' | 'multiple-choice';
  points: number;
  timeLimit: string;
  media?: string;
  thumbnail?: string;
  answers: {
    answer: string,
    isCorrect: boolean,
  }[];
}

export interface Quiz {
  id: string;
  name: string;
  owner: string;
  questions: Question[];
  thumbnail?: string;
  active?: string;
  createdAt: string;
  totalTime: string;
}

export const defaultQuestion: Question = {
  id: '',
  type: 'single-choice',
  title: 'Question title',
  timeLimit: '00:05',
  points: 0,
  answers: [
    { answer: '', isCorrect: false },
    { answer: '', isCorrect: false },
    { answer: '', isCorrect: false },
    { answer: '', isCorrect: false },
    { answer: '', isCorrect: false },
    { answer: '', isCorrect: false },
  ],
}

export interface Answer {
  answerIds: Number[],
  correct: boolean,
  answeredAt: string,
  questionStartedAt: string,
}
