const socket = io();

socket.on("connection", function () {
    const socketID = socket.id;
    console.log("Socket<" + socketID + "> connected");

    socket.on("disconnect", function () {
        console.log("Socket<" + socketID + "> disconnected");
    });
});