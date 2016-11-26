'use strict'

const CELL = 64
const PLAYER_SIZE = 1 * CELL
const WALK_SPEED = 555

const entities = {
  Spawn: function ({ x, y }) {
    this.player = this.add.graphics(x * CELL, y * CELL)
    this.player.beginFill(0xFFFFFF)
    this.player.drawRect(0, 0, CELL, CELL)
    this.game.physics.arcade.enable(this.player)
    this.game.camera.follow(this.player)
  },
  Goal: function ({ x, y }) {
    const goal = this.add.graphics(x * CELL, y * CELL, this.goals)
    goal.beginFill(0xFF0000)
    goal.drawRect(0, 0, CELL, CELL)
  }
}

module.exports = {
  init: function (stage) {
    this.stage = stage
  },
  create: function () {
    console.log(this.stage.height * CELL)
    game.world.setBounds(0, 0, this.stage.height * CELL, this.stage.width * CELL)
    this.goals = game.add.group()
    this.cursors = game.input.keyboard.createCursorKeys()
    this.stage.entities.forEach(([ entity, ...args ]) => {
      entities[entity].apply(this, args)
    })
  },
  update: function () {
    if (this.cursors.left.isDown) {
      this.player.body.velocity.x = -WALK_SPEED
    } else if (this.cursors.right.isDown) {
      this.player.body.velocity.x = WALK_SPEED
    } else {
      this.player.body.velocity.x = 0
    }
    if (this.cursors.up.isDown) {
      this.player.body.velocity.y = -WALK_SPEED
    } else if (this.cursors.down.isDown) {
      this.player.body.velocity.y = WALK_SPEED
    } else {
      this.player.body.velocity.y = 0
    }
  },
}

