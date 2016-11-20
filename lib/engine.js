'use strict'

var assert = require('assert')
var events = require('events')

module.exports = ({ ticksPerSecond }) => {
  var engine = new events.EventEmitter
  var TICK_TIME = 1000 / ticksPerSecond
  var TICK_DT = TICK_TIME / 1000
  var INV_TICK_TIME = 1 / TICK_TIME
  var MAX_TICKS_PER_FRAME = 3
  var gameStart
  var lastTick = 0
  var frameExtrapolation

  engine.loop = ({ update, render }) => {
    assert.equal(gameStart, undefined)
    gameStart = Date.now() - 1 /* avoid div by zero */

    function tick() {
      var now = Date.now()
      var floatFrame = (now - gameStart) * INV_TICK_TIME
      var frameNumber = floatFrame|0
      frameExtrapolation = floatFrame - frameNumber
      var framesToGo = frameNumber - lastTick
      lastTick = frameNumber

      if (framesToGo > MAX_TICKS_PER_FRAME) framesToGo = MAX_TICKS_PER_FRAME

      while (framesToGo--) {
        update(TICK_DT, frameNumber)
      }

      var extrapolationInSeconds = frameExtrapolation * TICK_DT
      render(extrapolationInSeconds)

      requestAnimationFrame(tick)
    }

    tick()
  }

  return engine
}

