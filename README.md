zappos
======

##This is the project description

###This project is a coding challenge for zappos.com

###This a responsive web application optimised for mobile.

###It uses zappos API to make RESTful calls and get product details from zappos servers. It uses angular.js for the front-end interface, node.js for the server and mongodb for storing data. 

####you can search for a product using the interface and favorite an item by clicking on the heart button below the product, or buy it by clicking on the cart button(basically you are redirected to zappos.com for that product ;)).
####once you favorite an item, you will be prompted to enter your name and email id, so that zappos can send you notifications when this item goes on sale(more than 20%).

Architecture
--------------
--------------
![architecture](https://docs.google.com/drawings/d/1P4nS-zMlU_jM2cx0__QKgfp9vXZCWG_4PdplIRrvWUA/pub?w=1381&h=733)

##Configuration instruction

###The interface can be found at [My Website](http://www.sarimzaidi.com/projects/zappos) here you can search for any product using the search box, some times the zappos api gets *throttled* and you dont get any results, so beware of that.

###once you favorite an item by clicking on the heart button, you will be prompted to enter your name and email, which will be used to send you notifications.

###this data now goes to my server **web-server.js** which does all the backend stuff

### to make the backend work, you need to host the web-server.js on your machine which has node.js install on it as well as mangodb installed.

##changes to be made in *form.html* and *web-server.js*

`line 56` in `form.html` connects to the server, you need to change the ip address and port number to point it to your server and port. 

`line 6` in `web-server.js` has to changed to point to where you created mongodb server

`line 73` in `web-server.js` tells you the port on which its listening, use this port while calling from `form.html`

`line 197` and `line 198` specify which emailID and password will be used to send emails to clients, set them up.

`line 204` sets the from field of the email, set it up

>Thats it, you are done, go on and play with my app, and let me know if you find any bug, or you have any suggestions to improve the app(i know you have;))









initial commit
