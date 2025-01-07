require("dotenv").config();
const express = require("express");
const axios = require("axios");
const bcrypt = require("bcrypt");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = process.env.PORT || 3000;
require("dotenv").config();

const mongoclient = new MongoClient(process.env.MONGODBTOKEN, {
	serverApi: {
		version: ServerApiVersion.v1,
	}
});

(async () => {
	await mongoclient
		.connect()
		.then(() => {
			console.log("Connected to MongoDB");
		})
		.catch((error) => {
			console.error(error);
		});
})();



app.get("/", (req, res) => {
	res.send("Hello World!");
});
app.get("/api/roulette", async (req, res) => {
    let user;
	if (!(user = await mongoclient.db("RefBot").collection("admin_users").findOne({user: req.headers.authorization?.split(" ")[1]}))) {
        res.status(401).send('{"error":"(401) Unauthorized"}')
        return;
    }
	const roulette = await mongoclient.db("RefBot").collection("roulette").findOne({});
	res.send(roulette?.winningNumber || '{"error":"no roulette game found!"}');
});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
