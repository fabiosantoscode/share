'use strict'

const components = require('./components')
const Round = require('./components/round')
const Body = require('./components/body')
const Display = require('./components/display')
const engine = require('./engine')
const makr = require('makr')

module.exports = canvas => {
  const ngin = engine({
    ticksPerSecond: 12
  })
  const ctx = canvas.getContext('2d')
  const em = makr(...components)

  const ent = em.create()
  const round = new Round({
    em,
    level: require('./test-stage')
  })

  ent.add(round)

  round.start()

  return ngin.loop({
    update: (dt) => {
      for (let entity of em.query(Body)) {
        entity.get(Body).update(dt)
      }
    },
    render: (extrapolation) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let entity of em.query(Display)) {
        entity.get(Display).render(ctx, entity.get(Body), extrapolation)
      }
    }
  })
}

