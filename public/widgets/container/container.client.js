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
      onReady: function() {
        this.get("#backgroundbox").droppable({
          drop: function() { alert('dropped'); },
          out: function() { alert('removed'); }
        });
      }
    }
  });
})();