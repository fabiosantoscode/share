'use strict'

const sin45 = Math.sin(Math.PI / 4)
const config = require('../config')
const makeEnemy = require('../sprites/enemy')

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
  Spawn: function ({ x, y }) {
    this.player = this.add.graphics(x * config.CELL, y * config.CELL)
    this.player.beginFill(0xFFFFFF)
    this.player.drawRect(0, 0, config.CELL, config.CELL)
    this.game.physics.arcade.enable(this.player)
    this.game.camera.follow(this.player)
  },
  Item: function ({ x, y }, itemId) {
    const item = items[itemId].call(this, x, y)
    this.items.add(item)
    this.game.physics.arcade.enable(item)
    item.body.setSize(config.CELL * 0.5, config.CELL * 0.5, config.CELL * 0.25, config.CELL * 0.25)
  },
  Enemy: function ({ x, y }, enemyId) {
    const enemy = makeEnemy(this, x, y)
  },
  Goal: function ({ x, y }) {
    const goal = this.add.graphics(x * config.CELL, y * config.CELL, this.goals)
    goal.beginFill(0xFF0000)
    goal.drawRect(0, 0, config.CELL, config.CELL)
  },
}

module.exports = {
  preload: function() {
    const loadImage = name => {
      this.load.image(name, `assets/${name}.png`)
    }
    loadImage('enemy')
    loadImage('player')
  },
  init: function (stage) {
    this.stage = stage
  },
  create: function () {
    this.game.world.setBounds(0, 0, this.stage.height * config.CELL, this.stage.width * config.CELL)
    this.goals = this.game.add.group()
    this.items = this.game.add.group()
    this.enemies = this.game.add.group()
    this.game.physics.arcade.enable(this.items)
    this.game.physics.arcade.enable(this.enemies)
    this.cursors = this.game.input.keyboard.createCursorKeys()
    this.stage.entities.forEach(([ entity, ...args ]) => {
      entities[entity].apply(this, args)
    })
    this.items.enableBody = true
    this.player.enableBody = true
  },
  update: function () {
    this.playerMovement()
    this.updateAttack()
    this.playerAction()
    this.game.physics.arcade.overlap(this.player, this.items, this.grabItem, null, this)
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
  harmEnemy: function (_, enemy) {
    enemy.startHarm = this.game.time.now
    enemy.harmDirection = this.playerDirection
    this.attack.harmedEnemy = true
    enemy.damage(config.ATTACK_STRENGTH)
  },
  grabItem: function (_, item) {
    item.destroy()
    item.effect(this)
  },
}

