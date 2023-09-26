
var server = io(); // Stabilisce una connessione socket con il server

server.on('reqClientInfo', () => { // Invia al server le informazioni dell'utente salvate in dei cookies
     let user = JSON.parse(getCookie('user'));
     let table = getCookie('table');
     server.emit('refreshClientData', user, table);
});

var testo = document.getElementById('hint'); // Paragrafo del documento html dove verrà stampato del testo durante la partita

var sedie = new Array;

server.on('start game', () => { // Appena riceve l'evento di setup del server, crea un mazzo interagibile nell'html e richiede la mano di carte iniziale
     server.emit('assegna posti');
     var img = document.createElement('img');
     img.classList.add('card');
     img.setAttribute('onclick', "server.emit('pesca carta', 1)")
     img.src = '/assets/cards/back_carte.png';
     document.getElementById('deck').appendChild(img);
     server.emit('mano iniziale');
});

server.on('posti assegnati', function(posti) { // sistema i giocatori nell'html una volta assegnati i posti dal server (il client sarà sempre nel posto SC, cioè il div in basso al centro)

     var alTavolo = posti.length;
     sedie = posti;

     // Rappresentano i div dove verranno stampate le informazioni dei singoli giocatori e dove verranno giocate le rispettive carte
     var SC = document.getElementById('SC');
     //var S2 = document.getElementById('S2');
     var S3 = document.getElementById('S3');
     //var S4 = document.getElementById('S4');
     var S5 = document.getElementById('S5');
     //var S6 = document.getElementById('S6');
     var S7 = document.getElementById('S7');
     //var S8 = document.getElementById('S8');
     
     switch(alTavolo){ // Crea il setup della pagina html in base al numero di giocatori
          case 1:
               document.getElementById('CNome').textContent = posti[0].username;
               document.getElementById('CMano').textContent = posti[0].vite_max;
               document.getElementById('CVite').textContent = posti[0].vite_max;
               SC.style.opacity = "100%";
               SC.setAttribute('id',posti[0].username);
               sedie[0].sedia = SC;
               sedie[0].dist = 0;
               sedie[0].nextPlayer = sedie[0].username;
               if(posti[0].ruolo == 'Re'){SC.style.border = "4px ridge gold";}
               return;
          case 2:
               document.getElementById('CNome').textContent = posti[0].username;
               document.getElementById('CMano').textContent = posti[0].vite_max;
               document.getElementById('CVite').textContent = posti[0].vite_max;
               SC.style.opacity = "100%";
               SC.setAttribute('id',posti[0].username);
               sedie[0].sedia = SC;
               sedie[0].dist = 0;
               sedie[0].nextPlayer = sedie[1].username;
               if(posti[0].ruolo == 'Re'){SC.style.border = "4px ridge gold";}
               S5.style.opacity = "100%";
               S5.setAttribute('id',posti[1].username);
               document.getElementById('G5Nome').textContent = posti[1].username;
               document.getElementById('G5Mano').textContent = posti[1].vite_max;
               document.getElementById('G5Vite').textContent = posti[1].vite_max;
               sedie[1].sedia = S5;
               sedie[1].dist = 1;
               sedie[1].nextPlayer = sedie[0].username;
               if(posti[1].ruolo == 'Re'){S5.style.border = "4px ridge gold";}
               return;
          case 3:
               document.getElementById('CNome').textContent = posti[0].username;
               document.getElementById('CMano').textContent = posti[0].vite_max;
               document.getElementById('CVite').textContent = posti[0].vite_max;
               SC.style.opacity = "100%";
               SC.setAttribute('id',posti[0].username);
               sedie[0].sedia = SC;
               sedie[0].dist = 0;
               sedie[0].nextPlayer = sedie[1].username;
               if(posti[0].ruolo == 'Re'){SC.style.border = "4px ridge gold";}
               S3.style.opacity = "100%";
               S3.setAttribute('id',posti[1].username);
               document.getElementById('G3Nome').textContent = posti[1].username;
               document.getElementById('G3Mano').textContent = posti[1].vite_max;
               document.getElementById('G3Vite').textContent = posti[1].vite_max;
               sedie[1].sedia = S3;
               sedie[1].dist = 1;
               sedie[1].nextPlayer = sedie[2].username;
               if(posti[1].ruolo == 'Re'){S3.style.border = "4px ridge gold";}
               S7.style.opacity = "100%";
               S7.setAttribute('id',posti[2].username);
               document.getElementById('G7Nome').textContent = posti[2].username;
               document.getElementById('G7Mano').textContent = posti[2].vite_max;
               document.getElementById('G7Vite').textContent = posti[2].vite_max;
               sedie[2].sedia = S7;
               sedie[2].dist = 1;
               sedie[2].nextPlayer = sedie[0].username;
               if(posti[2].ruolo == 'Re'){S7.style.border = "4px ridge gold";}
               return;
          case 4:
               document.getElementById('CNome').textContent = posti[0].username;
               document.getElementById('CMano').textContent = posti[0].vite_max;
               document.getElementById('CVite').textContent = posti[0].vite_max;
               SC.style.opacity = "100%";
               SC.setAttribute('id',posti[0].username);
               sedie[0].sedia = SC;
               sedie[0].dist = 0;
               sedie[0].nextPlayer = sedie[1].username;
               if(posti[0].ruolo == 'Re'){SC.style.border = "4px ridge gold";}
               S3.style.opacity = "100%";
               S3.setAttribute('id',posti[1].username);
               document.getElementById('G3Nome').textContent = posti[1].username;
               document.getElementById('G3Mano').textContent = posti[1].vite_max;
               document.getElementById('G3Vite').textContent = posti[1].vite_max;
               sedie[1].sedia = S3;
               sedie[1].dist = 1;
               sedie[1].nextPlayer = sedie[2].username;
               if(posti[1].ruolo == 'Re'){S3.style.border = "4px ridge gold";}
               S5.style.opacity = "100%";
               S5.setAttribute('id',posti[2].username);
               document.getElementById('G5Nome').textContent = posti[2].username;
               document.getElementById('G5Mano').textContent = posti[2].vite_max;
               document.getElementById('G5Vite').textContent = posti[2].vite_max;
               sedie[2].sedia = S5;
               sedie[2].dist = 2;
               sedie[2].nextPlayer = sedie[3];
               if(posti[2].ruolo == 'Re'){S5.style.border = "4px ridge gold";}
               S7.style.opacity = "100%";
               S7.setAttribute('id',posti[3].username);
               document.getElementById('G7Nome').textContent = posti[3].username;
               document.getElementById('G7Mano').textContent = posti[3].vite_max;
               document.getElementById('G7Vite').textContent = posti[3].vite_max;
               sedie[3].sedia = S7;
               sedie[3].dist = 1;
               sedie[3].nextPlayer = sedie[0].username;
               if(posti[3].ruolo == 'Re'){S7.style.border = "4px ridge gold";}
               return;
          case 5: //
                  //     Analoghi alla struttura sovrastante
          case 6: //     Rimossi per semplificare la lettura
                  //     Senza di questi il gioco supporta 1-4 giocatori
          case 7: //
     }
});

