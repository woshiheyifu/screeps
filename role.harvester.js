var creeps = require('creeps')
var sourceObj = require('source')
var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
	    if(creep.carry.energy < creep.carryCapacity) {
	        //首先判断creep是否正在移动去采集
            var source = sourceObj.getAwaitHarvestSource(creep)
            if (source) {
                if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
            }
        } else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                            structure.energy < structure.energyCapacity;
                    }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }else{
                //先保证upgrader数量足够
                if(creep.room.controller && creeps.getUpgraders().length < cfg.upgrader_min) {
                    console.log('变更'+creep.name+'为upgrader')
                    creep.memory.role = 'upgrader';
                    if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller);
                    }
                }else {
                    //去建造其他建筑
                    var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
                    if(targets.length) {
                        console.log('变更' + creep.name + '为builder')
                        creep.memory.role = 'builder';
                        if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(targets[0]);
                        }
                    }
                }
                //查找正在建造的蠕虫，并把能量给他
                // var building_builder = _.filter(Game.creeps, (creep) => {
                //     return creep.memory.role == 'builder' && creep.carry.energy < creep.carryCapacity && creep.memory.building == true
                // })
                // if (building_builder.length > 0) {
                //     creep.transfer(building_builder[0], RESOURCE_ENERGY)
                // }
            }
        }
	}
};

module.exports = roleHarvester;