'use strict';

// Application Architecture



class Climbing {
    date = new Date();
    id = (Date.now() + '').slice(-10);

    constructor(coords, reps, duration, grade) {
        this.coords = coords; // [lat, lng]
        this.reps = reps;
        this.duration = duration;
        this.grade = grade;
    } 
}

class Bouldering extends Climbing {
    type = 'bouldering';
    constructor(coords, reps, duration, grade) {
        super(coords, reps, duration, grade);
    }
}

class RockClimbing extends Climbing {
    type = 'rockclimb';
    constructor(coords, reps, duration, grade) {
        super(coords, reps, duration, grade);
    }
}

// const bould1 = new Bouldering([39, -12], 4, 26, 1.5);
// console.log(bould1);


////////////////////////////////////////
// APPLICATION ARCHITECTURE

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form_input-type');
const inputReps = document.querySelector('.form_input-reps')
const inputDuration = document.querySelector('.form_input-duration');
const inputGrade = document.querySelector('.form_input-grade');

class App {
    // Private instance properties
    #map;
    #mapEvent;
    #shoeIcon;
    #workouts = [];

    constructor() {
        this._getPosition(); // It automatically gets the position when the map is loaded
        form.addEventListener('submit', this._newWorkout.bind(this));
    }

    _getPosition() {
        if (navigator.geolocation) {

            navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), function() {
                
            }, function() {
                alert('Could not get your position');
            });
        }
    }
    
    _loadMap(position) {
        
        const {latitude} = position.coords;
        const {longitude} = position.coords;
        const coords = [latitude, longitude];
    
        this.#map = L.map('map').setView(coords, 13);
    
        this.#shoeIcon = L.icon({
            iconUrl: './image/climbing-shoes.png',
            iconSize: [30, 30], 
            iconAnchor: [22, 94],
            popupAnchor: [-3, -76]
        });
    
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.#map);
    
        // Handling clicks on map
        this.#map.on('click', this._showForm.bind(this));
    }

    _showForm(mapE) {
        this.#mapEvent = mapE;
        form.classList.remove('hidden');
        inputReps.focus();
            
    }

    _hideForm() {}

    _newWorkout(e) {

        const validInputs = (...inputs) => inputs.every(inp => Number.isFinite(inp));
        const allPositive = (...inputs) => inputs.every(inp => inp > 0);

        e.preventDefault();

        // Get data from the form
        const type = inputType.value;
        const reps = +inputReps.value;
        const duration = +inputDuration.value;
        const grade = +inputGrade.value;
        const {lat, lng} = this.#mapEvent.latlng;
        let climb;

        // Check if data is valid
        if (!validInputs(reps, duration, grade) || 
            !allPositive(reps, duration, grade) || 
            grade < 1 || grade >= 6) {
                return alert('Inputs have to be valid numbers!');
            }

        // If climbing bouldering, create bouldering object
        if (type === 'bouldering') {
            climb = new Bouldering([lat, lng], reps, duration, grade);
        }
        
        // If rock climbing, create rock climbing object
        if (type === 'rockclimb') {
            climb = new RockClimbing([lat, lng], reps, duration, grade);
        }
        
        // Add new object to workout array
        this.#workouts.push(climb);
        console.log(climb);

        // Render workout on map as marker
        this._renderWorkoutMarker(climb);

        // Render workout on list

        // Hide form + Clear input field

        // Clear input fields
        inputReps.value = inputDuration.value = inputGrade.value = '';

            
    }

    _renderWorkoutMarker(workout) {
        L.marker(workout.coords, {icon: this.#shoeIcon})
            .addTo(this.#map)
            .bindPopup(L.popup({
                maxWidth: 250,
                minWidth: 100,
                autoClose: false,
                closeOnClick: false,
                className: `${workout.type}-popup`,
            }))
            .setPopupContent('climb')
            .openPopup();
    }
}

const app = new App();




