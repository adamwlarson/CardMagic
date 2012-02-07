feather.ns("cardmagic");
(function() {
  cardmagic.container = feather.Widget.create({
    name: "cardmagic.container",
    path: "widgets/container/",
    prototype: {
      onInit: function() {
        
      },
      setContainerClass: function( name ) {
        this.get("#backgroundbox").addClass( name );
      },
      alignCardsInContainer: function( container, cardArray ) {
        for( var j = 0; j < cardArray.length; j++ ) {
          this.alignCardInContainer( container, cardArray[j], j);
        }
      },
      alignCardInContainer: function( container, obj, cardNum ) {
        //Variables to help space the card in the container
        var topSpacing = 10;
        var sideSpacing = 10;
        var cardWidth = 100;

        var topOffset = container.offset().top - obj.offset().top;
        topOffset += ( obj.position().top + topSpacing );
        var leftOffset = container.offset().left - obj.offset().left;
        leftOffset += ( obj.position().left + sideSpacing );
        leftOffset += ( cardNum ) * ( cardWidth + sideSpacing );

        //Move the card to that position
        obj.animate( {
            top: topOffset,
            left: leftOffset
          }, 300);
      },
      onReady: function() {
        var me = this;
        var itemsInContainer = [];
        this.get("#backgroundbox").droppable( {
          drop: function(event, ui) {
            //See if item is in list, remove it and add it to the end
            //TODO: insert into the location it is dropped rather than just the end!
            for( var i = 0; i < itemsInContainer.length; i++ ) {
              if( itemsInContainer[i] == ui.draggable ) {
                itemsInContainer.splice(i,1);
                break;
              }
            }
            itemsInContainer[itemsInContainer.length] = ui.draggable;
            me.alignCardsInContainer( $(this), itemsInContainer );
          },
          over: function(event, ui) {

          },
          out: function(events, ui) {
            //Using the revert option on the draggable causes some issues when a valid container
            //isn't found, and therefore the card isn't added to a container, I need to find a solution
            //around this problem
            for( var i = 0; i < itemsInContainer.length; i++ ) {
              if( itemsInContainer[i] == ui.draggable ) {
                //Remove this item
                itemsInContainer.splice(i,1);
              }
            }
            //Align all cards
            me.alignCardsInContainer( $(this), itemsInContainer );
          }
        });
      }
    }
  });
})();