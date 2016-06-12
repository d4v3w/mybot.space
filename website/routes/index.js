var express = require('express'),
    router = express.Router();

var websiteConfig = {
	name: 'mybot.space',
	description: 'It\'s all about the robots.'
};

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
		config: websiteConfig,
		title: websiteConfig.name,
		body: 'Welcome to ' + websiteConfig.name
	});
});

/* GET about page. */
router.get('/about', function(req, res, next) {
    res.render('index', {
		config: websiteConfig,
	    title: 'About ' + websiteConfig.name,
		body: 'All about robots.'
    });
});

/* GET robots page. */
router.get('/robots', function(req, res, next) {
    res.render('robot', {
		config: websiteConfig,
	    title: 'The ' + websiteConfig.name + ' robots',
		body: 'Enter the robots...'
    });
});

module.exports = router;
