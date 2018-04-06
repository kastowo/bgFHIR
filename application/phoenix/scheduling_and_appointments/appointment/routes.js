var routesAppointment = function(app, Appointment){
	app.get('/:apikey/Appointment', Appointment.get.appointment);
	app.get('/:apikey/AppointmentParticipant', Appointment.get.appointmentParticipant);

	app.post('/:apikey/appointment', Appointment.post.appointment);
	app.post('/:apikey/appointment-participant', Appointment.post.appointmentParticipant);
	
	app.put('/:apikey/appointment/:appointment_id?', Appointment.put.appointment);
	app.put('/:apikey/appointment-participant/:participant_id?/:dr?', Appointment.put.appointmentParticipant);
}
module.exports = routesAppointment;