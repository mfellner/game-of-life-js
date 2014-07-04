/*
 * GameBoard
 */
define('GameBoard', ['underscore', 'Cell'], function(_, Cell) {
  'use strict';

  var BG_COLOR = 'rgb(230, 230, 230)';

  function GameBoardException(message) {
    this.name = 'GameBoardException';
    this.message = message;
  }

  function eachCell(cellMap, fn) {
    _.each(cellMap, function(cellRow) {
      _.each(cellRow, fn);
    });
  }

  return function GameBoard(seed, size) {

    if (arguments.length != 2) {
      throw new GameBoardException('Invalid arguments');
    }

    console.log('new GameBoard', size);

    var that = this;
    this.size = size;
    this.color = BG_COLOR;
    this.cellMap = [];
    this.liveCells = [];

    // Initialize board with dead cells.
    for (var y = 0; y < this.size[1]; y += 1) {

      this.cellMap.push([]);

      for (var x = 0; x < this.size[0]; x += 1) {

        var newCell = new Cell(x, y);
        this.cellMap[y].push(newCell);
      }
    }

    // Revive seed cells.
    _.each(seed, function(coords) {
      var x = coords[0];
      var y = coords[1];
      var cell = that.cellMap[y][x];
      cell.revive();
      that.liveCells.push(cell);
    });

    this.draw = function(context, tick) {
      context.clearAll(that.color);

      eachCell(that.cellMap, function(cell) {
        cell.draw(context);
      });

      var killList = [];
      var reviveList = [];
      var checkList = [];

      // Do for each cell and its 8 neighbours.
      var forEachNeighbour = function(cell, fn) {
        _.each([
          [-1, -1],
          [-1, +0],
          [-1, +1],
          [+0, -1],
          [+0, +0],
          [+0, +1],
          [+1, -1],
          [+1, +0],
          [+1, +1]
        ], function(delta) {
          var x = cell.x + delta[0];
          var y = cell.y + delta[1];

          if (
            y >= 0 && x >= 0 &&
            y < that.cellMap.length &&
            x < that.cellMap[y].length
          ) {
            fn(that.cellMap[y][x]);
          }
        });
      };

      // Apply rules to cells. The only cells that potentially need
      // to be updated, are the live cells and their neighbours.
      _.each(that.liveCells, function(liveCell) {
        forEachNeighbour(liveCell, function(cell) {

          var neighbourCount = 0;

          // Count live neighbour cells.
          forEachNeighbour(cell, function(neighbour) {
            if (cell !== neighbour && neighbour.alive) {
              neighbourCount += 1;
            }
          });

          // Any live cell with fewer than two live neighbours dies
          if (cell.alive && neighbourCount < 2) {
            killList.push(cell);
          }
          // Any live cell with more than three live neighbours dies
          else if (cell.alive && neighbourCount > 3) {
            killList.push(cell);
          }
          // Any live cell with two or three live neighbours lives on
          else if (cell.alive && (neighbourCount === 2 || neighbourCount === 3)) {
            cell.age();
          }
          // Any dead cell with exactly three live neighbours becomes a live cell
          else if (!cell.alive && neighbourCount === 3) {
            reviveList.push(cell);
          }

        });
      });

      // Kill/revive cells and update live cell set.
      _.each(killList, function(cell) {
        cell.kill();
      });
      _.each(reviveList, function(cell) {
        cell.revive();
      });
      that.liveCells = _.without(that.liveCells, killList);
      that.liveCells = _.union(that.liveCells, reviveList);
    };
  };
});
