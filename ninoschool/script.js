let lattext = document.getElementById("lat");
let longtext = document.getElementById("long");
let nearestDistance = document.getElementById("dist");
let userLocationMarker;
let action = document.getElementById("action");
let playedPoints = new Set();

let polylineCoords = [
  [41.9250631, 42.0128077],
  [41.9257096, 42.0148623],
  [41.9240742, 42.0154288],
  [41.9251524, 42.0190873],
  [41.9270085, 42.0184758],
  [41.9290115, 42.0233681]
];
var turnOpsions = ["none", "100right","none", "100left","100left", "100right"]

let sumLat = polylineCoords.reduce((acc, val) => acc + val[0], 0);
let sumLng = polylineCoords.reduce((acc, val) => acc + val[1], 0);

let avgLat = sumLat / polylineCoords.length;
let avgLng = sumLng / polylineCoords.length;

let map = L.map('map').setView([avgLat, avgLng], 17.2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
}).addTo(map);

let checkpointMarkers = []; // Initialize an empty array to store checkpoint markers

polylineCoords.forEach((coord, index) => {
    let color = 'cyan';
    if (index === 0) color = 'red'; // Start point
    else if (index === polylineCoords.length - 1) color = 'black'; // End point

    let circleMarker = L.circleMarker(coord, {
        color: color,
        fillColor: 'blue',
        fillOpacity: 1,
        radius: 20
    }).addTo(map);

    animateBreathing(circleMarker); // Apply breathing animation to each marker

    // Store the marker and its index or any other relevant info
    checkpointMarkers.push({
        marker: circleMarker,
        index: index,
        coordinates: coord,
        description: `Checkpoint ${index + 1}`
    });
});

// Example of how to use the list
// Focus the map on the first checkpoint marker when a certain event occurs
//console.log("cc ", checkpointMarkers[0].coordinates);



let polyline = L.polyline(polylineCoords, {color: 'blue', weight: 5, dashArray: '12, 12'}).addTo(map);


// Function to animate "breathing" effect
function animateBreathing(circle) {
    let minRadius = 12;
    let maxRadius = 18;
    let deltaRadius = 1;
    let increasing = true;
    setInterval(() => {
        let currentRadius = circle.getRadius();
        if (increasing) {
            currentRadius += deltaRadius;
            if (currentRadius >= maxRadius) increasing = false;
        } else {
            currentRadius -= deltaRadius;
            if (currentRadius <= minRadius) increasing = true;
        }
        circle.setRadius(currentRadius);
    }, 150);
}






// Add circles before 100 and 25 meters from each checkpoint
let markers100 = [];
let markers25 = [];
polylineCoords.forEach((coord, index, arr) => {
    if (index < arr.length - 1) {
        const coordBefore100 = getPointBefore([coord, arr[index + 1]], 0.001); // Approximation for 100 meters
        const coordBefore25 = getPointBefore([coord, arr[index + 1]], 0.00025); // Approximation for 25 meters

        // Create markers and store them for later intersection checks
        const marker100 = L.circle(coordBefore100, {
            color: 'green',
            fillColor: '#0f0',
            fillOpacity: 0.5,
            radius: 10
        }).addTo(map).bindPopup('100 meters before checkpoint');
        const marker25 = L.circle(coordBefore25, {
            color: 'red',
            fillColor: '#ff0',
            fillOpacity: 0.5,
            radius: 10
        }).addTo(map).bindPopup('25 meters before checkpoint');

        markers100.push({
          marker: marker100,
          coordinates: coordBefore100 // Storing coordinates
      });
      markers25.push({
        marker: marker25,
        coordinates: coordBefore25 // Storing coordinates
    });

          }
});





