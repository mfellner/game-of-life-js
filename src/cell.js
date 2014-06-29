/*
 * Cell
 */
define('Cell', ['Color'], function(Color) {
  'use strict';

  var SIZE = 5;
  var COLOR = new Color(0, 0, 0);

  function CellException(message) {
    this.name = 'CellException';
    this.message = message;
  }

  return function Cell(x, y) {

    if (arguments.length !== 2) {
      throw new CellException('Invalid arguments');
    }

    var that = this;
    this.x = x;
    this.y = y;
    this.alive = false;
    this.color = COLOR;

    this.draw = function(context) {
      if (that.alive) {
        context.fillStyle = that.color.toString();
        context.fillRect(that.x * SIZE, that.y * SIZE, SIZE, SIZE);
      } else {
        context.beginPath();
        context.lineWidth = '0.1';
        context.strokeStyle = 'red';
        context.rect(that.x * SIZE, that.y * SIZE, SIZE, SIZE);
        context.stroke();
      }
    };

    this.age = function() {
      if (that.color.a < 1) {
        that.color.a += 0.1;
      } else {
        that.color.a = 1;
      }
    };

    this.kill = function() {
      that.alive = false;
    };

    this.revive = function() {
      that.color.a = 0.5;
      that.alive = true;
    };
  };
});
