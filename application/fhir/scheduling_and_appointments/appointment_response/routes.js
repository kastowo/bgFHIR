var routesAppointmentResponse = function(app, AppointmentResponse){
	app.get('/:apikey/AppointmentResponse', AppointmentResponse.get.appointmentResponse);
	app.post('/:apikey/AppointmentResponse', AppointmentResponse.post.appointmentResponse);
	app.put('/:apikey/AppointmentResponse/:appointment_response_id?', AppointmentResponse.put.appointmentResponse);
}
module.exports = routesAppointmentResponse;