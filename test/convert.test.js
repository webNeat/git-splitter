const assert   = require('assert')
    , config   = require('../src/config')
    , convert = require('../src/convert')

config.set({
  splits: {
    'src/A': 'url-of-A.git',
    'src/B': 'url-of-B.git',
    'src/plugins/C': 'url-of-C.git'
  }
})

const expect = (description, argv, commands) => {
  commands = Object.keys(commands).map(path => ({
    dir: path,
    cmd: commands[path]
  }))
  it(description, () => assert.deepEqual(convert.run(argv), commands))
}

describe('Converter', () => {
  describe('git add', () => {

    expect('adds all files', ['add', '.'], {
      '.': 'add .',
      'src/A': 'add .',
      'src/B': 'add .',
      'src/plugins/C': 'add .'
    })

    expect('adds all files with --all', ['add', '.', '--all'], {
      '.': 'add . --all',
      'src/A': 'add . --all',
      'src/B': 'add . --all',
      'src/plugins/C': 'add . --all'
    })

    expect('adds one file inside a split', ['add', 'src/A/foo/bar'], {
      '.': 'add src/A/foo/bar',
      'src/A': 'add foo/bar',
      'src/B': null,
      'src/plugins/C': null
    })

    expect('adds one file outside all splits', ['add', 'src/foo/bar'], {
      '.': 'add src/foo/bar',
      'src/A': null,
      'src/B': null,
      'src/plugins/C': null
    })

    expect('adds a directory containing a split', ['add', 'src/plugins'], {
      '.': 'add src/plugins',
      'src/A': null,
      'src/B': null,
      'src/plugins/C': 'add .'
    })

    expect('adds multiple files', ['add', 'src/temp', 'src/A/foo/ba ar', 'src/A/baz', 'src/plugins'], {
      '.': 'add src/temp "src/A/foo/ba ar" src/A/baz src/plugins',
      'src/A': 'add "foo/ba ar" baz',
      'src/B': null,
      'src/plugins/C': 'add .'
    })

  })

  describe('git commit', () => {

    expect('commit with message', ['commit', '-m', 'Hello World'], {
      '.': 'commit -m "Hello World"',
      'src/A': 'commit -m "Hello World"',
      'src/B': 'commit -m "Hello World"',
      'src/plugins/C': 'commit -m "Hello World"'
    })

  })

})
