var structure = {
    getType:function () {
        
    },
    getConstructionCount:function (type) {
        const targets = Game.rooms[cfg.roomName].find(FIND_MY_CONSTRUCTION_SITES, {
            filter: { structureType: type }
        });
        return targets.length
    },
}

module.exports = structure;