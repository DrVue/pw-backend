const router = require("express").Router();

const Sessions = require("../../models/Sessions");
const Users = require("../../models/Users");
const MailMessages = require("../../models/Mail");
const MailUsers = require("../../models/MailUsers");

router.post("/newMessage", async (req, res) => {
	const ret = await Sessions.getId(req.body.token);
	const data = await Users.findById(ret);
	const data2 = await Users.findById(req.body.id);
	const mailChat = await MailUsers.findById(req.body.id);

	if (ret !== null) {
		const from = new RegExp(ret, "i");
		const to = new RegExp(req.body.id, "i");

		if (req.body.type === "inChat") {
			await mailChat.update({text: req.body.text});
			const msg = new MailMessages({
				userFromName: data.name,
				userFromId: data._id,
				text: req.body.text,
				idMail: mailChat._id,
				userToName: mailChat.userToName,
				userToId: mailChat.userToId,
				time: new Date(),
			})
			await msg.save();
		} else {
			if (!mailChat) {
				const chat = new MailUsers({
					userFromName: data.name,
					userFromId: data._id,
					text: req.body.text,
					userToName: data2.name,
					userToId: req.body.id,
					time: new Date(),
				})
				chat.save().then(d => {
					const msg = new MailMessages({
						userFromName: data.name,
						userFromId: data._id,
						text: req.body.text,
						idMail: d._id,
						userToName: data2.name,
						userToId: req.body.id,
						time: new Date(),
					})
					msg.save();
				});

			} else {
				await mailChat.update({text: req.body.text});
				const msg = new MailMessages({
					userFromName: data.name,
					userFromId: data._id,
					text: req.body.text,
					idMail: mailChat._id,
					userToName: mailChat.userToName,
					userToId: mailChat.userToId,
					time: new Date(),
				})
				await msg.save();
			}
		}

		res.send({response: "ok"});
	} else {
		res.send({
			response: "err",
			error: "accessDenied",
		})
	}
})

router.post("/getMails", async (req, res) => {
	const ret = await Sessions.getId(req.body.token);
	const data = await Users.findById(ret);

	if (data === null) {
		return res.send({
			data: {},
			response: "err",
			error: "accessDenied",
		})
	} else {
		const id = new RegExp(ret, "i");
		const mailChat = await MailUsers.find().or([{"userFromId": {$regex: id}}, {"userToId": {$regex: id}}]);

		return res.send({
			data: mailChat,
			response: "ok",
		})
	}
});

router.post("/getMessages", async (req, res) => {
	const ret = await Sessions.getId(req.body.token);
	const data = await Users.findById(ret);

	if (data === null) {
		return res.send({
			data: {},
			response: "err",
			error: "accessDenied",
		})
	} else {
		const mailChat = await MailMessages.find({idMail: req.body.id});

		return res.send({
			data: mailChat,
			response: "ok",
		})
	}
});

module.exports = router;
