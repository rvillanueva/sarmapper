// Main JS

var probCircle={};
var mapLabel= {};

var LKP = new google.maps.LatLng(37.762308,-119.531227);

function updateMarkerPosition(latLng) {
  document.getElementById('currentLat').value = Number((latLng.lat()).toFixed(6));
  document.getElementById('currentLng').value = Number((latLng.lng()).toFixed(6));
}

var geocoder;
var map;

var marker;
var profile = "hiker";
var environment = "temperate";
var terrain = "mtn";
var pbounds = new Array (25, 50, 75, 95);

function validateType(){
	var validateTerrain = null;
	var validateEnvironment = null;
	var validateProfile = null;
	
	if (lostprofile[profile]){
		validateProfile = true;
		if (lostprofile[profile][environment]){
			validateEnvironment = true;
			if (lostprofile[profile][environment][terrain]){
				validateTerrain = true;
			}
		}
	}
		
	if (validateTerrain){
		return "terrain";
	} else if (validateEnvironment){
		return "environment";
	} else if (validateProfile){
		return "profile"
	} else {
		return null
	}
}

// Return readable behavior object path.

function behaviorReturn(){
	checkOptions();
	
	if (validateType() == "terrain"){
		return lostprofile[profile][environment][terrain];
	}
	else if (validateType() == "environment"){
		return behaviorCalcTrunc1 = lostprofile[profile][environment];
	}
	else if (validateType() == "profile"){
		return lostprofile[profile];
	}
	else {
		return lostprofile['error'];
	}
}

function mapLabelposition(location){ 
	for (var i=0;i<pbounds.length;i++){
		mapLabel[i].set('position', new google.maps.LatLng(location.lat(),location.lng() - behaviorReturn()['p' + pbounds[i]]/100));
	}
}

// Check option fields and return which are selected.

function checkOptions(){
	profile = document.getElementById("behavior").value;

	if (document.getElementById('environment_temperate').checked) {
		environment = 'temperate'
	} else if (document.getElementById('environment_dry').checked) {
		environment = 'dry'
	} else {
		environment = 'urban'
	}
	
	if (document.getElementById('terrain_mtn').checked==true) {
		terrain = 'mtn'
	} else {
		terrain = 'flat'
	}
}

function enable_cb() {
	checkOptions();
	var environmentTypes = new Array ("temperate","dry","urban");
	var terrainTypes = new Array ("mtn","flat");
	var environmentChecked;
	
	// Disable environment radio buttons if no environment data.	
	for (var i=0;i<environmentTypes.length;i++){
		if (lostprofile[profile][environmentTypes[i]] == null){
			$("input#environment_"+environmentTypes[i]).attr("disabled", true);
			forceCheckbox("environment");
		} else {
			$("input#environment_"+environmentTypes[i]).removeAttr("disabled");
		}
		if (document.getElementById("environment_" + environmentTypes[i]).checked) {
		environmentChecked = environmentTypes[i];
			disableTerrain(environmentChecked);
		};
	}
	// Disable terrain radio buttons if no environment data or no terrain data for selected environment
	function disableTerrain(environmentCheckedNow){
		for (var i=0;i<terrainTypes.length;i++){
			// Check if selected profile contains environment data. If not, disable all terrain radios and force checkbox change.
			if (lostprofile[profile][environmentCheckedNow] == null){ 
				$("input#terrain_" + [terrainTypes[i]]).attr("disabled", true);
				forceCheckbox("terrain");
			// If environment data exists, check each terrain type. If one doesn't exist, remove it and force checkbox change.
			} else if (lostprofile[profile][environmentCheckedNow][terrainTypes[i]] == null) {
					$("input#terrain_" + [terrainTypes[i]]).attr("disabled", true);
					forceCheckbox("terrain");
				} else {
					$("input#terrain_" + [terrainTypes[i]]).removeAttr("disabled");
				}
		}
	}
	function forceCheckbox(type){
		var $terrainRadios = $('input:radio[name=terrain]');
		var $environmentRadios = $('input:radio[name=environment]');
		
		if (type == "terrain" && $('input.terrain:checked').attr('disabled')){
			$('input.terrain:not(:disabled):first').prop('checked', true);
		}
		else if (type == "environment" && $('input.environment:checked').attr('disabled')){
			$('input.environment:not(:disabled):first').prop('checked', true);
		}
		// NOTE: Need to prevent checkbox forcing if all options are disabled
	}
}

