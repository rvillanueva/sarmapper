/*


*/

var directionMarker;
var directionLabel;
var directionPoly;
var directionDistance;
function directionBrng(){
	return compassCalc( directionMarker.getPosition().lat(), directionMarker.getPosition().lng(), marker.getPosition().lat(), marker.getPosition().lng(), 'bearingdegrees')
}
var directionLatDelta;
var directionLngDelta;
var dispersionLabel = {};
var dispersionLatLng = {};
var dispersionPolygon = {};

function addDirection() {
	directionMarker = new google.maps.Marker({
		position: new google.maps.LatLng(marker.getPosition().lat()+.2, marker.getPosition().lng()) ,
		map: map,
		draggable: true,
		zIndex: 1e3,
	});
	function directionMark(){
	directionLatDelta = directionMarker.getPosition().lat() - marker.getPosition().lat();
	directionLngDelta = directionMarker.getPosition().lng() - marker.getPosition().lng();
	}
	directionMark();
	directionLabel = new MapLabel({ map: map });
	directionLabel.bindTo('position', directionMarker, 'position');

	directionPoly = new google.maps.Polyline({
		path: [directionMarker.position, marker.position] ,
		strokeColor: "#FFFF00",
		strokeOpacity: .7,
		strokeWeight: 5,
		icons: [{
			icon: {
			path: google.maps.SymbolPath.BACKWARD_OPEN_ARROW,
			scale: 4,
			},
			offset: '25%',
		}],
		zIndex: 20,
	});
	directionPoly.setMap(map);

	directionLabel.set('text','Direction: ' + Math.round(directionBrng()) +' deg');
	addDispersion();


	google.maps.event.addListener(directionMarker, 'drag', function() {
		directionPoly.setPath([directionMarker.getPosition(), marker.getPosition()]);
		directionLabel.set('text','Direction: ' + Math.round(Math.round(directionBrng())) +' deg');
		directionMark();
		updateDispersion();
	});
	
	google.maps.event.addListener(marker, 'drag', function() {
		directionPoly.setPath([directionMarker.getPosition(), marker.getPosition()]);
		updateDispersion();
	});
	
	google.maps.event.addListener(marker, 'dragend', function() {
		updateDirectionMarker();
		updateDispersion();
	});
	updateDispersion();
}



function toggleDOT(){
	if (directionMarker.getMap() == map){
		directionPoly.setMap(null);
		directionMarker.setMap(null);
		directionLabel.setMap(null);
	document.getElementById("toggleDOT").className = "minimal Toggle Off";
	document.getElementById("toggleDOTtext").innerHTML = "Off";
	}
	else {
		directionPoly.setMap(map);
		directionMarker.setMap(map);
		directionLabel.setMap(map);
		updateDirectionMarker();
		document.getElementById("toggleDOT").className = "minimal Toggle On";
		document.getElementById("toggleDOTtext").innerHTML = "On";
	}		
}

function toggleDispersion(i){
	if (dispersionPolygon[i].getMap() == map){
		dispersionPolygon[i].setMap(null);
		dispersionPolygon[i+1].setMap(null);
		dispersionLabel[i].setMap(null);
		dispersionLabel[i+1].setMap(null);
	document.getElementById("toggleDispersion"+pbounds[Math.round(i/2-.2)]).className = "minimal Toggle Off";
	document.getElementById("toggleDispersion" + +pbounds[Math.round(i/2-.2)] + "text").innerHTML = "Off";
	}
	else {
		dispersionPolygon[i].setMap(map);
		dispersionPolygon[i+1].setMap(map);
		dispersionLabel[i].setMap(map);
		dispersionLabel[i+1].setMap(map);
		document.getElementById("toggleDispersion"+pbounds[Math.round(i/2-.2)]).className = "minimal Toggle On";
		document.getElementById("toggleDispersion" + +pbounds[Math.round(i/2-.2)] + "text").innerHTML = "On";
	}		
}

// Haversine formula

function distance(lat1,lon1,lat2,lon2) {
	var R = 6371; // km (change this constant to get miles)
	var dLat = (lat2-lat1) * Math.PI / 180;
	var dLon = (lon2-lon1) * Math.PI / 180; 
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
		Math.cos(lat1 * Math.PI / 180 ) * Math.cos(lat2 * Math.PI / 180 ) * 
		Math.sin(dLon/2) * Math.sin(dLon/2); 
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = R * c;
	if (d>1) return Math.round(d)+"km";
	else if (d<=1) return Math.round(d*1000)+"m";
	return d;
}

