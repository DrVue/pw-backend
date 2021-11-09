const express = require("express");
const ChatMessages = require("./models/ChatMessages");
const Sessions = require("./models/Sessions");
const Users = require("./models/Users");

const app = express();

const server = require("http").createServer(app);

const io = require("socket.io")(server, {
	cors: {
		origin: "*",
	},
});

io.on("connection", (client) => {
	client.on("subscribeToChat", async (chatTag) => {
		client.emit("message", await ChatMessages.find({chatTag: chatTag}).limit(50).sort({time: -1}))
	})
	client.on("subscribeToUserInfo", async (token) => {
		console.log("Connect");
		const ret = await Sessions.getId(token);
		client.emit("userInfo", await Users.findById(ret));
		setInterval(async () => {
			client.emit("userInfo", await Users.findById(ret));
		}, 1000 * 5)
	})
})

io.listen(30011);
console.log("Create socket on port 30011");

module.exports = io;