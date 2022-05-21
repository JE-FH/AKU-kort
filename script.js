//Create a map using OpenLayers
function createPopup(bolig) {
	let container = document.createElement("div");
	container.style.textAlign = "center";
	
	let title = document.createElement("h3");
	title.appendChild(document.createTextNode(bolig.navn));
	
	container.appendChild(title);
	
	let previewImage = document.createElement("img");
	previewImage.style.width = "160px";
	previewImage.style.margin = "0 auto"
	previewImage.src = `data/img/bolig-${bolig.id}.jfif`;
	container.appendChild(previewImage);
	
	let visitLink = document.createElement("a");
	visitLink.href = bolig.link;
	visitLink.classList.add("visit-button")
	visitLink.appendChild(document.createTextNode("Visit"));
	container.appendChild(visitLink);

	return container;
}

async function main() {
	let data = await (await fetch("data/combined.json")).json();

	var map = L.map('map').setView([57.036, 9.93], 12);

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);

	for (let bolig of data.data) {
		if (bolig.lonlat != null) {
			L.marker([bolig.lonlat[1], bolig.lonlat[0]]).addTo(map)
	    		.bindPopup((layer) => createPopup(bolig));
		}
	}
}


document.addEventListener("DOMContentLoaded", main);
