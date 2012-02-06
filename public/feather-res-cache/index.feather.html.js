

/* ========== app.client.js ========== */



/* ========== deckofcards.client.js ========== */

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

/* ========== card.client.js ========== */

feather.ns("cardmagic");
(function() {
  var backImage = "images/Card Back.jpg";
  var frontImage = "images/Card Back.jpg";
  cardmagic.card = feather.Widget.create({
    name: "cardmagic.card",
    path: "widgets/card/",
    prototype: {
      onInit: function() {
        
      },
      dealCardAnim: function(pos,bTop)
      {
        var topPos = 0;
        var leftPos = ( pos * 110 ) + 100;
        this.get( "#smallCard" ).animate({
          left: leftPos,
          top: topPos
        },100 );
      },
      setInfo: function(data) {
        frontImage = "images/"+data.filename+".jpg";
        this.get("#smallCard").attr("src", frontImage );
      },
      flipCard: function( ) {
        this.get("#smallCard").attr("src", backImage );
      },
      onReady: function() {
        var me = this;
        var bFlipped = false;
        var bEnlarged = false;


        me.get("#smallCard").draggable({
          revert: "invalid"
        });
        me.get("#smallCard").draggable({containment:'window'});
        me.get("#smallCard").draggable( {distance:15} );

        //Bind an event to make each card scale to the large card size
        me.domEvents.bind( me.get( "#smallCard"), "mouseenter", function( ) {
          if( bEnlarged ) return;
          me.get( "#smallCard" ).animate( 
          {
            width: '125px',
            height: '175px',
            zIndex: 50000
          }, 10 ); 
        });

        me.domEvents.bind( me.get( "#smallCard"), "mouseout", function( ) {
          if( bEnlarged ) return;
          me.get( "#smallCard" ).animate( 
          {
            width: '100px',
            height: '150px',
            zIndex: 1
          }, 10 ); 
        });

        me.domEvents.bind( me.get( "#smallCard"), "dblclick", function( ) {
          bEnlarged = !bEnlarged;
          if( bEnlarged ) {
            me.get( "#smallCard" ).animate( 
            {
              width: '400',
              height: '600',
              zIndex: 50000
            }, 10 ); 
          } else {
            
            me.get( "#smallCard" ).animate( 
            {
              width: '100px',
              height: '150px',
              zIndex: 1
            }, 10 ); 
          }
        });

        me.domEvents.bind( me.get( "#smallCard"), "click", function( ) {
          bFlipped = !bFlipped;
          var flipAmount = 0;
          if( bFlipped ) {
            flipAmount = 90;
          }

          //Wow i bet theres a plugin for rotations as well since it has to be handled across all browsers
          me.get( "#smallCard" ).css( { '-webkit-transform': 'rotate(' + flipAmount + 'deg)' } );
          me.get( "#smallCard" ).css( { 'transform': 'rotate(' + flipAmount + 'deg)' } );
          me.get( "#smallCard" ).css( { '-moz-transform': 'rotate(' + flipAmount + 'deg)' } );
          me.get( "#smallCard" ).css( { '-ms-transform': 'rotate(' + flipAmount + 'deg)' } );
          me.get( "#smallCard" ).css( { '-o-transform': 'rotate(' + flipAmount + 'deg)' } );
          me.get( "#smallCard" ).effect( "shake", { times: 1, distance: 5, direction: "up" }, 100 );
        });
      }
    }
  });
})();

/* ========== playingboard.client.js ========== */

feather.ns("cardmagic");
(function() {
  cardmagic.playingboard = feather.Widget.create({
    name: "cardmagic.playingboard",
    path: "widgets/playingboard/",
    prototype: {
      onInit: function() {
        
      },
      onReady: function() {
        $('body').animate( 
        {
          'background-color': "#8F8"
        },
        1000 );
      }
    }
  });
})();

/* ========== handofcards.client.js ========== */

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

/* ========== container.client.js ========== */

