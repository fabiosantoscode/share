'use strict'

const CELL = 64
const cells = n => n * CELL

module.exports = {
  CELL,
  PLAYER_SIZE: 1 * CELL,
  ENEMY_SPEED: cells(3),
}

