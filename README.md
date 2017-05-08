# minnesota-twitter-stream

Overview
========
Streams and maps Minnesotan tweets in realtime using the Twitter Streaming API, Node.js, OAuth, AngularJs, Express and Socket.io.
Currently the stream is only tracking tweets with geolocation tags.

View the application [here](http://minnesota-twitter-stream.herokuapp.com/)

TODO's
========
* Heroku socket connection not fully functional
* Add Twitter auth back
* Update Bower deps 
* Remove custom Angular Material CSS
* Figure out how to plot tweets that don't have a location (at least display them in sidenav)
* Add ability to retweet, favorite tweets

Local Development Setup
========
* Clone repo.
* Ensure Node, NPM, and Bower are installed globally.
* To pull dependencies run `npm install`
* Edit `config/api-keys.js` to include your twitter consumer key and secret.
* To start the application server, from the root directory run: `npm start`.
* Browse to localhost:3000.

License
========
Copyright 2017 Andrew Schneider.
 