// Check if Geolocation is supported
if ('geolocation' in navigator) {
  let userLocationMarker;



  let playedAudio100right = false;
let playedAudio100left = false;
let playedAudio100left2 = false;
let playedAudio100right2 = false;


let playedAudio25right = false;
let playedAudio25left = false;
let playedAudio25left2 = false;
let playedAudio25right2 = false;



  // Function to update user location
  function updateUserLocation(lat, lng) {
    if (userLocationMarker) {
      userLocationMarker.setLatLng([lat, lng]); // Update position if circle already exists
    } else {
      // Create a new circle marker if it doesn't exist
      userLocationMarker = L.circle([lat, lng], {
        color: 'red',      // Color of the circle outline
        fillColor: '#f03', // Fill color of the circle
        fillOpacity: 0.5,  // Opacity of the fill color
        radius: 20         // Radius of the circle in meters
      }).addTo(map);
      userLocationMarker.bindPopup("You are here!");
    }
    map.panTo([lat, lng]); // Optionally center the map on the new location
 // Calculate distance to the first checkpoint
    // Get the first checkpoint's coordinates and calculate distance
    const firstCheckpoint = L.latLng(markers100[0].coordinates);
    const secondCheckpoint = L.latLng(markers100[1].coordinates); // Get the second checkpoint coordinates
    const thirdCheckpoint = L.latLng(markers100[2].coordinates); // Get the third checkpoint coordinates
const fourthCheckpoint = L.latLng(markers100[3].coordinates); // Get the fourth checkpoint coordinates


const firstCheckpoint25 = L.latLng(markers25[0].coordinates);
const secondCheckpoint25 = L.latLng(markers25[1].coordinates); // Get the second checkpoint coordinates
const thirdCheckpoint25 = L.latLng(markers25[2].coordinates); // Get the third checkpoint coordinates
const fourthCheckpoint25 = L.latLng(markers25[3].coordinates); // Get the fourth checkpoint coordinates

    
    const currentLocation = L.latLng(lat, lng);
    const distanceToThird = currentLocation.distanceTo(thirdCheckpoint);
const distanceToFourth = currentLocation.distanceTo(fourthCheckpoint);

    const distanceToFirst = currentLocation.distanceTo(firstCheckpoint);
    const distanceToSecond = currentLocation.distanceTo(secondCheckpoint);



    const distanceToThird25 = currentLocation.distanceTo(thirdCheckpoint);
const distanceToFourth25 = currentLocation.distanceTo(fourthCheckpoint);

    const distanceToFirst25 = currentLocation.distanceTo(firstCheckpoint);
    const distanceToSecond25 = currentLocation.distanceTo(secondCheckpoint);

    // Update the nearest distance display for the first checkpoint
    nearestDistance.innerHTML = `Distance 2: ${Math.round(distanceToSecond)}m`;

  // Check proximity to the first checkpoint and play corresponding audio
if (distanceToFirst < 20 && !playedAudio100right) {
  console.log("In 100 meters, turn right");
  const audio100right = document.getElementById('audio100right');
  audio100right.play();
  playedAudio100right = true; // Set flag to true after playing
}else if (distanceToFirst25 < 15 && !playedAudio25right) {
  console.log("turn right");
  const audio25right = document.getElementById('audioRight');
  audio25right.play();
  playedAudio25right = true; // Set flag to true after playing
}




// Check proximity to the second checkpoint and play corresponding audio
if (distanceToSecond < 20 && !playedAudio100left) {
  console.log("In 100 meters, turn left");
  const audio100left = document.getElementById('audio100left'); // Assume this is the ID for the left turn audio
  audio100left.play();
  playedAudio100left = true; // Set flag to true after playing
}else if (distanceToSecond25 < 15 && !playedAudio25left) {
  console.log("turn left");
  const audio100left = document.getElementById('audioLeft'); // Assume this is the ID for the left turn audio
  audio25left.play();
  playedAudio25left = true; // Set flag to true after playing
}






// Check proximity to the third checkpoint and play corresponding audio
if (distanceToThird < 20 && !playedAudio100left2) {
  console.log("turn left");
  const audio100left2 = document.getElementById('audio100left'); // Reuse the ID for the third checkpoint left turn audio
  audio100left2.play();
  playedAudio100left2 = true; // Set flag to true after playing
}else if (distanceToThird25 < 15 && !playedAudio25left2) {
  console.log("In 100 meters, turn left");
  const audio25left2 = document.getElementById('audioLeft'); // Reuse the ID for the third checkpoint left turn audio
  audio25left2.play();
  playedAudio25left2 = true; // Set flag to true after playing
}







// Check proximity to the fourth checkpoint and play corresponding audio
if (distanceToFourth < 20 && !playedAudio100right2) {
  console.log("In 100 meters, turn right");
  const audio100right2 = document.getElementById('audio100right'); // Reuse the ID for the fourth checkpoint right turn audio
  audio100right2.play();
  playedAudio100right2 = true; // Set flag to true after playing
}else if (distanceToFourth25 < 15 && !playedAudio25right2) {
  console.log("turn right");
  const audio25right2 = document.getElementById('audioRight'); // Reuse the ID for the fourth checkpoint right turn audio
  audio25right2.play();
  playedAudio25right2 = true; // Set flag to true after playing
}






}

  // Start watching the user's location
  navigator.geolocation.watchPosition((position) => {
    let lat = position.coords.latitude;
    let lng = position.coords.longitude;
    updateUserLocation(lat, lng); // Update the location on the map
    lattext.innerHTML = `lat: ${lat}`; // Update latitude text on the webpage
    longtext.innerHTML = `long: ${lng}`; // Update longitude text on the webpage
  }, (err) => {
    console.error("Error getting the position - ", err);
  }, {
    enableHighAccuracy: true,
    maximumAge: 1000,
    timeout: 5000
  });
} else {
  console.log("Geolocation is not supported by this browser.");
}



// Calculate a point a specific distance from the end of a line segment
function getPointBefore(coords, dist) {
    const [lat1, lng1] = coords[0];
    const [lat2, lng2] = coords[1];
    const dy = lat2 - lat1;
    const dx = lng2 - lng1;
    const angle = Math.atan2(dy, dx);
    const latBefore = lat2 - dist * Math.sin(angle);
    const lngBefore = lng2 - dist * Math.cos(angle);
    return [latBefore, lngBefore];
}





document.addEventListener('DOMContentLoaded', function () {
  // Target the start button and the audio element
  const startButton = document.getElementById('startNavigation');
  const audioStart = document.getElementById('audioStart');

  // Add click event listener to the start button
  startButton.addEventListener('click', function() {
      // Play the start audio
      audioStart.play();
  });
});
