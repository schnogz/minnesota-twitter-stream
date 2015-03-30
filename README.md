# Twitter Stream Minnesota
***

About
========

Streams and maps Minnesotan tweets in realtime using the Twitter Streaming API, Node.js, OAuth, AngularJs, Express and Socket.io.

Currently the stream is only tracking tweets with geolocation tags.

Demo
=======

This is still a work in progress, demo coming soon!

Preparing The Dev Environment
========

* Clone repo.
* Ensure Node, NPM, and Bower are installed globally.
* From root directory, run: `npm install`, `bower install` to pull dependencies.
* Create a config directory at application root and add twitter.js. Twitter.js should export a module that is an object
  containing a Twitter consumer_key and consumer_secret. For example:
    module.exports = {
        consumer_key: "abc123",
        consumer_secret: "xyz987"
    };s
* To start the application server, from the root directory run: `node app`.
* Browse to localhost:3000 and enjoy.

Planned Future Revisions
========
* Tidy up UI (sidebar, tweet markers, twitter login).
* Add splash screen explaining app.
* Add tweet details bottom pane.
* Add tweet about app buttom.
* Add ability to rewteet, favorite tweets

License
========

Copyright 2015 Andrew Schneider.
Licensed under the MIT License.
 

