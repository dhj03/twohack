import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import QuizSessionButton from './QuizSessionButton';
import oldApiCall from '../apiCall';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../apiCall', () => ({
  __esModule: true,
  default: jest.fn()
}));

describe('<QuizSessionButton>', () => {
  const quizId = '123';
  const apiCall = oldApiCall as jest.MockedFunction<typeof oldApiCall>;

  beforeEach(() => {
    apiCall.mockClear();
    apiCall.mockResolvedValue({ active: '' });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders the button with Activate Quiz text', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <QuizSessionButton quizId={quizId} />
        </MemoryRouter>
      );
    });

    expect(screen.getByRole('button', { name: 'Activate Quiz' })).toBeInTheDocument();
  });

  it('shows the aria-labels for the modal buttons', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <QuizSessionButton quizId={quizId} />
        </MemoryRouter>
      );
    });
    const activateButton = screen.getByRole('button', { name: 'Activate Quiz' })
    expect(activateButton).toHaveAttribute('aria-label');

    await act(async () => {
      fireEvent.click(activateButton);
    });

    const copyButton = await screen.findByText('Copy Session ID to clipboard');
    expect(copyButton).toHaveAttribute('aria-label');
    const startButton = await screen.findByText('Start Quiz');
    expect(startButton).toHaveAttribute('aria-label');
    const closeButton = await screen.findByText('Close');
    expect(closeButton).toHaveAttribute('aria-label');
  });

  it('shows the aria-labels for the view results page buttons', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <QuizSessionButton quizId={quizId} />
        </MemoryRouter>
      );
    });

    await act(async () => {
      const activateButton = screen.getByRole('button', { name: 'Activate Quiz' });
      fireEvent.click(activateButton);

      const closeButton = await screen.findByText('Close');
      fireEvent.click(closeButton);

      const endButton = await screen.findByTestId('activate-button');
      fireEvent.click(endButton);

      const yesButton = await screen.findByText('Yes');
      expect(yesButton).toHaveAttribute('aria-label');

      const noButton = await screen.findByText('No');
      expect(noButton).toHaveAttribute('aria-label');
    });
  });

  it('shows correct text when activate quiz changes to end quiz', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <QuizSessionButton quizId={quizId} />
        </MemoryRouter>
      );
    });

    const activateButton = await screen.findByTestId('activate-button');

    await act(async () => {
      fireEvent.click(activateButton);
    });

    const endButton = await screen.findByTestId('activate-button');
    expect(endButton.textContent).toBe('End Quiz');
  })
});
