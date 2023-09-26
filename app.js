/////////////////////////////////////////
//            Server Setup             //
/////////////////////////////////////////

// Richiedo dei moduli di NodeJS salvati in locale
const path = require('path');
const http = require('http');
const express = require('express');
const session = require('express-session');
const socketIO = require('socket.io');

// Inizializzo le informazioni del Server
const publicPath = path.join(__dirname, '/client/public'); // Definisco il percorso della cartella 'public' contentente elementi statici (immagini e fogli di stile)
const port = process.env.PORT || 2000;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath));
app.use(session({ secret: 'supersecretsessionid123', resave: false, saveUninitialized: true}))

/////////////////////////////////////////
//        Collegamento Database        //
/////////////////////////////////////////

const mongoose = require('mongoose');
const User = require('./db_models/user'); // definisco la struttura di User
const db = 'mongodb+srv://Progetto_LTW:kadabra21@cluster0.1kea9.mongodb.net/Kadabra?retryWrites=true&w=majority';
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true }) // Attendo la connessione al database ed in caso di successo metto in ascolto il server sulla porta definita
    .then((result) => {
        console.log('Server connesso al Database');
        server.listen(port, () => {
        console.log('Server in ascolto sulla porta: '+ port);
        })
    })
    .catch((err) => console.log(err));

/////////////////////////////////////////
//            Richieste URL            //
/////////////////////////////////////////

// Il modulo Express prende le richieste URL, le elabora (ove necessario) ed invia al client il file richiesto
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client/index.html');
});

app.get('/login', (req, res) => {
    req.session.user = null;
    res.sendFile(__dirname + '/client/login.html');
});

app.get('/menu', (req, res) => {
    if(!req.session.user){ // Se nella sessione del client non è presente il campo utente valido, allora viene reindirizzato alla pagina di login
        return res.redirect('/login?error=' + encodeURIComponent('Non sei Loggato'));
    }
    res.sendFile(__dirname + '/client/menu.html');
});

app.get('/table', (req, res) => {
    if(!req.session.user){ // Controllo se il client ha effettuato il login
        return res.redirect('/login?error=' + encodeURIComponent('Non sei Loggato'));
    }
    res.sendFile(__dirname + '/client/tavolo.html');
});

app.get('/profile', (req, res) => {
    if(!req.session.user){ // Controllo se il client ha effettuato il login
        return res.redirect('/login?error=' + encodeURIComponent('Non sei Loggato'));
    }
    res.sendFile(__dirname + '/client/profile.html');
});

app.get('/help', (req, res) => {
    if(!req.session.user){ // Controllo se il client ha effettuato il login
        return res.redirect('/login?error=' + encodeURIComponent('Non sei Loggato'));
    }
    res.sendFile(__dirname + '/client/help.html');
});

app.get('/inventario', (req, res) => {
    if(!req.session.user){ // Controllo se il client ha effettuato il login
        return res.redirect('/login?error=' + encodeURIComponent('Non sei Loggato'));
    }
    res.sendFile(__dirname + '/client/inventario.html');
});

app.get('/leaderboard', (req, res) => {
    if(!req.session.user){ // Controllo se il client ha effettuato il login
        return res.redirect('/login?error=' + encodeURIComponent('Non sei Loggato'));
    }
    res.sendFile(__dirname + '/client/leaderboard.html');
});

app.get('/game', (req, res) => {
    if(!req.session.user){ // Controllo se il client ha effettuato il login
        return res.redirect('/login?error=' + encodeURIComponent('Non sei Loggato'));
    }
    res.sendFile(__dirname + '/client/game.html');
});

/////////////////////////////////////////
//       Richieste Register/Login      //
/////////////////////////////////////////

const bcrypt = require('bcryptjs'); // Richiama un modulo node js che cripta stringhe
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post('/signup', (req, res) => { // Riceve il modulo di registrazione

    User.findOne({ username: req.body.username }, async function(err, user) { // Controllo che l'username non sia già presente nel database con una query sull'username immesso
        if(err) {
            console.log(err);
            return res.status(500).send();
        }
        if(!user) { // Se l'utente non esiste
            const salt = await bcrypt.genSalt(8); // Definisce l'algoritmo di crittatura
            const hashedPassword = await bcrypt.hash(req.body.password, salt); // cripta la password fornita dall'utente
            const user = new User({ // Creo un nuovo utente sulla base del modello fornito
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword // Inserisco la password codificata
            });
            user.save() // Salva l'utente nel database
                .then(() => { // Al completamento dell'operazione chiedo al client di loggare
                    return res.redirect('/login?error=' + encodeURIComponent('Registrazione Effettuata, fare Login'));
                })
                .catch((err) => {
                    console.log(err);
                });
        }
        else{ // Se l'utente è già presente nel database, la pagina viene ricaricata con un erorre che avvisa il client
            return res.redirect('/login?error=' + encodeURIComponent('Username non disponibile'));
        }
    });
});

app.post('/login', (req, res) => { // Riceve il modulo di login
    User.findOne({ username: req.body.username }, async function(err, user) { // Cerco l'utente nel database con una query sull'username fornito
        if(err) {
            console.log(err);
            return res.status(500).send();
        }
        if(!user) { // Se l'utente non esiste ricarico la pagina con un errore che avvisa il client
            return res.redirect('/login?error=' + encodeURIComponent('Utente non trovato'));
        }
        else{ // Se l'utente esiste controllo che sia stata inserita la password corretta
            const match = await bcrypt.compare(req.body.password, user.password); // Funzione booleana, verifica se la password fornita è compatibile con la password di quell'utente codificata nel databasee
            if(match){ // Se c'è corrispondenza
                req.session.user = user; // Registra l'utente nella sessione attuale
                res.cookie('user', JSON.stringify(user)); // Salva le informazioni dell'utente loggato in un cookie
                return res.redirect('/menu'); // Reindirizza il client al menù
            }
            else{ // Se non c'è corrispondenza nelle password, ricarica la pagina con un errore che notifica il client
                return res.redirect('/login?error=' + encodeURIComponent('Password non corretta'));
            }
        }
    });
});

