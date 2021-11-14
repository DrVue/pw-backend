const Schema = require("mongoose").Schema;
const model = require("mongoose").model;

const schema = new Schema({
	title: String,
	lang: String,
	text: String,
	likes: {
		type: Number,
		default: 0,
	},
	userId: String,
	userName: String,
	date: Date,
});

module.exports = model("Articles", schema);