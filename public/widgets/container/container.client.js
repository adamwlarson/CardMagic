feather.ns("cardmagic");
(function() {
  cardmagic.container = feather.Widget.create({
    name: "cardmagic.container",
    path: "widgets/container/",
    prototype: {
      onInit: function() {
        this.itemsInContainer = new Array( );
        this.enableAutoSpacing = true;
      },
      setAutoSpacing: function( flag ) {
        this.enableAutoSpacing = flag;
      },
      setContainerClass: function( name ) {
        this.get("#backgroundbox").addClass( name );
      },
      alignCardsInContainer: function( container, cardArray ) {
        for( var j = 0; j < cardArray.length; j++ ) {
          this.alignCardInContainer( container, cardArray[j], j, cardArray);
        }
      },
      alignCardInContainer: function( container, obj, cardNum, cardArray ) { 

        var containerWidth = parseInt( this.get( "#backgroundbox" ).css( 'width' ), 10 );
        var cardPos = this.enableAutoSpacing ? cardNum : 0;

        //Variables to help space the card in the container
        var topSpacing = 10,
          sideSpacing = 10,
          cardWidth = 100,
          topOffset = 0,
          leftOffset = 0;

        var totalCardSpacing = ( cardArray.length * cardWidth );
        totalCardSpacing += ( sideSpacing * ( cardArray.length + 1 ) );

        //Top offset will never go away
        topOffset = container.offset().top - obj.offset().top;
        topOffset += ( obj.position().top + topSpacing );
        leftOffset = container.offset().left - obj.offset().left;
        leftOffset += ( obj.position().left + sideSpacing );

        if( totalCardSpacing < containerWidth ) {
          leftOffset += ( cardPos ) * ( cardWidth + sideSpacing ) + ( (containerWidth - totalCardSpacing) / 2 );
        } else {
          //Need to start overlapping
          //Calculate the overlap amount
          var numOfOverlaps = cardArray.length - 1; //Remember each card will overlap so this will be effect by x2
          var amountOfOverlapNeeded = totalCardSpacing - containerWidth;
          amountOfOverlapNeeded /= ( numOfOverlaps );
          //Now adjust the cards to slightly overlap
          //Also remember the spacing is calcuated into this so 
          leftOffset += ( cardPos ) * ( cardWidth + sideSpacing ) - ( ( cardPos ) * amountOfOverlapNeeded );
        }
        //Move the card to that position
        obj.animate( {
            top: topOffset,
            left: leftOffset,
            zIndex: (cardNum + 1)
          }, 50);
      },
      addCard:function( card, fromDrop ) {
        var me = this;
        for( var i = 0; i < me.itemsInContainer.length; i++ ) {
          if( me.itemsInContainer[i].attr('id') == card.attr('id') ) {
            me.itemsInContainer.splice(i,1);
            break;
          }
        }

        var currentBestDist = 999999;
        var currentBestInsertIdx = me.itemsInContainer.length;
        if( fromDrop && this.enableAutoSpacing ) {
          for( var i = 0; i < me.itemsInContainer.length; i++ ) {
            var dist = me.itemsInContainer[i].offset( ).left - card.offset( ).left;
            if( Math.abs( dist ) < currentBestDist ) {
              currentBestDist = Math.abs( dist );
              currentBestInsertIdx = (dist < 0) ? (i+1) : i;
            }
          }
        }
        me.itemsInContainer.splice( currentBestInsertIdx, 0, card );
        me.alignCardsInContainer( me.get("#backgroundbox"), me.itemsInContainer );
      },
      removeCard: function( card ) {
        var me = this;
        for( var i = 0; i < me.itemsInContainer.length; i++ ) {
          if( me.itemsInContainer[i].attr('id') == card.attr('id') ) {
            //Remove this item
            me.itemsInContainer.splice(i,1);
          }
        }
        //Align all cards
        me.alignCardsInContainer( me.get("#backgroundbox"), me.itemsInContainer );
      },
      onReady: function() {
        var me = this;
        this.get("#backgroundbox").droppable( {
          drop: function(event, ui) {
            //See if item is in list, remove it and add it to the end
            //TODO: insert into the location it is dropped rather than just the end!
            me.addCard( ui.draggable, true );
          },
          over: function(event, ui) {

          },
          out: function(events, ui) {
            //Using the revert option on the draggable causes some issues when a valid container
            //isn't found, and therefore the card isn't added to a container, I need to find a solution
            //around this problem
            me.removeCard( ui.draggable );
          }
        });
      }
    }
  });
})();