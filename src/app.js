let database = {};

const trackSelect = document.getElementById('track-select');
const seriesSelect = document.getElementById('series-select');
const resultsContainer = document.getElementById('results-container');
const noDataContainer = document.getElementById('no-data');

// Dictionaries to format the raw JSON keys into pretty display names
const trackNames = {
    "jeddah": "Jeddah Corniche Circuit",
    "miami": "Miami International Autodrome",
    "las_vegas": "Las Vegas Strip Circuit",
    "qatar": "Lusail International Circuit",
    "monza": "Autodromo Nazionale Monza",
    "daytona": "Daytona International Speedway",
    "indianapolis_road": "Indianapolis Motor Speedway (Road)",
    "lemans": "Circuit de la Sarthe (Le Mans)"
};

const seriesNames = {
    "f1": "Formula 1",
    "f2": "Formula 2",
    "indycar": "Indycar",
    "imsa": "IMSA",
    "wec": "WEC"
};

// Fetch the JSON data on load
fetch('data.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        database = data;
        
        // Auto-populate the track dropdown
        trackSelect.innerHTML = '<option value="" disabled selected>Choose a track...</option>';
        for (const trackKey in database) {
            const option = document.createElement('option');
            option.value = trackKey;
            // Use the dictionary name, or fallback to the raw key if not listed
            option.textContent = trackNames[trackKey] || trackKey; 
            trackSelect.appendChild(option);
        }
    })
    .catch(error => {
        console.error('There was a problem loading the database:', error);
        trackSelect.innerHTML = '<option value="" disabled>Error loading data</option>';
    });

// Update UI and populate Series dropdown when a track is selected
trackSelect.addEventListener('change', () => {
    const selectedTrack = trackSelect.value;
    const availableSeries = database[selectedTrack];

    // Reset and populate the series dropdown based ONLY on what's available
    seriesSelect.innerHTML = '<option value="" disabled selected>Choose a series...</option>';
    for (const seriesKey in availableSeries) {
        const option = document.createElement('option');
        option.value = seriesKey;
        option.textContent = seriesNames[seriesKey] || seriesKey.toUpperCase();
        seriesSelect.appendChild(option);
    }

    seriesSelect.disabled = false;
    resultsContainer.classList.add('hidden');
    noDataContainer.classList.add('hidden');
});

// Display data when series is selected
seriesSelect.addEventListener('change', () => {
    const track = trackSelect.value;
    const series = seriesSelect.value;
    const data = database[track][series];
    
    // Populate Qualifying Data
    document.getElementById('q-time').textContent = data.quali.time;
    document.getElementById('q-driver').textContent = data.quali.driver;
    document.getElementById('q-team').textContent = data.quali.team;
    document.getElementById('q-year').textContent = data.quali.year;
    
    // Populate Race Data
    document.getElementById('r-time').textContent = data.race.time;
    document.getElementById('r-driver').textContent = data.race.driver;
    document.getElementById('r-team').textContent = data.race.team;
    document.getElementById('r-year').textContent = data.race.year;
    
    resultsContainer.classList.remove('hidden');
});

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then(reg => console.log('Service Worker registered'))
            .catch(err => console.log('Service Worker registration failed: ', err));
    });
}
