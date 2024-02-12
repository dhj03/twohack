import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import QuizNameForm from './QuizNameForm';
import apiCall from '../apiCall';

jest.mock('../apiCall');

describe('<QuizNameForm>', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const props = {
    name: 'Create New Quiz',
    endpoint: '/admin/quiz/new',
    method: 'POST' as const,
    onNewCreated: jest.fn(),
  };

  it('renders the quiz name, name field and cancel and create buttons', () => {
    render(<QuizNameForm {...props} />)

    const quizNameButton = screen.getByRole('button', { name: props.name });
    expect(quizNameButton).toBeInTheDocument();

    fireEvent.click(quizNameButton);

    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: props.name })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument();
  })

  it('closes the dialog when the cancel button is clicked', async () => {
    render(<QuizNameForm {...props} />)

    const quizNameButton = screen.getByRole('button', { name: props.name });
    fireEvent.click(quizNameButton);

    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    })
  });

  it('calls the handleCreateNewQuiz function when the create button is clicked', async () => {
    render(<QuizNameForm {...props} />)

    const mockedApiCall = apiCall as jest.MockedFunction<typeof apiCall>;
    mockedApiCall.mockResolvedValueOnce({ quizzes: [] });

    const quizNameButton = screen.getByRole('button', { name: props.name });
    fireEvent.click(quizNameButton);

    const nameInput = screen.getByLabelText('Name');
    fireEvent.change(nameInput, { target: { value: 'My Quiz' } });

    const createButton = screen.getByRole('button', { name: 'Create' });
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(props.onNewCreated).toHaveBeenCalled();
      expect(screen.queryByLabelText('Name')).not.toBeInTheDocument();
    });
  })

  it('should have correct aria-label attributes', async () => {
    render(<QuizNameForm {...props} />)

    expect(screen.getByText(props.name)).toHaveAttribute('aria-label');

    const quizNameButton = screen.getByRole('button', { name: props.name });
    fireEvent.click(quizNameButton);

    await waitFor(() => {
      expect(screen.getByText('Cancel')).toHaveAttribute('aria-label');
      expect(screen.getByText('Create')).toHaveAttribute('aria-label');
    });
  });
})
