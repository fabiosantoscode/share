'use strict'

const config = require('../config')

module.exports = function (state, sprite) {
  if (sprite.startHarm) {
    const stillBeingHarmed = state.time.now - sprite.startHarm < config.KICKBACK_TIME
    if (stillBeingHarmed) {
      sprite.body.velocity.x = config.KICKBACK_SPEED * Math.cos(sprite.harmDirection)
      sprite.body.velocity.y = config.KICKBACK_SPEED * Math.sin(sprite.harmDirection)
    } else {
      sprite.startHarm = null
    }
  }
}

