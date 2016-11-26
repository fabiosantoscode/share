'use strict'

module.exports = () => {
  const game = global.game = new Phaser.Game(640, 640, Phaser.AUTO)
  game.state.add('GameState', require('./states/game'))

  game.state.start(
    'GameState',
    /*clearWorld=*/true,
    /*clearCache=*/false,
    require('./test-stage'))
}

