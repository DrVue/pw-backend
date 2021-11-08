const router = require("express").Router();

const Users = require("../../models/Users");

router.post("/get", async (req, res) => {
	const data = await Users.findById(req.body.idUser);
	if (data === null) {
		return res.send({
			data: {},
			response: "err",
			error: "notFoundUser",
		})
	} else {
		return res.send({
			data: data.formatOpen(),
			response: "ok",
		})
	}
});

/*
    Add new user --- /api/users/add
    email = String
    name = String
    pass = String
*/
router.post("/reg", async (req, res) => {
	if (await Users.checkEmail(req.body.email) === true) {
		const data = await Users.addUser(req.body.email, req.body.name, req.body.pass);
		return res.send({
			data: data,
			response: "ok",
		});
	} else {
		return res.send({
			data: {},
			response: "err",
			error: "thisEmailNotFree",
		});
	}
});

module.exports = router;