var express = require('express'),
    app = express();

var listenPort = process.env.PORT = 3000;

app.use(express.static(__dirname + '/src'));

app.listen(listenPort, function() {
    console.log('listening on port', listenPort);
});