function compassCalc(lat1, lon1, lat2, lon2, type){
	var R = 6371; // km
	var dLat = (lat2-lat1) * Math.PI / 180;
	var dLon = (lon2-lon1) * Math.PI / 180;
	var lat1 = lat1 * Math.PI / 180;
	var lat2 = lat2* Math.PI / 180;

	var dPhi = Math.log(Math.tan(Math.PI/4+lat2/2)/Math.tan(Math.PI/4+lat1/2));
	var q = (isFinite(dLat/dPhi)) ? dLat/dPhi : Math.cos(lat1);  // E-W line gives dPhi=0
	
	// if dLon over 180° take shorter rhumb across anti-meridian:
	if (Math.abs(dLon) > Math.PI) {
	  dLon = dLon>0 ? -(2*Math.PI-dLon) : (2*Math.PI+dLon);
	}
	
	var d = Math.sqrt(dLat*dLat + q*q*dLon*dLon) * R;
	var brng = Math.atan2(dLon, dPhi);
	
	function toCompass(rad){
			var degrees = rad/Math.PI * 180 + 180
			if (Math.round(degrees) < 360){
			return degrees;
			} else {
				return 0
			}
			
	}
		
	if (type=="bearingdegrees"){
			return toCompass(brng)
	} else if (type == "distance"){
		return d;
	} else if (type == "bearingrad"){
		return brng;
	}
	}



function projectBrng(lat1, lon1, brng, dist){
  var R = 6371; // km
  var d = parseFloat(dist)/R;
  // d = angular distance covered on earths surface
  lat1 = lat1*Math.PI/180
  lon1 = lon1*Math.PI/180;
  brng = brng*Math.PI/180;

  var dLat = d*Math.cos(brng);
  // nasty kludge to overcome ill-conditioned results around parallels of latitude:
  if (Math.abs(dLat) < 1e-10) dLat = 0; // dLat < 1 mm
  
  var lat2 = lat1 + dLat;
  var dPhi = Math.log(Math.tan(lat2/2+Math.PI/4)/Math.tan(lat1/2+Math.PI/4));
  var q = (isFinite(dLat/dPhi)) ? dLat/dPhi : Math.cos(lat1);  // E-W line gives dPhi=0
  var dLon = d*Math.sin(brng)/q;
  
  // check for some daft bugger going past the pole, normalise latitude if so
  if (Math.abs(lat2) > Math.PI/2) lat2 = lat2>0 ? Math.PI-lat2 : -Math.PI-lat2;
  
  lon2 = (lon1+dLon+3*Math.PI)%(2*Math.PI) - Math.PI;
 
  return new google.maps.LatLng(lat2/Math.PI*180, lon2/Math.PI*180);
	
	return new google.maps.LatLng(lat2, lon2);
}

function updateDirectionMarker(){
	var directionLatLng = new google.maps.LatLng(marker.getPosition().lat() + directionLatDelta, marker.getPosition().lng() + directionLngDelta);
	if (directionMarker){
	directionMarker.set('position', directionLatLng);
	directionPoly.setPath([directionMarker.getPosition(), marker.getPosition()]);
	directionLabel.bindTo('position', directionMarker, 'position');
	directionLabel.set('text','Direction: ' + Math.round(compassCalc( directionMarker.getPosition().lat(), directionMarker.getPosition().lng(), marker.getPosition().lat(), marker.getPosition().lng(), 'bearingdegrees')) +' deg')
	}
}

function distance(lat1,lon1,lat2,lon2) {
	var R = 6371; // km (change this constant to get miles)
	var dLat = (lat2-lat1) * Math.PI / 180;
	var dLon = (lon2-lon1) * Math.PI / 180; 
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
		Math.cos(lat1 * Math.PI / 180 ) * Math.cos(lat2 * Math.PI / 180 ) * 
		Math.sin(dLon/2) * Math.sin(dLon/2); 
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = R * c;
	return d;
}

function addDispersion(){
	for (var i=0;i<8;i++){
		dispersionLatLng[i] = new google.maps.Marker({
		map: map,
		title: 'Dispersion',
		draggable: false,
		visible: false,
	  });
   		dispersionPolygon[i] = new google.maps.Polygon({
	  		path: [directionMarker.position, marker.position],
			map: map,
			strokeColor: "#FFFFFF",
			strokeOpacity: 1,
			strokeWeight: 1,
			fillColor: "#0000FF",
			fillOpacity: 0.2,
		  });
		dispersionLabel[i] = new MapLabel({
			map: map,
			fontSize: 10,
			align: 'center',
			zIndex: 10,
			  });
			  
		dispersionLabel[i].set('text', pbounds[Math.round(i/2-.2)] + '%');
	}
}

function validateDispersion(){
	if (document.getElementById('dispersionAvg').checked) {
		return lostprofile['dispersionAvg'];
	}	
		if (lostprofile[profile]){
			if (lostprofile[profile][environment]){
				if (lostprofile[profile][environment]['dispersion']){
					return lostprofile[profile][environment]['dispersion'];
				} else {
					return lostprofile['error']
				}
				
			} else {
				return lostprofile['error']
			}
		} else {
			return lostprofile['error']
		}
}

