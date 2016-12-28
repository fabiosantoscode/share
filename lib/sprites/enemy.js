'use strict';

const config = require('../config')
const harm = require('../behaviours/harm')

function makeEnemy(game, x, y) {
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
    harm(game, this)
  };
  return enemy
}

module.exports = makeEnemy

