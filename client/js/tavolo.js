var server = io(); // Instaura una connessione socket con il server

server.on('reqClientInfo', () => { // Viene chiamata dal server ogniqualvolta il client si disconnette dalla socket e ne instaura un'altra (es: refresh della pagina); questa funzione aggiorna i dati del client, che altrimenti risulterebbe disconnesso, con l'ausilio dei cookies 
     let user = JSON.parse(getCookie('user')); // Legge il cookie 'user' nella pagina
     let table = getCookie('table'); // Legge il cookie 'table' nella pagina
     server.emit('refreshClientData', user, table); // Manda al server i dati del client prima della disconnessione, il quale li associerà alla nuova connessione socket
});

function sendMessage(msg){ // Invia il contenuto della form della chat al server se il messaggio non è vuoto
     if (msg != "") {
          server.emit('chat message', msg);
     }
}

server.on('chat message', function (msg, type, mittente) { // Gestisce la formattazione e l'aggiunta 'fisica' dei messaggi nella chat una volta che il server li ha elaborati e mandati ai client connessi allo stesso tavolo

     var item = document.createElement('li'); // I mesasggi sono rappresentati da elementi di una lista, la lista rappresenta quindi la chat
     var formattazione;

     switch (type){
          case "connessione":
               item.textContent = "+ " + msg + " joined +";
               formattazione = 'connection_css';
               break;
          case "connessione_tavolo":
               item.textContent = "| Connesso al tavolo: " + msg + " |";
               formattazione = 'table_connection_css';
               break;
          case "disconnessione":
               item.textContent = "- " + msg + " left -";
               formattazione = 'disconnection_css';
               break;
          case "messaggio_pubblico":
               item.textContent = mittente + ": " + msg;
               formattazione = 'standardmessage_css';
               break;
     }

     item.classList.add(formattazione);
     messages.appendChild(item);
     document.getElementById("chat-popup").scrollTo(0, document.getElementById("chat-popup").scrollHeight);
});      

function openChatPopup() { // Apre la il popup della chat (attualemnte il popup è sempre visibile, è stato rimosso il toggle)
     document.getElementById("chat-popup").style.display = "block";
}

function closeChatPopup() { // chiude la chat lasciando visibile solo il campo di testo che al focus riapre la chat
     document.getElementById("chat-popup").style.display = "none";
}

server.on('setCookie', function(nome,attributo) { // Imposta un cookie a partire da una richiesta del server
     document.cookie = nome, attributo;
});

let user = JSON.parse(getCookie('user')); // Legge il cookie 'user' nella pagina

var vue = new Vue({ // Istanza Vue che tiene i dati del tavolo a cui il client è connesso e li mostra nell'html aggiornati dopo ogni modifica
     el: '#vue',
     data: {
          username: user.username,
          table: {
               id: "-",
               connessi: 0,
               giocatori: []
          }
     }
})

function getCookie(cookieName) { // Funzione per leggere e decodificare cookies passando come argomento il nome del cookie d'interesse
     var name = cookieName + "=";
     var decodedCookie = decodeURIComponent(document.cookie);
     var ca = decodedCookie.split(';');
     for(var i = 0; i <ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) == ' ') {
               c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
               return c.substring(name.length, c.length);
          }
     }
     return "";
}

server.on('table update', function(table) { // Riceve aggiornamenti da parte del server per quanto riguarda i dati del tavolo a cui si è connessi e li salva nell'istanza Vue la quale li mostrerà visivamente nell'html relativo
     vue.table.id = table.id;
     vue.table.connessi = table.sockets.length;
     vue.table.giocatori = table.sockets;
});

server.on('redirect', function(destinazione, gameid){ // Elabora richieste di reindirizzamento ad una partita da parte del server e le esegue in finestra
     document.cookie = 'game' + "=" + gameid; // Scrive un cookie con il riferimento alla partita a cui si sta connettendo il client
     window.location.href = destinazione; // Esegue una richiesta URL gestita dal router presente nel server
});
