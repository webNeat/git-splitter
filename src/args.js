const minimist = require('minimist')
    , dargs    = require('dargs')

const parse = argv => {
    argv = minimist(argv, { string: true, boolean: true })
    var args = argv._
    delete argv._
    return { args: args, options: argv }
}

const join = (args, options) => {
    options._ = []
    return args.concat(dargs(options)).map(arg => {
        if (-1 < arg.indexOf(' '))
            arg = '"' + arg + '"';
        return arg
    }).join(' ')
}

module.exports = {parse, join}
