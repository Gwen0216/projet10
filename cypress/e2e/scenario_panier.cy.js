const apiUrl = "http://localhost:8081";
const frontendUrl = "http://localhost:8080/#/";

before(() => {
    
    cy.request("POST", `${apiUrl}/login`, {
        username: "test2@test.fr",
        password: "testtest"
    }).then((response) => {
        const token = response.body.token;
        Cypress.env("authToken", token); 
        cy.log("Token récupéré :", token);
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

describe("Vérification du panier apres ajout produit", () => {
    it("Ajouter un produit au panier et modification quantité", () => {
        cy.visit("http://localhost:8080/#/");
        
        cy.get('[data-cy="nav-link-login"]').click(); 
        cy.get('[data-cy="login-input-username"]') .type('test2@test.fr');  
                cy.get('[data-cy="login-input-password"]') .type('testtest');    
                cy.get('[data-cy="login-submit"]').click();
                cy.get('[data-cy="nav-link-cart"]').click();
        cy.visit("http://localhost:8080/#/");  
        cy.get('[data-cy="nav-link-products"]').click(); 

        // Sélectionner un produit
        cy.get('[data-cy="product-link"]').eq(6).click();

        // Récupérer le nom et le stock du produit
        cy.get('[data-cy="detail-product-name"]').should('be.visible').invoke("text").then((productName) => {
            cy.get('[data-cy="detail-product-stock"]').should('be.visible').invoke("text").then((stockText) => {

                // Extraire et convertir le stock
                const stockNr = extractStock(stockText);
                cy.log(`Produit : ${productName} | Stock initial : ${stockNr}`);

                // Vérifier que le stock est suffisant avant d'ajouter au panier
                expect(stockNr).to.be.gte(1, `Le stock du produit ${productName} doit être supérieur ou égal à 1`);

                // Ajouter le produit au panier
                cy.get('[data-cy="detail-product-add"]').click();
                cy.get('[data-cy="cart-line-name"]').should("be.visible").contains(productName);
                cy.get('[data-cy="cart-line-quantity"]').click();
                cy.get('[data-cy="cart-line-quantity"]').click();
                cy.go('back')
                const newStock = stockNr - 1 
                cy.get('[data-cy="detail-product-stock"]').invoke("text").should("match", new RegExp(newStock + " en stock"))
                
               
               
                });
            });
        });
});

describe("suppresion arcticle dans le panier",()=>{
    it("suppression",()=>{
        cy.visit("http://localhost:8080/#/");
        
        cy.get('[data-cy="nav-link-login"]').click(); 
        cy.get('[data-cy="login-input-username"]') .type('test2@test.fr');  
                cy.get('[data-cy="login-input-password"]') .type('testtest');    
                cy.get('[data-cy="login-submit"]').click();
                cy.get('[data-cy="nav-link-cart"]').click();
        cy.visit("http://localhost:8080/#/");  
        cy.get('[data-cy="nav-link-products"]').click(); 
        cy.get('[data-cy="product-link"]').eq(5).click(); 
        cy.get('[data-cy="detail-product-name"]').should('be.visible').invoke("text").then((productName) => {
            cy.get('[data-cy="detail-product-stock"]').should('be.visible').invoke("text").then((stockText) => {
                const stockNr = extractStock(stockText);
                cy.log(`Produit : ${productName} | Stock initial : ${stockNr}`);
        cy.get('[data-cy="detail-product-add"]').click(); 
        cy.get('[data-cy="cart-line-delete"]').click({ multiple: true });

    })
})
})
});

describe("quantité négative ", () => {
    it( "ajout une quantite negative",()=>{
        cy.visit("http://localhost:8080/#/");
        
        cy.get('[data-cy="nav-link-login"]').click(); 
        cy.get('[data-cy="login-input-username"]') .type('test2@test.fr');  
                cy.get('[data-cy="login-input-password"]') .type('testtest');    
                cy.get('[data-cy="login-submit"]').click();
                cy.get('[data-cy="nav-link-cart"]').click();
        cy.visit("http://localhost:8080/#/");  
        cy.get('[data-cy="nav-link-products"]').click(); 
        cy.get('[data-cy="product-link"]').eq(3).click();
        cy.get('[data-cy="detail-product-quantity"]').click();
        cy.get('[data-cy="detail-product-quantity"]').clear();
        cy.get('[data-cy="detail-product-quantity"]').type("-2");
        cy.get('[data-cy="detail-product-add"]').click();
    });
})

function extractStock(stockText) {
    cy.log(`Texte du stock récupéré : ${stockText}`);
    const match = stockText.match(/(\d+) en stock/);
    if (!match) {
        throw new Error("Stock non trouvé dans le texte :" + stockText);
    }
    return parseInt(match[1], 10);
}

describe("formulaire validation panier",()=> {
it("validation panier",()=>{
    cy.visit("http://localhost:8080/#/");
    cy.get('[data-cy="nav-link-login"]').click(); 
        cy.get('[data-cy="login-input-username"]') .type('test2@test.fr');  
                cy.get('[data-cy="login-input-password"]') .type('testtest');    
                cy.get('[data-cy="login-submit"]').click();
                cy.get('[data-cy="nav-link-cart"]').click();
        cy.visit("http://localhost:8080/#/");  
        cy.get('[data-cy="nav-link-products"]').click(); 
        cy.get('[data-cy="product-link"]').eq(7).click(); 
        cy.get('[data-cy="detail-product-add"]').click(); 
        cy.visit("http://localhost:8080/#/cart");
        cy.get('[data-cy="cart-input-lastname"]') .type('Dupond'); 
        cy.get('[data-cy="cart-input-firstname"]') .type('Julie'); 
        cy.get('[data-cy="cart-input-address"]') .type('10 rue de la paix'); 
        cy.get('[data-cy="cart-input-zipcode"]') .type('12345'); 
        cy.get('[data-cy="cart-input-city"]') .type('paris'); 
        cy.get('[data-cy="cart-submit"]').click(); 
        cy.wait(1000);
        cy.get('p.subtitle-confirm').should('be.visible').and('contain.text', 'Votre commande est bien validée'); 

});
});

describe("erreur formulaire", () => {
    it("code postal mal rempli", () => {
        cy.visit("http://localhost:8080/#/");
        cy.get('[data-cy="nav-link-login"]').click(); 
        cy.get('[data-cy="login-input-username"]').type('test2@test.fr');  
        cy.get('[data-cy="login-input-password"]').type('testtest');    
        cy.get('[data-cy="login-submit"]').click();
        
        cy.get('[data-cy="nav-link-cart"]').click();
        cy.visit("http://localhost:8080/#/");  
        cy.get('[data-cy="nav-link-products"]').click(); 

      
        cy.get('[data-cy="product-link"]').eq(7).click(); 
        cy.get('[data-cy="detail-product-add"]').click({ force: true });
        
       
        cy.visit("http://localhost:8080/#/cart");
       
        cy.get('[data-cy="cart-product"]').should('exist'); 

        cy.get('[data-cy="cart-input-lastname"]').type('Dupond'); 
        cy.get('[data-cy="cart-input-firstname"]').type('Julie'); 
        cy.get('[data-cy="cart-input-address"]').type('10 rue de la paix'); 
        cy.get('[data-cy="cart-input-zipcode"]').type('12345'); 
        cy.get('[data-cy="cart-input-city"]').type('paris'); 
        cy.get('[data-cy="cart-submit"]').click(); 
    });
});
