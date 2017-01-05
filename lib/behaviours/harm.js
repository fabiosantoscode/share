'use strict'

const config = require('../config')

module.exports = harm

function harm (state, sprite) {
  if (sprite.startHarm) {
    const stillActive = state.time.now - sprite.startHarm < config.KICKBACK_TIME
    if (stillActive) {
      sprite.body.velocity.x = config.KICKBACK_SPEED * Math.cos(sprite.harmDirection)
      sprite.body.velocity.y = config.KICKBACK_SPEED * Math.sin(sprite.harmDirection)
    } else {
      sprite.startHarm = null
    }
  }
}

harm.start = function (state, sprite, harmDirection) {
  sprite.startHarm = state.game.time.now
  sprite.harmDirection = harmDirection
}

