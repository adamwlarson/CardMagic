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
        //cardImage.src = 'images/'+filename+'.jpg';
        cardImage.src = filename;
        return cardImage;
      },
      numCards: function( ) {
        return unusedCards.length;
      },
      loadDeck: function( ) {
        //debugger;
        var me = this;
        var totalDeckSize = 0;
        me.wipeCardData( );

        $.getJSON( "decklists/BW Human_Vampire_3_with_metadata.json", function( data ) {
          //alert( "Hello" + data.deck[0] );
          $.each( data.deck, function( i, s ){
            //alert( i + s.imageUrl );
            console.log( s.imageUrl );
            var imagefile = me.loadCard( s.imageUrl );
            for( var j = 0; j < s.count; j++ ) {
              //Generate a new card
              totalDeckSize += 1;
              me.createCardWidget( function( obj ) {
                var deckSize = currentFullDeck.length;
                cardWidgets[cardWidgets.length] = obj;
                currentFullDeck[deckSize] = new createCard( s.imageUrl, s.name, 
                                                                      0,0,
                                                                      "None", imagefile,
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