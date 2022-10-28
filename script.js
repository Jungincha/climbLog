'use strict';

// Application Architecture

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form_input-type');
const inputReps = document.querySelector('.form_input-reps')
const inputDuration = document.querySelector('.form_input-duration');
const inputGrade = document.querySelector('.form_input-grade');

navigator.geolocation.getCurrentPosition(function(position) {
    const {latitude} = position.coords;
    const {longitude} = position.coords;
    
    const coords = [latitude, longitude];

    const map = L.map('map').setView(coords, 13);

    const shoeIcon = L.icon({
        iconUrl: './image/climbing-shoes.png',
        iconSize: [30, 30], 
        iconAnchor: [22, 94],
        popupAnchor: [-3, -76]
    });

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker(coords, {icon: shoeIcon}).addTo(map)
    .bindPopup('Climb')
    .openPopup();
}, function() {
    alert('Could not get your position');
})

// class App {
//     #map;
//     #mapZoomLevel = 13;
//     #mapEvent;
//     #workouts = [];

//     constructor() {
//         _loadMap(position) {

//         }
//     }
// }