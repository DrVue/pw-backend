const express = require("express");
const ChatMessages = require("./models/ChatMessages");
const Sessions = require("./models/Sessions");
const Users = require("./models/Users");
const MailMessages = require("./models/Mail");
const MailUsers = require("./models/MailUsers");

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
	client.on("subscribeToMail", async (token) => {
		const ret = await Sessions.getId(token);
		const id = new RegExp(ret, "i");
		client.emit("mail", await MailUsers.find().or([{"userFromId": {$regex: id}}, {"userToId": {$regex: id}}]))
		setInterval(async () => {
			client.emit("mail", await MailUsers.find().or([{"userFromId": {$regex: id}}, {"userToId": {$regex: id}}]))
		}, 1000 * 3);
	})
	client.on("subscribeToMailMessages", async (id) => {
		client.emit("mailMessages", await MailMessages.find({idMail: id}).limit(50).sort({time: -1}))
		setInterval(async () => {
			client.emit("mailMessages", await MailMessages.find({idMail: id}).limit(50).sort({time: -1}))
		}, 1000);
	})
	client.on("subscribeToUserInfo", async (token) => {
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