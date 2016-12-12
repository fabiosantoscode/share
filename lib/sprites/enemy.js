'use strict';

const config = require('../config')

const directionFromAxes = (x, y) => Math.atan2(y, x)

const bipolar = n => n === 0 ? 0 : n < 0 ?  -1 : 1

function makeEnemy(game, x, y, destination) {
  const enemy = game.add.graphics(x * config.CELL, y * config.CELL)
  game.physics.arcade.enable(enemy)
  if (game.enemies) {
    game.enemies.add(enemy)
  }
  enemy.beginFill(0xDD0000)
  enemy.drawRect(0, 0, config.CELL, config.CELL)
  enemy.enableBody = true;
  enemy.body.setSize(config.CELL, config.CELL, 0, 0)
  enemy.update = function ()  {
    const following = !!game.player
    if (game.player) {
      enemy.body.velocity.x = bipolar(-(enemy.body.position.x - game.player.body.position.x))
      enemy.body.velocity.y = bipolar(-(enemy.body.position.y - game.player.body.position.y))
      enemy.body.velocity.normalize()
      enemy.body.velocity.multiply(config.ENEMY_SPEED, config.ENEMY_SPEED)
    }
    if (enemy.startHarm) {
      const stillBeingHarmed = game.time.now - enemy.startHarm < config.KICKBACK_TIME
      if (stillBeingHarmed) {
        enemy.body.velocity.x = config.KICKBACK_SPEED * Math.cos(enemy.harmDirection)
        enemy.body.velocity.y = config.KICKBACK_SPEED * Math.sin(enemy.harmDirection)
      } else {
        enemy.startHarm = null
      }
    }
  };
  return enemy
}

module.exports = makeEnemy

