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
            var energy = spawn.getEnergy()
            if (energy >= 200) {
                //默认都生成harvester，后根据需要来变换角色
                console.log('energy:',energy)
                var body = creeps.generateBody(energy)
                var newName = 'Creeps' + Game.time;
                console.log('body:',body)
                console.log('Spawning new harvester: ' + newName);
                Game.spawns[cfg.spawnName].spawnCreep(body, newName,
                    {memory: {role: 'harvester',body:body}});
            }
        }
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