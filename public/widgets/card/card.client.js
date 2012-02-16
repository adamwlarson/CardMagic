feather.ns("cardmagic");
(function() {
  cardmagic.card = feather.Widget.create({
    name: "cardmagic.card",
    path: "widgets/card/",
    prototype: {
      onInit: function() {
        this.myZIndex = 0;
        this.isFlipped = true; //Back up
        this.frontImage = "images/Card Back.jpg";
        this.backImage = "images/Card Back.jpg";
      },
      untapCard: function( ) {
        this.fsm.fire('untap');
      },
      toggleMenu: function( show ) {
        var me = this;
        if( show ) {
          me.get(".dropdown").show();
          me.get(".dropdown dd ul").show( );
          me.get( ".dropdown" ).offset( {
            top: me.get( "#smallCard" ).offset( ).top - 100,
            left: me.get( "#smallCard" ).offset( ).left
          } );
        } else {
          me.get(".dropdown").hide();
          me.get(".dropdown dd ul").hide( );
        }
      },
      setStartContainer: function( container ) {
        //This sets up which container the card is started in, this could be saved eventually
        //To handle the case when the card is dropped invalidly
        container.addCard( this.get( "#smallCard" ) );
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
        var currentZIndex = this.get( "#smallCard" ).css( 'z-index' );
        if( enter ){
          this.fire( "cardSelected", this.get( "#smallCard" ).attr( "src") );
          this.get("#smallCard").css('border', "solid 2px yellow" );
        } else {
          this.get("#smallCard").css('border', "solid 0px yellow" );
        }
      },
      setInfo: function(data) {
        //this.frontImage = "images/"+data.filename+".jpg";
        this.frontImage = data.filename;
        this.get("#smallCard").attr("src", this.frontImage );
        this.isFlipped = false; //Automatically flip face up
        this.fsm.fire('dealt');
      },
      flipCard: function( ) {
        this.isFlipped = !this.isFlipped;
        var img = this.isFlipped ? this.backImage : this.frontImage;
        this.get("#smallCard").attr("src", img );
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
          me.get("#cardContainer").draggable("option", 'disabled', false );
        } else if (!draggable) {
          me.get("#cardContainer").draggable("option", 'opacity', 1.0 );
          me.get("#cardContainer").draggable("option", 'disabled', true );
        }
      },
      onReady: function() {
        var me = this;
        var menuVisible = false;

        me.initializeDraggable( );
        me.get(".dropdown").hide();

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
              tap: function() {
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
              untap: function() {
                
                return this.states.untapped;
              },
              viewCard: function( ) {
                return this.states.zoomed;
              },
              untap: function( ) {
                return this.states.untapped;
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
          //Right click event
          /*if( events.which == 3 ){
            me.fsm.fire( "viewCard" );
          }*/
        });//End Bind

        //Untap
        me.domEvents.bind( me.get( "#untapCard" ), "click", function( ) {
          menuVisible = false;
          me.toggleMenu( menuVisible );
          me.fsm.fire( "untap" );
        });//End Bind

        //Untap
        me.domEvents.bind( me.get( "#tapCard" ), "click", function( ) {
          menuVisible = false;
          me.toggleMenu( menuVisible );
          me.fsm.fire( "tap" );
        });//End Bind

        //Turn over
        me.domEvents.bind( me.get( "#flipCard" ), "click", function( ) {
          menuVisible = false;
          me.toggleMenu( menuVisible );
          me.flipCard( );
        });

        //Turn off border and set this back to a normal zIndex
        me.domEvents.bind( me.get( "#smallCard"), "mouseout", function( ) {
          me.fsm.fire("mouseout");
          //me.toggleMenu( false );
        });//End Bind

        //Scale the card up for reading
        me.domEvents.bind( me.get( "#smallCard"), "dblclick", function( ) {
          me.fsm.fire("dblclick");
        });//End Bind

        //Flip the card when clicked
        me.domEvents.bind( me.get( "#smallCard"), "click", function( ) {
          //me.fsm.fire("click");
          menuVisible = !menuVisible;
          me.toggleMenu( menuVisible );
        });//End Bind
      }
    }
  });
})();