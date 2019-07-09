var spawn = {
    spawn: Game.spawns[cfg.spawnName],
    init : function () {
        var structureObj = require('structure')
        //查找路线，并建造道路
        if (structureObj.getConstructionCount(STRUCTURE_ROAD) < cfg.construction_sites_total){
            // spawnObj.findPath()
            this.buildRoadToController()
            this.buildRoadToAllSources()
        }
        // this.renewCreep()
    },
    renewCreep : function () {
        var creepsObj = require('creeps'),
            creeps = creepsObj.getAllCreeps()
        for (var i in creeps) {
            this.spawn.renewCreep(creeps[i])
        }
    },
    findPath:function () {
        //控制器
        var controller = Game.spawns['Spawn1'].room.controller
        //能量源
        var sources = Game.spawns['Spawn1'].room.find(FIND_SOURCES);
        var spawn = Game.spawns['Spawn1']

        var path_to_controller = Game.spawns['Spawn1'].room.findPath(spawn.pos,controller.pos,{ ignoreCreeps: true })
        for (var a in sources) {
            //计算能量源周围24个点
            var x_s = sources[a].pos.x - 2,
                y_s = sources[a].pos.y - 2
            for (a = 0; a < 5; a++) {
                for (b = 0; b < 5; b++) {
                    this.buildStructure(x_s + a, y_s + b, STRUCTURE_ROAD)
                }
            }
            var path_to_source = Game.spawns['Spawn1'].room.findPath(spawn.pos, sources[a].pos)
            for (var i in path_to_source) {
                if (sources[a].pos.x != path_to_source[i] && sources[a].pos.y != path_to_source[i].y) {
                    var res_road = Game.spawns['Spawn1'].room.lookForAt(LOOK_STRUCTURES, path_to_source[i].x, path_to_source[i].y)
                    var res_site = Game.spawns['Spawn1'].room.lookForAt(LOOK_CONSTRUCTION_SITES, path_to_source[i].x, path_to_source[i].y)
                    if (res_road.length == 0 && res_site.length == 0) {
                        console.log('build road to source', path_to_source[i].x, path_to_source[i].y)
                        Game.spawns['Spawn1'].room.createConstructionSite(path_to_source[i].x, path_to_source[i].y, STRUCTURE_ROAD)
                    }
                }
            }
        }
        for (var i in path_to_controller) {
            //查找已建和待建
            var res_road = Game.spawns['Spawn1'].room.lookForAt(LOOK_STRUCTURES,path_to_controller[i].x,path_to_controller[i].y)
            var res_site = Game.spawns['Spawn1'].room.lookForAt(LOOK_CONSTRUCTION_SITES,path_to_controller[i].x,path_to_controller[i].y)
            if (res_road.length == 0 && res_site.length == 0 && path_to_controller[i].x != controller.pos.x && path_to_controller[i].y != controller.pos.y) {
                console.log('build road to controller')
                Game.spawns['Spawn1'].room.createConstructionSite(path_to_controller[i].x,path_to_controller[i].y,STRUCTURE_ROAD)
            }
        }
    },
    //查找目标点是否存在设施
    checkExistenceSite : function(x,y){
        //查找已建和待建
        var res_road = this.spawn.room.lookForAt(LOOK_STRUCTURES,x,y),
            res_site = this.spawn.room.lookForAt(LOOK_CONSTRUCTION_SITES,x,y)
        if (res_road.length == 0 && res_site.length == 0) {
            return true
        }else {
            return false
        }
    },
    buildRoadToController:function(){
        //控制器
        var controller = this.spawn.room.controller
        var paths = this.spawn.room.findPath(this.spawn.pos,controller.pos,{ ignoreCreeps: true })
        for (var i in paths) {
            if (this.checkExistenceSite(paths[i].x, paths[i].y)) {
                console.log('build road to controller', paths[i].x, paths[i].y)
                this.buildStructure(paths[i].x,paths[i].y,STRUCTURE_ROAD)
            }
        }
    },
    buildRoadToAllSources : function () {
        var sources = this.spawn.room.find(FIND_SOURCES);
        for (var a in sources) {
            var paths = this.spawn.room.findPath(this.spawn.pos,sources[a].pos,{ ignoreCreeps: true })
            for (var i in paths) {
                if (sources[a].pos.x != paths[i].y && sources[a].pos.y != paths[i].y) {
                    if (this.checkExistenceSite(paths[i].x, paths[i].y)) {
                        console.log('build road to source', paths[i].x, paths[i].y)
                        this.buildStructure(paths[i].x,paths[i].y,STRUCTURE_ROAD)
                    }
                }
            }
        }
    },
    //包括本身和扩展中的
    getEnergy:function () {
        var structureObj = require('structure'),
            extensions = structureObj.getStructureTarget(FIND_STRUCTURES,STRUCTURE_EXTENSION),
            extensions_energy = 0
        for (var i in extensions) {
            extensions_energy += extensions[i].energy
        }
        var energy = extensions_energy + this.spawn.energy
        console.log('当前能量：',energy)

        return energy
    },
    buildStructure:function (x, y, STRUCTURE_TYPE) {
        this.spawn.room.createConstructionSite(x,y,STRUCTURE_TYPE)
    },
    //判断spawn能量是否满，包括扩展中的
    checkSpawnEnergyFull : function () {
        var structureObj = require('structure'),
            extensions = structureObj.getStructureTarget(FIND_STRUCTURES,STRUCTURE_EXTENSION)
        if (this.getEnergy() == this.spawn.energyCapacity + extensions.length*cfg.extension_energy_capacity){
            return true
        }else {
            return false
        }

    },
    buildRoadByPath : function (creep, target) {
        var paths = creep.pos.findPathTo(target)
        creep.moveByPath(paths);
        creep.memory.path = paths
        creep.memory.targetPoint = target.pos
        for (var i in paths) {
            if (this.checkExistenceSite(paths[i].x, paths[i].y)) {
                this.buildStructure(paths[i].x,paths[i].y,STRUCTURE_ROAD)
            }
        }
    }
}

module.exports = spawn;