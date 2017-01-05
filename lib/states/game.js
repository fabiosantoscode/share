'use strict'

const assert = require('assert')
const config = require('../config')
const levels = require('../levels')
const makeEnemy = require('../sprites/enemy')
const makePlayer = require('../sprites/player')
const makeWall = require('../sprites/wall')

const sin45 = Math.sin(Math.PI / 4)

const since = when => isNaN(when) ? Infinity : Date.now() - when

const directionFromAxes = (x, y) => Math.atan2(y, x)

const items = {
  sword: function (x, y) {
    const sword = this.add.graphics(x * config.CELL, y * config.CELL, this.items)
    sword.beginFill(0xDDDDFF)
    sword.drawRect(config.CELL * 0.44, 0, config.CELL * 0.12, config.CELL * 0.75)
    sword.drawRect(config.CELL * 0.3333, config.CELL * 0.75, config.CELL * 0.3333, config.CELL * 0.05)
    sword.drawRect(config.CELL * 0.475, config.CELL * 0.75, config.CELL * 0.05, config.CELL * 0.25)
    sword.effect = function (state) {
      state.sword = true
    }
    return sword
  },
}

const entities = {
  Spawn: function (id, { x, y }) {
    this.player = global.player = makePlayer(this, x, y)
    return this.player
  },
  Item: function (id, { x, y }, itemType) {
    if (this.levelState.collectedItems.includes(id)) {
      return null
    }
    const item = items[itemType].call(this, x, y)
    item.itemId = id
    this.items.add(item)
    this.game.physics.arcade.enable(item)
    item.body.setSize(config.CELL * 0.5, config.CELL * 0.5, config.CELL * 0.25, config.CELL * 0.25)
    return item
  },
  Enemy: function (id, { x, y }, enemyId) {
    const enemy = makeEnemy(this, x, y)
    return enemy
  },
  Goal: function (id, { x, y }) {
    const goal = this.add.graphics(x * config.CELL, y * config.CELL, this.goals)
    goal.beginFill(0xFF0000)
    goal.drawRect(0, 0, config.CELL, config.CELL)
    return goal
  },
  Wall: function (id, { x, y }) {
    const wall = makeWall(this, x, y)
    return wall
  },
}

const createLevelState = () => Object.seal({
  collectedItems: []
})

