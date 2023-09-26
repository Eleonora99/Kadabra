const mongoose = require('mongoose'); // Richiede le funzionalità del pacchetto 'mongoose'
const Schema = mongoose.Schema;

const userSchema = new Schema({ // Crea un'istanza dello schema di mongoose
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: Number,
        default: 0
    },
    exp: {
        type: Number,
        default: 0
    },
    friends: {
        type: Array,
        default: new Array()
    },
    played_games: {
        type: Number,
        default: 0
    },
    winned_games: {
        type: Number,
        default: 0
    },
    last_seen: {
        type: Number,
        default: Date.now()
    }
}, { timestamps: true })

const User = mongoose.model('User', userSchema);

module.exports = User; // Esporta lo schema creato