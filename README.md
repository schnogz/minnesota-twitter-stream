# minnesota-twitter-stream
***

Overview
========
Streams and maps Minnesotan tweets in realtime using the Twitter Streaming API, Node.js, OAuth, AngularJs, Express and Socket.io.
Currently the stream is only tracking tweets with geolocation tags.

Demo
=======
This is still a work in progress, demo coming soon!

Local Development Setup
========
* Clone repo.
* Ensure Node, NPM, and Bower are installed globally.
* To pull dependencies run: 
```
  npm install && bower install
```
* Edit `config/api-keys.js` to include your twiiter
* To start the application server, from the root directory run: `node app`.
* Browse to localhost:3000.

TODO's
========
* Tidy up UI (sidebar, tweet markers, twitter login).
* Add splash screen explaining app.
* Add tweet details bottom pane.
* Add tweet about app buttom.
* Add ability to rewteet, favorite tweets

License
========
Copyright 2017 Andrew Schneider.
 

