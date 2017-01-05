'use strict'

const config = require('../config')

module.exports = damageImmune

function damageImmune (state, sprite) {
  const disable = () => {
    sprite.visible = sprite.alive
    sprite.startDamageImmune = null
  }
  if (sprite.startDamageImmune) {
    if (!sprite.alive) {
      return disable()
    }
    const timePassed = state.time.now - sprite.startDamageImmune
    const stillImmune = timePassed < config.DAMAGE_IMMUNE_TIME
    if (stillImmune) {
      sprite.visible = timePassed % 100 < 50
    } else {
      disable()
    }
  }
}

damageImmune.isActive = function (sprite) {
  return sprite.startDamageImmune != null
}

damageImmune.start = function (state, sprite) {
  sprite.startDamageImmune = state.game.time.now
}

