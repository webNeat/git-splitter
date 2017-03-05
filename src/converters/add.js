const P      = require('path')
    , config = require('../config')
    , join   = require('../args').join


const projectPath = (path, dir) => {
    const relative = P.relative(dir, path)

    if (relative.startsWith('..')) {
        // relative == '../../..' : dir is inside path
        if (relative.replace(/\.\.\//g, '') == '..')
            return '.'
        // relative == '../../aa' : no intersection between path and dir
        return null
    }
    // relative == 'aa/bb/cc' : path is inside dir
    return (relative == '') ? '.' : relative
}

module.exports = (args, options, path) => {
    path = P.resolve(path)
    args = args.map(arg => projectPath(P.resolve(arg), path))
        .filter(path => (null !== path))
    if (0 === args.length)
        return null
    return 'add ' + join(args, options)
}
