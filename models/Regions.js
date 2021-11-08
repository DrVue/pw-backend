const Schema = require("mongoose").Schema;
const model = require("mongoose").model;

const schema = new Schema({
	name: String,
	nameLat: String,

	government: {
		type: String,
		default: "null",
	},
	guber: {
		type: String,
		default: "null",
	},
});

schema.methods.formatOpen = () => {
	return {
		name: this.name,
		nameLat: this.nameLat,
		government: this.government,
		guber: this.guber,
	}
}

module.exports = model("Regions", schema);