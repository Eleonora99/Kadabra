module.exports = {
     ruoli: function(numero_giocatori){  // Definisce i ruoli che verranno interpretati nella partita in base al numero dei giocatori
          switch(numero_giocatori){
               case 1: // da togliere
                    return ['Re'];
               case 2: // da togliere
                    return ['Re','Brigante']
               case 3: // da togliere
                    return ['Re','Brigante','Brigante'];
               case 4:
                    return ['Re','Stregone','Brigante','Brigante'];
               case 5:
                    return ['Re','Stregone','Brigante','Brigante','Cavaliere'];
               case 6:
                    return ['Re','Stregone','Brigante','Brigante','Brigante','Cavaliere'];
               case 7:
                    return ['Re','Stregone','Brigante','Brigante','Brigante','Cavaliere','Cavaliere'];
          }
     },

     addExtraRules: function(player){ // Verifica se il giocatore ha bisogno di una modifica delle statistiche durante il setup
          if(player.ruolo == 'Re'){ // il Re inizia la partita con 2 PV in più
               player.vite += 2;
               player.vite_max += 2;
               player.isActive = true;
          }
          if(player.personaggio == "Paul Regret"){player.mod_visione += 1;} // numero 9
          else if(player.personaggio == "Rose Doolan"){player.visione += 1;} // numero 11
     }
}