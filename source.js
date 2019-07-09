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
        var sources = this.getAllSources()
        var source
        if (creep.memory.targetPoint) {
            var paths = creep.memory.path,
                sources_points = sourceObj.getSourcesPoints()
            for (var a in sources_points) {
                //对比坐标是否在集合中
                var res = paths.some((e,i)=>{
                    if (e.x == sources_points[a][0] && e.y == sources_points[a][1]) {
                        source = sources[a]
                    }
                    return e.x == sources_points[a][0] && e.y == sources_points[a][1]
                })
                if (res) {
                    break;
                }
            }

            if (!res){
                for (var i in sources) {
                    var creeps = _.filter(Game.creeps,(creep) => creep.memory.targetPoint && creep.memory.path)
                    creeps = _.filter(creeps,(creep) => creep.memory.targetPoint.x == sources[i].pos.x && creep.memory.targetPoint.y == sources[i].pos.y)
                    if (creeps.length < 4) {
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
        return Game.rooms[cfg.roomName].find(FIND_SOURCES,{
            filter : (source) => {
                return source.energy > 0
            }
        })
    }
}

module.exports = sourceObj;