const express = require('express');
const next = require('next');
const http = require('http')
const cors = require('cors');
const mongoose = require('mongoose');
const user = require('./Server/Router/QrApiRoutes');



const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();
const socketServer = http.createServer(app);
    
    server.use(cors())
    server.use(express.json());
    server.use('/', user)

    mongoose.connect('mongodb://localhost:27017/chat_data').then(() => {
        console.log('database connection established')
    })

    const io = require('socket.io')(socketServer, {
        cors: {
            origin: ["https://front-end-hn5g.vercel.app", "http://localhost:3000"],
            methods: ["GET", "POST", "PUT", "DELETE"]
        }
    });


    let connectedClients = {};

    let pendingConnections = {};



    io.on('connection', (socket) => {
        socket.on('join-room', (code) => {
            connectedClients[code] = socket.id;
        });

        socket.on('confirm-connection', (code) => {
            const clientSocketId = connectedClients[code];
            if (clientSocketId) {
                io.to(clientSocketId).emit('connected', { status: 'Connected' });
            }
        });

        socket.on('send-message', (message, name) => {
            io.emit('received-message', { message: message, name: name });
        });

        socket.on("join_request", ({ code }) => {
            if (!pendingConnections[code]) {
                pendingConnections[code] = [];
            }
            pendingConnections[code].push(socket.id);

            io.emit("notify_home", { code });
        });


        socket.on("home_response", ({ code, accepted }) => {
            const joinSockets = pendingConnections[code];
            if (joinSockets) {
                joinSockets.forEach((joinSocketId) => {
                    io.to(joinSocketId).emit("response", { accepted });
                });
                delete pendingConnections[code];
            }
        });


        socket.on('disconnect', () => {
            console.log('A user disconnected:', socket.id);
        });
    });


    server.all('*', (req, res) => {
        return handle(req, res);
    });

    server.listen(3000, (err) => {
        if (err) throw err;
        console.log('> Ready on http://localhost:3000');
    });
});
