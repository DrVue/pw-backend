const Schema = require("mongoose").Schema;
const model = require("mongoose").model;

const schema = new Schema({
	articleId: String,
	userId: String,
});

module.exports = model("ArticleLikes", schema);