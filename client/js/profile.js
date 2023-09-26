var server = io(); // Instaura una connessione socket con il server

let cookieUser = JSON.parse(getCookie('user')); // Legge il cookie 'user' nella pagina
server.emit('getUserData', {username: cookieUser.username}, {}); // Chiede al server le informazioni dell'utente loggato nella sessione corrente

var vue = new Vue({ // Crea un'istanza di Vue con tutti i dati che interessano alla pagina html
  el: '#vue',
  data: {
    user: cookieUser,
    current: 0, // Indice che scorre nell'array avatars
    avatar: 0, // Tiene l'indice dell'ultima immagine salvata dall'utente
    diversa: false, // Controlla se l'immagine del profilo dell'utente corrisponda a quella attualmente mostrata
    activeClass: 'button', // Classe css che mostra il bottone 'salva' se si sta modificando l'immagine del profilo
    errorClass: 'noButton', // Classe css che nasconde il bottone 'salva' se l'immagine del profilo corrisponde a quella corrente
    avatars: // Lista di src per le immagini del profilo
    [
    'https://openclipart.org/image/800px/238968',
    '/assets/images/avatars/foto1.png',
    '/assets/images/avatars/foto2.png',
    '/assets/images/avatars/foto3.png',
    '/assets/images/avatars/foto4.png',
    '/assets/images/avatars/foto5.png'
    ]
  },
  methods: {
    calcolaAccesso: function(time) { // Trasforma il timestamp in ore
      vue.user.last_seen = ((Date.now() - time)/3600000).toFixed() + ' Ore fa';
    },
    calcolaExp: function(exp){ // Calcola i punti esperienza in proporzione al limite di punti esperienza fissato
      return Math.floor((exp/1000) * 100) + "%";
    },
    cambiaAvatar: function(){ // Al click dell'immagine del profilo, viene lannciata questa funzione che fa scorrere la 'src' dell'immagine nell'array vue.avatars con un cambio di indice 
      if(vue.current == vue.avatars.length-1){ vue.current = 0; }
      else{ vue.current++; }
      if(vue.current != vue.avatar){ vue.diversa = true; }
      else{ vue.diversa = false; }
    }
  }
})

function getCookie(cname) { // Funzione per leggere e decodificare cookies passando come argomento il nome del cookie d'interesse
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

server.on('userData', function(data) { // Riceve i dati dell'utente chiesti in precedenza e salva i necessari nell'istanza di 'Vue'
  vue.user = data.shift();
  vue.calcolaAccesso(vue.user.last_seen);
  vue.avatar = vue.user.avatar;
  vue.current = vue.avatar; // Mostra sempre come prima immagine, l'immagine salvata nel database dell'utente
});

server.on('aggiorna amici', function(data) { // Aggiorna la lista degli amici dell'utente dopo che se ricevono delle modifiche effettuate con successo
  vue.user.friends = data.friends;
});