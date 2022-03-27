const cheerio = require('cheerio');
let fetch = import("node-fetch");
const fs = require("fs/promises");

//lookup an address in open street map and return the longitude and latitude
function lookupAddress(address) {
	var url = 'https://nominatim.openstreetmap.org/search?q=' + encodeURIComponent(address) + '&format=json';
	console.log(`Requesting: ${url}`);

	return fetch(url, {
		headers: {
			"Referer": "https://jens.ovh/",
			"User-Agent": "Aalborg boligere kort / 0.1"
		}
	})
		.then((response) => response.json())
		.then((result) => {
			result = result.filter((location) => location["display_name"].toLowerCase().includes("aalborg"));
			if (result.length > 0) {
				return [result[0].lon, result[0].lat];
			}
			return null;
		});
}


function cleanAddress(address) {
	return (address
		.split(/[\n\t]/g).filter((x) => x.length > 0)[0] + ", Aalborg")
		.replace(/([0-9]+[A-Z]?)\s*\-\s*[0-9]+[A-Z]?/g, "$1")
		.replace(/([A-Z])\s*\-\s*[A-Z]/g, "$1")
		.replace(/[A-Za-z]+\-\//g, "")
		.trim();
}

//parse alle boliger i boligoversigten
async function parseEjendomme($) {
	let rv = [];
	$(".ejendom").each((i, element) => {
		let raw_addresse = $(element).find("div.adresse").text().trim();
		let rigtig_addresse = raw_addresse.split(/[\n\t]/g).filter((x) => x.length > 0).join(", ");
		let søgbar_addresse = cleanAddress(raw_addresse);
		let link = `https://vl.aku-aalborg.dk/${$(element).find("div>div>a")[0].attribs.href}`;
		rv.push({
			navn: $(element).find("div.overskrift").text().replace(/[\t\n\r]/g, "").trim(),
			link: link,
			rigtig_addresse,
			søgbar_addresse
		});
	});

	for (let i = 0; i < rv.length; i++) {
		//We can only lookup one address every second to avoid being blocked by the API, so we need to send them slow
		rv[i].lonlat = await lookupAddress(rv[i].søgbar_addresse);
		console.log(`${i + 1}/${rv.length}`);
		await new Promise((resolve) => setTimeout(resolve, 2000));
	}
	
	return rv;
}

const datasets = [
	{id: 3738, name: "Aalborg Centrum"},
	{id: 3739, name: "Aalborg Syd/Vest"},
	{id: 3740, name: "Aalborg Syd/Øst"},
	{id: 3741, name: "Aalborg Øst"},
	{id: 3744, name: "Opland Syd"}
];

async function main() {
	fetch = (await fetch).default;

	for (let dataset of datasets) {
		console.log("Parsing dataset: " + dataset.name);
		let data = await (await fetch(`https://vl.aku-aalborg.dk/BoligOversigt.aspx?ID=${dataset.id}`)).text();
		let $ = cheerio.load(data);
		let ejendomme = await parseEjendomme($);
		let json = JSON.stringify(ejendomme);
		await fs.writeFile(`./data/${dataset.name.replace(/[\\\/:*?"<>|]/g, " ")}.json`, JSON.stringify({
			data: ejendomme,
			last_updated: new Date()
		}));
	}
}

main();