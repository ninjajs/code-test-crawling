
/*
 * GET home page.
 */

exports.index = function(req, res) {
	res.render('index', { title: 'Gloves' });
};

/*
 * Reset products
 */

exports.reset = function(req, res) {

	writeFile('');

	res.end('Data reset.');
};

/*
 * Scrape products
 */

exports.scrape = function(req, res){

	var request = require('request');
	var jsdom = require('jsdom');

	request({uri: 'http://www.freepeople.com/accessories-gloves-2/'}, function(err, response, body) {

		//Just a basic error check
		if (err && response.statusCode !== 200) { console.log('Request error.'); }

		jsdom.env(
			body,
			['http://code.jquery.com/jquery-1.6.min.js'],
			function(err, window) {
				//Use jQuery just as in a regular HTML page
				var $ = window.jQuery;

				var products = $('.products .product');
				var productsLength = products.length;
				var productsArr = [];

				function checkFinished() {
					console.log(productsArr.length);

					if (productsArr.length == productsLength) {
						console.log('we are finished');

						var jsonStr = JSON.stringify(productsArr);

						res.end('Finished scraping.');

						writeFile(jsonStr);
					}
				}

				// loop through each product
				for (var i = 0; i < productsLength; i++) {
					
					var curr = $(products[i]);

					var details = curr.find('.details');
					var link = details.find('h2 a');
					var colors = curr.find('.swatches .swatch');
					var quickviewUrl = curr.find('.image .quickview').attr('href');

					var product = {
						name: link.html(),
						url: link.attr('href'),
						price: $.trim(details.find('.price').text()),
						image: curr.find('.image img').attr('src'),
						colors: []
					};

					// colors
					for (var j = 0; j < colors.length; j++) {
						var color = $(colors[j]).attr('title');
						product.colors.push(color);
					}

					// get description
			        request({uri: quickviewUrl}, (function(err, response, body) { 
			        	var self = this;

			        	jsdom.env(
							body,
							['http://code.jquery.com/jquery-1.6.min.js'],
							function(err, window) {
								var $ = window.jQuery;

								var desc = $.trim($('.long-desc').text());
								self.description = desc;

								productsArr.push(self);
								checkFinished();
						});
			        }).bind(product));
					
				}

				//res.end($('.products').html());
		});
	});
};

function writeFile(str) {
	var fs = require('fs');

	fs.writeFile("./public/data/products.json", str, function(err) {
	    if(err) {
	        console.log(err);
	    } else {
	        console.log("The file was saved!");
	    }
	});
}
