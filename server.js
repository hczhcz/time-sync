'use strict';

var port = 23333;

var fs = require('fs');
var http = require('http');
var io = require('socket.io');

// web content

var client = fs.readFileSync('client.html');

// http server: send the html file

var server = http.createServer(function (req, res) {
    res.writeHead(200, {});
    res.end(client);
});

var ioserver = io(server);

// socket.io server: exchange data dynamically

ioserver.on('connection', function (socket) {
    // send timestamp back
    socket.on('sync', function (req, res) {
        res(Date.now());
    });

    // broadcast an action
    socket.on('broadcast', function (req) {
        ioserver.emit('broadcast', {
            // just for demo, input is not filtered here
            timestamp: Date.now() + req.delay,
            action: req.action,
        });
    });
});

// run the server

server.listen(port);
