'use strict'

function Body({ x, y, dx, dy }) {
  this.x = x || 0
  this.y = y || 0
  this.dx = dx || 0
  this.dy = dy || 0
}

Body.prototype = {
  constructor: Body,
  update: function (dt) {
    this.x += dt * this.dx
    this.y += dt * this.dy
  }
}

module.exports = Body

