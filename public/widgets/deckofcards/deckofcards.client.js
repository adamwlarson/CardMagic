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
      saveCardWidgets: function( ) {
        //Is there a better way to reference these without storing as an array?
        cardWidgets = [this.card1, this.card2, this.card3, this.card4, this.card5,
                       this.card6, this.card7, this.card8, this.card9, this.card10,
                       this.card11, this.card12, this.card13,this.card14, this.card15,
                       this.card16, this.card17, this.card18, this.card19, this.card20,
                       this.card21, this.card22, this.card23, this.card24, this.card25,
                       this.card26, this.card27, this.card28, this.card29, this.card30,
                       this.card31, this.card32, this.card33, this.card34, this.card35,
                       this.card36, this.card37, this.card38, this.card39, this.card40,
                       this.card41, this.card42, this.card43, this.card44, this.card45,
                       this.card46, this.card47, this.card48, this.card49, this.card50,
                       this.card51, this.card52, this.card53, this.card54, this.card55,
                       this.card56, this.card57, this.card58, this.card59, this.card60];
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
        var me = this;
        me.wipeCardData( );
        me.saveCardWidgets( );
        $.getJSON( "decklists/deck1.JSON", function(data){
          $.each(data.deck.card, function( i, s ) {
            //Load the image
            var imagefile = me.loadCard( s.filename );
            for( var j = 0; j < s.quantity; j++ )
            {
              //Generate a new card
              var deckSize = currentFullDeck.length;
              currentFullDeck[deckSize] = new createCard( s.filename, s.name, 
                                                                      s.attack, s.defense,
                                                                      s.type, imagefile,
                                                                      (cardWidgets[deckSize] ) );
            }
          });
          alert( "Number of Cards in Deck " + currentFullDeck.length );
          me.resetCards( );
        });
      },
      onReady: function() {
        var me = this;
      }
    }
  });
})();