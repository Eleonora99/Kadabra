var pop = document.getElementById('popup'); // Aggancia 'pop' ad un div rappresentante il messaggio di errore
const urlParams = new URLSearchParams(window.location.search); // Copia i parametri dell'URL attuale
const errorMessage = urlParams.get('error'); // Cerca il parametro 'error'
var tipoPopup;
if(errorMessage == 'Registrazione Effettuata, fare Login'){ // Se il messaggio di errore è questo, allora il popup mostrerà come titolo 'Successo'
  tipoPopup = "Successo!";
}
else{
  tipoPopup = "Errore!"; // Altrimenti sarà un popup di 'Errore!'
}
if(errorMessage != null) { // Se è stato causato un errore, fa comprarire il popup di errore con un'animazione
  pop.style.animation = "fadein 2s";
}
else{ // se nessun errore è stato causato, il popup è invisibile
  pop.setAttribute("style","opacity: 0");
}

var vue = new Vue({ // Istanza di Vue che tiene traccia del messaggio di errore ed il tipo di popup
  el: '#vue',
  data: {
    errore: errorMessage,
    type: tipoPopup
  }
})