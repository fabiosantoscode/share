'use strict';

const config = require('../config')

function makeWall(game, x, y) {
  const wall = game.add.sprite(x * config.CELL, y * config.CELL, 'wall')
  game.physics.arcade.enable(wall)
  wall.enableBody = true;
  wall.body.setSize(config.CELL, config.CELL, 0, 0)
  wall.body.immovable = true
  game.walls.add(wall)
  return wall
}

module.exports = makeWall

