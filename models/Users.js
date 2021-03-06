const Schema = require("mongoose").Schema;
const model = require("mongoose").model;
const Sessions = require("./Sessions");
const md5 = require("md5");

const schema = new Schema({
	email: String,
	pass: String,
	name: String,
	priv: {
		type: Number,
		default: 0,
	},
	lastLogin: Date,
	regDate: Date,

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

	expFactory: {
		type: Number,
		default: 0,
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

	notifyNewLevel: {
		type: Boolean,
		default: false,
	},
	notifyNewMail: {
		type: Boolean,
		default: false,
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
		regDate: new Date(),
	});
	await user.setPassword(pass);
	await user.save();
	return user;
};

schema.statics.getUser = async function (_id) {
	return await this.findOne({_id: _id});
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
		_id: this._id,
		email: this.email,
		name: this.name,
		lastLogin: this.lastLogin,
		expFactory: this.expFactory,
		regDate: this.regDate,
		region: this.region,
		lvl: this.lvl,
	}
}

schema.methods.formatPrivate = function () {
	return {
		_id: this._id,
		email: this.email,
		name: this.name,
		priv: this.priv,
		lastLogin: this.lastLogin,
		regDate: this.regDate,
		region: this.region,
		lvl: this.lvl,
		exp: this.exp,
		expMax: this.expMax,
		expFactory: this.expFactory,
		energy: this.energy,
		energyMax: this.energyMax,
		vip: this.vip,
		vipDate: this.vipDate,
		money: this.money,
		gold: this.gold,
		notifyNewLevel: this.notifyNewLevel,
		notifyNewMail: this.notifyNewMail,
		energyBank: this.energyBank,
		oil: this.oil,
		ore: this.ore,
		buildingMaterial: this.buildingMaterial,
	}
}

schema.methods.updateLastLogin = async function () {
	await this.update({lastLogin: new Date()});
}

schema.methods.addExp = async function (val = 10) {
	await this.update({$inc: {exp: val}}).then(async () => {
		if ((this.exp + val) >= this.expMax) {
			await this.update({$inc: {lvl: 1, expMax: this.expMax}, notifyNewLevel: true, exp: 0});
		}
	});
}

schema.methods.addExpFactory = async function (val = 10) {
	await this.update({$inc: {expFactory: val}});
}

schema.methods.addEnergy = async function (val = 1) {
	await this.update({$inc: {energy: val}});
}

schema.methods.delEnergy = async function (val = 1) {
	await this.update({$inc: {energy: -val}});
}

schema.methods.addMoney = async function (val = 0) {
	await this.update({$inc: {money: val.toFixed(0)}});
}

schema.methods.addGold = async function (val = 0) {
	await this.update({gold: (this.gold + val).toFixed(2)});
}

schema.methods.addResource = async function (type = "oil", val = 0) {
	switch (type) {
		case "oil":
			await this.update({$inc: {oil: val.toFixed(0)}});
			break;
		case "ore":
			await this.update({$inc: {ore: val.toFixed(0)}});
			break;
		case "buildingMaterial":
			await this.update({$inc: {buildingMaterial: val.toFixed(0)}});
			break;
	}
}

module.exports = model("Users", schema);