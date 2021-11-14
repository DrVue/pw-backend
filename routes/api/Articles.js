const router = require("express").Router();

const Sessions = require("../../models/Sessions");
const Users = require("../../models/Users");
const Articles = require("../../models/Articles");
const ArticleLikes = require("../../models/ArticleLikes");

router.post("/add", async (req, res) => {
	const ret = await Sessions.getId(req.body.token);
	const data = await Users.findById(ret);

	if (data !== null) {
		const article = new Articles({
			userName: data.name,
			userId: data._id,
			text: req.body.text,
			title: req.body.title,
			lang: "RU",
			time: new Date(),
		})
		await article.save();
		res.send({response: "ok"});
	} else {
		res.send({response: "err", err: "accessDenied"});
	}
})

router.post("/getOne", async (req, res) => {
	const ret = await Sessions.getId(req.body.token);
	const data = await Users.findById(ret);
	const art = await Articles.find({}).limit(50).sort({data: -1});
	const likes = await ArticleLikes.findOne({userId: ret, articleId: req.body.id});
	if (data === null) {
		return res.send({
			data: {},
			response: "err",
			error: "notFoundArticle",
		})
	} else {
		if (likes === null) {
			return await res.send({
				data: art,
				response: "ok",
			})
		} else {
			const obj = {
				isLike: true,
			}
			const d = Object.assign(obj, art._doc);
			return await res.send({
				data: d,
				response: "ok",
			})
		}
	}
});

router.post("/getAll", async (req, res) => {
	const art = await Articles.find({}).limit(50).sort({data: -1});
	if (data === null) {
		return res.send({
			data: {},
			response: "err",
			error: "notFoundArticle",
		})
	} else {
		return await res.send({
			data: art,
			response: "ok",
		})
	}
});

router.post("/addLike", async (req, res) => {
	const ret = await Sessions.getId(req.body.token);
	const data = await Users.findById(ret);
	const art = await Articles.findById(req.body.id);
	const likes = await ArticleLikes.findOne({userId: ret, articleId: req.body.id})

	if (data === null && likes !== null) {
		return res.send({
			response: "err",
			error: "accessDenied",
		})
	} else {
		await art.update({$inc: {likes: req.body.val}});
		const like = new ArticleLikes({
			userId: ret,
			articleId: req.body.id,
		})
		await like.save();
		return await res.send({
			response: "ok",
		});
	}
});

module.exports = router;