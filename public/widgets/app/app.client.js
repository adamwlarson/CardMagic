feather.ns("cardmagic");
(function() {
  cardmagic.app = feather.Widget.create({
    name: "cardmagic.app",
    path: "widgets/app/",
    prototype: {
      onInit: function() {
        
      },
      onReady: function() {
        var me = this;

        //Is there a better way to do this?
        me.p1LandContainer.setContainerClass( "p1Land" );

        me.domEvents.bind( me.get( "#btnLoadDeck" ), "click", function( ) {
          me.p1Deck.loadDeck( );
          me.p1Hand.resetHand( );
        });
        me.domEvents.bind( me.get( "#btnDrawACard" ), "click", function( ) {
          me.p1Hand.dealCard( me.p1Deck.grabTopCard( ), 0 );
        });
        me.domEvents.bind( me.get( "#btnDealHand" ), "click", function( ) {
          if( me.p1Deck.numCards( ) < 60 ){
            alert( "Invalid Deck Size. Please Import valid deck." );
            return;
          }
          me.p1Hand.resetHand( );

          //Now actually deal
          var NUM_CARDS = 7;
          for( var i = 0; i < NUM_CARDS; i++ )
          {
            me.p1Hand.dealCard( me.p1Deck.grabTopCard( ),0 );
          }
        });
        me.domEvents.bind( me.get( "#btnShuffle" ), "click", function( ) {
          me.p1Deck.shuffle( );
        });
      }
    }
  });
})();