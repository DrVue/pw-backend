const router = require("express").Router();

const Users = require("../../models/Users");
const Sessions = require("../../models/Sessions");

/*
    Get auth user information --- /api/users/auth/get

    token = String
*/
router.post("/get", async (req, res) => {
	const ret = await Sessions.getId(req.body.token);
	const data = await Users.findById(ret);
	if (ret !== null) {
		await data.updateLastLogin();
		res.send({
			data: data.formatPrivate(),
			response: "ok",
		});
	} else {
		res.send({
			data: {},
			response: "err",
			error: "accessDenied",
		})
	}
});

router.post("/deleteNotify", async (req, res) => {
	const ret = await Sessions.getId(req.body.token);
	const data = await Users.findById(ret);
	if (ret !== null) {
		switch (req.body.type) {
			case "notifyNewLevel":
				await data.update({notifyNewLevel: false});
				break;
			case "notifyNewMail":
				await data.update({notifyNewMail: false});
				break;
		}
		res.send({
			response: "ok",
		});
	} else {
		res.send({
			data: {},
			response: "err",
			error: "accessDenied",
		})
	}
});

/*
    Login user --- /api/users/auth/login

    email = String
    pass = String
*/
router.post("/login", async (req, res) => {
	const ret = await Users.loginUser(req.body.email, req.body.pass);
	if (ret !== false) {
		res.send({
			data: {
				token: ret,
			},
			response: "ok",
		})
	} else {
		res.send({
			data: {},
			response: "err",
			error: "falseEmailPass",
		})
	}
});

/*
    Check user token --- /api/users/auth/checkToken

    token = String
*/
router.post("/checkToken", async (req, res) => {
	const ret = await Sessions.checkToken(req.body.token);
	if (ret !== null) {

		return res.send({
			data: ret,
			response: "ok",
		});
	} else {
		return res.send({
			data: {},
			response: "err",
			error: "invalidToken",
		})
	}
});

module.exports = router;