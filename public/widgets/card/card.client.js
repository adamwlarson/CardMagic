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
        var me = this;
        var topPos = 0;
        var leftPos = ( pos * 110 ) + 100;
        this.get( "#smallCard" ).animate({
          left: leftPos,
          top: topPos
        },100, null, function() {
          me.fsm.fire('dealt');
        } );
      },
      cardRotate: function( amount ) {
        //Wow i bet theres a plugin for rotations as well since it has to be handled across all browsers
        //TODO: Look for a jQuery plugin that handles this nicely!!!
        this.get( "#smallCard" ).css( { '-webkit-transform': 'rotate(' + amount + 'deg)' } );
        this.get( "#smallCard" ).css( { 'transform': 'rotate(' + amount + 'deg)' } );
        this.get( "#smallCard" ).css( { '-moz-transform': 'rotate(' + amount + 'deg)' } );
        this.get( "#smallCard" ).css( { '-ms-transform': 'rotate(' + amount + 'deg)' } );
        this.get( "#smallCard" ).css( { '-o-transform': 'rotate(' + amount + 'deg)' } );
        this.get( "#smallCard" ).effect( "shake", { times: 1, distance: 5, direction: "up" }, 100 );
      },
      cardMouseEvent: function( enter ) {
        if( enter ){
          this.get("#smallCard").css('border', "solid 2px yellow" );
          this.get( "#smallCard" ).animate( {
            zIndex: 50000
          }, 10 ); 
        } else {
          this.get("#smallCard").css('border', "solid 0px yellow" );
          this.get( "#smallCard" ).animate( {
            zIndex: 1
          }, 10 ); 
        }
      },
      setInfo: function(data) {
        frontImage = "images/"+data.filename+".jpg";
        this.get("#smallCard").attr("src", frontImage );
      },
      flipCard: function( ) {
        this.get("#smallCard").attr("src", backImage );
      },
      initializeDraggable: function( ) {
        this.get("#smallCard").draggable( {
            revert: 'invalid',
            containment: 'window',
            distance: 15,
            opacity: 1
          });
      },
      makeDraggable: function(draggable) {
        var me = this;
        if (draggable) {
          me.get("#smallCard").draggable("option", 'disabled', false );
        } else if (!draggable) {
          me.get("#smallCard").draggable("option", 'opacity', 1.0 );
          me.get("#smallCard").draggable("option", 'disabled', true );
        }
      },
      deal: function() {
        this.dealCardAnim();
        this.fsm.fire('dealt');
      },
      onReady: function() {
        var me = this;

        me.initializeDraggable( );

        me.fsm = new feather.FiniteStateMachine({
          states: {
            initial: {
              stateStartup: function() {
                me.makeDraggable(true);
              },
              dealt: function() {
                return this.states.dealt;
              }
            },
            dealt: {
              stateStartup: function() {
                return this.states.untapped;
              }              
            },
            untapped: {
              stateStartup: function() {
                me.cardRotate( 0 );
              },
              mouseenter: function() {
                me.cardMouseEvent( true );
              },
              mouseout: function() {
                me.cardMouseEvent( false );
              },
              click: function() {
                return this.states.tapped;
              },
              viewCard: function( ) {
                return this.states.zoomed;
              }
            },
            tapped: {
              stateStartup: function() {
                me.cardRotate( 90 );
              },
              mouseenter: function() {
                me.cardMouseEvent( true );
              },
              mouseout: function() {
                me.cardMouseEvent( false );
              },
              click: function() {
                
                return this.states.untapped;
              },
              viewCard: function( ) {
                return this.states.zoomed;
              }
            },
            zoomed: {
              stateStartup: function() {
                me.makeDraggable(false);
                //alert( "Zoom In" );
                me.cardRotate( 0 );
                me.cardMouseEvent( false );
                me.get( "#smallCard" ).effect( "scale", {
                  percent: 300,
                  direction: 'both'
                }, 10);
              },
              viewCard: function( ) {
                return this.previousState;
              },
              leavingState: function( ) {
                //alert( "Zoom Out" );
                me.makeDraggable(true);
                me.get( "#smallCard" ).effect( "scale", {
                  percent: 33.33,
                  direction: 'both'
                }, 10);
              }
            }
          }
        });        

        //Bind an event to make each card highlight or scale
        me.domEvents.bind( me.get( "#smallCard"), "mouseenter", function( ) {
          me.fsm.fire("mouseenter");
        });//End Bind

        //Bind a right click event
        me.domEvents.bind( me.get( "#smallCard" ), "mousedown", function( events ) {
          if( events.which == 3 ){
            me.fsm.fire( "viewCard" );
          }
        });//End Bind

        //Turn off border and set this back to a normal zIndex
        me.domEvents.bind( me.get( "#smallCard"), "mouseout", function( ) {
          me.fsm.fire("mouseout");
        });//End Bind

        //Scale the card up for reading
        me.domEvents.bind( me.get( "#smallCard"), "dblclick", function( ) {
          me.fsm.fire("dblclick");
        });//End Bind

        //Flip the card when clicked
        me.domEvents.bind( me.get( "#smallCard"), "click", function( ) {
          me.fsm.fire("click");
        });//End Bind
      }
    }
  });
})();