const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
const PORT = process.env.PORT || 8080;
app.get('/', (req, res) => {
        res.send('Hello World');
});

io.on("connection", (socket) => {
    socket.emit("me", socket.id);
    
    // Handle offer signal from client 1 to forward to client 2
    socket.on("sendOffer", ({ callToUserSocketId, callFromUserSocketId, offerSignal }) => {
        console.log(`Forwarding offer from ${callFromUserSocketId} to ${callToUserSocketId}`);
        io.to(callToUserSocketId).emit("receiveOffer", {
            callFromUserSocketId,
            offerSignal
        });
    });
    
    // Handle answer signal from client 2 to forward back to client 1
    socket.on("sendAnswer", ({ callToUserSocketId, callFromUserSocketId, answerSignal }) => {
        console.log(`Forwarding answer from ${callFromUserSocketId} to ${callToUserSocketId}`);
        io.to(callToUserSocketId).emit("receiveAnswer", {
            callFromUserSocketId,
            answerSignal
        });
    });
    
    // Listen for disconnect events
    socket.on("disconnect", () => {
        console.log(`Socket disconnected: ${socket.id}`);
        // Optionally broadcast a "user disconnected" event to remove streams on client side
        socket.broadcast.emit("userDisconnected", socket.id);
    });

});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));