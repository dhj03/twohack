import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NewQuestionButton from './NewQuestionButton';
import apiCall from '../apiCall';

jest.mock('../apiCall');

const noop = () => {}

describe('<NewQuestionButton>', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the create new question button', () => {
    render(<NewQuestionButton quizId="123" onQuestionCreated={noop} />);
    expect(screen.getByText('Create new question')).toBeInTheDocument();
  });

  it('calls onQuestionCreated props when button is clicked', async () => {
    const mockedApiCall = apiCall as jest.MockedFunction<typeof apiCall>;
    mockedApiCall.mockResolvedValueOnce({ questions: [] });

    const onQuestionCreated = jest.fn();
    const { getByRole } = render(<NewQuestionButton quizId="123" onQuestionCreated={onQuestionCreated} />);

    const createButton = getByRole('button', { name: 'Create new question' });
    userEvent.click(createButton);

    await waitFor(() => expect(mockedApiCall).toHaveBeenCalledTimes(2));
    expect(onQuestionCreated).toHaveBeenCalledTimes(1);
  });

  it('calls handleQuestionSubmit function when button is clicked', async () => {
    const mockedApiCall = apiCall as jest.MockedFunction<typeof apiCall>;
    mockedApiCall.mockResolvedValueOnce({ questions: [] });

    const onQuestionCreated = jest.fn();
    const { getByRole } = render(<NewQuestionButton quizId="123" onQuestionCreated={onQuestionCreated} />);

    const createButton = getByRole('button', { name: 'Create new question' });
    userEvent.click(createButton);

    await waitFor(() => expect(mockedApiCall).toHaveBeenCalledTimes(2));
    expect(mockedApiCall).toHaveBeenCalledWith('/admin/quiz/123', 'GET', {});
  });

  it('has an aria-label attribute', () => {
    render(<NewQuestionButton quizId="123" onQuestionCreated={noop} />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-label');
  });
});
