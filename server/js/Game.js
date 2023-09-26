class Game {

     constructor(table, id_partita, giocatori, numero_giocatori, deck, pila_scarti, carta_attiva, zona_extra, controllo){
          this.table = table;
          this.id_partita = id_partita;
          this.giocatori = giocatori;
          this.numero_giocatori = numero_giocatori;
          this.deck = deck;
          this.pila_scarti = pila_scarti;
          this.carta_attiva = carta_attiva;
          this.zona_extra = zona_extra;
          this.controllo = controllo;
     }

     checkDist(carta, sedie, target){ // Verifica che il bersaglio scelto dal 'lanciante' sia idoneo rispetto all'effetto della carta giocata
          let lanciante = sedie[0];
          let range = carta.range;
          if(range == 'me' && target == lanciante){
               return true;
          }
          else if(range == 'vicino_raggiungibile' && target != lanciante && this.raggiungibile(lanciante,target,1)){
               return true;
          }
          else if(range == 'visibile' && target != lanciante && this.raggiungibile(lanciante,target,'nessuna')){
               return true;
          }
          else if(range == 'qualsiasi'){
               return true;
          }
          else if(range == 'qualsiasi_altro' && target != lanciante){
               return true;
          }
          else if(range == 'qualsiasi_altro_noSceriffo' && target.ruolo != 'Sceriffo' /*&& target != lanciante*/){
               return true;
          }
          else {
               return false;
          }
     }

     raggiungibile(lanciante, target, restrizione){ // Misura la distanza in posti tra 'lanciante' e 'bersaglio', necessaria per controllare se il bersaglio della carta giocata è 'raggiungibile' dal 'lanciante'
          var visione_lanciante = lanciante.arma_visione + lanciante.visione;      
          if(restrizione == 'nessuna'){
               if((visione_lanciante - target.mod_visione) >= target.dist) {return true;}
               else {return false;}
          }
          else{
               if(target.dist <= restrizione && lanciante.mod_visione >= target.mod_visione) {return true;}
               else {return false;}
          }
     }
}

module.exports = Game;