const apiUrl = "http://localhost:8081";
const frontendUrl = "http://localhost:8080/#/";

before(() => {
    
    cy.request("POST", `${apiUrl}/login`, {
        username: "test2@test.fr",
        password: "testtest"
    }).then((response) => {
        const token = response.body.token;
        Cypress.env("authToken", token); 
        
    });
});

Cypress.Commands.add("apiRequest", (method, endpoint, body = {}) => {
    return cy.request({
        method,
        url: `${apiUrl}${endpoint}`,
        body,
        headers: { Authorization: `Bearer ${Cypress.env("authToken")}` }
    });
});

describe("connexion", () => {
    it("se connecter", () => {
        cy.visit("http://localhost:8080/#/");
        
        cy.get('[data-cy="nav-link-login"]').click(); 
        cy.get('[data-cy="login-input-username"]') .type('test2@test.fr');  
                cy.get('[data-cy="login-input-password"]') .type('testtest');    
                cy.get('[data-cy="login-submit"]').click();
            });
        });

        describe("erreur connexion", () => {
            it("se connecter et faire une erreur", () => {
                cy.visit("http://localhost:8080/#/");
                
                cy.get('[data-cy="nav-link-login"]').click(); 
                cy.get('[data-cy="login-input-username"]') .type('test2@test');  
                cy.get('[data-cy="login-input-password"]') .type('testtest');    
                cy.get('[data-cy="login-submit"]').click();
                cy.get('[data-cy="login-errors"]').should('be.visible');
            });
         });

        describe("incription",()=>{
            it("s/'/incrire",()=>{
                cy.visit("http://localhost:8080/#/");
                cy.get('[data-cy="nav-link-register"]').click();
                cy.get('[data-cy="register-input-lastname"]') .type('Dupond'); 
                cy.get('[data-cy="register-input-firstname"]') .type('Julie'); 
                const uniqueEmail = `user${Date.now()}@gmail.com`;
                cy.get('[data-cy="register-input-email"]') .type(uniqueEmail); 
                cy.get('[data-cy="register-input-password"]') .type('12345'); 
                cy.get('[data-cy="register-input-password-confirm"]') .type('12345');
                cy.get('[data-cy="register-submit"]').click();
                    
            })
        });               

         describe("mauvaise incription",()=>{
            it("incrire mal remplie",()=>{
                cy.visit("http://localhost:8080/#/");
                cy.get('[data-cy="nav-link-register"]').click();
                cy.get('[data-cy="register-input-lastname"]') .type('Dupond'); 
                cy.get('[data-cy="register-input-firstname"]') .type('Julie'); 

                const uniqueEmail = `user${Date.now()}@gmail.com`;

                cy.get('[data-cy="register-input-email"]') .type(uniqueEmail); 
                cy.get('[data-cy="register-input-password"]') .type('12345'); 
                cy.get('[data-cy="register-input-password-confirm"]') .type('1234');
                cy.get('[data-cy="register-submit"]').click();
                cy.get('[data-cy="register-errors"]').should('be.visible');              
    })
     }); 