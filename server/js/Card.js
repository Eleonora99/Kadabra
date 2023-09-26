class Card{
    constructor(name, number, suit, color, action, ability, range, quantity, img, id){
        this.name = name;
        this.number = number;
        this.suit = suit;
        this.color = color;
        this.action = action;
        this.ability = ability;
        this.range = range;
        this.quantity = quantity;
        this.img = img;
        this.id = id;
    }
}

module.exports = Card;