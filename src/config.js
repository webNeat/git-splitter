const fs = require('fs')

var data = null

const set = value => {
    data = value
}

const get = () => data

const load = path => {
    data = JSON.parse(fs.readFileSync(path, 'utf8'))
}

module.exports = {set, get, load}
