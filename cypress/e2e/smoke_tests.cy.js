describe('Smoke Tests', () => {

    // Test de la page de connexion
    describe('Page de Connexion', () => {
      beforeEach(() => {
        cy.visit('http://localhost:8080/#/login');  
        cy.wait(2000); 
      });
  
      it('Vérifie la présence des champs et boutons de connexion', () => {
        cy.get('[data-cy="login-input-username"]').should('be.visible');  
        cy.get('[data-cy="login-input-password"]').should('be.visible');  
        cy.get('[data-cy="login-submit"]').should('be.visible').and('contain', 'Se connecter'); 
      });
  
      it('Effectuer une connexion', () => {
        cy.get('[data-cy="login-input-username"]').type('test2@test.fr');  
        cy.get('[data-cy="login-input-password"]').type('testtest');  
        cy.get('[data-cy="login-submit"]').click();  
  
        cy.wait(3000); 
        cy.url().should('include', '/#');  
      });
    });
  
    // Test de la page produit
    describe('Page Produit', () => {
      beforeEach(() => {
        cy.visit('http://localhost:8080/#/login'); 
        cy.wait(2000); 
        cy.get('[data-cy="login-input-username"]').type('test2@test.fr');  
        cy.get('[data-cy="login-input-password"]').type('testtest');  
        cy.get('[data-cy="login-submit"]').click();  
        cy.wait(3000);  
      });
  
      it('Vérifie la présence du bouton "Ajouter au panier"', () => {
       
        cy.visit('http://localhost:8080/#/products/3'); 
        cy.wait(2000); 
    
        
        cy.get('[data-cy="detail-product-add"]').should('be.visible');  
    
       
        cy.get('[data-cy="detail-product-add"]').click();  
    
    });
    
  
      it('Vérifie la présence du champ de disponibilité du produit', () => {
        cy.visit('http://localhost:8080/#/products/3');  
        cy.wait(2000); 
        cy.get('[data-cy="detail-product-stock"]').should('be.visible'); 
      });
    });
  
  });
  