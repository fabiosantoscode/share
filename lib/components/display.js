'use strict'

function Display({ color, size }) {
  this.color = color || 'red'
  this.size = size || 1
}

Display.prototype = {
  constructor: Display,
  render: function (ctx, body, extrapolation) {
    ctx.fillStyle = this.color
    const [ sizeX, sizeY ] = [ 10 * this.size, 10 * this.size ]
    ctx.fillRect(
      body.x + (body.dx * extrapolation),
      body.y + (body.dy * extrapolation),
      sizeX,
      sizeY
    )
  }
}

module.exports = Display

