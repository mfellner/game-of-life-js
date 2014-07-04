/*
 * Require.js config
 */
require.config({
  paths: {
    'underscore': 'node_modules/underscore/underscore',
    'canvasContext': 'src/canvas-context',
    'Color': 'src/color',
    'HashMap': 'src/hash-map',
    'CellSeed': 'src/cell-seed',
    'Cell': 'src/cell',
    'GameBoard': 'src/game-board',
    'GameRuntime': 'src/game-runtime'
  }
});


/*
 * Main application
 */
require(['GameRuntime', 'CellSeed'], function(GameRuntime, CellSeed) {
  'use strict';

  var blinker = new CellSeed(
    [1, 0], [1, 1], [1, 2]
  );

  var toad = new CellSeed(
    [1, 0], [2, 0], [3, 0], [0, 1], [1, 1], [2, 1]
  );

  var beacon = new CellSeed(
    [0, 0], [0, 1], [1, 0], [2, 3], [3, 2], [3, 3]
  );

  var gliderGun = new CellSeed(
    [0, 4], [1, 4],
    [0, 5], [1, 5],
    //
    [12, 2], [13, 2],
    [11, 3], [15, 3],
    [10, 4], [16, 4],
    [10, 5], [14, 5], [16, 5], [17, 5],
    [10, 6], [16, 6],
    [11, 7], [15, 7],
    [12, 8], [13, 8],
    //
    [24, 0],
    [22, 1], [24, 1],
    [20, 2], [21, 2],
    [20, 3], [21, 3],
    [20, 4], [21, 4],
    [22, 5], [24, 5],
    [24, 6],
    //
    [34, 2], [35, 2],
    [34, 3], [35, 3]
  );

  blinker.move(0, 0);
  toad.move(5, 1);
  beacon.move(11, 0);
  gliderGun.move(0, 10);

  var seed = [].concat(
    blinker.seeds,
    toad.seeds,
    beacon.seeds,
    gliderGun.seeds
  );

  var runtime = new GameRuntime(50);

  try {
    runtime.setSeed(seed);
    runtime.start();
  } catch (err) {
    runtime.stop();
    console.error(err.message);
  }

  setTimeout(runtime.stop, 30000);
});
