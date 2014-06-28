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

  function CellException(message) {
    this.name = 'CellException';
    this.message = message;
  }

  function Cell(x, y) {
    if (arguments.length !== 2) {
      throw new CellException('Invalid arguments');
    }

    this.x = x;
    this.y = y;

    this.draw = function(context) {
      context.fillRect(this.x * SIZE, this.y * SIZE, SIZE, SIZE);
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

  return function GameBoard(seed) {

    // var cells = (function(seed) {
    var cells = [];
    _.each(seed, function(coords) {
      cells.push(new Cell(coords[0], coords[1]));
    });
    //   return cells;
    // }(seed));

    this.draw = function(context) {
      _.each(cells, function(cell) {
        cell.draw(context);
      });
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

require(['underscore', 'canvasContext', 'GameBoard'], function(_, context, GameBoard) {
  'use strict';

  var seed = [
    [0, 0],
    [1, 1],
    [2, 2]
  ];

  var board = new GameBoard(seed);
  board.draw(context);
});
