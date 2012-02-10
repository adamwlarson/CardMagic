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
        //I want to be able to have a generic container that changes based on where its used
        me.p1LandContainer.setContainerClass( "p1Land" );
        me.p1HandContainer.setContainerClass( "p1Hand" );
        me.p1GraveYardContainer.setContainerClass( "p1GraveYard" );
        me.p1InPlayContainer.setContainerClass( "p1InPlay" );
        me.p2InPlayContainer.setContainerClass( "p2InPlay" );
        me.p2LandContainer.setContainerClass( "p2Land" );
        me.p1GraveYardContainer.setAutoSpacing( false );

        //Load the Deck
        me.domEvents.bind( me.get( "#btnLoadDeck" ), "click", function( ) {
          me.p1Deck.loadDeck( );
          me.p1Hand.resetHand( );
        });//End Bind

        //Draw a New Card
        me.domEvents.bind( me.get( "#btnDrawACard" ), "click", function( ) {
          var newCard = me.p1Deck.grabTopCard( );
          me.p1Hand.dealCard( newCard,0 );
          newCard.widget.setStartContainer( me.p1HandContainer );
        });//End Bind

        //Deal a New Hand
        me.domEvents.bind( me.get( "#btnDealHand" ), "click", function( ) {
          if( me.p1Deck.numCards( ) < 60 ) {
            alert( "Invalid Deck Size. Please Import valid deck." );
            return;
          }
          me.p1Hand.resetHand( );

          //Now actually deal
          var NUM_CARDS = 7;
          for( var i = 0; i < NUM_CARDS; i++ ) {
            var newCard = me.p1Deck.grabTopCard( );
            me.p1Hand.dealCard( newCard,0 );
            newCard.widget.setStartContainer( me.p1HandContainer );
          }
        });//End Bind

        //Shuffle the Deck
        me.domEvents.bind( me.get( "#btnShuffle" ), "click", function( ) {
          me.p1Deck.shuffle( );
        });//End Bind

        //Untap all cards
        me.domEvents.bind( me.get( "#btnUnTap" ), "click", function( ) {
          me.p1Deck.untapAllCards( );
        }); //End Bind

        //Disable Context "right click menu"
        me.domEvents.bind( $(document), "contextmenu", function( events ) {
          return false;
        });//End Bind
      }
    }
  });
})();