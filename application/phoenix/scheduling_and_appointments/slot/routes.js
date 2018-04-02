var routesSlot = function(app, Slot){
	app.get('/:apikey/Slot', Slot.get.slot);
	app.post('/:apikey/slot', Slot.post.slot);
	app.put('/:apikey/slot/:slot_id', Slot.put.slot);
}
module.exports = routesSlot;