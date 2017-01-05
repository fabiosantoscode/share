'use strict'

const assert = require('assert')
const config = require('./config')

const assertAndReturn = value => {
  assert(value)
  return value
}

module.exports = {
  getCurrentScreen: function (level, current) {
    if (current != null) {
      return assertAndReturn(level.screens[current])
    }
    return assertAndReturn(
      level.screens.find(screen =>
        screen.entities.find(ent => ent[0] === 'Spawn')))
  },
  getNextScreen: function (x, y, screen, stage) {
    assert(x === 0 || x === 1 || x === -1)
    assert(y === 0 || y === 1 || y === -1)
    assert(x !== 0 || y !== 0)

    const newX = screen.x + x
    const newY = screen.y + y

    if (
      newX < 0 || newX >= stage.width ||
      newY < 0 || newY >= stage.height
    ) {
      return undefined
    }

    return assertAndReturn(
      stage.screens.find(scr =>
        scr.x === newX && scr.y === newY))
  },
}
