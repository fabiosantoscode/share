'use strict'

const startGame = require('./lib/game')

const phaserScript = document.createElement('script')
phaserScript.src = '/assets/phaser.js'

document.body.appendChild(phaserScript)

phaserScript.onload = () => { startGame() }

