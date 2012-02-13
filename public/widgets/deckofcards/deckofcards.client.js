feather.ns("cardmagic");
(function() {

  //These are card data values
  var currentFullDeck = [];
  var graveYard = [];
  var unusedCards = [];
  var exiledCards = [];
  var cardWidgets = [];

  function createCard( _filename, _name, _attack, _defense, _type, _image, _widget ) {
    this.filename = _filename;
    this.name = _name;
    this.attack = _attack;
    this.defense = _defense;
    this.type = _type;
    this.image = _image;
    this.widget = _widget;
  };

  cardmagic.deckofcards = feather.Widget.create( {
    name: "cardmagic.deckofcards",
    path: "widgets/deckofcards/",
    prototype: {
      onInit: function( ) {
        //onInit
      },
      createCardWidget: function( _cb ) {
        var me = this;
        feather.Widget.load( {
          path: "widgets/card/",
          clientOptions: {
            parent: this,
            keepContainerOnDispose: true,
            container: $("<div class='p1deck'> </div>").prependTo( me.get( "#p1Deck" ) ),
            onceState: {
              ready: function( ) {
                _cb( this );
              }
            }
          }
        });
      },
      setCurrentSelectedCard: function( filename ) {
        //alert( "setCurrentSelectedCard" + filename );
        this.fire( "previewCard", filename );
      },
      untapAllCards: function( ) {
        for( var i = 0; i < currentFullDeck.length; i++ ) {
          currentFullDeck[i].widget.untapCard( );
        }
      },
      resetCards: function( ) {
        //This is called on a shuffle or re-deal, loading wipes all this
        unusedCards = currentFullDeck.slice(0);
        graveYard = [];
        exiledCards = [];
      },
      shuffleArray: function( array ) {
        var tmp, current, top = array.length;

        if(top) while(--top) {
          current = Math.floor(Math.random() * (top + 1));
          tmp = array[current];
          array[current] = array[top];
          array[top] = tmp;
        }
        return array;
      },
      wipeCardData: function( ) {
        currentFullDeck = [];
        graveYard = [];
        unusedCards = [];
        exiledCards = [];
        cardWidgets = [];
      },
      shuffle: function( ) {
        if( unusedCards.length == 0 )
          return;
        unusedCards = this.shuffleArray( unusedCards );
      },
      grabTopCard: function( ) {
        var card = unusedCards.pop( );
        return card;
      },
      loadCard: function( filename ) {
        //Need to find out about resource unloading/loading
        var cardImage = new Image( );
        cardImage.src = 'images/'+filename+'.jpg';
        return cardImage;
      },
      numCards: function( ) {
        return unusedCards.length;
      },
      loadDeck: function( ) {
        debugger;
        var me = this;
        var totalDeckSize = 0;
        me.wipeCardData( );
        //TODO pull in the JSON file from deckbox API
        $.getJSON( "decklists/deck1.JSON", function(data) {
          $.each(data.deck.card, function( i, s ) {
            //Load the image
            var imagefile = me.loadCard( s.filename );
            for( var j = 0; j < s.quantity; j++ ) {
              //Generate a new card
              totalDeckSize += 1;
              me.createCardWidget( function( obj ) {
                var deckSize = currentFullDeck.length;
                //Save the created widget and then create the card data
                cardWidgets[cardWidgets.length] = obj;
                currentFullDeck[deckSize] = new createCard( s.filename, s.name, 
                                                                      s.attack, s.defense,
                                                                      s.type, imagefile,
                                                                      obj );

                //Bind event for previewing card
                obj.on( "cardSelected", function( data ){
                  me.setCurrentSelectedCard( data );
                } );

                //If finished set up the cards and display the total loaded in
                if( totalDeckSize == currentFullDeck.length )
                {
                  //Finished Loading the deck reset cards and display deck total
                  me.resetCards( );
                  alert( "Deck Size: " + totalDeckSize );
                } 
              });
            }
            
          });
        });
      },
      onReady: function() {
        var me = this;
      }
    }
  });
})();