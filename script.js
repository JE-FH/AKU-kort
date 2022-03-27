//Create a map using OpenLayers
async function main() {
	// Popup overlay
	var popup = new ol.Overlay.Popup ({
		popupClass: "default", //"tooltips", "warning" "black" "default", "tips", "shadow",
		closeBox: true,
		onshow: function(){  },
		onclose: function(){ },
		positioning: 'auto',
		autoPan: true,
		autoPanAnimation: { duration: 250 }
	});

	var map = new ol.Map({
		target: 'map',
		layers: [
			new ol.layer.Tile({
			source: new ol.source.OSM()
		  })
		],
		view: new ol.View({
			center: ol.proj.fromLonLat([9.93, 57.036]),
			zoom: 12
		}),
		overlays: [popup]
	});
	let data = await (await fetch("data/combined.json")).json();

	let features = [];
	for (let bolig of data.data) {
		if (bolig.lonlat != null) {
			let feature = new ol.Feature({
				geometry: new ol.geom.Point(ol.proj.fromLonLat([bolig.lonlat[0], bolig.lonlat[1]]))
			})
			feature.set("boligData", bolig);
			feature.set("asfdkgoakdfosadkf", bolig.link);
			features.push(feature);
		}
	}

	var layer = new ol.layer.Vector({
		source: new ol.source.Vector({
			features: features
		})
	});
	map.addLayer(layer);

	var select = new ol.interaction.Select({});
	map.addInteraction(select);
	select.getFeatures().on(['add'], function(e) {
		var feature = e.element;
		console.log(feature.get("boligData"));
		var content = `${feature.get("boligData").navn}<a href="${encodeURI(feature.get("boligData").link)}"><br>visit</a>`;
		popup.show(feature.getGeometry().getFirstCoordinate(), content); 
	});
	select.getFeatures().on(['remove'], function(e) {
		popup.hide(); 
	})
}


document.addEventListener("DOMContentLoaded", main);
