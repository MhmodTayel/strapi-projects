'use strict';

function setupConnection(strapi) {
    var io = require("socket.io")(strapi.server.httpServer, {
        cors: { // cors setup
            origin: "*", // TODO change to process.env.FRONTEND_URL || "http://localhost:3000"
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    io.on("connection", function (socket) { //Listening for a connection from the frontend
        socket.on("join", ({ userId, entityId, portal }) => { // Listening for a join connection
            strapi.log.info(`user joined ${userId}`);

            if (userId) {
                socket.join(portal + "-users"); // admin, teacher, parent, student
                socket.join("user-id-" + userId); // user-id-1
                socket.join(portal + "-user-" + entityId); // entity-id-1

                socket.emit("welcome", `userId: ${userId}, entityId: ${entityId}, socket id: ${socket.id}, welcome.`);
            } else {
                strapi.log.error('An error occurred');
            }
        });

        socket.on('join-room', ({ userId, entityId, portal, entity }) => {
            // Listening for a join connection
            if (userId && entity && entityId) {
                strapi.log.info(`user ${userId} joined room entity-${entity}-${entityId}`);
                socket.join(`entity-${entity}-${entityId}`);
            }
        });

        socket.on('leave-room', ({ userId, entityId, portal, entity }) => {
            // Listening for a leave connection
            if (userId && entity && entityId) {
                strapi.log.info(`user ${userId} left room entity-${entity}-${entityId}`);
                socket.leave(`entity-${entity}-${entityId}`);
            }
        });
    });

    return io;
}


module.exports = {
    setupConnection
}