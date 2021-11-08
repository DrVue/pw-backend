const Schema = require("mongoose").Schema;
const model = require("mongoose").model;
const Users = require("./Users");

let randomString = (i = 32) => {
	let rnd = '';
	while (rnd.length < i)
		rnd += Math.random().toString(36).substring(2);
	return rnd.substring(0, i);
};

const schema = new Schema({
	idUser: String,
	token: String,
});

schema.statics.addToken = function (_id) {
	const session = new this({
		idUser: _id,
		token: randomString(),
	});
	session.save();
	return session.token;
};

schema.statics.checkToken = async function (token) {
	const tokenRes = await this.findOne({token: token});
	if (tokenRes !== null) {
		return tokenRes;
	} else {
		return null;
	}
};

schema.statics.getId = async function (token) {
	let tokenRes = await this.findOne({token: token});
	if (tokenRes !== null) {
		return tokenRes.idUser;
	} else {
		return null;
	}
};

schema.statics.getUser = async function (token) {
	const tokenRes = await this.findOne({token: token});
	if (tokenRes !== null) {
		return Users.getUser({_id: tokenRes.idUser});
	} else {
		return null;
	}
};

module.exports = model("Sessions", schema);