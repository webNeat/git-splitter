const args = require('./args')

function Router() {
    this.index = {}
    this.defaultCallback = null
}

Router.prototype.when = function(command, callback) {
    command = command.trim()
    if (command === '')
        throw new Error('Router: Command name cannot be empty')

    this.add(command.split(' '), callback)
    return this
}

Router.prototype.add = function(commands, callback) {
    const command = commands[0]
    if (1 === commands.length) {
        if (undefined !== this.index[command])
            throw new Error('Router: Duplicate command definition')

        this.index[command] = (callback instanceof Router)
            ? callback
            : (new Router).otherwise(callback)
    } else {
        if (undefined === this.index[command]) {
            this.index[command] = new Router
        }

        this.index[command].add(commands.slice(1), callback)
    }

}

Router.prototype.otherwise = function(callback) {
    this.defaultCallback = callback
    return this
}

Router.prototype.run = function(argv) {
    argv = args.parse(argv)
    return this.handle(argv.args, argv.options)
}

Router.prototype.handle = function(args, options) {
    if (0 === args.length || undefined === this.index[args[0]])
        return this.defaultCallback
            ? this.defaultCallback(args, options)
            : Router.defaultCallback(args, options)

    return this.index[args[0]].handle(args.slice(1), options)
}

Router.defaultCallback = args => console.error('Unknown route for arguments:', args)

module.exports = () => (new Router)
