describe('Login Page', () => {
    beforeEach(() => {


        cy.visit('https://ricky-morty-fan-page.vercel.app/login')
    })

    function login(username, password) {
        cy.get(".login-input.user-name").clear().type(username)
        cy.get('.login-input.password').clear().type(password)
        cy.get('[data-cta="login"]').click()
    }

    it('TC001', () => {
        const username = ['root_user@gmail.com', 'system_user@gmail.com']
        const password = ['root_password@gmail.com', 'system_password@gmail.com']

        for (let i = 0; i < 2; i++) {

            login(username[i], password[i])
            cy.get('.login-input.user-name').should('be.not.exist')
            cy.get('.logout').click()
        }
    })

    it('TC002', () => {
        const username = ['root_user@gmail.com', 'system_user@gmail.com']
        const wrongPassword = ['root_password@gmail.co', 'ystem_password@gmail.com']

        for (let i = 0; i < 2; i++) {

            login(username[i], wrongPassword[i])
            cy.get('[data-cta="login"]').click()
            cy.get('.login-error').should('have.text', 'Wrong password')
        }
    })

    it('TC003', () => {
        const wrongUsername = ['root_user@gmail.co', 'ystem_user@gmail.com']
        const password = ['root_password@gmail.com', 'system_password@gmail.com']

        for (let i = 0; i < 2; i++) {

            login(wrongUsername[i], password[i])
            cy.get('.login-error').should('have.text', 'User not found')
        }
    })

    it('TC004', () => {

        login('system_user@gmail.com', 'system_password@gmail.com')
        cy.reload()
        cy.get('.login-input.user-name').should('be.not.exist')
    })

    it('TC005', () => {

        login('system_user@gmail.com', 'system_password@gmail.com')
        cy.get('.logout').click()
        cy.reload()
        cy.get('[data-cta="login"]').should('be.visible')
    })
})
