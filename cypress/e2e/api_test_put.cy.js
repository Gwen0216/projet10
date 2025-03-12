let token;
const apiUrl = "http://localhost:8081"; 


before(() => {
    cy.request("POST", `${apiUrl}/login`, {
        username: "test2@test.fr",
        password: "testtest"
    }).then((response) => {
        token = response.body.token; 
        Cypress.env("authToken", token); 
        
    });
});


Cypress.Commands.add("apiRequest", (method, endpoint, body = {}) => {
  return cy.request({
      method,
      url: `${apiUrl}${endpoint}`,
      body,
      failOnStatusCode: false,
      headers: { Authorization: `Bearer ${Cypress.env("authToken")}` } 
  });
});
it("login", () => {
    cy.request("POST", `${apiUrl}/login`, {
        username: "test2@test.fr",
        password: "testtest"
    }).then((response) => {
        token = response.body.token; 
        Cypress.env("authToken", token); 
        
    });
});

it('retourne 403 quand on veut recuperer le panier sans connexion', () => {
    cy.request({
      method: 'GET',
      url: `${apiUrl}/orders`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.equal(403); 
    });
  });

  it('recuperer panier apres connexion', () => {
    cy.apiRequest('GET', '/orders').then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('orderLines');
      expect(response.body.orderLines).to.be.an('array');
      response.body.orderLines.forEach(orderLine => {
        expect(orderLine).to.have.property('id');
        expect(orderLine).to.have.property('product');
        expect(orderLine.product).to.have.property('name');
        expect(orderLine.product).to.have.property('price');
        expect(orderLine).to.have.property('quantity');
      });
    });
  });

  it('recuperer detail produit', () => {
    const productId = 3; 
    cy.apiRequest('GET', `/products/${productId}`).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('id', productId);
      expect(response.body).to.have.property('name');
      expect(response.body).to.have.property('description');
      expect(response.body).to.have.property('price');
      expect(response.body).to.have.property('picture');
    });
  });

  it('ajouter produit au panier', () => {
    const productToAdd = {
      product: 3, 
      quantity: 2
    };
     cy.apiRequest('PUT', '/orders/add', productToAdd).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an('object');
      expect(response.body).to.have.property('orderLines');
      expect(response.body.orderLines).to.be.an('array');
      const addedProduct = response.body.orderLines.find(line => line.product.id === productToAdd.product);
      expect(addedProduct).to.exist;
    });
  });

  describe('Test Ajout Produit en Rupture de Stock', () => {
    it('devrait empêcher ajout  produit en rupture de stock', () => {
      const produitRuptureStock = {
        product: 3,  
        quantity: 0   
      };
      cy.apiRequest('PUT', '/orders/add', produitRuptureStock).then((response) => {
        expect(response.status).to.be.oneOf([401]);
        expect(response.body).to.have.property('error');
        expect(response.body.error).to.include('Rupture de stock');
      });
    });
  });
  
  describe('Test Ajout d\'un Avis', () => {
    it('devrait ajouter un avis pour un produit', () => {
      const avis = {
        title: "Excellent produit",    
        comment: "Je suis très satisfait de ce produit.", 
        rating: 5                      
      };
        cy.apiRequest('POST', '/reviews', avis).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('id');
        expect(response.body).to.have.property('date');
        expect(response.body).to.have.property('title', avis.title);
        expect(response.body).to.have.property('comment', avis.comment);
        expect(response.body).to.have.property('rating', avis.rating);
      });
    });
    it('ne devrait pas ajouter un avis avec un titre vide', () => {
      const avis = {
        title: "",    
        comment: "Je suis très satisfait de ce produit.", 
        rating:5                     
      };
      cy.apiRequest('POST', '/reviews', avis).then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('error');
      });
    });
  });
    
    
    