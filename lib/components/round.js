'use strict'

const Body = require('./body')
const Display = require('./display')

function Round({ em, level }) {
  this.em = em
  this.level = level
}

Round.prototype = {
  constructor: Round,
  start: function () {
    const ent = this.em.create()
    ent.add(new Body({ x: 0, y: 0, dx: 5, dy: 10 }))
    ent.add(new Display({ color: 'blue', size: 1 }))

    this.level.entities.forEach(entity => {
      const outEnt = this.em.create()
      entity.forEach(([ componentName, ...args ]) => {
        const component = new (require('.').byName(componentName))(...args)
        outEnt.add(component)
      })
    })
  }
}

module.exports = Round
