'use strict'

const CELL = 64
const PLAYER_SIZE = 1 * CELL
const WALK_SPEED = 555
const ATTACK_LIFE = 50
const ATTACK_COOLDOWN = 100
const sin45 = Math.sin(Math.PI / 4)

const since = when => isNaN(when) ? Infinity : Date.now() - when

const directionFromAxes = (x, y) => Math.atan2(y, x)

const items = {
  sword: function (x, y) {
    const sword = this.add.graphics(x * CELL, y * CELL, this.items)
    sword.beginFill(0xDDDDFF)
    sword.drawRect(CELL * 0.44, 0, CELL * 0.12, CELL * 0.75)
    sword.drawRect(CELL * 0.3333, CELL * 0.75, CELL * 0.3333, CELL * 0.05)
    sword.drawRect(CELL * 0.475, CELL * 0.75, CELL * 0.05, CELL * 0.25)
    sword.effect = function (state) {
      state.sword = true
    }
    return sword
  },
}

const entities = {
  Spawn: function ({ x, y }) {
    this.player = this.add.graphics(x * CELL, y * CELL)
    this.player.beginFill(0xFFFFFF)
    this.player.drawRect(0, 0, CELL, CELL)
    this.game.physics.arcade.enable(this.player)
    this.game.camera.follow(this.player)
  },
  Item: function ({ x, y }, itemId) {
    const item = items[itemId].call(this, x, y)
    this.items.add(item)
    this.game.physics.arcade.enable(item)
    item.body.setSize(CELL * 0.5, CELL * 0.5, CELL * 0.25, CELL * 0.25)
  },
  Goal: function ({ x, y }) {
    const goal = this.add.graphics(x * CELL, y * CELL, this.goals)
    goal.beginFill(0xFF0000)
    goal.drawRect(0, 0, CELL, CELL)
  },
}

module.exports = {
  init: function (stage) {
    this.stage = stage
  },
  create: function () {
    this.game.world.setBounds(0, 0, this.stage.height * CELL, this.stage.width * CELL)
    this.goals = this.game.add.group()
    this.items = this.game.add.group()
    this.game.physics.arcade.enable(this.items)
    this.cursors = this.game.input.keyboard.createCursorKeys()
    this.stage.entities.forEach(([ entity, ...args ]) => {
      entities[entity].apply(this, args)
    })
    this.items.enableBody = true
    this.player.enableBody = true
  },
  update: function () {
    this.playerMovement()
    this.playerAction()
    this.attackMovement()
    this.game.physics.arcade.collide(this.player, this.items, this.grabItem, null, this)
  },
  playerMovement: function () {
    const bod = this.player.body
    const prevVelocityX = bod.velocity.x
    const prevVelocityY = bod.velocity.y
    if (this.cursors.left.isDown) {
      bod.velocity.x = -WALK_SPEED
    } else if (this.cursors.right.isDown) {
      bod.velocity.x = WALK_SPEED
    } else {
      bod.velocity.x = 0
    }
    if (this.cursors.up.isDown) {
      bod.velocity.y = -WALK_SPEED
    } else if (this.cursors.down.isDown) {
      bod.velocity.y = WALK_SPEED
    } else {
      bod.velocity.y = 0
    }
    if (bod.velocity.y !== 0 && bod.velocity.x !== 0) {
      bod.velocity.y *= sin45
      bod.velocity.x *= sin45
    }
    // directions, 1 to 4: ^ -> v <-
    if (bod.velocity.x !== 0 || bod.velocity.y !== 0) {
      this.playerDirection = directionFromAxes(bod.velocity.x, bod.velocity.y)
    }
  },
  playerAction: function () {
    if (game.input.keyboard.isDown(32)) {
      if (this.sword && since(this.attackStart) >= ATTACK_COOLDOWN) {
        this.attackStart = Date.now()
        const halfCell = CELL * 0.5
        this.attack = this.game.add.graphics(halfCell, halfCell)
        this.attack.beginFill(0xFFFFFF)
        const startDrawX = halfCell
        const startDrawY = -halfCell
        this.attack.moveTo(startDrawX - 10, startDrawY - 10)
        this.attack.bezierCurveTo(startDrawX + 15, startDrawY + 2, startDrawX + 33, startDrawY + 12, startDrawX + 34, startDrawY + 13)
        this.attack.bezierCurveTo(startDrawX + 40, startDrawY + 37, startDrawX + 35, startDrawY + 40, startDrawX + 33, startDrawY + 60)
        //this.attack.anchor.setTo(0.5, 05)
        this.attack.angle = this.playerDirection * (180 / Math.PI)
        this.player.addChild(this.attack)
      }
    }
  },
  attackMovement: function () {
    if (this.attack && since(this.attackStart) > ATTACK_LIFE) {
      this.attack.destroy()
      this.attack = null
    }
  },
  grabItem: function (_, item) {
    item.destroy()
    item.effect(this)
  },
}

