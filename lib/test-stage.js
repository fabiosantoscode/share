'use strict'

const walls = ((level, n = 10) =>
  n < 0 ? [] : [
  [ 'Wall', { x: n, y: 0 } ],
  [ 'Wall', { x: 0, y: n } ],
  (level !== 1 || n !== 1 ? [ 'Wall', { x: n, y: 9 } ] : null),
  [ 'Wall', { x: 9, y: n } ],
  ].filter(w => !!w).filter(w => (w[1].y !== 1 && ( level === 0 ? w[1].x > 3 : w[1].x < 3 ) || ( level === 0 ? w[1].x <= 3 : w[1].x >= 3 ))).concat(walls(level, n - 1)))

module.exports = {
  width: 2,
  height: 2,
  screens: [
    {
      x: 0,
      y: 0,
      entities: [
        ...walls(0),
        [ 'Spawn', { x: 1, y: 1 } ],
        [ 'Item', { x: 3, y: 1 }, 'sword' ],
      ],
    },
    {
      x: 1,
      y: 0,
      entities: [
        ...walls(1),
        [ 'Goal', { x: 8, y: 8 } ],
        ...[ 0, 1, 2, 3, 4, 5 ].map(x => [ 'Wall', { x: x, y: 5 } ]),
        [ 'Enemy', { x: 2, y: 4 } ],
        [ 'Enemy', { x: 4, y: 2 } ],
      ],
    },
    {
      x: 1,
      y: 1,
      entities: [
        ...walls(2)
      ],
    },
    {
      x: 0,
      y: 1,
      entities: [
        ...walls(2)
      ],
    }
  ],
}
