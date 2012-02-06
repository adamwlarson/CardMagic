var deckApi = exports.DeckApi = function(feather) {
  this.feather = feather;
};

deckApi.prototype = {

  area: function(r) {
    var PI = 3.14;
    return PI * r * r;
  },

  circumference: function(r) {
    var PI = 3.14;
    return 2 * PI * r;
  }
};