const apiUrl = "http://localhost:8081";
const frontendUrl = "http://localhost:8080/#/";

describe("Vérification du panier après ajout produit", () => {
    it("Ajouter un produit au panier et modification quantité", () => {
        cy.visit(frontendUrl); 
        cy.loginUI('test2@test.fr', 'testtest');
        
        cy.get('[data-cy="nav-link-cart"]').click();
        cy.get('[data-cy="nav-link-products"]').click(); 
        cy.get('[data-cy="product-link"]').eq(3).should('be.visible').click();

        cy.get('[data-cy="detail-product-name"]').should('be.visible').invoke("text").then((productName) => {
            cy.get('[data-cy="detail-product-stock"]').should('be.visible').invoke("text").then((stockText) => {

               
                const stockNr = extractStock(stockText);
                cy.log(`Produit : ${productName} | Stock initial : ${stockNr}`);

                
                expect(stockNr).to.be.gte(1, `Le stock du produit ${productName} doit être supérieur ou égal à 1`);

               
                cy.get('[data-cy="detail-product-add"]').click();
                cy.get('[data-cy="cart-line-name"]').should("be.visible").contains(productName);
                cy.get('[data-cy="cart-line-quantity"]').eq(0).click(); 
                cy.get('[data-cy="cart-line-quantity"]').eq(0).click();;
                cy.go('back')
                const newStock = stockNr - 1 
                cy.get('[data-cy="detail-product-stock"]').invoke("text").should("match", new RegExp(newStock + " en stock"))
                
               
               
                });
            });
        });
});


describe("Suppression article dans le panier", () => {
    it("Suppression", () => {
        cy.visit(frontendUrl);
        cy.loginUI('test2@test.fr', 'testtest');
        cy.get('[data-cy="nav-link-cart"]').click();
        cy.get('[data-cy="nav-link-products"]').click(); 
        cy.get('[data-cy="product-link"]').eq(3).click(); 
        cy.get('[data-cy="detail-product-name"]').should('be.visible').invoke("text").then((productName) => {
            cy.get('[data-cy="detail-product-stock"]').should('be.visible').invoke("text").then((stockText) => {
                const stockNr = extractStock(stockText);
                cy.log(`Produit : ${productName} | Stock initial : ${stockNr}`);
        cy.get('[data-cy="detail-product-add"]').click(); 
        cy.get('[data-cy="cart-line-delete"]').each(($el) => {
            cy.wrap($el).click();
        });
    });
    });
    });
});

describe("Quantité négative", () => {
    it("Ajout une quantité négative", () => {
        cy.visit(frontendUrl);
        cy.loginUI('test2@test.fr', 'testtest');
        cy.get('[data-cy="nav-link-cart"]').click();
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

describe("Validation formulaire panier", () => {
    it("Validation panier", () => {
        cy.visit(frontendUrl);
        cy.loginUI('test2@test.fr', 'testtest');
        cy.get('[data-cy="nav-link-cart"]').click();
        cy.get('[data-cy="nav-link-products"]').click(); 
        cy.get('[data-cy="product-link"]').eq(7).click(); 
        cy.get('[data-cy="detail-product-add"]').click({ force: true });
        cy.intercept('POST', '/api/cart').as('addToCart'); 
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

describe("Erreur formulaire", () => {
    it("Code postal mal rempli", () => {
        cy.visit(frontendUrl);
        cy.loginUI('test2@test.fr', 'testtest');
        cy.get('[data-cy="nav-link-cart"]').click();
        cy.get('[data-cy="nav-link-products"]').click(); 
        cy.get('[data-cy="product-link"]').eq(7).click(); 
        cy.get('[data-cy="detail-product-add"]').click({ force: true });
        cy.intercept('POST', '/api/cart').as('addToCart'); 
        cy.get('[data-cy="detail-product-add"]').click();
        cy.visit("http://localhost:8080/#/cart");
        cy.get('[data-cy="cart-input-lastname"]').type('Dupond'); 
        cy.get('[data-cy="cart-input-firstname"]').type('Julie'); 
        cy.get('[data-cy="cart-input-address"]').type('10 rue de la paix'); 
        cy.get('[data-cy="cart-input-zipcode"]').type('1235'); 
        cy.get('[data-cy="cart-input-city"]').type('Paris'); 
        cy.get('[data-cy="cart-submit"]').click();
        cy.get('label.error').contains('Code postal').should('have.css', 'color', 'rgb(234, 15, 15)');
    });
});

