const fs = require("fs/promises");
const path = require("path");
async function main() {
	let files = await Promise.all((await fs.readdir("data/"))
		.filter((x) => x != "combined.json")
		.map((x) => path.join("data/", x))
		.map(async (x) => JSON.parse(await fs.readFile(x, "utf-8"))));
	
	let combined = []
	for (let file of files) {
		for (let bolig of file.data) {
			combined.push(bolig);
		}
	}
	
	await fs.writeFile("data/combined.json", JSON.stringify({
		data: combined,
		last_updated: new Date()
	}));
}

main();