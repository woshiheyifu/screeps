var sourceObj = require('source')
var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

	    if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	        creep.memory.building_target = ''
	        creep.say('🚧 build');
	    }

	    if(creep.memory.building) {
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
            	if (creep.memory.building_target == ''){
					var index = Math.floor(Math.random()*(targets.length))
					if(creep.build(targets[index]) == ERR_NOT_IN_RANGE) {
						creep.moveTo(targets[index]);
						creep.memory.building_target = targets[index]
					}
				}else {
            		var old_target = Game.getObjectById(creep.memory.building_target.id)
					if(creep.build(old_target) == ERR_NOT_IN_RANGE) {
						creep.moveTo(old_target);
					}
				}
            }else{
				console.log('变更'+creep.name+'为harvester')
            	creep.memory.role = 'harvester'
			}
	    } else {
	    	//非建造中的蠕虫，检查巢穴能量是否满，不满则将多余的builder变为harvester
			var targets = creep.room.find(FIND_STRUCTURES, {
				filter: (structure) => {
					return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
						structure.energy < structure.energyCapacity;
				}
			});
			var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder')
			if (targets.length && builders.length > cfg.builder_max) {
				console.log('变更'+creep.name+'为harvester')
				creep.memory.role = 'harvester'
			}
			var source = sourceObj.getAwaitHarvestSource(creep)
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
	    }
	}
};

module.exports = roleBuilder;