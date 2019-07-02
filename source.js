var sourceObj = {
    getSourcesPoints:function(){
        var sources = sourceObj.getAllSources(),
            points = []
        for (var i in sources) {
            points.push([sources[i].pos.x,sources[i].pos.y])
        }
        return points
    },
    getAwaitHarvestSource : function (creep) {
        var sources = Game.rooms[cfg.roomName].find(FIND_SOURCES)
        var source
        if (creep.memory._move) {
            var creep_move_to = [creep.memory._move.dest.x,creep.memory._move.dest.y],
                sources_points = sourceObj.getSourcesPoints()
            //对比坐标是否在集合中
            var res = sources_points.some((e,i)=>{
                if (JSON.stringify(e) == JSON.stringify(creep_move_to)) {
                    source = sources[i]
                }
                return JSON.stringify(e) == JSON.stringify(creep_move_to)
            })
            if (!res){
                for (var i in sources) {
                    var creeps = _.filter(Game.creeps,(creep) => creep.memory._move)
                    creeps = _.filter(creeps,(creep) => creep.memory._move.dest.x == sources[i].pos.x && creep.memory._move.dest.y == sources[i].pos.y)
                    if (creeps.length < 5) {
                        source = sources[i]
                        break
                    }
                }
            }
        }

        if (source == undefined) {
            //取随机索引
            var index = Math.floor(Math.random()*(sources.length))
            source = sources[index]
        }
        return source
    },
    getAllSources : function () {
        return Game.rooms[cfg.roomName].find(FIND_SOURCES)
    }
}

module.exports = sourceObj;