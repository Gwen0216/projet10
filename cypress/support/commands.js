
Cypress.Commands.add('signIn', (username, password) => {
    
  
    return cy.request({
      method: 'POST',
      url: `http://localhost:8081/login`,
      body: { username, password },
      failOnStatusCode: false // Évite plantage si erreur API, à gérer manuellement
    }).then((response) => {
      expect(response.status).to.eq(200);
  
      const token = response.body.token;
      Cypress.env('authToken', token);
  
     
      return token;
    });
  });
  

  Cypress.Commands.add("loginUI", (username, password) => {
    cy.get('[data-cy="nav-link-login"]').click();
    cy.get('[data-cy="login-input-username"]').type(username);
    cy.get('[data-cy="login-input-password"]').type(password);
    cy.get('[data-cy="login-submit"]').click();
    
  });
  
 
  Cypress.Commands.add("loginPersisted", (username, password) => {
    cy.session([username, password], () => {
      cy.signIn(username, password);
    });
  });
  
  
  Cypress.Commands.add("register", (lastname, firstname, email, password, confirmPassword) => {
    
  
    cy.get('[data-cy="nav-link-register"]').click();
    cy.get('[data-cy="register-input-lastname"]').type(lastname);
    cy.get('[data-cy="register-input-firstname"]').type(firstname);
    cy.get('[data-cy="register-input-email"]').type(email);
    cy.get('[data-cy="register-input-password"]').type(password);
    cy.get('[data-cy="register-input-password-confirm"]').type(confirmPassword);
    cy.get('[data-cy="register-submit"]').click();
  });
  
  // 📦 Requête API avec token d'authentification
  Cypress.Commands.add("apiRequest", (method, endpoint, body = {}) => {
    const token = Cypress.env("authToken");
  
    return cy.request({
      method,
      url: `http://localhost:8081${endpoint}`,
      body,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  });
  
  


