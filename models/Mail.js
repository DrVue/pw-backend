const Schema = require("mongoose").Schema;
const model = require("mongoose").model;

const schema = new Schema({
	userFromName: String,
	userFromId: String,
	userToName: String,
	userToId: String,
	idMail: String,
	text: String,
	time: Date,
});

module.exports = model("MailMessages", schema);