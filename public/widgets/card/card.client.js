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
      dealCardAnim: function(pos,bTop) {
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


        me.get("#smallCard").draggable( {
          revert: "invalid"
        });
        me.get("#smallCard").draggable( {containment:'window'} );
        me.get("#smallCard").draggable( {distance:15} );
        me.get("#smallCard").draggable( {stack:'true'} );

        //Bind an event to make each card highlight or scale
        me.domEvents.bind( me.get( "#smallCard"), "mouseenter", function( ) {
          if( bEnlarged ) return;
          me.get("#smallCard").css('border', "solid 2px yellow" );
          me.get( "#smallCard" ).animate( {
            zIndex: 50000
          }, 10 ); 
        });//End Bind

        //Turn off border and set this back to a normal zIndex
        me.domEvents.bind( me.get( "#smallCard"), "mouseout", function( ) {
          if( bEnlarged ) return;
          me.get("#smallCard").css('border', "solid 0px yellow" );
          me.get( "#smallCard" ).animate( {
            zIndex: 1
          }, 10 ); 
        });//End Bind

        //Scale the card up for reading
        me.domEvents.bind( me.get( "#smallCard"), "dblclick", function( ) {
          bEnlarged = !bEnlarged;
          if( bEnlarged ) {
            me.get( "#smallCard" ).animate( {
              zIndex: 50000
            }, 10 ); 
          } else {
            
            me.get( "#smallCard" ).animate( {
              width: '100px',
              height: '150px',
              zIndex: 1
            }, 10 ); 
          }
        });//End Bind

        //Flip the card when clicked
        me.domEvents.bind( me.get( "#smallCard"), "click", function( ) {
          bFlipped = !bFlipped;
          var flipAmount = 0;
          if( bFlipped ) {
            flipAmount = 90;
          }

          //Wow i bet theres a plugin for rotations as well since it has to be handled across all browsers
          //TODO: Look for a jQuery plugin that handles this nicely!!!
          me.get( "#smallCard" ).css( { '-webkit-transform': 'rotate(' + flipAmount + 'deg)' } );
          me.get( "#smallCard" ).css( { 'transform': 'rotate(' + flipAmount + 'deg)' } );
          me.get( "#smallCard" ).css( { '-moz-transform': 'rotate(' + flipAmount + 'deg)' } );
          me.get( "#smallCard" ).css( { '-ms-transform': 'rotate(' + flipAmount + 'deg)' } );
          me.get( "#smallCard" ).css( { '-o-transform': 'rotate(' + flipAmount + 'deg)' } );
          me.get( "#smallCard" ).effect( "shake", { times: 1, distance: 5, direction: "up" }, 100 );
        });//End Bind
      }
    }
  });
})();