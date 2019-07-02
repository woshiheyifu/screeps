var spawn = {
    findPath:function () {
        //控制器
        var controller = Game.spawns['Spawn1'].room.controller
        //能量源
        var sources = Game.spawns['Spawn1'].room.find(FIND_SOURCES);
        var spawn = Game.spawns['Spawn1']

        var path_to_controller = Game.spawns['Spawn1'].room.findPath(spawn.pos,controller.pos)
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
    //包括本身和扩展中的
    getEnergy:function () {
        var extensions = Game.rooms[cfg.roomName].find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_EXTENSION
            }
        });
        var extensions_energy = 0
        for (var i in extensions) {
            extensions_energy += extensions[i].energy
        }
        var energy = extensions_energy + Game.spawns[cfg.spawnName].energy

        return energy
    },
    buildStructure:function (x, y, STRUCTURE_TYPE) {
        Game.spawns[cfg.spawnName].room.createConstructionSite(x,y,STRUCTURE_TYPE)
    }
}

module.exports = spawn;