var config = {
    roomName : 'E39N22',
    spawnName : 'Spawn1',
    builder_min:3,
    builder_max:3,
    harvester_min:3,
    harvester_max:5,
    upgrader_min:2,
    upgrader_max:4,
    construction_sites_total:100,//系统默认值，不能修改
    creeps_total:6,
    harvester_body:[MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY],
    // harvester_body:[MOVE,WORK,CARRY,CARRY],
    extension_energy_capacity:50,//控制器等级小于7级，默认都为50
}

module.exports = config;