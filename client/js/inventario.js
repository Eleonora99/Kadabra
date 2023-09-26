var server = io(); // Instaura una connessione socket con il server
let cookieUser = JSON.parse(getCookie('user')); // Legge il cookie 'user' nella pagina
server.emit('getUserData', {username: cookieUser.username}, {}); // Chiede al server le informazioni dell'utente loggato nella sessione corrente

var vue = new Vue({
  el: '#vue',
  data: {
    user: cookieUser,
    current: 0,
    avatars: 
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

server.on('userData', function(data) { // Riceve i dati dell'utente chiesti in precedenza e salva i necessari nell'istanza di 'Vue'
  vue.user = data.shift();
  vue.current = vue.user.avatar;
  vue.calcolaAccesso(vue.user.last_seen);
});