server.on('pesca carta', function(carta) { // Aggiorna la mano del giocatore a seguito di un evento 'pesca carta' e richiede un update dei dati per gli altri giocatori
     var img = document.createElement('img');
     img.classList.add('card');
     img.src = '/assets/cards/' + carta.img;
     img.setAttribute('id', carta.img);
     img.setAttribute('data-nome', carta.name);
     img.setAttribute('onclick', "server.emit('gioca carta', this.id)")
     document.getElementById('mano').appendChild(img);
     server.emit('update info', 'pescata', carta);
});

server.on('update deck', function(quanti) { // Aggiorna il numero che indica le carte rimaste nel mazzo
     document.getElementById('deckinfo').innerText = quanti;
});

server.on('update mano', function(giocatore, nuovoValore) { // Aggiorna visivamente il valore che rappresenta il numero di carte nella mano del giocatore che ha pescato o giocato delle carte
     let player = sedie.find(g => g.username == giocatore);
     player.sedia.children[2].textContent = nuovoValore;
});

server.on('update vite', function(giocatore, nuovoValore) { // Aggiorna visivamente il valore che rappresenta il numero di vite del giocatore
     let player = sedie.find(g => g.username == giocatore);
     player.sedia.children[3].textContent = nuovoValore;
});

server.on('update cards', function(giocatoreID, carta, dove) {  // Sposta le carte nel tavolo su richiesta del server dopo aver elaborato la mossa
     if(giocatoreID != null)
          giocatore = sedie.find(g => g.username == giocatoreID);
     centro = document.getElementById('centro')
     var img = document.createElement('img');
     img.classList.add('card');
     img.src = '/assets/cards/' + carta.img;
     img.setAttribute('id', carta.img);

     switch(dove){
          case 'Attiva':
               centro.children[2].appendChild(img);
               return;
          case 'levaAttiva':
               let attiva = document.getElementById(carta.img);
               centro.children[2].removeChild(attiva);
               return;
          case 'Scarti':
               centro.children[0].appendChild(img);
               return;
          case 'Extra':
               centro.children[4].appendChild(img);
               return;
          case 'ExtraEmporio':
               img.setAttribute('onclick', "server.emit('pesco emporio', sedie, this.id)");
               centro.children[4].appendChild(img);
               return;
          case 'Equip':
               giocatore.sedia.children[4].children[0].appendChild(img);
               return;
          case 'Arma':
               giocatore.sedia.children[4].children[1].appendChild(img);
               return;
          case 'RimuoviExtra':
               let extra = document.getElementById(carta.img);
               centro.children[4].removeChild(extra);
               centro.children[0].appendChild(extra);
               return;
          case 'RimuoviDaTavola':
               let card = document.getElementById(carta.img);
               if(carta.color == 'blu'){
                    giocatore.sedia.children[4].children[0].appendChild(card);
               }
               else if(carta.color == 'blu_arma'){
                    giocatore.sedia.children[4].children[1].removeChild(card);
               }
               else if(carta.color == 'marrone'){
                    centro.children[2].removeChild(card);
               }
               centro.children[0].appendChild(card);
               console.log("in scarti");
               return;
     }

});

