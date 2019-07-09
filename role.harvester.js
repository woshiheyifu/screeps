var creeps = require('creeps')
var sourceObj = require('source')
var spawnObj = require('spawn')
var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
	    if(creep.carry.energy < creep.carryCapacity) {
	        //先判断有没有tombstone
            var tombstone = creep.room.find(FIND_TOMBSTONES)
            if (tombstone.length > 0) {
                console.log('有tombstone：',tombstone[0])
                if (creep.withdraw(tombstone[0],RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(tombstone[0])
                }
            }
	        //首先判断creep是否正在移动去采集
            var source = sourceObj.getAwaitHarvestSource(creep)
            if (source) {
                if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    // creep.moveTo(source)
                    spawnObj.buildRoadByPath(creep,source)
                    creep.memory.sourceId = source.id
                }
            }
        } else {
	        creep.memory.sourceId = ''
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN) &&
                            structure.energy < structure.energyCapacity;
                    }
            });
            var towers = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_TOWER &&
                        structure.energy < structure.energyCapacity;
                }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    // creep.moveTo(targets[0])
                    spawnObj.buildRoadByPath(creep,targets[0])
                }
            }else if (towers.length > 0){
                if(creep.transfer(towers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    // creep.moveTo(targets[0])
                    spawnObj.buildRoadByPath(creep,towers[0])
                }
            }else{
                //先保证upgrader数量足够
                if(creep.room.controller && creeps.getUpgraders().length < cfg.upgrader_min) {
                    console.log('变更'+creep.name+'为upgrader')
                    creep.memory.role = 'upgrader';
                    if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        // creep.moveTo(creep.room.controller);
                        spawnObj.buildRoadByPath(creep,creep.room.controller)
                    }
                }else {
                    //去建造其他建筑
                    var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
                    if(targets.length > 0) {
                        console.log('变更' + creep.name + '为builder')
                        creep.memory.role = 'builder';
                        if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                            // creep.moveTo(targets[0]);
                            spawnObj.buildRoadByPath(creep,towers[0])
                        }
                    }
                }
            }
        }
	},
};

module.exports = roleHarvester;