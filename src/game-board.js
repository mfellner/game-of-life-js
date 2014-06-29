/*
 * GameBoard
 */
define('GameBoard', ['underscore', 'HashMap', 'Cell'], function(_, HashMap, Cell) {
  'use strict';

  var BG_COLOR = 'rgb(230, 230, 230)';

  function GameBoardException(message) {
    this.name = 'GameBoardException';
    this.message = message;
  }

  return function GameBoard(seed, size) {

    if (arguments.length != 2) {
      throw new GameBoardException('Invalid arguments');
    }

    console.log('new GameBoard', size);

    var that = this;
    this.size = size;
    this.color = BG_COLOR;
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

        // Count 8 nearest neighbours of the cell.
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
          cell.age();
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
