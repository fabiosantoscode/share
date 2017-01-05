'use strict';

const config = require('../config')
const harm = require('../behaviours/harm')
const damageImmune = require('../behaviours/damage-immune')

function makePlayer(state, x, y) {
  const player = state.add.sprite(x * config.CELL, y * config.CELL, 'player')
  player.health = config.PLAYER_HEALTH
  state.game.physics.arcade.enable(player)
  player.enableBody = true;
  player.body.setSize(config.CELL, config.CELL, 0, 0)
  player.update = function ()  {
    harm(state, this)
    damageImmune(state, this)
  };
  return player
}

module.exports = makePlayer

