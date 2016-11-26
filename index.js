'use strict'

const phaserScript = document.createElement('script')
phaserScript.src = '/assets/phaser.js'

document.body.appendChild(phaserScript)

phaserScript.onload = () => { require('./lib/game')() }