function initialize() {

  var mapOptions = {
    zoom: 10,
    center: LKP,
    mapTypeId: google.maps.MapTypeId.HYBRID,
	scaleControl: true
  };

map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
  
 marker = new google.maps.Marker({
    position: map.getCenter(),
    map: map,
    title: 'Last Known Point',
	draggable: true,
	zIndex: 1e3,
  });

for (var i=0;i<pbounds.length;i++){
	mapLabel[i] = new MapLabel({
		text: pbounds[i] + '%',
		map: map,
		fontSize: 10,
		align: 'center',
		zIndex: 10,
		  });
}

mapLabelposition(LKP);

var circleOptions = {};

for (var i=0;i<pbounds.length;i++){
	circleOptions[i] = {
      strokeColor: '#FFFFFF',
      strokeOpacity: 1,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.15,
	  zIndex: 100-10*i,
      map: map,
      radius: behaviorReturn()['p' + pbounds[i]]*1000,
    }
//	if (document.getElementById('toggle25text').class !== "On"){
//		probCircle[i].setVisible(false);
//		mapLabel[i].setMap(null);
//	}
		
}

for (var i=0;i<pbounds.length;i++){
	probCircle[i] = new google.maps.Circle(circleOptions[i]);
	probCircle[i].bindTo('center', marker, 'position');
}

		
// Update Button Click

function optionsUpdate(){
	checkOptions();
	var jumpCoordinates = new google.maps.LatLng(document.getElementById('currentLat').value,document.getElementById('currentLng').value);	
	
	for (var i=0;i<pbounds.length;i++){
	 probCircle[i].set('radius',behaviorReturn()['p' + pbounds[i]]*1000);
	 //if (behaviorReturn()['p' + pbounds[i]] > 0){
//		document.getElementById('current' + pbounds[i]).innerHTML = 'Located within ' + behaviorReturn()['p' + pbounds[i]] + 'km';
//	 }
//	 else {
//		 document.getElementById('current' + pbounds[i]).innerHTML = 'Data unavailable';
//	 }
	}
	
	document.getElementById('sample').innerHTML = behaviorReturn()['n'];
	marker.set('position', jumpCoordinates);
	mapLabelposition(marker.getPosition());
	map.panTo(jumpCoordinates);
	updateDirectionMarker();
	updateDispersion();
}


	var updateButton = document.getElementById("updateButton");
		if(updateButton.addEventListener){
			updateButton.addEventListener("click", function() { optionsUpdate();}, false);
		} else if(centerButton.attachEvent){
			updateButton.attachEvent("onclick", function() {  optonsUpdate();});
		}
		
 // Update current position info.
  updateMarkerPosition(LKP);
  addDirection();
  updateDirectionMarker();
    
  // Add dragging event listeners.
  google.maps.event.addListener(marker, 'dragstart', function() {  
   mapLabelposition(marker.getPosition()) });
  
  google.maps.event.addListener(marker, 'drag', function() {
    updateMarkerPosition(marker.getPosition()), mapLabelposition(marker.getPosition());
  });
  
  google.maps.event.addListener(marker, 'dragend', function() {
    updateMarkerPosition(marker.getPosition()), mapLabelposition(marker.getPosition());
  });	
  
 optionsUpdate();
 
 geocoder = new google.maps.Geocoder();
 
 // Run every time behavior menu is changed or environment radio is selected.
 
 $(function() {
  $("#behavior").change(enable_cb)
  $(".environment").change(enable_cb);
  $(".terrain").change(enable_cb);
  $(".environment").change(optionsUpdate);
  $(".terrain").change(optionsUpdate);
  $("#behavior").change(optionsUpdate);
  $("#currentLat").change(optionsUpdate);
  $("#currentLng").change(optionsUpdate);
  $("#dispersionAvg").click(updateDispersion);
});

$(function() {
    $( ".helper" ).tooltip();
  });

};
// Initialize end///////////////

// Geocoder

function codeAddress() {
  var address = document.getElementById('address').value;
  geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      map.setCenter(results[0].geometry.location);
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

// Set LKP to center of map with Set LKP button.
function setLKP(){
	marker.setAnimation(null);
	marker.set('position', map.getCenter());
	updateMarkerPosition(map.getCenter());
	mapLabelposition(marker.getPosition());
	marker.setAnimation(google.maps.Animation.DROP);
	updateDirectionMarker();
	updateDispersion();
}

google.maps.event.addDomListener(window, 'resize', function() {
	if (parseInt(document.getElementById("map-canvas").style.width) < 700){
    document.getElementById("panel").style.visibility="hidden";
	}
	else {
		document.getElementById("panel").style.visibility="visible";
	}
});

// Toggle probability circles on and off.
function toggleProb(i){
var toggleID = "toggle"+pbounds[i];
if (probCircle[i].getVisible() == true){
	probCircle[i].setVisible(false);
	mapLabel[i].setMap(null);
	document.getElementById(toggleID).className = "minimal Toggle Off";
	document.getElementById(toggleID+"text").innerHTML = "Off";
}
else {
	probCircle[i].setVisible(true);
	mapLabel[i].setMap(map);
	document.getElementById(toggleID).className = "minimal Toggle On";
	document.getElementById(toggleID+"text").innerHTML = "On";
}
}

google.maps.event.addDomListener(window, 'load', initialize);