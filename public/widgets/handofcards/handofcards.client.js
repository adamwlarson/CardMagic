feather.ns("cardmagic");
(function() {
  var cardsInHand = [];             
  cardmagic.handofcards = feather.Widget.create({
    name: "cardmagic.handofcards",
    path: "widgets/handofcards/",
    prototype: {
      onInit: function() {
        
      },
      resetHand: function() {
        cardsInHand = [];
      },
      dealCard: function( newCard, nPlayerId ) {
        //nPlayerId 0 = Player1, 1 = Player2
        //Need a way to determine which player we are and then display this correctly
        cardsInHand.push( newCard );
        newCard.widget.dealCardAnim( cardsInHand.length, nPlayerId );
        newCard.widget.setInfo( newCard );
      },
      onReady: function() {

      }
    }
  });
})();