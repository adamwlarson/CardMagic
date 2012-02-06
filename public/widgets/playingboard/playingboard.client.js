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