const Schema = require("mongoose").Schema;
const model = require("mongoose").model;
// const RoundNumber = require("mongoose-round-number");

const schema = new Schema({
	name: String,
	userId: String,
	region: String,
	type: String,

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

	moneyBank: {
		type: Number,
		default: 0,
	},
	goldBank: {
		type: Number,
		default: 0,
	},
	resourcesBank: {
		type: Number,
		default: 0,
	},

	profitMoney: {
		type: Number,
		default: 20000,
	},
	profitGold: {
		type: Number,
		default: 0.1,
	},
	profitResources: {
		type: Number,
		default: 100,
	},

	salary: {
		type: Number,
		default: 0.5,
	},
});

schema.methods.addMoneyBank = async function (i = 1) {
	await this.update({$inc: {moneyBank: ((this.profitMoney - (this.profitMoney * this.salary)) * i).toFixed(0)}});
}

schema.methods.delMoney = async function (val = 0) {
	await this.update({$inc: {moneyBank: -val.toFixed(0)}});
}

schema.methods.delGold = async function (val = 0) {
	await this.update({$inc: {goldBank: -val.toFixed(2)}});
}

schema.methods.delResources = async function (val = 0) {
	await this.update({$inc: {resourcesBank: -val.toFixed(0)}});
}

schema.methods.addGoldBank = async function (i = 1) {
	await this.update({goldBank: (this.goldBank + ((this.profitGold - (this.profitGold * this.salary)) * i)).toFixed(2)});
}

schema.methods.addResourcesBank = async function (i = 1) {
	await this.update({resourcesBank: (this.resourcesBank + ((this.profitResources - (this.profitResources * this.salary)) * i)).toFixed(0)});
}

schema.methods.addExp = async function (val = 10) {
	await this.update({$inc: {exp: val}}).then(async () => {
		if ((this.exp + val) >= this.expMax) {
			await this.update({$inc: {lvl: 1, expMax: this.expMax}});
		}
	});
}

module.exports = model("Factors", schema);