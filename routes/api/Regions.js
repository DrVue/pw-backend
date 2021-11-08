const router = require("express").Router();

const Sessions = require("../../models/Sessions");
const Users = require("../../models/Users");
const Regions = require("../../models/Regions");

router.post("/add", async (req, res) => {
	const ret = await Sessions.getId(req.body.token);
	const data = await Users.findById(ret);

	if (data.priv === 3) {
		const {name, nameLat} = req.body;
		const reg = await Regions.findOne({name: name});
		if (reg === null) {
			const region = new Regions({
				name: name,
				nameLat: nameLat,
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
				error: "thisRegionNameNotFree",
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

router.post("/getOne", async (req, res) => {
	const data = await Regions.findById(req.body.id);
	if (data === null) {
		return res.send({
			data: {},
			response: "err",
			error: "notFoundRegion",
		})
	} else {
		return res.send({
			data: data,
			response: "ok",
		})
	}
});

router.post("/search", async (req, res) => {
	const name = new RegExp(req.body.name, "i");
	const nameLat = new RegExp(req.body.nameLat, "i");
	const data = await Regions.find().or([{"name": {$regex: name}}, {"nameLat": {$regex: nameLat}}])
	if (data === null) {
		return res.send({
			data: [],
			response: "ok",
		})
	} else {
		return res.send({
			data: data,
			response: "ok",
		})
	}
});

router.post("/getAll", async (req, res) => {
	const data = await Regions.find({});
	if (data === null) {
		return res.send({
			data: {},
			response: "err",
			error: "notFoundRegion",
		})
	} else {
		return res.send({
			data: data,
			response: "ok",
		})
	}
});

router.post("/move", async (req, res) => {
	const reg = await Regions.findById(req.body.id);
	const ret = await Sessions.getId(req.body.token);
	const data = await Users.findById(ret);

	if (data !== null) {
		if (reg !== null) {
			await Users.updateOne({_id: data._id}, {region: reg._id})
			return res.send({
				response: "ok",
			});
		} else {
			return res.send({
				data: {},
				response: "err",
				error: "regionNotFound",
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