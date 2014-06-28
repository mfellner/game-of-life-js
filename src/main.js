/**
 * main.js
 */

require.config({
  paths: {
    'underscore': 'node_modules/underscore/underscore'
  },
  shim: {
    underscore: {
      exports: '_'
    }
  }
});


define('HashMap', function() {
  'use strict';

  var hash = function(o) {
    var p, h = '+';
    for (p in o) {
      h += o[p];
    }
    return h;
  };

  return function HashMap() {
    var that = this;

    this.put = function(key, val) {
      that[hash(key)] = val;
    };

    this.get = function(key) {
      return that[hash(key)];
    };
  };
});


define('Cell', function() {
  'use strict';

  var SIZE = 5;
  var COLOR = 'black';

  function CellException(message) {
    this.name = 'CellException';
    this.message = message;
  }

  function Cell(x, y) {
    if (arguments.length !== 2) {
      throw new CellException('Invalid arguments');
    }

    var that = this;
    this.x = x;
    this.y = y;
    this.color = COLOR;

    this.draw = function(context) {
      context.fillStyle = that.color;
      context.fillRect(that.x * SIZE, that.y * SIZE, SIZE, SIZE);
    };

    this.move = function(x, y) {
      this.x += x;
      this.y += y;
    };
  }

  Cell.prototype.size = function() {
    return SIZE;
  };

  return Cell;
});


define('GameBoard', ['underscore', 'HashMap', 'Cell'], function(_, HashMap, Cell) {
  'use strict';

  function GameBoardException(message) {
    this.name = 'GameBoardException';
    this.message = message;
  }

  return function GameBoard(seed) {

    if (!seed) {
      throw new GameBoardException('Invalid arguments');
    }

    var cells = [];

    _.each(seed, function(coords) {
      cells.push(new Cell(coords[0], coords[1]));
    });

    this.draw = function(context) {
      _.each(cells, function(cell) {
        cell.draw(context);
      });
    };

    this.tick = function(tick) {

    };
  };
});


define('canvasContext', function() {
  'use strict';

  var canvas = document.getElementById('game-board');
  var context = canvas.getContext('2d');
  context.width = canvas.width;
  context.height = canvas.height;

  return context;
});


define('GameRuntime', ['canvasContext', 'GameBoard'], function(context, GameBoard) {
  'use strict';

  function GameRuntimeException(message) {
    this.name = 'GameRuntimeException';
    this.message = message;
  }

  return function GameRuntime() {
    var that = this;

    var gameLoop = function(tick) {
      that.gameBoard.draw(context);
      that.gameBoard.tick(tick);
    };

    this.setSeed = function(seed) {
      that.seed = seed;
      that.gameBoard = new GameBoard(seed);
    };

    this.start = function() {
      if (!that.gameBoard) {
        throw new GameRuntimeException('Runtime not initialized');
      }

      that.tick = 0;
      that.intervalID = setInterval(function() {
        gameLoop(that.tick);
        that.tick += 1;
      }, 200);
    };

    this.stop = function() {
      clearInterval(that.intervalID);
    };
  };
});


require(['GameRuntime'], function(GameRuntime) {
  'use strict';

  var seed = [
    [0, 0],
    [1, 1],
    [2, 2]
  ];

  var runtime = new GameRuntime();
  runtime.setSeed(seed);

  try {
    runtime.start();
  } catch (err) {
    runtime.stop();
    console.error(err.message);
  }

  setTimeout(runtime.stop, 5000);
});
