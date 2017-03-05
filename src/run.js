const convert = require('./convert')
    , exec   = require('child_process').exec;

const execute = commandsList => {
    // run the first command and show output
    const command = `git ${commandsList[0].command}`
    exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error running '${command}': ${error}`)
          return
        }
        console.log(stderr);
        console.log(stdout);
    })
    // run other commands silently
    commandsList.slice(1).forEach(c => {
        if (c.cmd) {
            const cmd = `cd "${c.dir}" && git ${c.cmd}`
            exec(cmd, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error running '${cmd}': ${error}`)
                    return
                }
            })
        }
    })
}

module.exports = argv => execute(convert.run(argv))
