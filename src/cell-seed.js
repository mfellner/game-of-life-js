/*
 * CellSeed
 */
define('CellSeed', ['underscore'], function(_) {
  'use strict';

  return function CellSeed() {
    var that = this;
    this.seeds = Array.prototype.slice.call(arguments, 0).slice(0);

    this.move = function(x, y) {
      _.each(that.seeds, function(seed) {
        seed[0] += x;
        seed[1] += y;
      });
    };
  };
});
