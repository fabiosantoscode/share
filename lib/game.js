'use strict'

const engine = require('./engine')
const makr = require('makr')

module.exports = canvas => {
  const ngin = engine({
    ticksPerSecond: 12
  })
  const ctx = canvas.getContext('2d')
  var dx = 20
  var x = 0
  return ngin.loop({
    update: (dt) => {
      x += dx * dt
    },
    render: (extrapolation) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillRect(x + (dx * extrapolation), 0, 10, 10)
    }
  })
}

