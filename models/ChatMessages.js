const Schema = require("mongoose").Schema;
const model = require("mongoose").model;

const schema = new Schema({
	userName: String,
	userId: String,
	chatId: String,
	chatTag: String,
	text: String,
	time: Date,
});

module.exports = model("ChatMessages", schema);