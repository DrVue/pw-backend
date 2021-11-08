const Schema = require("mongoose").Schema;
const model = require("mongoose").model;
const Sessions = require("./Sessions");
const md5 = require("md5");

let randomString = (i = 32) => {
	let rnd = '';
	while (rnd.length < i)
		rnd += Math.random().toString(36).substring(2);
	return rnd.substring(0, i);
};

const schema = new Schema({
	email: String,
	pass: String,
	name: String,
	priv: {
		type: Number,
		default: 0,
	},
	lastLogin: {
		type: Number,
		default: Date.now(),
	},

	region: {
		type: String,
		default: "null",
	},

	lvl: {
		type: Number,
		default: 1,
	},
	exp: {
		type: Number,
		default: 0,
	},
	expMax: {
		type: Number,
		default: 1000,
	},

	energy: {
		type: Number,
		default: 0,
	},
	energyMax: {
		type: Number,
		default: 200,
	},

	vip: {
		type: Boolean,
		default: false,
	},
	vipDate: {
		type: Number,
		default: 0,
	},

	money: {
		type: Number,
		default: 1000000,
	},
	gold: {
		type: Number,
		default: 100,
	},

	energyBank: {
		type: Number,
		default: 0,
	},
	oil: {
		type: Number,
		default: 0,
	},
	ore: {
		type: Number,
		default: 0,
	},
	buildingMaterial: {
		type: Number,
		default: 0,
	},

	tank: {
		type: Number,
		default: 0,
	},
});

schema.statics.checkEmail = async function (email) {
	let user = await this.findOne({email: email});
	return user === null;
};

schema.methods.checkPassword = function (pass) {
	return this.pass === md5(pass);
};

schema.statics.addUser = async function (email, name, pass) {
	let user = new this({
		email: email,
		name: name,
	});
	await user.setPassword(pass);
	await user.save();
	return user;
};

schema.statics.getUser = async function (_id) {
	const user = await this.findOne({_id: _id});
	return user;
};

schema.methods.setPassword = function (pass) {
	this.pass = md5(pass);
	return true;
};

schema.statics.loginUser = async function (email, pass) {
	let user = await this.findOne({email: email});
	if (user !== null) {
		if (user.pass === md5(pass)) {
			return Sessions.addToken({_id: user._id.toString()});
		} else {
			return false;
		}
	} else {
		return false;
	}
};

schema.methods.formatOpen = function () {
	return {
		email: this.email,
		name: this.name,
		lastLogin: this.lastLogin,
	}
}

schema.methods.formatPrivate = function () {
	return {
		email: this.email,
		name: this.name,
		priv: this.priv,
		lastLogin: this.lastLogin,
		region: this.region,
		lvl: this.lvl,
		exp: this.exp,
		expMax: this.expMax,
		energy: this.energy,
		energyMax: this.energyMax,
		vip: this.vip,
		vipDate: this.vipDate,
		money: this.money,
		gold: this.gold,
		energyBank: this.energyBank,
		oil: this.oil,
		ore: this.ore,
		buildingMaterial: this.buildingMaterial,
	}
}

module.exports = model("Users", schema);