module.exports = {
  run: function(rooms: SODB, jobs: SODB){
    if (Memory.stats == undefined) {
      Memory.stats = {}
    }

    Memory.stats['gcl.progress'] = Game.gcl.progress
    Memory.stats['gcl.progressTotal'] = Game.gcl.progressTotal
    Memory.stats['gcl.level'] = Game.gcl.level
    Memory.stats['cpu.getUsed'] = Game.cpu.getUsed()
    Memory.stats['cpu.limit'] = Game.cpu.limit
    Memory.stats['cpu.bucket'] = Game.cpu.bucket
    Memory.stats['memory.size'] = RawMemory.get().length
    Memory.stats['market.credits'] = Game.market.credits


    Memory.stats['jobs.count'] = jobs.count()
    Memory.stats['creeps.count'] = Object.keys(Game.creeps).length

    _.forEach(rooms.where({mine: true}), function(roomObject){
      var room = Game.rooms[roomObject.name]
      Memory.stats['room.' + room.name + '.energyAvailable'] = room.energyAvailable
      Memory.stats['room.' + room.name + '.energyCapacityAvailable'] = room.energyCapacityAvailable
      if(room.controller){
        Memory.stats['room.' + room.name + '.controllerProgress'] = room.controller.progress
        Memory.stats['room.' + room.name + '.controllerProgressTotal'] = room.controller.progressTotal
        Memory.stats['room.' + room.name + '.level'] = room.controller.level
      }

      var roomJobs = jobs.where({room: room.name})
      Memory.stats['room.' + room.name + '.jobs'] = roomJobs.length

      Memory.stats['room.' + room.name + '.job.deliver'] = jobs.where({room: room.name}, {act: 'deliver'}, {collect: {isnot: 'harvest'}}).length
      Memory.stats['room.' + room.name + '.job.build'] = jobs.where({room: room.name}, {act: 'build'}).length
      Memory.stats['room.' + room.name + '.job.supply'] = jobs.where({room: room.name}, {collect: 'supply'}).length

      Memory.stats['room.' + room.name + '.defcon'] = Memory.defcon[room.name].defcon

      if(room.storage){
        _.forEach(Object.keys(room.storage.store), function(resource){
          if(room.storage)
            Memory.stats['room.' + room.name + '.storage.' + resource] = room.storage.store[resource]
        })
      }
    })
  }
}