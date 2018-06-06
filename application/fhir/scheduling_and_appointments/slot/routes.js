var routesSlot = function(app, Slot){
	app.get('/:apikey/Slot', Slot.get.slot);
	app.post('/:apikey/Slot', Slot.post.slot);
	app.put('/:apikey/Slot/:slot_id?', Slot.put.slot);
}
module.exports = routesSlot;