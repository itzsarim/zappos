var http = require("http");
var url = require("url");

//make mongo connection
var mongoose = require('mongoose');
	mongoose.connect('mongodb://localhost/test');//where you set it up

	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function callback() {
		// yay!
	});
	
	
	//--------------------------------------mongo setup-------------------------------//
	

	var zapposSchema = mongoose.Schema({
		name : String,
		pid : String,
		sid : String,
		email : String,
		predisc:String
	})

	var entry = mongoose.model('entry', zapposSchema);

	//-------------------------------------------------------------------------------------//

// extract product id , name and email from the form submitted and insert in the db

qs = require("querystring");
http.createServer(function(request, response) {

	

	if (request.method == 'POST') {
		var body = '';
		request.on('data', function(data) {
			body += data;
		});

		request.on('end', function() {

			
			var variable = qs.parse(body);

			var a = variable.pid;
			var d = variable.email;
			var c = variable.name;
			var b = variable.sid;
			
			var record = new entry({

				pid : a,
				sid : b,
				name : c,
				email : d,
				predisc : 0
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

	//--------------------------------------mongo setup-------------------------------//
	//dummy data for initialisation
	var rec1 = new entry({
		name : 'Sarim Zaidi',
		pid : "7515478",
		sid : "1788220",
		email : "z.sarim@gmail.com",
		predisc : "0"
	});

	rec1.save(function(err, fluffy) {
		if (err)
			return console.error(err);
		
	});


	//-------------------------------------------------------------------------------------//

	

	
	var emailID, name, sid, predisc;

	//query for every pid and sid combination to find the discount on that

	entry.find({
		pid : {
			$exists : true
		}
	}, function(err, products) {
		if (err)
			return console.error(err);
		
		products.forEach(function(pro) {
			sid = pro.sid;
			pid= pro.pid;
			emailID = pro.email;
			name = pro.name;
			predisc = pro.predisc;
			
			//get the product id from database and append in this url
			url = "http://api.zappos.com/Product/" + pid + "?includes=[%22styles%22]&key=b05dcd698e5ca2eab4a0cd1eee4117e7db2a10c4";

			console.log(name);
		})
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
				product = data.product[0];

				console.log(product);

				style = product.styles;
				
				var i;
				console.log(Object.keys(style).length);
				
				for(i=0;i<Object.keys(style).length;i++)
				{
					if(style[i].styleId==sid)
					discount = style[i].percentOff;//percentoff for the particular style of that product
				
					
				}
				
				
			
			
			
				console.log("discount " + discount);
				var disc = discount.substr(0, 2);
				console.log(disc);
                console.log(predisc);

//send notifications to individual emails if polling returned a discount is more than the previous discount
				if (disc >= 20 && disc > predisc) {


//update the discount, so that if discount goes more than previous discount the user will be emailed
					predisc = disc;
					entry.update({
						sid : products.sid
					}, {
						$set : {
							predisc : predisc
						}
					}, function(err, updated) {
						if (err || !updated)
							console.log("User not updated");
						else
							console.log("User updated");
					});
					
					

					console.log(emailID);

					var nodemailer = require("nodemailer");

					// create reusable transport method (opens pool of SMTP connections)
					var smtpTransport = nodemailer.createTransport("SMTP", {
						service : "Gmail",
						auth : {
							user : "emailID",
							pass : "password"
						}
					});

					// setup e-mail data with unicode symbols
					var mailOptions = {
						from : "Name ✔ <email>", // sender address
						to : emailID, // list of receivers
						subject : "Discount on your favourite item", // Subject line
						text : "Hello " + name + ", there is a discount on one of your favourite item, grab it before we decide to left it off the sale ;)", // plaintext body
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

	})//entry.find ends
}, 600000);//change polling interval here

