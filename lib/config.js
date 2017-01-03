'use strict'

const CELL = 64
const cells = n => n * CELL

module.exports = {
  CELL,
  PLAYER_SIZE: 1 * CELL,
  PLAYER_SPEED: 555,
  PLAYER_HEALTH: 10,
  ENEMY_SPEED: cells(3),
  ENEMY_HEALTH: 3,
  ENEMY_STRENGTH: 1,
  ATTACK_SIZE: cells(1.5),
  ATTACK_LIFE: 50,
  ATTACK_STRENGTH: 1,
  ATTACK_COOLDOWN: 100,
  KICKBACK_TIME: 200,
  KICKBACK_SPEED: cells(8),
}

