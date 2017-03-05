const assert   = require('assert')
    , add = require('../../src/converters/add')

describe('"git add" Converter', () => {

  it('adds path inside the split', () => {
    assert.equal('add foo', add(['src/A/foo'], {}, 'src/A'))
    assert.equal('add foo bar/baz', add(['src/A/foo', 'src/A/bar/baz'], {}, 'src/A'))
    assert.equal('add foo --all', add(['src/A/foo'], {all: true}, 'src/A'))
  })

  it('adds . when adding parent directory', () => {
    assert.equal('add .', add(['src/A'], {}, 'src/A'))
    assert.equal('add .', add(['src'], {}, 'src/A'))
    assert.equal('add .', add(['.'], {}, 'src/A'))
    assert.equal('add . --all', add(['.'], {all: true}, 'src/A'))
  })

  it('ignores outside paths', () => {
    assert.equal(null, add(['src/B'], {}, 'src/A'))
    assert.equal(null, add(['test'], {}, 'src/A'))
    assert.equal(null, add(['test/src/A'], {}, 'src/A'))
  })

  it('handles all at onces', () => {
    assert.equal('add foo . --all', add(['test', 'src/A/foo', 'src/B', 'src', 'sr'], {all: true}, 'src/A'))
  })

})
