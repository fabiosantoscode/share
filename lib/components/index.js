'use strict'

const classes = [
  require('./body'),
  require('./display'),
  require('./round'),
]

classes.byName = name =>
  classes.filter(CompClass => CompClass.name === name)[0]

module.exports = classes
