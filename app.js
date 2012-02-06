exports.onReady = function(feather) {
  var DeckApi = require("./lib/cardsapi").DeckApi;
  feather.deck = {
    api: new DeckApi(feather)
  };
};