const Schema = require("mongoose").Schema;
const model = require("mongoose").model;

const schema = new Schema({
	name: String,
	tag: String,
});

module.exports = model("Chats", schema);