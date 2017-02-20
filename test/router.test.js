const assert = require('assert')
const router = require('../src/router')

var app = router()
  .when('add', (args, options) => {
    return {command: 'add', args, options}
  })
  .when('branch', (args, options) => {
    return {command: 'branch', args, options}
  })
  .when('branch add', (args, options) => {
    return {command: 'branch add', args, options}
  })
  .when('branch rm', (args, options) => {
    return {command: 'branch rm', args, options}
  })
  .when('remote', router()
    .when('add', (args, options) => {
      return {command: 'remote add', args, options}
    })
    .when('rm', (args, options) => {
      return {command: 'remote rm', args, options}
    })
    .otherwise((args, options) => {
      return {command: 'remote', args, options}
    })
  )
  .otherwise((args, options) => {
    return {command: null, args, options}
  })

const expect = (description, assertions) =>
  it(description, () =>
    assertions.forEach(assertion =>
      assert.deepEqual({
        command: assertion.command,
        args: assertion.args,
        options: assertion.options
      }, app.run(assertion.argv))
    )
  )

describe('Router', () => {

  expect('runs the default when no args', [
    { argv: [], command: null, args: [], options: {} }
  ])

  expect('runs the default when unknown command', [
    { argv: ['foo'], command: null, args: ['foo'], options: {} },
    { argv: ['foo', '--bar'], command: null, args: ['foo'], options: {bar: true} },
    { argv: ['foo', 'bar'], command: null, args: ['foo', 'bar'], options: {} },
    { argv: ['foo', '-c', 'Yo', '--bar=Hey'], command: null, args: ['foo'], options: {c: 'Yo', bar: 'Hey'} },
    { argv: ['foo', '--bar', 'Yo'], command: null, args: ['foo', 'Yo'], options: {bar: true} }
  ])

  expect('runs first level commands', [
    { argv: ['add'], command: 'add', args: [], options: {} },
    { argv: ['add', '.', '--all'], command: 'add', args: ['.'], options: {all: true} },
    { argv: ['branch', 'foo'], command: 'branch', args: ['foo'], options: {} },
    { argv: ['remote', '--bar', 'foo'], command: 'remote', args: ['foo'], options: {bar: true} },
    { argv: ['remote', '--level=3', 'foo', '--bar', 'baz'], command: 'remote', args: ['foo', 'baz'], options: {level: 3, bar: true} }
  ])

  expect('runs subcommands', [
    { argv: ['branch', 'add', 'foo'], command: 'branch add', args: ['foo'], options: {} },
    { argv: ['branch', '--verbose', 'add', 'foo'], command: 'branch add', args: ['foo'], options: {verbose: true} },
    { argv: ['branch', 'rm', '--verbose', 'add', 'foo'], command: 'branch rm', args: ['add', 'foo'], options: {verbose: true} },
    { argv: ['remote', 'add', 'foo'], command: 'remote add', args: ['foo'], options: {} },
    { argv: ['remote', '--verbose', 'add', 'foo'], command: 'remote add', args: ['foo'], options: {verbose: true} },
    { argv: ['remote', 'rm', '--verbose', 'add', 'foo'], command: 'remote rm', args: ['add', 'foo'], options: {verbose: true} }
  ])

})
