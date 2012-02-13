feather.ns("cardmagic");
(function() {
  cardmagic.preview = feather.Widget.create({
    name: "cardmagic.preview",
    path: "widgets/preview/",
    prototype: {
      onInit: function() {
        
      },
      onReady: function() {
        
      },
      setInfo: function(data) {
        this.get("#previewCard").attr("src", data );
      }
    }
  });
})();