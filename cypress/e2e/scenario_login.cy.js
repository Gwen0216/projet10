const frontendUrl = "http://localhost:8080/#/"
describe("Authentification", () => {
    beforeEach(() => {
      cy.visit(frontendUrl);
    });
  
    it("Connexion réussie", () => {
      cy.loginUI("test2@test.fr", "testtest");
      cy.url().should('eq', 'http://localhost:8080/#/');
    });
  
    it("Erreur de connexion avec mauvais email", () => {
      cy.loginUI("test2@test", "testtest");
      cy.get('[data-cy="login-errors"]').should("be.visible");
    });
  });
  
  describe("Inscription", () => {
    beforeEach(() => {
      cy.visit(frontendUrl);
    });
  
    it("Inscription réussie", () => {
      const email = `user${Date.now()}@gmail.com`;
      cy.register("Dupond", "Julie", email, "12345", "12345");
      cy.url().should('eq', 'http://localhost:8080/#/');
    });
  
    it("Erreur si mot de passe de confirmation incorrect", () => {
      const email = `user${Date.now()}@gmail.com`;
      cy.register("Dupond", "Julie", email, "12345", "1234");
      cy.get('[data-cy="register-errors"]').should("be.visible");
    });
  });
  