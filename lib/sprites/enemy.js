'use strict';

const config = require('../config')

const directionFromAxes = (x, y) => Math.atan2(y, x)

const bipolar = n => n === 0 ? 0 : n < 0 ?  -1 : 1

function makeEnemy(game, x, y, destination) {
  const enemy = game.add.graphics(x * config.CELL, y * config.CELL)
  game.physics.enable(enemy, Phaser.Physics.ARCADE);
  enemy.enableBody = true;
  enemy.beginFill(0xDD0000)
  enemy.drawRect(0, 0, config.CELL, config.CELL)
  enemy.update = function ()  {
    if (game.player) {
      enemy.body.velocity.x = bipolar(-(enemy.body.position.x - game.player.body.position.x))
      enemy.body.velocity.y = bipolar(-(enemy.body.position.y - game.player.body.position.y))
      enemy.body.velocity.normalize()
      enemy.body.velocity.multiply(config.ENEMY_SPEED, config.ENEMY_SPEED)
    }
  };
  return enemy
}

module.exports = makeEnemy

