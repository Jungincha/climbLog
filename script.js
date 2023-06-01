'use strict';

// Application Architecture



class Climbing {
    date = new Date();
    id = (Date.now() + '').slice(-10);

    constructor(coords, reps, duration, grade, note) {
        this.coords = coords; // [lat, lng]
        this.reps = reps;
        this.duration = duration;
        this.grade = grade;
        this.note = note;
    } 

    // can't call this method in climbing class since there is no type
    _setDescription() {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        
        this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on
                             ${months[this.date.getMonth()]} ${this.date.getDate()}`;
    }
}

class Bouldering extends Climbing {
    type = 'bouldering';
    constructor(coords, reps, duration, grade, note) {
        super(coords, reps, duration, grade, note);
        this._setDescription();
    }
}

class RockClimbing extends Climbing {
    type = 'rockclimb';
    constructor(coords, reps, duration, grade, note) {
        super(coords, reps, duration, grade, note);
        this._setDescription();
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
const inputNote = document.querySelector('.form_input-note');
const deleteX = document.querySelector('.fa-xmark');

class App {
    // Private instance properties
    #map;
    #mapZoomLevel = 13;
    #mapEvent;
    #shoeIcon;
    #workouts = [];

    constructor() {
        // Get use's location and load
        this._getPosition(); // It automatically gets the position when the map is loaded
        
        // Get data from local storage
        this._getLocalStorage();

        // When the form is submit
        form.addEventListener('submit', this._newWorkout.bind(this));

        // When the climb card is clicked -> move to the popup
        containerWorkouts.addEventListener('click', this._moveToPopup.bind(this));

        // When the delete x mark is clicked on the workout list
        containerWorkouts.addEventListener('click', this._deleteWorkout.bind(this));
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
    
        this.#map = L.map('map').setView(coords, this.#mapZoomLevel);
    
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

        // Have to put the marker load here to make sure it happens after the map is uploaded
        this.#workouts.forEach(work => {
            this._renderWorkoutMarker(work);
        });
    }

    _showForm(mapE) {
        this.#mapEvent = mapE;
        form.classList.remove('hidden');
        inputReps.focus();
        
    }
    
    
    // Hide form + Clear input field
    _hideForm() {
        // Empty inputs
        inputReps.value = inputDuration.value = inputGrade.value = inputNote.value = '';
        form.style.display = 'none';
        form.classList.add('hidden');
        // to put on form again later display has to be grid again
        setTimeout(() => (form.style.display = 'grid'), 1000);
    }
    
    _newWorkout(e) {
        
        const validInputs = (...inputs) => inputs.every(inp => Number.isFinite(inp));
        const allPositive = (...inputs) => inputs.every(inp => inp > 0);
        
        e.preventDefault();
        
        // Get data from the form
        const type = inputType.value;
        const reps = +inputReps.value;
        const duration = +inputDuration.value;
        const grade = inputGrade.value;
        const {lat, lng} = this.#mapEvent.latlng;
        const note = inputNote.value;
        let climb;
        
        // Check if data is valid
        if (!validInputs(reps, duration) || 
        !allPositive(reps, duration)) {
            return alert('Inputs have to be valid numbers!');
        }
        
        // If climbing bouldering, create bouldering object
        if (type === 'bouldering') {
            climb = new Bouldering([lat, lng], reps, duration, grade, note);
        }
        
        // If rock climbing, create rock climbing object
        if (type === 'rockclimb') {
            climb = new RockClimbing([lat, lng], reps, duration, grade, note);
        }
        
        // Add new object to workout array
        this.#workouts.push(climb);
        
        // Render workout on map as marker
        this._renderWorkoutMarker(climb);
        
        // Render workout on list
        this._renderWorkout(climb);

        // Hide the form
        this._hideForm();
        
        // Set local storage for all the climb list
        this._setLocalStorage();
        
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
            .setPopupContent(`${workout.type === 'bouldering' ? '🧗' : '🪢'} ${workout.description}`)
            .openPopup();
    }

    _renderWorkout(workout) {
        const html = `
            <li class="workout climbing-${workout.type}" data-id="${workout.id}">
                <div class="title-head">
                    <h2 class="workout__title">${workout.description}</h2>
                    <i class="fa-solid fa-xmark ${workout.id}"></i>
                </div>
                <div class="workout-body">
                    <div class="workout__details">
                        <span class="workout__icon">🔁</span>
                        <span class="workout__value">${workout.reps}</span>
                        <span class="workout__unit">reps</span>
                    </div>

                    <div class="workout__details">
                        <span class="workout__icon">⏱</span>
                        <span class="workout__value">${workout.duration}</span>
                        <span class="workout__unit">min</span>
                    </div>

                    <div class="workout__details">
                        <span class="workout__icon">⚡️</span>
                        <span class="workout__value">${workout.grade}</span>
                        <span class="workout__unit">grade</span>
                    </div>

                    <div class="workout__details">
                        <span class="workout__icon">📝</span>
                        <span class="workout__value">${workout.note}</span>
                    </div>
                </div>
            </li>
        `;

        form.insertAdjacentHTML('afterend', html);
    }

    _moveToPopup(e) {
        const workoutEl = e.target.closest('.workout');
        
        if(!workoutEl) return;

        const workout = this.#workouts.find(
            work => work.id === workoutEl.dataset.id
        );

        this.#map.setView(workout.coords, this.#mapZoomLevel, {
            animate: true,
            pan: {
                duration: 1,
            },
        });
    }

    _deleteWorkout(e) {
        const deleteX = e.target.closest('.fa-xmark');
        
        if (!deleteX) return;

        this.#workouts = this.#workouts.filter(el => el.id != deleteX.classList[2]);

        this._setLocalStorage();

        location.reload();
    }

    _setLocalStorage() {
        localStorage.setItem('workouts', JSON.stringify(this.#workouts));
    }

    _getLocalStorage() {
        const data = JSON.parse(localStorage.getItem('workouts'));

        if(!data) return;

        this.#workouts = data;

        this.#workouts.forEach(work => {
            this._renderWorkout(work);
        });

    }

    reset() {
        localStorage.removeItem('workouts');
        location.reload();
    }
}

const app = new App();


// Ability to edit a workout

// Ability to delete a workout (O)

// Ability to delete all workouts (Using UI)

// Ability to sort workouts by a certain field (eg. distance)

// Re-build Running and Cycling objects coming from Local Storage

// More realistic error and confirmation messages

// Ability to position the map to show all workouts(very hard)

// Geocode location from coordinates("Run in Faro, Portugal") [only after asynchronous JavaScript section]

// Display weather data for workout time and place [after asyn js section]



