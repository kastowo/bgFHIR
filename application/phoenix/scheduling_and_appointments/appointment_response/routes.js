var routesAppointmentResponse = function(app, AppointmentResponse){
	app.get('/:apikey/appointment-response', AppointmentResponse.get.appointmentResponse);
	app.post('/:apikey/appointment-response', AppointmentResponse.post.appointmentResponse);
	app.put('/:apikey/appointment-response/:appointment_response_id', AppointmentResponse.put.appointmentResponse);
}
module.exports = routesAppointmentResponse;