server.on('rimuovi da mano', (carta) => { // Rimuove la carta richiesta dalla mano
     let card = document.getElementById(carta.img);
     let mano = document.getElementById('mano');
     mano.removeChild(card);
});

server.on('imposta carte', (situazione, target, status) => { // Rende interagibili alcune carte sul tavolo quando una carta lo richiede per effetto (es: rimuover dal tavolo l'equipaggiamento di un giocatore)
     if(situazione == 'panico' || situazione == 'catbalou'){
          if(target.equipaggiamenti.length != 0){
               target.equipaggiamenti.forEach(e => {
                    var equip = document.getElementById(e.img);
                    if(status == 'attiva'){
                         equip.setAttribute('data-proprietario', target.id);
                         equip.setAttribute('onclick', "server.emit('carta selezionata', this.id, this.dataset.proprietario)");
                    }
                    else if(status == 'disattiva'){
                         equip.removeAttribute('data-proprietario');
                         equip.removeAttribute('onclick');
                    }
               });
          }
          if(target.arma != 'disarmato'){
               var arma = document.getElementById(target.arma.img);
               if(status == 'attiva'){
                    arma.setAttribute('data-proprietario', target.id);
                    arma.setAttribute('onclick', "server.emit('carta selezionata', this.id, this.dataset.proprietario)");
               }
               else if(status == 'disattiva'){ 
                    arma.removeAttribute('data-proprietario');
                    arma.removeAttribute('onclick');
               }
          }
     }    
});

server.on('attiva marrone', (carta) => { // In base al 'raggio di azione' della carta attivata dal client, le cornici dei giocatori diventano interagibili in modo che si possa selezionare il bersaglio per la carta
     server.emit('update info', 'marrone', carta);
     if(carta.range != 'tutti' && carta.range != 'mazzo'){
          attivaMirino();               
     }
     else{
          server.emit('risolvi carta');
     }
});

server.on('equipaggia blu', (carta) => { // Conferma al server di equipaggiare una carta blu
     server.emit('update info', 'blu', carta);
});

server.on('equipaggia arma', (carta) => { // Conferma al server di equipaggiare un'arma
     server.emit('update info', 'arma', carta);
});

server.on('rimuovi mirino', function() { // Disattiva la possibilità di selezionare il bersaglio
     disattivaMirino();
});

server.on('testo', (msg, azione) => { // Cambia il contenuto del testo al centro del tavolo
     if(azione == 'concatena'){
          testo.textContent += msg;
     }
     else{
          testo.textContent = msg;
     }
});

server.on('prep end game', (player) => { // Mostra un messaggio con il nome del vincitore della partita e chiama 'end game' al server
     testo.textContent = player + ' è il Vincitore!';
     setTimeout(() => {
          server.emit('end game');
      }, 2000);
});

function attivaMirino() { // Rende interagibili le cornici dei giocatori
     sedie.forEach(gioc => {
          gioc.sedia.classList.add("target");
          gioc.sedia.setAttribute('onclick', "server.emit('risolvi carta', this.id)");
     });
}
function disattivaMirino() { // Rimuove l'interagibilità alle cornici dei giocatori
     sedie.forEach(gioc => {
          gioc.sedia.classList.remove("target");
          gioc.sedia.removeAttribute('onclick');
     });
}

function getCookie(cname) { // Decodifica i cookie passati come argomento
     var name = cname + "=";
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

server.on('chat message', function (msg, type, mittente, destinatario) { // Gestisce i messaggi della chat nel tavolo

     var item = document.createElement('li');
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

server.on('redirect', function(destinazione, gameid){ // Elabora richieste di reindirizzamento e scrive un cookie con l'id della partita attuale
     document.cookie = 'game' + "=" + gameid;
     window.location.href = destinazione;
});

function sendMessage(msg){ // Chiede al server di elaborare il messaggio inviato dal client
if (msg != "") {
     server.emit('chat message', msg);
     }
}

function openChatPopup() { // Apre il popup della chat
document.getElementById("chat-popup").style.display = "block";
}

function closeChatPopup() { // Chiude il popup della chat
document.getElementById("chat-popup").style.display = "none";
}

