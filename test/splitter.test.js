const assert = require('assert')
const splitter = require('../src/splitter')

const split = splitter({
  splits: {
    'src/A': 'url-of-A.git',
    'src/B': 'url-of-B.git',
    'src/plugins/C': 'url-of-C.git'
  }
})

const expect = (description, argv, commands) =>
  it(description, () => assert.equal(commands, split(argv)))

describe('Splitter', () => {
  describe('git add', () => {

    expect('adds all files', ['git', 'add', '.'], [
      'git add .',
      'cd src/A && git add .',
      'cd src/B && git add .',
      'cd src/plugins/C && git add .'
    ])

    expect('adds all files with --all', ['git', 'add', '.', '--all'], [
      'git add . --all',
      'cd src/A && git add . --all',
      'cd src/B && git add . --all',
      'cd src/plugins/C && git add . --all'
    ])

    expect('adds one file inside a split', ['git', 'add', 'src/A/foo/bar'], [
      'git add src/A/foo/bar',
      'cd src/A && git add foo/bar'
    ])

    expect('adds one file outside all splits', ['git', 'add', 'src/foo/bar'], [
      'git add src/A/foo/bar'
    ])

    expect('adds a directory containing a split', ['git', 'add', 'src/plugins'], [
      'git add src/plugins',
      'cd src/plugins/C && git add .'
    ])

    expect('adds multiple files', ['git', 'add', 'src/temp', 'src/A/foo/ba ar', 'src/A/baz', 'src/plugins'], [
      'git add src/temp "src/A/foo/ba ar" src/A/baz src/plugins',
      'cd src/A && git add "foo/ba ar" baz',
      'cd src/plugins/C && git add .'
    ])

  })
})