module.exports = {
  preload: function() {
    const loadImage = name => {
      this.load.image(name, `assets/${name}.png`)
    }
    loadImage('enemy')
    loadImage('player')
    loadImage('wall')
  },
  init: function (stage, current, levelState, playerPositionInPreviousScreen) {
    this.stage = stage
    this.screen = current || levels.getCurrentScreen(stage, current)
    this.playerPositionInPreviousScreen = playerPositionInPreviousScreen
    this.levelState = levelState || createLevelState()
    this.game.world.setBounds(0, 0, config.SCREEN_HEIGHT * config.CELL, config.SCREEN_WIDTH * config.CELL)
    this.goals = this.game.add.group()
    this.items = this.game.add.group()
    this.enemies = this.game.add.group()
    this.walls = this.game.add.group()
    this.game.physics.arcade.enable(this.items)
    this.game.physics.arcade.enable(this.enemies)
    this.cursors = this.game.input.keyboard.createCursorKeys()
    this.items.enableBody = true
  },
  create: function () {
    this.generateEntities(this.screen)
    this.game.physics.arcade.enable(this.player)
    this.camera.follow(this.player)
    this.player.enableBody = true

    var prev = this.playerPositionInPreviousScreen
    if (prev) {
      this.player.destroy()
      const num = number => {
        assert(!isNaN(number))
        return number
      }
      const positionReset = (resetCode, playerCenter, screenLength) => {
        playerCenter /= config.CELL
        playerCenter = Math.floor(playerCenter)
        const almostACell = 1 / config.CELL
        if (resetCode === 0) { return num(playerCenter) }
        if (resetCode === -1) { return -(1/2) + almostACell }
        if (resetCode === 1) { return num(screenLength) - (1/2) - almostACell }
        assert(false)
      }
      this.player = makePlayer(
        this,
        positionReset(prev.resetX, prev.playerCenter.x, config.SCREEN_WIDTH),
        positionReset(prev.resetY, prev.playerCenter.y, config.SCREEN_HEIGHT))
    }
  },
  generateEntities: function (screen) {
    if (this.generatedEntities) {
      this.generatedEntities.forEach(ent => { ent.destroy() })
    }
    this.generatedEntities = screen.entities.map(([ entity, ...args ], index) => {
      const id = [
        'ent',
        this.stage.screens.indexOf(this.screen),
        index
      ].join('-')
      return entities[entity].apply(this, [id].concat(args))
    })
    .filter(ent => ent != null)
  },
  update: function () {
    this.playerMovement()
    this.updateAttack()
    this.updateEnemies()
    this.playerAction()
    this.game.physics.arcade.overlap(this.player, this.items, this.collectItem, null, this)
    this.game.physics.arcade.collide(this.player, this.walls)
    this.checkDoors()
  },
  playerMovement: function () {
    const bod = this.player.body
    const prevVelocityX = bod.velocity.x
    const prevVelocityY = bod.velocity.y
    if (this.cursors.left.isDown) {
      bod.velocity.x = -config.PLAYER_SPEED
    } else if (this.cursors.right.isDown) {
      bod.velocity.x = config.PLAYER_SPEED
    } else {
      bod.velocity.x = 0
    }
    if (this.cursors.up.isDown) {
      bod.velocity.y = -config.PLAYER_SPEED
    } else if (this.cursors.down.isDown) {
      bod.velocity.y = config.PLAYER_SPEED
    } else {
      bod.velocity.y = 0
    }
    if (bod.velocity.y !== 0 && bod.velocity.x !== 0) {
      bod.velocity.y *= sin45
      bod.velocity.x *= sin45
    }
    if (bod.velocity.x !== 0 || bod.velocity.y !== 0) {
      this.playerDirection = directionFromAxes(bod.velocity.x, bod.velocity.y)
    }
  },
  checkDoors: function () {
    const x = this.player.body.center.x
    const y = this.player.body.center.y
    if (x <= 0) {
      const screen = levels.getNextScreen(-1, 0, this.screen, this.stage)
      if (screen) {
        return this.changeToScreen(screen, this.player.body.center, 1, 0)
      }
    }
    if (x >= this.world.width) {
      const screen = levels.getNextScreen(1, 0, this.screen, this.stage)
      if (screen) {
        return this.changeToScreen(screen, this.player.body.center, -1, 0)
      }
    }
    if (y <= 0) {
      const screen = levels.getNextScreen(0, -1, this.screen, this.stage)
      if (screen) {
        return this.changeToScreen(screen, this.player.body.center, 0, 1)
      }
    }
    if (y >= this.world.height) {
      const screen = levels.getNextScreen(0, 1, this.screen, this.stage)
      if (screen) {
        return this.changeToScreen(screen, this.player.body.center, 0, -1)
      }
    }
  },
  changeToScreen: function (screen, playerCenter, resetX, resetY) {
    assert(screen !== this.screen)
    this.screen = screen
    game.state.start(
      'GameState',
      /*clearWorld=*/true,
      /*clearCache=*/false,
      /*...args*/ this.stage, this.screen, this.levelState, { playerCenter: playerCenter.clone(), resetX, resetY })
  },
  playerAction: function () {
    if (game.input.keyboard.isDown(32)) {
      if (this.sword && since(this.attackStart) >= config.ATTACK_COOLDOWN) {
        this.attackStart = Date.now()
        const halfCell = config.CELL * 0.5
        this.attack = this.game.add.graphics(halfCell, halfCell)
        this.player.addChild(this.attack)
        this.attack.enableBody = true
        this.attack.beginFill(0xFFFFFF)
        const startDrawX = halfCell
        const startDrawY = -halfCell
        this.attack.moveTo(startDrawX - 10, startDrawY - 10)
        this.attack.bezierCurveTo(startDrawX + 15, startDrawY + 2, startDrawX + 33, startDrawY + 12, startDrawX + 34, startDrawY + 13)
        this.attack.bezierCurveTo(startDrawX + 40, startDrawY + 37, startDrawX + 35, startDrawY + 40, startDrawX + 33, startDrawY + 60)
        this.attack.angle = this.playerDirection * (180 / Math.PI)
        this.game.physics.arcade.enable(this.attack)
        this.attack.body.immovable = true
        const offsetX = ( Math.cos(this.playerDirection) - 0.5 ) * config.ATTACK_SIZE
        const offsetY = ( Math.sin(this.playerDirection) - 0.5 ) * config.ATTACK_SIZE
        this.attack.body.setSize(config.ATTACK_SIZE, config.ATTACK_SIZE, offsetX, offsetY)
      }
    }
  },
  updateAttack: function () {
    if (this.attack && since(this.attackStart) > config.ATTACK_LIFE) {
      this.attack.destroy()
      this.attack = null
    } else if (this.attack && !this.attack.harmedEnemy) {
      this.attack.harmedEnemy =
        this.game.physics.arcade.overlap(this.attack, this.enemies, this.harmEnemy, null, this)
    }
  },
  updateEnemies: function () {
    if (this.player && !this.player.startHarm) {
      this.game.physics.arcade.overlap(this.enemies, this.player, this.harmPlayer, null, this)
    }
  },
  harmEnemy: function (_, enemy) {
    enemy.startHarm = this.game.time.now
    enemy.harmDirection = this.playerDirection
    this.attack.harmedEnemy = true
    enemy.damage(config.ATTACK_STRENGTH)
  },
  harmPlayer: function (player, enemy) {
    this.player.startHarm = this.game.time.now
    this.player.harmDirection = enemy.body.center.angle(this.player.body.center)
    this.player.damage(config.ENEMY_STRENGTH)
  },
  collectItem: function (_, item) {
    item.destroy()
    item.effect(this)
    assert(item.itemId)
    this.levelState.collectedItems.push(item.itemId)
  },
}

