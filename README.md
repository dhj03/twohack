# TwoHack

## Introduction

TwoHack is a quiz game web application based on the well-known [Kahoot](https://kahoot.com/). It allows its users to create quizzes, start sessions from them, and join sessions to attempt quizzes. Quizzes contain questions, which are to be answered during a game session, and award points if answered correctly. At the end of a session, the user with the most points wins.

## Running the program

This program contains a frontend and a backend, which must be run separately.

Navigate to the `backend` folder and run `npm install` to install the dependencies necessary to run the backend. This is only required before running the backend for the first time. Then, run `npm start` to start the backend.

Navigate to the `frontend` folder and repeat the above procedure for the frontend.

Enter `localhost:3000` in the browser of your choice to access the web application.

## Authentication

Authentication is used to allow users to create and edit their own quizzes.

One may register a new account with an email, password, and name. Logging in only requires the email and password. When logged in, a user may also log out.

Joining a session to play doesn't require an account.

## Quizzes and Questions

Upon logging in, a user is greeted with their dashboard, which lists the user's quizzes. When a user creates a quiz, they are the admin of said quiz. Only the admin is able to edit or delete a quiz, or start a game session from it.

Each quiz contains a title, description, image, and a list of questions. Each question contains a description, list of possible answers, a list of correct answers, the number of seconds to answer the question, and the number of points to be gained from answering the question correctly.

## Game Sessions

In order for a quiz to be played, a game session must be started from it. The admin starts the quiz, and is given the code for the current session. Players may then join the session using its code.

During a session, the admin has the ability to advance to the next question. If done while the current question is still being answered, its remaining time will immediately be set 0.

The admin may also stop the session, which will direct all of its players to a results screen that will show information about how they went in the quiz.
