'use strict';

const config = require('../config')

const directionFromAxes = (x, y) => Math.atan2(y, x)

function makeEnemy(game, x, y, destination) {
  const enemy = game.add.sprite(x * config.CELL, y * config.CELL, 'enemy')
  enemy.health = config.ENEMY_HEALTH
  game.physics.arcade.enable(enemy)
  if (game.enemies) {
    game.enemies.add(enemy)
  }
  enemy.enableBody = true;
  enemy.body.setSize(config.CELL, config.CELL, 0, 0)
  enemy.update = function ()  {
    const following = !!game.player
    if (game.player) {
      enemy.body.velocity.x = Math.sign(-(enemy.body.position.x - game.player.body.position.x))
      enemy.body.velocity.y = Math.sign(-(enemy.body.position.y - game.player.body.position.y))
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

