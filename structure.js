var structure = {
    room : Game.rooms[cfg.roomName],
    init : function () {
        this.attackHostileCreep()
        this.repairRoad()
        // this.repairWall()
    },
    getType:function () {
        
    },
    getConstructionCount:function (type) {
        const targets = this.room.find(FIND_MY_CONSTRUCTION_SITES, {
            filter: { structureType: type }
        });
        return targets.length
    },
    getStructureTarget : function(FIND_TYPE,TYPE){
        return this.room.find(FIND_TYPE,{
            filter: {
                structureType: TYPE
            }
        })
    },
    repairRoad : function () {
        var roads = this.getStructureTarget(FIND_STRUCTURES,STRUCTURE_ROAD),
            towers = this.getStructureTarget(FIND_MY_STRUCTURES,STRUCTURE_TOWER)
        for (var i in towers) {
            if (towers[i].energy > 0) {
                //修路
                for (var a in roads) {
                    if (roads[a].hits < roads[a].hitsMax){
                        towers[i].repair(roads[a])
                    }
                }
            }
        }
    },
    repairWall : function () {
        var walls = this.getStructureTarget(FIND_STRUCTURES,STRUCTURE_WALL),
            towers = this.getStructureTarget(FIND_MY_STRUCTURES,STRUCTURE_TOWER)
        for (var i in towers) {
            if (towers[i].energy > 0) {
                //修路
                for (var a in walls) {
                    if (walls[a].hits < walls[a].hitsMax){
                        towers[i].repair(walls[a])
                    }
                }
            }
        }
    },
    attackHostileCreep : function () {
        var hostile_creeps = this.room.find(FIND_HOSTILE_CREEPS),
            towers = this.getStructureTarget(FIND_MY_STRUCTURES,STRUCTURE_TOWER)
        if (hostile_creeps.length > 0) {
            console.log('有敌人：',hostile_creeps[0].id)
            for (var i in towers) {
                if (towers[i].energy > 0) {
                    //攻击他
                    towers[i].attack(hostile_creeps[0])
                }
            }
        }
    },
}

module.exports = structure;