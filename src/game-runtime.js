/*
 * GameRuntime
 */
define('GameRuntime', ['canvasContext', 'GameBoard'], function(context, GameBoard) {
  'use strict';

  function GameRuntimeException(message) {
    this.name = 'GameRuntimeException';
    this.message = message;
  }

  return function GameRuntime(interval) {
    var that = this;

    var gameLoop = function(tick) {
      that.gameBoard.draw(context, tick);
    };

    this.setSeed = function(seed) {
      var w = context.getCanvasSize()[0] / 5; // FIXME
      var h = context.getCanvasSize()[1] / 5; // FIXME
      that.seed = seed;
      that.gameBoard = new GameBoard(seed, [w, h]);
    };

    this.start = function() {
      if (!that.gameBoard) {
        throw new GameRuntimeException('Runtime not initialized');
      }

      that.tick = 0;
      that.intervalID = setInterval(function() {
        gameLoop(that.tick);
        that.tick += 1;
      }, interval || 1);
    };

    this.stop = function() {
      clearInterval(that.intervalID);
    };
  };
});
