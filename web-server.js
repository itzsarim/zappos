var http = require("http");
var url = require("url");

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
	// yay!
});

var zapposSchema = mongoose.Schema({
	name : String,
	pid : String,
	sid : String,
	email : String
})

var entry = mongoose.model('entry', zapposSchema);

// extract product id , name and email from the form submitted and insert in the db

qs = require("querystring");
http.createServer(function(request, response) {

	if (request.method == 'POST') {
		var body = '';
		request.on('data', function(data) {
			body += data;
		});

		request.on('end', function() {

			//console.log('posted:'+body);

			var variable = qs.parse(body);

			var a = variable.pid;
			var b = variable.email;
			var c = variable.name;
			var d = variable.sid;

			console.log(a);
			console.log(b);
			console.log(c);

			var record = new entry({
				name : c,
				pid : a,
				sid : d,
				email : b
			});

			record.save(function(err, fluffy) {
				if (err)
					return console.error(err);

			});

		});

	}

	response.end();
}).listen(10001);

setInterval(function() {

	//get the product id from database and append in this url

	var emailID, name;
	
	//query for every pid and sid combination to find the discount on that
	
	

	entry.find({
		pid : "7515478"
	}, function(err, products) {
		if (err)
			return console.error(err);
		products.forEach(function(pro) {

			emailID = pro.email;
			name = pro.name;

			console.log(pro.email);
		})
	})
	url = "http://api.zappos.com/Product/7515478?includes=[%22styles%22]&key=b05dcd698e5ca2eab4a0cd1eee4117e7db2a10c4";

	// get is a simple wrapper for request()
	// which sets the http method to GET
	var request = http.get(url, function(response) {
		// data is streamed in chunks from the server
		// so we have to handle the "data" event
		var buffer = "", data, discount, style, product;

		response.on("data", function(chunk) {
			buffer += chunk;
		});

		response.on("end", function(err) {
			// finished transferring data
			// dump the raw data
			console.log(buffer);
			console.log("\n");
			data = JSON.parse(buffer);

			console.log(data)
			//var data = eval("("+buffer+")");
			product = data.product[0];

			console.log(product);

			style = product.styles;

			discount = style[4].percentOff;//for the sid of this pid
			console.log("discount " + discount);
			var disc = discount.substr(0, 2);
			console.log(disc);

			//if this discount for this product is more than 20% then send email to all the names against this productid

			//send notifications to individual emails if polling returned a discount

			if (disc >= 20) {
				var nodemailer = require("nodemailer");

				// create reusable transport method (opens pool of SMTP connections)
				var smtpTransport = nodemailer.createTransport("SMTP", {
					service : "Gmail",
					auth : {
						user : "z.sarim@gmail.com",
						pass : "piddus1989"
					}
				});

				// setup e-mail data with unicode symbols
				var mailOptions = {
					from : "Sarim Zaidi ✔ <z.sarim@gmail.com>", // sender address
					to : emailID, // list of receivers
					subject : "Discount on your favourite item", // Subject line
					text : "Hello " + name + ", there is a discount on one of your favourited item, grab it before we decide to left it off the sale ;)", // plaintext body
					//html: "<b>Hello world ✔</b>" // html body
				}

				// send mail with defined transport object
				smtpTransport.sendMail(mailOptions, function(error, response) {
					if (error) {
						console.log(error);
					} else {
						console.log("Message sent: " + response.message);
					}

					// if you don't want to use this transport object anymore, uncomment following line
					//smtpTransport.close(); // shut down the connection pool, no more messages
				});

			}

			

		});
	});

}, 2000);

