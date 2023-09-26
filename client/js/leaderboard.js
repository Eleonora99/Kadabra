var server = io(); // Instaura una connessione socket con il server

server.emit('getUserData', {}, {exp: -1}); // Emette al server una Query per ordinare in modo decrescente sull'attributo 'exp' tutti gli utenti del database

var vue = new Vue({
el: '#vue',
data: {
     classifica: [ // Lista di 10 oggetti alla quale fa riferimento il documento html
     {username: "", exp: 0},
     {username: "", exp: 0},
     {username: "", exp: 0},
     {username: "", exp: 0},
     {username: "", exp: 0},
     {username: "", exp: 0},
     {username: "", exp: 0},
     {username: "", exp: 0},
     {username: "", exp: 0},
     {username: "", exp: 0}
     ]
},
methods: {
     calcolaExp: function(exp){ // Calcola i punti esperienza in proporzione al limite di punti esperienza fissato
     return Math.floor((exp/1000) * 100) + "%";
     }
}
})

server.on('userData', function(data) { // Riceve dal server il risultato della query chiamata in precedenza e sovrascrive la lista in 'vue' con i primi 10 elementi della lista ricevuta
for(var i = 0; i<10; i++){
     let user = data.shift();
     vue.classifica[i].username = user.username;
     vue.classifica[i].exp = user.exp;
}
});