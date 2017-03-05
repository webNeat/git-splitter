const router = require('./router')
    , config = require('./config')
    , join   = require('./args').join

const call = (prefix, converter) => ((args, options) => {
    const splits = config.get().splits
    var list = []
    list.push({
        dir: '.',
        cmd: prefix + join(args, options)
    })
    if (converter) {
        for (path in splits) {
            list.push({
                dir: path,
                cmd: converter(args, options, path, splits[path])
            })
        }
    }
    return list
})

module.exports = router()
    .when('add', call('add ', require('./converters/add')))
    .otherwise(call(null))
