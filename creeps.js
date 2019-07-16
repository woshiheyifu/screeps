var spawn           = require('spawn');
var creeps = {
    body : {
        MOVE : {
            cost:50
        },
        WORK : {
            cost:100
        },
        //负重
        CARRY : {
            cost:50
        },
        //攻击
        ATTACK : {
            cost:80
        },
        //远程攻击
        RANGED_ATTACK : {
            cost:150
        },
        //治疗
        HEAL : {
            cost:250
        },
        //可攻击其他房间控制器的属性
        CLAIM : {
            cost:600
        },
        //额外生命，没有啥用
        TOUGH : {
            cost:10
        },
    },
    init : function(){
        this.clearDeathCreeps()
        this.createCreeps()
        this.consoleCreepsCount()
        for(var name in Game.creeps) {
            var creep = Game.creeps[name]
            this.run(creep)
        }
    },
    run : function(creep){
        var creepRole = require('role.'+this.getCreepRole(creep));
        creepRole.run(creep)
    },
    //清理已死的creep
    clearDeathCreeps : function () {
        for(var name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }
    },
    getCreepRole : function(creep){
        return creep.memory.role
    },
    getHarvesters : function(){
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester')
        return harvesters
    },
    getBuilders : function(){
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder')
        return builders
    },
    getUpgraders : function(){
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader')
        return upgraders
    },
    getAllCreeps : function(){
        var creeps = _.filter(Game.creeps, (creep) => creep.memory.role);
        return creeps
    },
    createCreeps : function () {
        if (creeps.getAllCreeps().length < cfg.creeps_total) {
            //暂时生成相同的creep
            var newName
            console.log(cfg.harvester_body)
            if (this.getHarvesters().length < cfg.harvester_min) {       //生成harvester
                newName = 'Harvester' + Game.time;
                console.log('Spawning new harvester: ' + newName);
                console.log(Game.spawns[cfg.spawnName].spawnCreep(cfg.harvester_body, newName,
                    {memory: {role: 'harvester', body: cfg.harvester_body}}))

            }else if (this.getUpgraders().length < cfg.upgrader_min) {            //生成upgrader
                newName = 'Upgrader' + Game.time;
                console.log('Spawning new upgrader: ' + newName);
                Game.spawns[cfg.spawnName].spawnCreep(cfg.harvester_body, newName,
                    {memory: {role: 'upgrader', body: cfg.harvester_body}});
            } else if (this.getBuilders().length < cfg.builder_min)         //生成builder
                newName = 'Builder' + Game.time;
                console.log('Spawning new builder: ' + newName);
                Game.spawns[cfg.spawnName].spawnCreep(cfg.harvester_body, newName,
                    {memory: {role: 'builder', body: cfg.harvester_body}});
            }

    },
    consoleCreepsCount : function(){
        console.log('harvester:',this.getHarvesters().length)
        console.log('upgrader:',this.getUpgraders().length)
        console.log('builder:',this.getBuilders().length)
    },
    generateBody : function (energy) {
        //查看当前能量,目前最大能量550 @todo 以后优化算法
        var body = []
        //目前只添加 WORK 和 MOVE
        switch (true) {
            case energy < 250:
                body = [MOVE,CARRY,WORK]
                break;
            case energy >= 250:
                body = [MOVE,MOVE,CARRY,WORK]
                energy -= 250
                //以每50区分
                var count = Math.floor(energy/50)
                if (count > 2) {
                    var num = Math.floor(count / 2)
                    for (i = 0;i < num;i++){
                        body.push(WORK)
                    }
                    var remainder_energy = energy-count*100
                    if (remainder_energy >= 50) {
                        body.push(CARRY)
                    }
                }else{
                    body.push(CARRY)
                }
                break;
        }
        return body
    }

}

module.exports = creeps;