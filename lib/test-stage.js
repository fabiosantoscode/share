'use strict'

const walls = ((n = 10) =>
  n < 0 ? [] : [
    [ 'Wall', { x: n, y: 0 } ],
    [ 'Wall', { x: 0, y: n } ],
    [ 'Wall', { x: n, y: 11 } ],
    [ 'Wall', { x: 11, y: n } ],
  ].concat(walls(n - 1)))

module.exports = {
  height: 12,
  width: 12,
  entities: [
    ...walls(),
    [ 'Wall', { x: 11, y: 11 } ],
    [ 'Spawn', { x: 1, y: 1 } ],
    [ 'Goal', { x: 10, y: 10 } ],
    [ 'Item', { x: 3, y: 1 }, 'sword' ],
    [ 'Enemy', { x: 4, y: 2 } ],
  ]
}
