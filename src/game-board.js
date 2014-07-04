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
    // this.cellMap = new HashMap();
    this.cellMap = [];
    this.liveCells = [];

    // Initialize board with dead cells.
    for (var y = 0; y < this.size[1]; y += 1) {

      this.cellMap.push([]);

      for (var x = 0; x < this.size[0]; x += 1) {

        var newCell = new Cell(x, y);
        this.cellMap[y].push(newCell);
        // that.cellMap.put([w, h], new Cell(i, k));
      }
    }

    // Revive seed cells.
    // _.each(seed, function(coords) {
    //   that.cellMap.get(coords).revive();
    // });

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

      // _.each(that.cellMap.values, function(cell) {
      //   cell.draw(context);
      // });
      // _.each(that.cellMap, function(cellRow) {
      //   _.each(cellRow, function(cell) {
      //     cell.draw(context);
      //   });
      // });
      eachCell(that.cellMap, function(cell) {
        cell.draw(context);
      });

      var killList = [];
      var reviveList = [];
      var checkList = [];

      _.each(that.liveCells, function(cell) {
        checkList.push(cell);
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
          var x = cell.x + delta[0];
          var y = cell.y + delta[1];

          if (
            y >= 0 && x >= 0 &&
            y < that.cellMap.length &&
            x < that.cellMap[y].length
          ) {
            checkList.push(that.cellMap[y][x]);
          }
        });
      });

      // _.each(that.cellMap.values, function(cell) {
      _.each(checkList, function(cell) {
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
          // var coords = [cell.x + delta[0], cell.y + delta[1]];
          // var neighbour = that.cellMap.get(coords);
          var x = cell.x + delta[0];
          var y = cell.y + delta[1];

          if (
            y >= 0 && x >= 0 &&
            y < that.cellMap.length &&
            x < that.cellMap[y].length &&
            that.cellMap[y][x].alive
          ) {
            neighbourCount += 1;
          }

          // if (neighbour && neighbour.alive) {
          //   neighbourCount += 1;
          // }
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
      that.liveCells = _.without(that.liveCells, killList);
      that.liveCells = _.union(that.liveCells, reviveList);
      // console.log('---------TICK-----------------------------------');
    };
  };
});
