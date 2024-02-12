describe('Registers, creates a new game, updates game thumbnail and name, starts and ends game, loads results page, logs out, logs back in', () => {
  const email = `${Date.now()}@aharotest.com`;
  const password = 'password';
  const name = 'Test Admin';
  it('Register and log in', () => {
    cy.visit('localhost:3000/register');
    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').type(password);
    cy.get('input[type="text"]').type(name);
    cy.contains('Register').click();

    cy.visit('localhost:3000/login');
    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').type(password);
    cy.contains('Login').click();
  });

  it('Create a new game', () => {
    cy.visit('localhost:3000/dashboard');
    cy.contains('Create New Quiz').click();
    cy.get('[aria-label="Create"]').click();
  });

  it('Update game thumbnail and name', () => {
    cy.contains('Edit Quiz').click()
    cy.contains('Edit Quiz Name').click()
    cy.contains('Create').click()
    cy.contains('Edit Quiz Thumbnail').click()
  })

  it('Start and end game', () => {
    cy.visit('localhost:3000/dashboard');
    cy.contains('Activate Quiz').click();
    cy.contains('Close').click();
    cy.contains('End Quiz').click();
  })

  it('logs out', () => {
    cy.contains('Logout').click();
  })

  it('logs back in', () => {
    cy.visit('localhost:3000/login');
    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').type(password);
    cy.contains('Login').click();
  })
});
