/*
 * HashMap
 */
define('HashMap', function() {
  'use strict';

  var hash = function(o) {
    var p, h = '';
    for (p in o) {
      h += '+' + String(o[p]);
    }
    return h;
  };

  return function HashMap() {
    var that = this;
    this.values = {};

    this.put = function(key, val) {
      that.values[hash(key)] = val;
    };

    this.get = function(key) {
      return that.values[hash(key)];
    };
  };
});
