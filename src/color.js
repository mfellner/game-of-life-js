/*
 * Color
 */
define('Color', function() {
  return function Color(r, g, b, a) {
    var that = this;
    this.r = r || 0;
    this.g = g || 0;
    this.b = b || 0;
    this.a = a || 1;

    this.toString = function() {
      return 'rgba(' + that.r + ',' + that.g + ',' + that.b + ',' + that.a + ')';
    };
  };
});
