var routesAppointment = function(app, Appointment){
	app.get('/:apikey/Appointment', Appointment.get.appointment);
	app.post('/:apikey/Appointment', Appointment.post.appointment);
	app.post('/:apikey/Appointment/:appointment_id?/Participant', Appointment.post.appointmentParticipant);

	app.put('/:apikey/Appointment/:appointment_id?', Appointment.put.appointment);
	app.put('/:apikey/Appointment/:appointment_id?/Participant/:participant_id?', Appointment.put.appointmentParticipant);
}
module.exports = routesAppointment;