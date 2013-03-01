var DEBUG = true
var PORT = process.env.PORT || 3000
var INIT_MESSAGES = 5
var APP_NAME = "http://peaceful-hamlet-4616.herokuapp.com"

/*
    Express web app
*/

var express = require('express')

var app = express.createServer(express.logger())
app.set('views', __dirname)
app.set("view options", {layout: false});
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
    response.render("chat", {"PORT": PORT, "HOST": APP_NAME})
})

app.listen(PORT, function() {
    console.log("Listening on " + PORT)
})

/*
    Socket.io server
*/

var io = require('socket.io').listen(app)
io.set ('transports', ['xhr-polling', 'jsonp-polling'])

var messages = new Array()

Array.prototype.inject = function(element) {

    if (this.length >= INIT_MESSAGES) {
        this.shift()
    }
    this.push(element)
}

io.sockets.on('connection', function(client) {

    if (DEBUG)
        console.log("New Connection: ", client.id)

    client.emit("init", JSON.stringify(messages))

    client.on('msg', function(msg) {

        if (DEBUG)
            console.log("Message: " + msg)

        var message = JSON.parse(msg)
        messages.inject(message)

        client.broadcast.emit('msg', msg)
    })

    client.on('disconnect', function() {

        if (DEBUG)
            console.log("Disconnected: ", client.id)
    })
})
