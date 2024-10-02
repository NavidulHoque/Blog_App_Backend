export default function socketEvents(io) {

    io.on("connection", (socket) => {

        socket.on("blogApp", (payload) => {
            io.emit("blogApp", payload)
        })

        // Handle disconnection
        socket.on("disconnect", () => {
            console.log('Client disconnected')
        });
    });
};
