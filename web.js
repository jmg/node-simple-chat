var DEBUG = true
var PORT = 3000
var INIT_MESSAGES = 5

var http = require('http')

var server = http.createServer()
server.listen(PORT)

var io = require('socket.io').listen(server)
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
