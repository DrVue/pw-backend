const router = require("express").Router();

const Sessions = require("../../models/Sessions");
const Users = require("../../models/Users");
const Chats = require("../../models/Chats");
const ChatMessages = require("../../models/ChatMessages");

router.post("/add", async (req, res) => {
	const ret = await Sessions.getId(req.body.token);
	const data = await Users.findById(ret);

	if (data.priv === 3) {
		const {name, tag} = req.body;
		const reg = await Chats.findOne({name: name});
		if (reg === null) {
			const region = new Chats({
				name: name,
				tag: tag,
			});
			region.save().then((d) => {
				return res.send({
					_id: d._id,
					response: "ok",
				});
			});
		} else {
			return res.send({
				data: {},
				response: "err",
				error: "thisChatNameNotFree",
			})
		}
	} else {
		return res.send({
			data: {},
			response: "err",
			error: "invalidToken",
		})
	}
});

router.post("/newMessageByTag", async (req, res) => {
	const ret = await Sessions.getId(req.body.token);
	const data = await Users.findById(ret);
	const chat = await Chats.findOne({tag: req.body.tag});

	const msg = new ChatMessages({
		userName: data.name,
		userId: data._id,
		text: req.body.text,
		chatId: req.body.id,
		chatTag: req.body.tag,
		time: new Date(),
	})
	await msg.save();
	res.send({response: "ok"});
})

router.post("/getMessagesById", async (req, res) => {
	const data = await ChatMessages.find({chatId: req.body.id});
	if (data === null) {
		return res.send({
			data: {},
			response: "err",
			error: "notFoundMsg",
		})
	} else {
		return res.send({
			data: data,
			response: "ok",
		})
	}
});

router.post("/getMessagesByTag", async (req, res) => {
	const data = await ChatMessages.find({chatTag: req.body.tag}).limit(50).sort({time: -1});
	if (data === null) {
		return res.send({
			data: {},
			response: "err",
			error: "notFoundMsg",
		})
	} else {
		return res.send({
			data: data,
			response: "ok",
		})
	}
});

router.post("/getOne", async (req, res) => {
	const data = await Chats.findById(req.body.id);
	if (data === null) {
		return res.send({
			data: {},
			response: "err",
			error: "notFoundChat",
		})
	} else {
		return res.send({
			data: data,
			response: "ok",
		})
	}
});

router.post("/getByTag", async (req, res) => {
	const data = await Chats.findOne({tag: req.body.tag});
	if (data === null) {
		return res.send({
			data: {},
			response: "err",
			error: "notFoundChat",
		})
	} else {
		return res.send({
			data: data,
			response: "ok",
		})
	}
});

router.post("/edit", async (req, res) => {
	const ret = await Sessions.getId(req.body.token);
	const data = await Users.findById(ret);

	if (data.priv === 3) {
		const {name, tag} = req.body;
		const reg = await Chats.findOne({name: name});
		if (reg === null) {
			await Chats.updateOne({_id: req.body.id}, {name: name, tag: tag});
			return res.send({
				_id: req.body.id,
				response: "ok",
			});
		} else {
			return res.send({
				data: {},
				response: "err",
				error: "thisChatNameNotFree",
			})
		}
	} else {
		return res.send({
			data: {},
			response: "err",
			error: "invalidToken",
		})
	}
});

module.exports = router;

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

const server = require("http").createServer(app);

const io = require("socket.io")(server, {
	cors: {
		origin: "*",
	},
});

// io.set("origins", "*:*");

io.on("connection", (client) => {
	client.on("subscribeToChat", (chatTag) => {
		console.log("Connect");
		setInterval(async () => {
			client.emit("message", await ChatMessages.find({chatTag: chatTag}).limit(50).sort({time: -1}))
		}, 1000)
	})
})

io.listen(30011);
console.log("Create socket on port 30011");