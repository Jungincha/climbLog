'use strict';

// Application Architecture

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form_input-type');
const inputReps = document.querySelector('.form_input-reps')
const inputDuration = document.querySelector('.form_input-duration');
const inputGrade = document.querySelector('.form_input-grade');
let map;
let mapEvent;
let shoeIcon;

navigator.geolocation.getCurrentPosition(function(position) {
    const {latitude} = position.coords;
    const {longitude} = position.coords;
    
    const coords = [latitude, longitude];

    map = L.map('map').setView(coords, 13);

    shoeIcon = L.icon({
        iconUrl: './image/climbing-shoes.png',
        iconSize: [30, 30], 
        iconAnchor: [22, 94],
        popupAnchor: [-3, -76]
    });

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Handling clicks on map
    map.on('click', function(mapE) {
        mapEvent = mapE;
        form.classList.remove('hidden');
        inputReps.focus();
        
    })
    
}, function() {
    alert('Could not get your position');
});

form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Clear input fields
    inputReps.value = inputDuration.value = inputGrade.value = '';

    console.log(mapEvent);
    const {lat, lng} = mapEvent.latlng;
    
    // Display marker
    L.marker([lat, lng], {icon: shoeIcon})
        .addTo(map)
        .bindPopup(L.popup({
            maxWidth: 250,
            minWidth: 100,
            autoClose: false,
            closeOnClick: false,
            className: 'climbing-popup',
        }))
        .setPopupContent('Climb')
        .openPopup();
});



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