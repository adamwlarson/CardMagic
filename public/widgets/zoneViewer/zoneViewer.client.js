feather.ns("cardmagic");
(function() {
  cardmagic.zoneViewer = feather.Widget.create({
    name: "cardmagic.zoneViewer",
    path: "widgets/zoneViewer/",
    prototype: {
      onInit: function() {
        
      },
      onReady: function() {
        this.get('#tabs').tabs();
      }
    }
  });
})();