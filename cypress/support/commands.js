Cypress.Commands.add('signIn', (username, password) => {
    return cy.request({
        method: 'POST',
        url: `http://localhost:8081/login`,
        body: { username, password }  
    }).then((response) => {
        expect(response.status).to.eq(200);
        const token = response.body.token;
        Cypress.env('authToken', token);
        return token;
    });
});

