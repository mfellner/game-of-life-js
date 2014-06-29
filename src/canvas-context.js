/*
 * Canvas Context
 */
define('canvasContext', function() {
  'use strict';

  var canvas = document.getElementById('game-board');
  var context = canvas.getContext('2d');

  context.clearAll = function(color) {
    context.fillStyle = color;
    context.fillRect(0, 0, canvas.width, canvas.height);
  };

  context.getCanvasSize = function() {
    return [canvas.width, canvas.height];
  };

  return context;
});
