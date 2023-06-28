import faker from 'faker';
describe('Search and filter', () => {

    beforeEach(() => {
        cy.visit('https://ricky-morty-fan-page.vercel.app/login')
        cy.get(".login-input.user-name").type('root_user@gmail.com')
        cy.get('.login-input.password').type('root_password@gmail.com')
        cy.get('[data-cta="login"]').click()
        cy.intercept('GET', /\/character\//).as('apiRequest');
    })
    function checkCardsNames(expectText) {
        cy.get('[data-character-id]').each(($element, index) => {
            cy.wrap($element).find('h6')
                .should(($name) => {
                    const text = $name.first().text().trim();
                    expect(text).to.equal(expectText[index]);
                });
        });
    }

    it('TC006', () => {
        cy.get('[data-input="search"]').type('Jerry Smith')
        cy.get('[title="Loading..."]').should('not.exist');
        // cy.wait('@apiRequest');
        cy.get('[data-character-id]').its('length').should('eq', 3)
        checkCardsNames(['Jerry Smith', 'Jerry Smith', 'Jerry Smith'])
    })

    it('TC007', () => {

        cy.get('[data-input="search"]').type('Morty')
        cy.wait('@apiRequest');
        cy.get('[title="Loading..."]').should('not.exist');
        cy.get('[data-character-id]').its('length').should('eq', 4)

        checkCardsNames(["Morty Smith", "Alien Morty", "Antenna Morty", "Aqua Morty"])

        cy.get('button').eq(3)
            .filter('[class*="Pagination_"]')
            .then(($buttons) => {
                cy.get($buttons).should('have.text', '1')
            });

        cy.get('[data-page]').should('have.length', 5)
        cy.get('[data-item-value="all_characters"]').click()
        cy.get('[data-item-value="female_characters"]').click()
        cy.get('[title="Loading..."]').should('not.exist');
        //   cy.wait('@apiRequest');
        cy.get('[data-character-id]').its('length').should('eq', 3)
        checkCardsNames(["Morty’s Disguise", "Morty’s Mother-in-law", "Morty’s Girlfriend"])
    })


    it('TC008', () => {
        cy.get('[data-input="search"]').type('A Rick')
        cy.get('[title="Loading..."]').should('not.exist');
        //cy.wait('@apiRequest');
        cy.get('[data-character-id]').its('length').should('eq', 3)
        checkCardsNames(["Antenna Rick", "Aqua Rick", "Zeta Alpha Rick"])

        cy.get('[data-section="character-status-selector"]').children().children().eq(1).click()
        cy.get('[title="Loading..."]').should('not.exist');
        // cy.wait('@apiRequest');
        cy.get('[data-character-id]').its('length').should('eq', 1)
        checkCardsNames(["Zeta Alpha Rick"])
    })

    it('TC009', () => {

        const exchars = new Array(4);

        cy.get('[data-character-id]').its('length').should('eq', 4)
            .then((l) => {
                for (let i = 0; i < l; i++) {
                    cy.get('[data-character-id]').eq(i).find('h6').first().then(($h6) => {
                        exchars[i] = $h6.text();
                    });
                }
            });
        cy.get('[data-input="search"]').type('Beth')
        cy.get('[data-section="character-status-selector"]').children().children().eq(2).click()
        cy.get('[title="Loading..."]').should('not.exist');
        // cy.wait('@apiRequest');
        cy.get('[data-character-id]').its('length').should('eq', 3)
        checkCardsNames(["Goddess Beth", "Young Beth", "Young Beth"])

        cy.contains('button', 'Reset Filter').click();
        cy.get('[data-character-id]').its('length').should('eq', 4)
        checkCardsNames(exchars)
    })

    it('TC010', () => {
        const rtext = faker.name.findName();
        cy.get('[data-input="search"]').type(rtext)
        // cy.wait('@apiRequest');
        cy.get('[title="Loading..."]').should('not.exist');
        cy.get('[role="dialog"]').children().eq(1).should('have.text', 'Characters Not Found')
    })

    it('TC011', () => {
        let image1,name,gender,status;

        cy.get('[data-character-img-src]').its('length').then((l) => {
            for (let i = 0; i < l; i++) {
                cy.get('[data-character-img-src]').eq(i).invoke('attr', 'src').then((src) => {
                    cy.request(src).then((ri1) => {
                        image1 = ri1.body;
                    });
                });
                cy.get('[data-character-id]').eq(i).find('h6').first().then(($h6) => {
                    name = $h6.text();
                });
                cy.get('[data-character-id]').eq(i).find('h6').eq(1).then(($h6) => {
                    status = $h6.text();
                });
                cy.get('[data-character-id]').eq(i).find('h6').last().then(($h6) => {
                    gender = $h6.text();
                });

                cy.get('[data-character-img-src]').eq(i).click()
                //  cy.wait('@apiRequest');
                cy.get('[title="Loading..."]').should('not.exist');

                cy.get('img').invoke('attr', 'src').then((src) => {
                    cy.request(src).then((ri2) => {
                        const image2 = ri2.body;
                        expect(image1).to.equal(image2);
                    });
                });

                cy.get('h2').eq(0).invoke('text').then((name2) => {
                    expect(name2.trim()).to.equal(name);
                });

                cy.get('h6').eq(0).invoke('text').then((gender2) => {
                    expect(gender).to.equal(gender2.trim());
                });

                cy.get('h6').eq(1).invoke('text').then((status2) => {
                    expect(status).to.equal(status2.trim());
                });
                cy.go(-1);
                // cy.wait('@apiRequest');
            }
        });
    })
})
