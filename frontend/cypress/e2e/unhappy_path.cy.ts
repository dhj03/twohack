describe('Registers, Create a new game, Logouts, Registers with same email', () => {
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

  it('logs out', () => {
    cy.contains('Logout').click();
  })

  it('Registers with same email', () => {
    cy.visit('localhost:3000/register');
    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').type(password);
    cy.get('input[type="text"]').type(name);
    cy.contains('Register').click();
  })
});