/////////////////////////////////////////
//            Richiesta Moduli         //
/////////////////////////////////////////

var setup = require('./server/js/setupper.js');
var util = require('./server/js/utility.js');
var card_list = require('./server/js/card_list');

var Player = require('./server/js/Player.js'); 
var Table = require('./server/js/Table.js');
var Game = require('./server/js/Game.js');
var Deck = require('./server/js/Deck');

const { nanoid } = require('nanoid')

/////////////////////////////////////////
//          Costanti e Variabili       //
/////////////////////////////////////////

const i_used = new Array; // Conterrà gli indici occupati della lista tables
const tables = new Array; // Raccolta dei tavoli attivi
const games = new Array; // Raccolta delle partite attive

/////////////////////////////////////////
//          Listener Server            //
/////////////////////////////////////////

io.on('connect', (client) => { // Blocco che viene eseguito quando il server rileva una connessione socket da un

    /***************************************************************************************************************************\ 
    |                                     Gestione dati del client e Interazioni con il database                                |
    \***************************************************************************************************************************/
    
    client.emit('reqClientInfo'); // Richiede al client appena connesso di mandare indietro il contenuto di alcuni cookies (definita nel client)
    
    client.on('refreshClientData', (cookieUser, table) => { // Appena riceve i dati dal client, li salva temporaneamente nell'oggetto che lo rappresenta nella connessione socket
        client.user = cookieUser;
        if(tables[table] != undefined && tables[table] != null){ // Se è stato fornito anche il cookie contenente un tavolo valido
            client.table = tables[table]; // Salvo i dati del tavolo nell'oggetto client
            if(tables[table].sockets.find(c => c == cookieUser.username) == undefined){ // Se il client non è presente nella lista dei giocatori di quel tavolo
                joinTable(client, client.table); // Lancia una funzione che lo connette a quel tavolo
            }
        }
        if(games[table] != undefined && games[table] != null){ // Se è presente una partita in quel tavolo
            client.player = games[table].giocatori.find(g => g.username == cookieUser.username); // Se il client è nella lista dei giocatori di una partita, vengono salvate nell'oggetto le informazioni relative al suo personaggio
        }
    }); // Questi due eventi servono ad avere sesmpre l'oggetto client aggiornato, nel caso di una perdita di connessione o di cambio pagina

    client.on('getUserData', (query, sort) => { // Evento che prende come argomento una query e una sort
        User.find(query).sort(sort).exec(function(err, result){ // Effetua un controllo nel database
            if (err) throw err;
            client.emit('userData', result); //  Ritorna un evento con il risultato al client richiedente la query
        });
    });

    client.on('setUserData', (query, newData) => { // Evento che prende come argomenti una query e nuovi dati per aggiornare il database
        User.updateOne(query, newData, function(e, res) { // Cerca e aggiorna un elemento nel database
            if (e) throw e;
            User.find(query).exec(function(err, result){ // Ricerca l'utente aggiornato
                if (err) throw err;
                client.emit('userData', result); //  Ritorna un evento con il risultato dell'update al client richiedente
            });
        });
    });

    client.on('addFriend', (user, query, check) => { // Evento che si occupa della lista amici
        if(user.username == check){ return; } // Controlla che il client non stia aggiungendo sè stesso
        User.findOne({ username: check }, async function(e, u) { // Controlla se esiste l'utente che si sta cercando di aggiungere
            if(e) {
                console.log(e);
                return;
            }
            if(!u) {
                return; // Se l'utente non esiste non accade nulla
            }
            await User.updateOne(user, query, function(e, r) { // Se l'utente esiste e non è già nella lista amici del client (controllo effettuato dalla query), viene aggiunto al database
                if (e) throw e;
            });
            await User.find(user,  function(err, result){ // Cerca l'utente (in questo caso il client stesso)
                if (err) throw err;
                client.emit('userData', result); // Ritorna al client i suoi dati aggiornati
            });  
        });
    });

    client.on('removeFriend', (user, query) => { // Evento per rimuovere un utente dalla lista amici del client
        User.updateOne(user, query, function(e, r) { // Rimuove l'amico dalla lista amici
            if (e) throw e;
            User.find(user, function(err, result){ // Cerca l'utente (in questo caso il client stesso)
                if (err) throw err;
                client.emit('userData', result); // Ritorna al client i suoi dati aggiornati
            });        
        });
    });

    /***************************************************************************************************************************\ 
    |                                           Creazione Tavoli e Gestione delle stanze                                        |
    \***************************************************************************************************************************/

    client.on('create table', () => { // Evento che genera un nuovo Tavolo
        const tablePos = util.getIndice(i_used); // Utilizza una funzione ausiliaria che tiene traccia degli indici usati e ne assegna uno libero
        const tableID = nanoid(4); // Genera un codice di 4 caratteri
        const table = new Table(tableID,tablePos,[],false); // Creo un nuovo Oggetto di classe Table
        i_used.push(table.pos); // Aggiungo l'indice del tavolo a quelli utilizzati
        tables[table.pos] = table; // aggiungo il nuovo tavolo alla lista dei tavoli nell'indice assegnato
        client.emit('redirect', '/table#' + encodeURIComponent(table.id), table.pos); // Reindirizza il client al tavolo appena creato insieme all'indice del tavolo che verrà salvato in un cookie dal client
    });

    client.on('join table', (tableid) => { // Evento che connette il client ad un tavolo

        const table = tables.find(tavolo => tavolo.id == tableid); // Cerca se esiste il tavolo a partire dell'id fornito dal client

        if(table == undefined){ return; } // Se non esiste non succede niente
        else{
            client.emit('redirect', '/table#' + encodeURIComponent(table.id), table.pos); // Se esiste, reindirizza il client al tavolo e fornisce le informazioni da scrivere nel cookie
        }
    });

    client.on('chat message', (msg) => { // Riceve un messaggio di chat dal client
        let mittente = client.user.username; // Imposta il nome del mittente
        if(client.table.inGame && msg == '/end'){ // Messaggio che simula un fine partita se è in corso
            client.player.status = 'Winner'; // Decreta vincitore il client che ha scritto il comando
            io.in(client.table.id).emit('prep end game', client.user.username); // Induce il messaggio di fine partita a tutti i giocatori al tavolo con il nome del vincitore 
            return;
        }
        io.in(client.table.id).emit('chat message', msg, 'messaggio_pubblico', mittente); // Inoltra il messaggio a tutte le chat dei giocatori al tavolo del client con il relativo mittente
    });

    const joinTable = (client, table) => { // Funzione che connette il client alla stanza virtuale e invia feedback agli altri giocatori al tavolo
        client.join(table.id); // Funzionalità di Socket.IO (modulo di Node.js) connette l'oggetto client ad un canale privato e identificato dall'ID del tavolo a cui è connesso
        table.sockets.push(client.user.username); // Aggiunge l'username del client alla lista dei giocatori connessi a quel tavolo
        io.in(table.id).emit('table update', table); // Invia i dati del tavolo aggiornati (dopo la connessione del client) a tutti gli altri client connessi allo stesso tavolo
        client.emit('chat message', table.id, 'connessione_tavolo'); // Genera un messaggio in chat al client che notifica l'avvenuta connessione al tavolo
        client.to(table.id).emit('chat message', client.user.username, 'connessione'); // Genera un messaggio in chat a tutti i client connessi al tavolo, che notifica la connessione di un nuovo utente 
        io.in(table.id).emit('aggiorna lista', client.user.username, 'aggiungi'); // Aggiorna la lista (visibile nell'html) dei giocatori connessi al tavolo di tutti i presenti
    }

    const leaveTable = (client, table) => { // Disconnette il client da un tavolo
        client.leave(table.id); // Disconnette con Socket.IO il client dalla stanza privata
        io.in(table.id).emit('chat message', client.user.username, 'disconnessione'); // Notifica gli altri al tavolo della disconnessione
        io.in(table.id).emit('aggiorna lista', client.user.username, 'rimuovi'); // Rimuove il nome del client dalla lista (visibile nell'html) dei giocatori al tavolo
        table.sockets = table.sockets.filter((item) => item != client.user.username); // Filtra la lista degli username connessi al tavolo in modo da rimuovere il client appena disconnesso
        client.table = null; // Elimina le informazioni del tavolo dall'oggetto client
        if (table.sockets.length == 0 && !table.inGame){ // Controlla se al tavolo non sono più giocatori connessi e non sia in corso una partita su quel tavolo
            var index = i_used.indexOf(table.pos); // Cerca l'indice dell'ID del vecchio tavolo nella lista di ID usati
            delete tables[table.pos]; // Elimina il tavolo
            i_used.splice(index, 1); // Rende nuovamente disponibile l'ID del tavolo eliminato
        }
        else{
            io.in(table.id).emit('table update', table); // Se al tavolo c'è ancora qualcuno connesso, invia le informazioni del tavolo aggiornate ai giocatori rimasti
        }
    };

    client.on('end game', () => { // Evento che aggiorna i dati (nel database) del client che ha terminato la partita come Vincitore o Sconfitto
        if(client.player.status == 'Winner'){ // Statistiche guadagnate da un giocatore 'Vincitore'
            User.updateOne({ username: client.user.username }, { $inc: { exp: 10, played_games: 1, winned_games: 1 } },function(err, user) {
                if(err) {
                    console.log(err);
                    return;
                }
                if(!user) {
                    return false;
                }
            });
        }
        else if(client.player.status == 'Loser'){ // Statistiche guadagnate da un giocatore 'Sconfitto'
            User.updateOne({ username: client.user.username }, { $inc: { exp: 5, played_games: 1 } },function(err, user) {
                if(err) {
                    console.log(err);
                    return;
                }
                if(!user) {
                    return false; 
                }
            });
        }
        client.player = null; // Resetto le informazioni di gioco dell'oggetto client
        client.emit('redirect', '/table#' + encodeURIComponent(client.table.id)); // Reindirizza il giocatore al tavolo al quale era connesso
    });

    client.on('disconnect', () => { // Evento chiamato alla disconnessione del client dalla connessione socket
        if(client.table != null && client.table != undefined){ // Se il client era connesso ad un tavolo attivo
            leaveTable(client, client.table); // Disconnette il client dal tavolo
        }
    });

    /***************************************************************************************************************************\ 
    |                                                   Gestione Eventi di Gioco                                                |
    \***************************************************************************************************************************/

    // NB: Il seguente codice è stato scritto seguendo il regolamento studiato per il gioco di carte Kadabra!, alcune parti potrebbero non risultare chiare

    client.on('start game', () => { // Questo evento viene chiamato quanto un client preme il bottone 'start game' al tavolo ed ha la funzione di creare la partita

        // Avvia il setup della partita in base al numero dei giocatori connessi al tavolo
        const tavolo = client.table;
        const numero_giocatori = tavolo.sockets.length;
        var mazzi = new Deck(card_list); // Creo un mazzo a partire dalla lista di carte
        var main_deck = util.shuffle(mazzi.deck);
        var character_deck = util.shuffle(mazzi.character_deck);
        var ruoli = setup.ruoli(numero_giocatori);
        var ruolitmp = util.shuffle(ruoli);
        ruoli = util.shuffle(ruolitmp);
        var posti = new Array;
        const gameID = nanoid(6);
        var game = new Game(tavolo,gameID,[],numero_giocatori,main_deck,[],null,[],[]); // Creo un'istanza della classe 'Game' che conterrà tutte le informazioni della partita
        io.in(client.table.id).emit('redirect', '/game#' + encodeURIComponent(client.table.id), gameID); // Reindirizzo tutti i client del tavolo alla partita insieme al codice identificativo che verrà salvato in un cookie
        tavolo.inGame = true; // Imposto come 'Occupato' il tavolo corrispondente

        for(i=0; i<numero_giocatori; i++){ // Crea un ordine di posti in base al numero di giocatori
            posti.push(i);
        }
        
        posti = util.shuffle(posti); // Mischia i posti

        for (let username of tavolo.sockets){ // Creo per ogni giocatore al tavolo un'istanza di 'Player' che conterrà tutte le informazioni del client relative alla partita attuale
            let ruolo = ruoli.shift();
            let posto = posti.shift();
            let personaggio = character_deck.shift();
            let vita = parseInt(personaggio.quantity); 
            let player = new Player(username,ruolo,gameID,posto,personaggio,vita,vita,true,[],[],'disarmato',1,0,0,false,false,true,'inGame');
            setup.addExtraRules(player); // Aggiunge al giocatore delle statistiche extra se rientra in dei casi speciali
            game.giocatori.push(player); // Aggiunge l'oggetto player all'interno della lista dei giocatori della partita
        }

        games[client.table.pos] = game; // Aggiunge la partita alla lista delle partite attive nell'indice del tavolo

        setTimeout(() => { // Dopo 2 secondi avvia il 'setup grafico' nei client
            io.in(tavolo.id).emit('start game');
            io.in(tavolo.id).emit('update deck', game.deck.length);
            io.in(tavolo.id).emit('testo', (game.giocatori.find(g => g.ruolo == 'Re').username + " è il Re e quindi il primo a giocare!"));    
        }, 2000);
    });

    client.on('assegna posti', () => { // Ordina i posti in modo che ogni client si trovi 'seduto' durante il gioco nella parte bassa del proprio schermo, ma mantiene l'ordine dei posti stabilito nel setup
        var newPosti = new Array;
        var rawPosti = games[client.table.pos].giocatori;
        newPosti = util.postiRelativi(rawPosti, client.player.posto);
        client.emit('posti assegnati', newPosti);
    });

    client.on('mano iniziale', () => { // La mano iniziale di ogni giocatore è data dal numero delle sue vite nel gioco
        var n = client.player.vite_max;
        pesca(client,n);
    });

    client.on('pesca carta', (n) => { // Quando il client richiede di pescare, il server prende una carta dal mazzo rispettivo e la manda al giocatore
        for(i=0;i<n;i++){
            let pescata = games[client.table.pos].deck.shift();
            client.emit('pesca carta', pescata);    
        }
    });

    const pesca = (client, quante) => { // Funzione per pescare dal mazzo
        for(i=0;i<quante;i++){
            sleep(1000).then(() => {
                let pescata = games[client.table.pos].deck.shift();
                client.emit('pesca carta', pescata);
                io.in(client.table.id).emit('update deck', games[client.table.pos].deck.length);
            });
        }
    }

    client.on('pesco emporio', (posti, cardID) => { // Risolve l'effetto 'emporio' che consiste nel pescare tante carte (scoperte) quanti sono i gicatori ed in senso orario ognuno ne prende una
        if(client.player.isReacting == 'toEmporio'){
            let game =  games[client.table.pos];
            let carta = util.getCard(cardID);
            io.in(client.table.id).emit('update cards', null, carta, 'RimuoviExtra');
            client.emit('pesca carta', carta);
            io.in(client.table.id).emit('update mano', client.user.username, client.player.mano.length);
            risolvi(game,client,game.carta_attiva,posti[0].nextPlayer);
        }
        else{return;}
    });

    client.on('gioca carta', (idCarta) => { // Gestisce le richieste del client quando prova a giocare delle carte ed in base alle regole del gioco il server permette o vieta l'azione
        if(client.player.isReacting != false){
            let reaction = client.player.isReacting;
            let carta = util.getCard(idCarta);
            let game = games[client.table.pos];
            switch (reaction){
                case 'toColpo':
                    if(carta.name == 'Mancato!'){
                        rimuoviDaMano(carta, client);
                        io.in(client.table.id).emit('update cards', client.user.username, carta, 'Extra');
                        game.zona_extra.push(carta);
                        client.player.isReacting = 'mancato';
                        risolvi(game ,client,game.carta_attiva,client.user.username);
                    }
                    return;
                case 'toIndiani':
                    if(carta.name == 'Bang!'){
                        rimuoviDaMano(carta, client);
                        io.in(client.table.id).emit('update cards', client.user.username, carta, 'Extra');
                        game.zona_extra.push(carta);
                        client.player.isReacting = 'bang';
                        risolvi(game,client,game.carta_attiva,client.user.username);
                    }
                    return;
                case 'toGatling':
                    if(carta.name == 'Mancato!'){
                        rimuoviDaMano(carta, client);
                        io.in(client.table.id).emit('update cards', client.user.username, carta, 'Extra');
                        game.zona_extra.push(carta);
                        client.player.isReacting = 'mancato';
                        risolvi(game ,client,game.carta_attiva,client.user.username);
                    }
                    return;
                case 'toDuello':
                    if(carta.name == 'Bang!'){
                        rimuoviDaMano(carta, client);
                        io.in(client.table.id).emit('update cards', client.user.username, carta, 'Extra');
                        game.zona_extra.push(carta);
                        client.player.isReacting = 'Bang';
                        risolvi(game ,client,game.carta_attiva,game.controllo[0]);
                    }
                    return;
            }
            return;
        }
        if(!(client.player.isActive && games[client.table.pos].carta_attiva == null)){return;} // Se c'è una carta attiva o non sei il giocatore di turno, blocca ogni carta nella mano

        let carta = util.getCard(idCarta);

        if(carta.name == 'Mancato!' && games[client.table.pos].carta_attiva == null){return;}

        if(carta.name == "Bang!" && client.player.canBang == false && (client.player.arma.name != 'Volcanic' && client.player.personaggio.name != "Willy the Kid"))
            return;

        switch (carta.color){ // Identifica il tipo di carta giocata e indica al client dove metterla nell'html
            case 'marrone':
                client.emit('attiva marrone', carta);
                if(carta.name == "Bang!" && (client.player.personaggio.name != "Willy the Kid" && client.player.arma.name != "Volcanic"))
                    client.player.canBang = false;
                break;
            case 'blu':
                if(carta.name == 'Prigione'){
                    client.emit('attiva marrone', carta);
                    break;
                }
                client.emit('equipaggia blu', carta);
                break;
            case 'blu_arma':
                client.emit('equipaggia arma', carta);
                break;
        }
    });

    client.on('risolvi carta', (nomeTarget) => { // Risolve l'effetto della carta giocata
        var game = games[client.table.pos];
        var carta = game.carta_attiva;
        let target = game.giocatori.find(g => g.username == nomeTarget);

        if(carta.range == 'mazzo' || carta.range == 'tutti'){
            risolvi(game, client, carta, client.user.username);
        }
        else{
            if(target.alive){
                client.emit('rimuovi mirino');
                risolvi(game, client, carta, target);
            }
        }
    });

    client.on('carta selezionata', (cartaID, target) => { // Gestisce il caso in cui il client ha risposto ad una carta attiva
        let carta = util.getCard(cartaID);
        let game = games[client.table.pos];
        client.player.isReacting = 'daTavolo';
        game.controllo = new Array;
        game.controllo.push(carta);
        risolvi(game,client,game.carta_attiva,target);
    });

    client.on('update info', (tipo, carta) => { // Aggiorna i dati di tutti i giocatori al tavolo, come il numero di carte in mano o il numero di vite rimaste
        updateManager(client, tipo, carta);
    });

    const updateManager = (client, tipo, carta) => { // Disposizione al tavolo delle carte giocate in base al tipo di carta
        switch (tipo){
            case 'pescata':
                client.player.mano.push(carta);
                io.in(client.table.id).emit('update deck', games[client.table.pos].deck.length);
                io.in(client.table.id).emit('update mano', client.user.username, client.player.mano.length);
                break;
            case 'marrone':
                rimuoviDaMano(carta,client);
                games[client.table.pos].carta_attiva = carta;
                io.in(client.table.id).emit('testo', client.player.username +' ha giocato la carta: '+carta.name);
                io.in(client.table.id).emit('update cards', client.user.username, carta, 'Attiva');
                break;
            case 'blu':
                rimuoviDaMano(carta,client);
                if(client.player.equipaggiamenti.length != 0 && client.player.equipaggiamenti.find( equip => equip.name == carta.name) != undefined){
                    let equip = client.player.equipaggiamenti.find( equip => equip.name == carta.name)
                    io.in(client.table.id).emit('update cards', client.user.username, equip, 'RimuoviDaTavola');
                    client.player.equipaggiamenti = client.player.equipaggiamenti.filter((e) => e.name != carta.name);
                }
                client.player.equipaggiamenti.push(carta);
                io.in(client.table.id).emit('update cards', client.user.username, carta, 'Equip');
                break;
            case 'arma':
                rimuoviDaMano(carta,client);
                if(client.player.arma != 'disarmato'){
                    io.in(client.table.id).emit('update cards', client.user.username, client.player.arma, 'RimuoviDaTavola');
                }
                client.player.arma = carta;
                client.player.arma_visione = parseInt(carta.quantity);
                io.in(client.table.id).emit('update cards', client.user.username, carta, 'Arma');
                break;
        }
    }

    client.on('passa', (nextP) => { // Gestisce le interazioni con il pulsante passa del client in base alla situazione quando viene premuto
        if(client.player.isActive == false && client.player.isReacting == false){
            return;
        }
        else if(client.player.isReacting == 'toEmporio'){
            return;
        }
        else if(client.player.isReacting == 'toPanico' || client.player.isReacting == 'toCatBalou'){
            console.log('prendo dalla mano del giocatore...');
            let game = games[client.table.pos];
            if(game.controllo == 'manoVuota'){return;}            
            client.player.isReacting = 'daMano';
            risolvi(game,client,game.carta_attiva, game.controllo);
            return;
        }
        else if(client.player.isReacting != false){
            io.in(client.table.id).emit('testo', (client.player.username + " non risponde alla carta attiva"));
            let game = games[client.table.pos];
            client.player.isReacting = 'subisci';
            risolvi(game,client,game.carta_attiva,client.user.username);
        }
        else if(client.player.isActive == true && games[client.table.pos].carta_attiva != null){
            return;
        }
        else{ // Se il giocatore è nella condizione di poter passare, il turno di gioco passa al giocatore successivo in senso orario
            let nextPlayer = games[client.table.pos].giocatori.find(g => g.username == nextP);
            client.player.isActive = false;
            nextPlayer.isActive = true;
            io.in(client.table.id).emit('testo', (client.player.username + " ha passato, è il turno di " + nextPlayer.username));
        }
    });

    const rimuoviDaMano = (carta, client) => { // Rimuove una carta dalla mano di un giocatore
        let index = client.player.mano.indexOf(carta);
        client.player.mano.splice(index, 1);
        client.emit('rimuovi da mano', carta);
        io.in(client.table.id).emit('update mano', client.user.username, client.player.mano.length);
    }

    const risolvi = (game, client, carta, target) => { // Risolve la carta passata in argomento e scambia informazioni con i client al tavolo
        if(target.username != undefined){
            io.in(client.table.id).emit('testo', (target.username + " è bersaglio della carta " + carta.name));
        }
        switch(carta.action){ // Tutti gli effetti seguono un ragionamento analogo al primo esempio
            case 'colpo': // Nel caso in cui l'effetto della carta che si sta cercando di risolvere sia di tipo 'colpo'
                if(client.player.isReacting != false){ // Se il client entrato in questa funzione è in realtà il bersaglio di un'attivazione precedente della stessa carta (vedere il seguito), allora si risolve la carta in un modo diverso 
                    if(client.player.isReacting == 'mancato'){ // Se ha risposto alla carta attiva che causa un 'colpo' con una carta 'mancato'
                        io.in(client.table.id).emit('testo', (client.player.username + " ha schivato il Kadabra!")); // Avvisa (con un messaggio) i giocatori al tavolo che il bersaglio ha schivato il colpo
                    }
                    else if(client.player.isReacting == 'subisci'){ // Se il bersaglio ha 'passato' e quindi deciso di non rispondere alla carta attiva
                        io.in(client.table.id).emit('testo', (client.player.username + " ha subito un danno.")); // Avvisa gli altri giocatori al tavolo che ha subito un danno dal 'colpo'
                        modificaPV(client, target,-1); // Funzione che modifica i punti vita di un bersaglio e aggiorna i dati al tavolo
                    }
                    client.player.isReacting = false; // Imposto che il giocatore ha terminato il suo 'turno di reazione'
                    setTimeout(() => { attivaRisolta(client, game); }, 2000); // Dopo un paio di secondi, la carta attiva al centro del tavolo viene scartata ed il gioco continua
                }
                else{
                    target.isReacting = 'toColpo'; // Se la carta è stata appena attivata, imposta che il target sta per iniziare il suo 'turno di reazione' ad un effetto 'colpo'
                }
                break;

            case 'scarta': // Permette al 'lanciante' di scegliere una carta dalla mano di un giocatore, o a terra, e scartarla 
                if(client.player.isReacting != false){
                    if(client.player.isReacting == 'daMano'){
                        let bersaglio = games[client.table.pos].giocatori.find(g => g.username == target)
                        console.log('catbalou in mano di', target.username); // DEBUG
                        target.mano.forEach(card => {
                            console.log(card.name + "")
                        });
                        let presa = randomDaMano(target);
                        rimuoviDaMano(presa,bersaglio);
                        io.in(client.table.id).emit('update cards', null, presa, 'Scarti');  
                        console.log('nuova mano di', target.username); // DEBUG
                        target.mano.forEach(card => {
                            console.log(card.name + "")
                        });
                    }
                    else if(client.player.isReacting == 'daTavolo'){
                        console.log('catbalou sul tavolo', target.equipaggiamenti, target.arma.name); // DEBUG
                        let selezionata = game.controllo.shift();
                        io.in(client.table.id).emit('update cards', target, selezionata, 'RimuoviDaTavola');
                        target.equipaggiamenti = target.equipaggiamenti.filter((equip) => equip != selezionata);
                        console.log('nuovi equip', target.equipaggiamenti, target.arma.name); // DEBUG
                    }
                    client.emit('imposta carte', 'catbalou', target, 'disattiva');
                    client.player.isReacting = false;
                    game.controllo = new Array;
                    setTimeout(() => { attivaRisolta(client, game); }, 2000);
                }
                else{
                    client.player.isReacting = 'toCatBalou';
                    if(target.mano.length == 0)
                        game.controllo = 'manoVuota';
                    game.controllo = target;
                    client.emit('imposta carte', 'catbalou', target, 'attiva');
                }
                break;

            case 'ruba': // Permette al 'lanciante' di scegliere una carta dalla mano di un giocatore, o a terra, ed aggiungerla alla propria mano 
                console.log('entro in ruba', client.player.isReacting);
                if(client.player.isReacting != false){
                    if(client.player.isReacting == 'daMano'){
                        let bersaglio = games[client.table.pos].giocatori.find(g => g.username == target);

                        console.log('panico in mano di', target.username); // DEBUG
                        target.mano.forEach(card => {
                            console.log(card.name + "")
                        });
                        let presa = randomDaMano(target);
                        rimuoviDaMano(presa,bersaglio);
                        client.emit('pesca carta', presa);
                        io.in(client.table.id).emit('update mano', client.user.username, client.player.mano.length);  

                        console.log('nuova mano di', target.username); // DEBUG
                        target.mano.forEach(card => {
                            console.log(card.name + "")
                        });
                    }
                    else if(client.player.isReacting == 'daTavolo'){
                        console.log('panico sul tavolo', target.equipaggiamenti, target.arma.name); // DEBUG
                        let selezionata = game.controllo.shift();
                        io.in(client.table,id).emit('update cards', target, selezionata, 'RimuoviDaTavola');
                        target.equipaggiamenti = target.equipaggiamenti.filter((equip) => equip != selezionata);
                        client.emit('pesca carta', selezionata);
                        io.in(client.table.id).emit('update mano', client.user.username, client.player.mano.length); 
                        console.log('nuovi equip', target.equipaggiamenti, target.arma.name); // DEBUG
                    }
                    client.emit('imposta carte', 'panico', target, 'disattiva');
                    client.player.isReacting = false;
                    game.controllo = new Array;
                    setTimeout(() => { attivaRisolta(client, game); }, 2000);
                }
                else{
                    client.player.isReacting = 'toCatBalou';
                    if(target.mano.length == 0)
                        game.controllo = 'manoVuota';
                    game.controllo = target;
                    client.emit('imposta carte', 'catbalou', target, 'attiva');
                }
                break;

            case 'pesca': // Fa pescare dal mazzo al 'lanciante' una quantità di carte determinata dalla carta giocata
                pesca(client, carta.quantity);
                setTimeout(() => { attivaRisolta(client, game); }, 2000);
                break;

            case 'recupera': // Fa recuperare dei punti vita al 'lanciante' di una quantità determinata dalla carta giocata
                modificaPV(client, target, carta.quantity);
                setTimeout(() => { attivaRisolta(client, game); }, 2000);
                break;
            
            case 'saloon': // Fa recuperare un punto vita a tutti i giocatori al tavolo
                game.giocatori.forEach(gioc => {
                    modificaPV(client, gioc, carta.quantity);
                });
                setTimeout(() => { attivaRisolta(client, game); }, 2000);
                break;

            case 'duello': // Chi lancia il duello seleziona un bersaglio ed il primo che non gioca una carta 'Kadabra!' subisce un danno
                if(client.player.isReacting != false){
                    if(client.player.isReacting == 'Bang'){
                        io.in(client.table.id).emit('testo', (client.player.username + "ha risposto alla Battaglia, cosa farà " + game.controllo[0] + '?'));
                        client.player.isReacting = false;
                        risolvi(game,client,game.carta_attiva,game.controllo[0]);
                    }
                    else if(client.player.isReacting == 'subisci'){
                        io.in(client.table.id).emit('testo', (client.player.username + "ha subito un danno!"));
                        modificaPV(client, target,-1);
                        client.player.isReacting = false;
                        game.controllo = new Array;
                        setTimeout(() => { attivaRisolta(client, game); }, 2000);
                    }
                }
                else{
                    target.isReacting = 'toDuello';
                    game.controllo[0] = client.user.username;
                }
                break;

            case 'gatling': // Il lanciante genera un effetto 'colpo' a tutti gli altri giocatori al tavolo
                if(client.player.isReacting != false){
                    if(client.player.isReacting == 'mancato'){
                        console.log(client.player.username, 'ha schivato la Gatling.');
                    }
                    else if(client.player.isReacting == 'subisci'){
                        console.log(client.player.username, "ha subito un danno dalla Gatling.");
                        modificaPV(client, target,-1);
                    }
                    client.player.isReacting = false;
                    game.controllo = game.controllo.filter((id) => id != client.user.username);
                    if(game.controllo.length == 0)
                        setTimeout(() => { attivaRisolta(client, game); }, 2000);
                }
                else{
                    game.giocatori.forEach(gioc => {
                        if(gioc.id != client.user.username){
                            game.controllo.push(gioc.id);
                            gioc.isReacting = 'toGatling';
                        }
                    });
                }
                break;

            case 'indiani': // Tutti a parte il 'lanciante' giocano una carta 'Kadabra!' o subiscono un danno
                if(client.player.isReacting != false){
                    if(client.player.isReacting == 'bang'){
                        console.log(client.player.username, 'ha respinto gli indiani.');
                    }
                    else if(client.player.isReacting == 'subisci'){
                        console.log(client.player.username, "ha subito un danno degli indiani.");
                        modificaPV(client, target,-1);
                    }
                    client.player.isReacting = false;
                    game.controllo = game.controllo.filter((id) => id != client.user.username);
                    if(game.controllo.length == 0)
                        setTimeout(() => { attivaRisolta(client, game); }, 2000);
                }
                else{
                    game.giocatori.forEach(gioc => {
                        if(gioc.id != client.user.username){
                            game.controllo.push(gioc.id);
                            gioc.isReacting = 'toIndiani';
                        }
                    });
                }
                break;

            case 'emporio': // Tutti i giocatori in senso orario a partire dal 'lanciante', scelgono una carta scoperta dall'effetto di questa carta e la aggiungono alla propria mano
                if(client.player.isReacting != false){
                    client.player.isReacting = false;
                    if(target == game.controllo){
                        game.controllo = new Array;
                        setTimeout(() => { attivaRisolta(client, game); }, 2000);
                        return;
                    }
                    let next = game.giocatori.find(g => g.username == target);
                    next.isReacting = 'toEmporio';
                }
                else{
                    console.log('primo lancio', client.player.isReacting);
                    let quanti = game.giocatori.length;
                    estraiCarta(client,quanti,'emporio');
                    client.player.isReacting = 'toEmporio';
                    game.controllo = client.user.username;
                }
                break;

            case 'estrai_barile': // Se il giocatore ha una carta 'Barile' equipaggiata ed è bersaglio di un colpo, può tentare di schivare il colpo seguendo le regole del 'Barile'
                let funziona = estraiCarta(client,1,'barile');
                if(funziona){
                    client.player.isReacting = 'mancato';
                }
                break;
            case 'estrai_prigione': // Se è il turno del bersaglio ed è in 'Prigione' deve risolverne gli effetti prima di potre giocare altre carte
                if(client.player.isReacting == 'toPrigione'){
                    let uscito = estraiCarta(client,1,'prigione');
                    if(uscito){
                        io.in(client.table.id).emit('update cards', client.user.username, carta, 'RimuoviDaTavola');
                    }
                    else{
                        io.in(client.table.id).emit('update cards', client.user.username, carta, 'RimuoviDaTavola');
                    }
                }
                else{
                    if(target.equipaggiamenti.length != 0 && target.equipaggiamenti.find( equip => equip.name == carta.name) != undefined){
                        let equip = target.equipaggiamenti.find( equip => equip.name == carta.name)
                        io.in(client.table.id).emit('update cards', target, equip, 'RimuoviDaTavola');
                        client.player.equipaggiamenti = client.player.equipaggiamenti.filter((e) => e.name != carta.name);
                    }
                    target.equipaggiamenti.push(carta);
                    attivaRisolta(client, game, target);
                }
                break;
            case 'estrai_dinamite': // Se è il turno di un giocatore avente la 'Dinamite', deve risolverne gli effetti prima di potre giocare altre carte
                if(client.player.isReacting == 'toDinamite'){
                    let esplosa = estraiCarta(client,1,'dinamite');
                    if(esplosa){
                        modificaPV(client, target,-3);
                        io.in(client.table.id).emit('update cards', client.user.username, carta, 'RimuoviDaTavola');
                    }
                    else{
                        io.in(client.table.id).emit('update cards', client.user.username, carta, 'RimuoviDaTavola');
                    }
                }
                break;
        }
             
    }

    const modificaPV = (client, target, quanti) => { // Funzione che modifica i punti vita di un bersaglio e aggiorna i dati visivi al tavolo dei client
        target.vite = parseInt(target.vite);
        quanti = parseInt(quanti);
        if( quanti > 0 && target.vite == target.vite_max){
            return;
        }
        target.vite += quanti;
        io.in(client.table.id).emit('update vite', target.username, target.vite);
        if(target.vite == 0){
            io.in(client.table.id).emit('testo', target.username + ", " + target.ruolo + " è morto!");
            target.alive = false;
        }
    }

    function attivaRisolta(client, game, target){ // Sistema le carte al tavolo una volta risolta la carta attiva
        console.log(target);
        let carta = game.carta_attiva;
        if(carta.name == 'Prigione'){
            io.in(client.table.id).emit('update cards', null, carta, 'levaAttiva');
            io.in(client.table.id).emit('update cards', target, carta, 'Equip');
        }
        else{
            io.in(client.table.id).emit('update cards', null, carta, 'RimuoviDaTavola');
            console.log('rimossa');
        }
        if(game.zona_extra.length != 0){
            game.zona_extra.forEach(extra => { // FIXARE LO SCARTO DALLA ZONA EXTRA => DEVE AVVENIRE DOPO LA ZONA ATTIVA E NON TUTTE LE CARTE INSIEME
                io.in(client.table.id).emit('update cards', null, extra, 'RimuoviExtra');
            });
            game.zona_extra = new Array;
        }
        game.carta_attiva = null;
    }

    function estraiCarta(client, quante, scopo){ // Risolve gli effetti 'Estrai' in base alla carta che lo richiede, cioè scoprire la prima carta del mazzo, controllare numero e seme e poi scartarla
        let game = games[client.table.pos];
        for(var i=0;i<quante;i++){
            let estratta = game.deck.shift();
            if(scopo == 'emporio'){
                io.in(client.table.id).emit('update cards', client.user.username, estratta, 'ExtraEmporio');
            }
            else if(scopo == 'barile' || scopo == 'prigione'){
                io.in(client.table.id).emit('update cards', client.user.username, estratta, 'Extra');
                setTimeout(() => {
                    io.in(client.table.id).emit('update cards', null, estratta, 'RimuoviExtra'); 
                }, 2000);
                return estratta.suit == 'C';
            }
            else if(scopo == 'dinamite'){
                io.in(client.table.id).emit('update cards', client.user.username, estratta, 'Extra');
                setTimeout(() => {
                    io.in(client.table.id).emit('update cards', null, estratta, 'RimuoviExtra'); 
                }, 2000);
                return (estratta.suit == 'P' && estratta.number >= 2 && estratta.number <= 9);
            }
            io.in(client.table.id).emit('update deck', game.deck.length);
        }
    }

    function randomDaMano(target){ // Seleziona una carta a caso dalla mano di un giocatore bersaglio
        let quante = target.mano.length;
        let randomIndex = Math.floor(Math.random()*quante);
        let presa = target.mano[randomIndex];
        return presa;
    }

    function sleep(ms) { // Risolve un blocco di codice con un ritardo
        return new Promise(resolve => setTimeout(resolve, ms));
    }
});