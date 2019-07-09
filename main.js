global.cfg = require('config')
var spawnObj        = require('spawn');
var creeps          = require('creeps')
var structureObj    = require('structure')

module.exports.loop = function () {
    creeps.init()
    spawnObj.init()
    structureObj.init()
}