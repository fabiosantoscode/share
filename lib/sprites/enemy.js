'use strict';

const config = require('../config')
const harm = require('../behaviours/harm')

const stickToZero = x => (x > -2 && x < 2) ? 0 : Math.sign(x)

function makeEnemy(game, x, y) {
  const enemy = game.add.sprite(x * config.CELL, y * config.CELL, 'enemy')
  enemy.health = config.ENEMY_HEALTH
  game.physics.arcade.enable(enemy)
  enemy.enableBody = true;
  enemy.body.setSize(config.CELL, config.CELL, 0, 0)
  enemy.update = function ()  {
    if (game.player && game.player.alive) {
      enemy.body.velocity.x = stickToZero(game.player.body.center.x - enemy.body.center.x)
      enemy.body.velocity.y = stickToZero(game.player.body.center.y - enemy.body.center.y)
      enemy.body.velocity.normalize()
      enemy.body.velocity.multiply(config.ENEMY_SPEED, config.ENEMY_SPEED)
    } else if (enemy.body.velocity.x || enemy.body.velocity.y) {
      enemy.body.velocity.setTo(0, 0)
    }
    harm(game, this)
  };
  return enemy
}

module.exports = makeEnemy

