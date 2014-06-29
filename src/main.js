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
    this.values = {};

    this.put = function(key, val) {
      that.values[hash(key)] = val;
    };

    this.get = function(key) {
      return that.values[hash(key)];
    };
  };
});


define('Cell', function() {
  'use strict';

  var SIZE = 5;
  var COLOR = 'rgba(0, 0, 0, 1)';

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
    this.age = 0;
    this.alive = false;
    this.color = COLOR;

    this.draw = function(context) {
      if (that.alive) {
        context.fillStyle = that.color;
        context.fillRect(that.x * SIZE, that.y * SIZE, SIZE, SIZE);
      }
    };

    this.kill = function() {
      that.alive = false;
    };

    this.revive = function() {
      that.alive = true;
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

  var COLOR = 'rgb(230, 230, 230)';

  function GameBoardException(message) {
    this.name = 'GameBoardException';
    this.message = message;
  }

  return function GameBoard(seed, size) {
    if (!seed) {
      throw new GameBoardException('Invalid arguments');
    }

    var that = this;
    this.size = size;
    this.color = COLOR;
    this.cellMap = new HashMap();

    // Initialize board with dead cells.
    for (var i = 0; i < this.size[0]; i += 1) {
      for (var k = 0; k < this.size[1]; k += 1) {
        that.cellMap.put([i, k], new Cell(i, k));
      }
    }

    // Revive seed cells.
    _.each(seed, function(coords) {
      that.cellMap.get(coords).revive();
    });

    this.draw = function(context, tick) {
      context.clearAll(that.color);

      _.each(that.cellMap.values, function(cell) {
        cell.draw(context);
      });

      var killList = [];
      var reviveList = [];

      _.each(that.cellMap.values, function(cell) {
        var neighbourCount = 0;

        _.each([
          [-1, -1],
          [-1, +0],
          [-1, +1],
          [+0, -1],
          [+0, +1],
          [+1, -1],
          [+1, +0],
          [+1, +1]
        ], function(delta) {
          var coords = [cell.x + delta[0], cell.y + delta[1]];
          var neighbour = that.cellMap.get(coords);

          if (neighbour && neighbour.alive) {
            neighbourCount += 1;
          }
        });

        // Any live cell with fewer than two live neighbours dies
        if (cell.alive && neighbourCount < 2) {
          // console.log('Any live cell with fewer than two live neighbours dies', cell);
          killList.push(cell);
        }
        // Any live cell with more than three live neighbours dies
        else if (cell.alive && neighbourCount > 3) {
          // console.log('Any live cell with more than three live neighbours dies', cell);
          killList.push(cell);
        }
        // Any live cell with two or three live neighbours lives on
        else if (cell.alive && (neighbourCount === 2 || neighbourCount === 3)) {
          // console.log('Any live cell with two or three live neighbours lives on', cell);
          cell.age += 1;
        }
        // Any dead cell with exactly three live neighbours becomes a live cell
        else if (!cell.alive && neighbourCount === 3) {
          // console.log('Any dead cell with exactly three live neighbours becomes a live cell', cell);
          reviveList.push(cell);
        }
      });

      _.each(killList, function(cell) {
        cell.kill();
      });
      _.each(reviveList, function(cell) {
        cell.revive();
      });

      // console.log('---------TICK-----------------------------------');
    };
  };
});


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
      that.seed = seed;
      that.gameBoard = new GameBoard(seed, context.getCanvasSize());
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


require(['GameRuntime'], function(GameRuntime) {
  'use strict';

  var seed = [
    [1, 1],
    [1, 2],
    [1, 3]
  ];

  var runtime = new GameRuntime(200);
  runtime.setSeed(seed);

  try {
    runtime.start();
  } catch (err) {
    runtime.stop();
    console.error(err.message);
  }

  setTimeout(runtime.stop, 4000);
});