function updateDispersion(){
	var directionMarkerDistance = distance(directionMarker.getPosition().lat(), directionMarker.getPosition().lng(), marker.getPosition().lat(), marker.getPosition().lng());
	var brng;
	brng = directionBrng();
	var deg;
	function calcDispersion(deg){
		return projectBrng(marker.getPosition().lat(), marker.getPosition().lng(), (brng - deg), directionMarkerDistance);
	}
	
	for (var i=0;i<4;i++){
		dispersionLatLng[i*2].set('position',calcDispersion(validateDispersion()['p' + pbounds[i]]))
		dispersionLatLng[i*2+1].set('position',calcDispersion(-(validateDispersion()['p' + pbounds[i]])))

}
	for (var i=0;i<8;i++){
			dispersionLabel[i].bindTo('position', dispersionLatLng[i]);
	}

	function updateDispersionPolygon(){
		dispersionPolygon[0].setPath([directionMarker.getPosition(), dispersionLatLng[0].getPosition(),marker.getPosition()]);
		dispersionPolygon[1].setPath([directionMarker.getPosition(), dispersionLatLng[1].getPosition(),marker.getPosition()]);
		dispersionPolygon[2].setPath([directionMarker.getPosition(),dispersionLatLng[0].getPosition(),dispersionLatLng[2].getPosition(), marker.getPosition()]);
		dispersionPolygon[3].setPath([directionMarker.getPosition(),dispersionLatLng[1].getPosition(),dispersionLatLng[3].getPosition(),marker.getPosition()]);
		dispersionPolygon[4].setPath([directionMarker.getPosition(),dispersionLatLng[0].getPosition(),dispersionLatLng[2].getPosition(),dispersionLatLng[4].getPosition(),marker.getPosition()]);
		dispersionPolygon[5].setPath([directionMarker.getPosition(),dispersionLatLng[1].getPosition(),dispersionLatLng[3].getPosition(),dispersionLatLng[5].getPosition(),marker.getPosition()]);
		dispersionPolygon[6].setPath([directionMarker.getPosition(),dispersionLatLng[0].getPosition(),dispersionLatLng[2].getPosition(),dispersionLatLng[4].getPosition(),dispersionLatLng[6].getPosition(),marker.getPosition()]);
		dispersionPolygon[7].setPath([directionMarker.getPosition(),dispersionLatLng[1].getPosition(),dispersionLatLng[3].getPosition(),dispersionLatLng[5].getPosition(),dispersionLatLng[7].getPosition(),marker.getPosition()]);
	};
		updateDispersionPolygon();
	
	document.getElementById('sampleDispersion').innerHTML = validateDispersion()['n'];
//	for (var i=0;i<pbounds.length;i++){
//	 if (validateDispersion()['p' + pbounds[i]] > 0){
//		document.getElementById('dispersion' + pbounds[i]).innerHTML = 'Located within ' + validateDispersion()['p' + pbounds[i]] + ' degrees from direction of travel';
//	 }
//	 else {
//		 document.getElementById('dispersion' + pbounds[i]).innerHTML = 'Data unavailable';
//	 }
//	}
		
}

//function aggregateDispersion(){
//	var ntotal = 0;
//	var p25avg = 0;
//	var p50avg = 0;
//	var p75avg = 0;
//	var p95avg = 0;
//	function addData(profile) {
//		if (lostprofile[profile]){
//			if (lostprofile[profile]['temperate']){
//				if (lostprofile[profile]['temperate']['dispersion']){
//					ntotal += lostprofile[profile]['temperate']['dispersion']['n'];
//					p25avg += lostprofile[profile]['temperate']['dispersion']['p25']*lostprofile[profile]['temperate']['dispersion']['n'];
//					p50avg += lostprofile[profile]['temperate']['dispersion']['p50']*lostprofile[profile]['temperate']['dispersion']['n'];
//					p75avg += lostprofile[profile]['temperate']['dispersion']['p75']*lostprofile[profile]['temperate']['dispersion']['n'];
//					p95avg += lostprofile[profile]['temperate']['dispersion']['p95']*lostprofile[profile]['temperate']['dispersion']['n'];
//				}
//				if (lostprofile[profile]['dry']){
//					if (lostprofile[profile]['dry']['dispersion']){
//					ntotal += lostprofile[profile]['dry']['dispersion']['n'];
//					p25avg += lostprofile[profile]['dry']['dispersion']['p25']*lostprofile[profile]['dry']['dispersion']['n'];
//					p50avg += lostprofile[profile]['dry']['dispersion']['p50']*lostprofile[profile]['dry']['dispersion']['n'];
//					p75avg += lostprofile[profile]['dry']['dispersion']['p75']*lostprofile[profile]['dry']['dispersion']['n'];
//					p95avg += lostprofile[profile]['dry']['dispersion']['p95']*lostprofile[profile]['dry']['dispersion']['n'];
//					}
//				}
//			} else {
//				return 0
//			}
//		} else {
//			return 0
//		}
//	}
//	addData('angler');
//	addData('child1to3');
//	addData('child7to9');
//	addData('child13to15');
//	addData('climber');
//	addData('dementia');
//	addData('despondent');
//	addData('hiker');
//	addData('hunter');
//	addData('mountainbiker');
//	addData('skiernordic');
//	addData('snowmobiler');
//	
//	console.log(ntotal); 
//	console.log(p25avg/ntotal); 
//	console.log(p50avg/ntotal); 
//	console.log(p75avg/ntotal); 
//	console.log(p95avg/ntotal); 
//}