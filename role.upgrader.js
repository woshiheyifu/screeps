var sourceObj = require('source')
var spawnObj = require('spawn')
var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.upgrading = true;
	        creep.say('⚡ upgrade');
	    }

	    if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                // creep.moveTo(creep.room.controller);
                spawnObj.buildRoadByPath(creep,creep.room.controller)
            }
        }else {
	        // //从spawn中拿能量
            // if (creep.withdraw(spawnObj.spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            //     spawnObj.buildRoadByPath(creep,spawnObj.spawn)
            //     creep.memory.sourceId = spawnObj.spawn.id
            // }
            var source = sourceObj.getAwaitHarvestSource(creep)
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                // creep.moveTo(source);
                spawnObj.buildRoadByPath(creep,source)
                creep.memory.sourceId = source.id
            }
        }
	}
};

module.exports = roleUpgrader;