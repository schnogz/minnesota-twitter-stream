exports.error = function (request, response) {
	response.route;
	response.render('404', {
		title: '404 - Page Not Found',
		requestedUrl: request.headers.host + request.session.invalidUrl
	});
};