feather.ns("cardmagic");
(function() {

  var containers = new feather.Registry();

  cardmagic.container = feather.Widget.create({
    name: "cardmagic.container",
    path: "widgets/container/",
    prototype: {
      onInit: function() {
        var me = this;
        containers.add(this);

        this.cards = new feather.Registry({
          on: {
            itemAdded: function(card) {
              containers.fire("cardAdded", me, card);
            },
            itemRemoved: function(card) {
              me.alignCardsInContainer();
            }
          }
        });

        containers.on("cardAdded", function(container, card) {
          if (container !== me) {
            me.cards.remove(card);
          }
        });
      },
      onReady: function() {
        var me = this;
        this.container.droppable( {
          drop: function(event, ui) {
            //See if item is in list, remove it and add it to the end
            //TODO: insert into the location it is dropped rather than just the end!
            var card = $(ui.draggable).data("card");
            me.addCard( card );
          }
        });
      },
      alignCardsInContainer: function() {
        var me = this;
        me.cards.each(_.bind(me.alignCardInContainer, me));
        /* the above is functionally equivalent to this...
        me.cards.each(function(card, index) {
          me.alignCardInContainer(card, index);
        });
        */
      },
      alignCardInContainer: function( card, cardNum ) { 
        var container = this.container;
        var obj = card.container;
        var cardArray = this.cards.items;
        var containerWidth = parseInt( container.width(), 10 );
        var cardPos = cardNum;

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
      addCardToEnd: function(card){
        this.addCard(card, this.cards.items.length);
      },
      addCard: function( card, index ) {
        var me = this;
        me.cards.remove(card);

        var currentBestDist = 999999;
        var insertIndex;
        if( typeof index === "undefined" ) {
          insertIndex = me.cards.items.length;
          me.cards.each(function(_card, i) {
            var dist = _card.container.offset( ).left - card.container.offset( ).left;
            if( Math.abs( dist ) < currentBestDist ) {
              currentBestDist = Math.abs( dist );
              insertIndex = (dist < 0) ? (i+1) : i;
            }
          });
        } else {
          insertIndex = index;
        }

        if (insertIndex > me.cards.items.length) {
          insertIndex = me.cards.items.length;
        }

        //move the card to this container
        card.container.remove().appendTo(me.container);

        //testing...
        card.container.addClass("test");

        me.cards.add(card, insertIndex);
        me.alignCardsInContainer();
      },
      dispose: function() {
        containers.remove(this);
        cardmagic.container._super.prototype.dispose.apply(this, arguments);
      }
    }
  });
})();