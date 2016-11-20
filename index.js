'use strict'

const game = require('./lib/game')

const canvas = window.canvas = document.createElement('canvas')

document.body.style.margin = 0
document.body.style.overflow = 'hidden'


game(canvas)

const onResize = () => {
  canvas.width = document.documentElement.clientWidth
  canvas.height = document.documentElement.clientHeight
  canvas.style.width = canvas.width + 'px'
  canvas.style.height = canvas.height + 'px'
}
window.addEventListener('resize', onResize)
onResize()

document.body.appendChild(canvas)

