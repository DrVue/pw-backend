const router = require("express").Router();

const Sessions = require("../../models/Sessions");
const Users = require("../../models/Users");
const Factors = require("../../models/Factors");

router.post("/add", async (req, res) => {
	const ret = await Sessions.getId(req.body.token);
	const data = await Users.findById(ret);

	if (data.money >= 1000000) {
		const reg = await Factors.findOne({name: req.body.name, region: data.region});
		if (reg === null) {
			await Users.updateOne({_id: data._id}, {$inc: {money: -1000000}});
			const factory = new Factors({
				name: req.body.name,
				region: data.region,
				userId: data._id,
				type: req.body.type,
			});
			factory.save().then((d) => {
				return res.send({
					_id: d._id,
					response: "ok",
				});
			});
		} else {
			return res.send({
				data: {},
				response: "err",
				error: "thisFactoryNameNotFree",
			})
		}
	} else {
		return res.send({
			data: {},
			response: "err",
			error: "notMoney",
		})
	}
});

router.post("/getOne", async (req, res) => {
	const data = await Factors.findById(req.body.id);
	if (data === null) {
		return res.send({
			data: {},
			response: "err",
			error: "notFoundFactory",
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
	const data = await Factors.find().or([{"name": {$regex: name}}])
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
	const data = await Factors.find({region: req.body.region});
	if (data === null) {
		return res.send({
			data: {},
			response: "err",
			error: "notFound",
		})
	} else {
		return res.send({
			data: data,
			response: "ok",
		})
	}
});

router.post("/work", async (req, res) => {
	const factory = await Factors.findById(req.body.id);
	const ret = await Sessions.getId(req.body.token);
	const data = await Users.findById(ret);

	if (data !== null) {
		if (factory !== null && data.region === factory.region) {
			const energy = req.body.energy < 10 ? 10 : req.body.energy;
			const enr = (energy / 10).toFixed(0);
			if (data.energy >= energy) {
				await data.delEnergy(enr * 10)
				await data.addExp(10 * enr);
				await factory.addExp(10 * enr);
				await data.addMoney((factory.profitMoney * factory.salary) * enr);
				await factory.addMoneyBank(enr);
				switch (factory.type) {
					case "gold":
						await data.addGold((factory.profitGold * factory.salary) * enr);
						await factory.addGoldBank(enr);
						break;
					case "oil":
						await data.addResource("oil", factory.profitResources * factory.salary);
						await factory.addResourcesBank(enr);
						break
					case "ore":
						await data.addResource("ore", factory.profitResources * factory.salary);
						await factory.addResourcesBank(enr);
						break
					case "buildingMaterial":
						await data.addResource("buildingMaterial", factory.profitResources * factory.salary);
						await factory.addResourcesBank(enr);
						break
				}
				return res.send({
					response: "ok",
				});
			} else {
				return res.send({
					data: {},
					response: "err",
					error: "notEnergy",
				})
			}
		} else {
			return res.send({
				data: {},
				response: "err",
				error: "factoryNotFound",
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

router.post("/cashOut", async (req, res) => {
	const factory = await Factors.findById(req.body.id);
	const ret = await Sessions.getId(req.body.token);
	const data = await Users.findById(ret);

	if (data !== null) {
		if (factory !== null && data._id !== factory.userId) {
			switch (req.body.type) {
				case "money":
					await data.addMoney(factory.moneyBank);
					await factory.delMoney(factory.moneyBank);
					break;
				case "gold":
					await data.addGold(factory.goldBank);
					await factory.delGold(factory.goldBank);
					break;
				case "resources":
					switch (factory.type) {
						case "gold":
							await data.addGold(factory.goldBank);
							await factory.delGold(factory.goldBank);
							break;
						case "oil":
							await data.addResource("oil", factory.resourcesBank);
							await factory.delResources(factory.resourcesBank);
							break;
						case "ore":
							await data.addResource("ore", factory.resourcesBank);
							await factory.delResources(factory.resourcesBank);
							break;
						case "buildingMaterial":
							await data.addResource("buildingMaterial", factory.resourcesBank);
							await factory.delResources(factory.resourcesBank);
							break;
					}
					break;
			}
			return res.send({response: "ok"});
		} else {
			return res.send({
				data: {},
				response: "err",
				error: "factoryNotFound",
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