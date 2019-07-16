var sourceObj = require('source')
var creeps = require('creeps')
var spawnObj = require('spawn')
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

	    //如果存在能量未满的建筑，则先保障采集者的数量
		var targets = creep.room.find(FIND_STRUCTURES, {
			filter: (structure) => {
				return (structure.structureType == STRUCTURE_EXTENSION ||
					structure.structureType == STRUCTURE_SPAWN ||
					structure.structureType == STRUCTURE_TOWER) &&
					structure.energy < structure.energyCapacity;
			}
		});
		if(targets.length > 0 && creeps.getHarvesters().length < cfg.harvester_min) {
			console.log('变更'+creep.name+'为harvester')
			creep.memory.role = 'harvester'
		}else {
			if(creep.memory.building) {
				//首先建造塔和扩展
				var important_targets = creep.room.find(FIND_CONSTRUCTION_SITES,{
					filter: (structure) => {
						return structure.structureType == STRUCTURE_TOWER ||
						structure.structureType == STRUCTURE_EXTENSION ||
							structure.structureType == STRUCTURE_STORAGE
					}
				});
				var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
				if(important_targets.length){
					if (creep.build(important_targets[0]) == ERR_NOT_IN_RANGE) {
						// creep.moveTo(important_targets[0]);
						spawnObj.buildRoadByPath(creep,important_targets[0])
						creep.memory.building_target = important_targets[0]
					}
				}else if (targets.length) {
					if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
						// creep.moveTo(important_targets[0]);
						spawnObj.buildRoadByPath(creep,targets[0])
						creep.memory.building_target = targets[0]
					}
					// if (creep.memory.building_target == ''){
					// 	var index = Math.floor(Math.random()*(targets.length))
					// 	if(creep.build(targets[index]) == ERR_NOT_IN_RANGE) {
					// 		spawnObj.buildRoadByPath(creep,targets[index])
					// 		// creep.moveTo(targets[index]);
					// 		creep.memory.building_target = targets[index]
					// 	}
					// }else {
					// 	var old_target = Game.getObjectById(creep.memory.building_target.id)
					// 	if(creep.build(old_target) == ERR_NOT_IN_RANGE) {
					// 		spawnObj.buildRoadByPath(creep,old_target)
					// 		// creep.moveTo(old_target);
					// 	}
					// }
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
					// creep.moveTo(source);
					spawnObj.buildRoadByPath(creep,source)
					creep.memory.sourceId = source.id
				}
			}
		}
	}
};

module.exports = roleBuilder;