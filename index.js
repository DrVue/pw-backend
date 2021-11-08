require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const md5 = require("md5");
const cors = require("cors");

const Users = require("./models/Users");

const PORT = process.env.PORT;

mongoose.connect(process.env.MONGODB_SERVER, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();

app.use(bodyParser());
app.use(cors());

app.use("/", require("./routes"));

app.get("/", (req, res) => {
	res.send("ok");
})

setInterval(async () => {
	await Users.updateMany({energy: {$lt: 200}}, {$inc: {energy: 1}});
}, 1000 * 60)

app.listen(PORT, () => {
	Users.find({email: "admin"}).then(async (data) => {
		if (data.length === 0) {
			console.error("Not found admin user");
			console.log("Create admin user...");
			await Users.addUser("admin", "admin", "admin").then(() => {
				console.log("Add admin user\nLogin: admin\nPassword: admin");
			});
		}
	});
	console.log("Server started on port " + PORT);
})

//
// Socket server
//


