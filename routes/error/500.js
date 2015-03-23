exports.internalError = function (request, response) {
	response.route;
	response.render('500', {
		title: '500 - Internal Server Error'
	});
};