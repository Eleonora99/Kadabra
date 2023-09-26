var server = io(); // Instaura una connessione socket con il server

var joinform = document.getElementById('join_form'); // Si aggancia alla form per inserire l'id di un tavolo esistente

document.cookie = 'table' + "=" + ""; // Ogniqualvolta l'utente si reaca al menù, il cookie che tiene traccia del tavolo in cui si trova attualemnte viene resettato 

server.on('redirect', function(destinazione, table){ // Elabora richieste di reindirizzamento ad un tavolo da parte del server e le esegue in finestra
document.cookie = 'table' + "=" + table; // Scrive un cookie con il riferimento al tavolo a cui si sta connettendo il client
window.location.href = destinazione; // Esegue una richiesta URL gestita dal router presente nel server
});

joinform.addEventListener('submit', function (e) { // Aggiunge un lister di tipo 'submit' al form dove si inserisce l'id del tavolo e all'occorrenza chiede al server di provare a reindirizzare il client ad esso
     e.preventDefault();
     if (searchbar.value != '') {
     server.emit('join table', searchbar.value);
     searchbar.value = '';
     }
});