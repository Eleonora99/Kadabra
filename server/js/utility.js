const card_list = require("./card_list");

module.exports = {
    getIndice: function (listaIndici){ // Restituisce il primo indice non presente nella lista fornita
        i = 0;
        while(listaIndici.includes(i))
            i++;
        return i;
    },

    shuffle: function(array) { // Mischia gli elementi di un array fornito
        var currentIndex = array.length, temporaryValue, randomIndex;
        while (0 !== currentIndex) {
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
        }
        return array;
      },

    postiRelativi(giocatori, posto){ // Rielabola l'array dei posti in modo che ogni client si trovi sempre in prima posizione
        var postiRel = new Array; 
        prossimoPosto = posto;
        tot = giocatori.length;
        for(i=0;i<tot;i++){
            for(let g of giocatori){
                if(g.posto == prossimoPosto){
                    postiRel.push(g);
                    if(prossimoPosto == tot-1){
                        prossimoPosto = 0;
                        break;
                    }
                    else{
                        prossimoPosto ++;
                        break;
                    }
                }
            }
        }
        return postiRel;
    },

    getCard(idCarta){ // Estrae l'id della carta passata come argomento
        let card = card_list.find(c => c.img == idCarta);
        return card;
   }
}