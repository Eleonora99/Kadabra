const Card = require('./Card');

class Deck {
    constructor(mazzo) {
        this.deck = new Array();
        this.character_deck = new Array();
        this.createDeck(mazzo);
    }

    createDeck(mazzo) { // Metodo per creare un mazzo a partire dalla lista di carte fornita
        var id = 0
        for (let c of mazzo) {
            let card = new Card(c.name, c.number, c.suit, c.color, c.action, c.ability, c.range, c.quantity, c.img, ++id); 
            if (card.suit == 'Base')
                this.character_deck.push(card);
            else
                this.deck.push(card);
        }
    }

    shuffle() { // Metodo che mescola gli elementi di un array
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
        return this.deck;
    }

    draw() { // Metodo per pescare dal mazzo
        return this.deck.shift();
    }
}

module.exports = Deck;