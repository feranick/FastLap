let database = {};

const trackSelect = document.getElementById('track-select');
const seriesSelect = document.getElementById('series-select');
const resultsContainer = document.getElementById('results-container');
const noDataContainer = document.getElementById('no-data');

const trackNames = {
    "albert_park": "Albert Park Circuit (Australia)",
    "shanghai": "Shanghai International Circuit",
    "suzuka": "Suzuka International Racing Course",
    "bahrain": "Bahrain International Circuit",
    "miami": "Miami International Autodrome",
    "imola": "Autodromo Enzo e Dino Ferrari (Imola)",
    "monaco": "Circuit de Monaco",
    "barcelona": "Circuit de Barcelona-Catalunya",
    "gilles_villeneuve": "Circuit Gilles Villeneuve (Canada)",
    "red_bull_ring": "Red Bull Ring (Austria)",
    "silverstone": "Silverstone Circuit",
    "spa": "Circuit de Spa-Francorchamps",
    "hungaroring": "Hungaroring",
    "zandvoort": "Circuit Zandvoort",
    "monza": "Autodromo Nazionale Monza",
    "baku": "Baku City Circuit",
    "singapore": "Marina Bay Street Circuit",
    "cota": "Circuit of the Americas (COTA)",
    "mexico": "Autódromo Hermanos Rodríguez",
    "interlagos": "Autódromo José Carlos Pace (Interlagos)",
    "las_vegas": "Las Vegas Strip Circuit",
    "qatar": "Lusail International Circuit",
    "yas_marina": "Yas Marina Circuit (Abu Dhabi)",
    "jeddah": "Jeddah Corniche Circuit",
    "st_petersburg": "Streets of St. Petersburg",
    "phoenix": "Phoenix Raceway",
    "arlington": "Streets of Arlington",
    "barber": "Barber Motorsports Park",
    "long_beach": "Long Beach Street Circuit",
    "indianapolis_oval": "Indianapolis Motor Speedway (Oval)",
    "indianapolis_road": "Indianapolis Motor Speedway (Road)",
    "detroit": "Streets of Detroit",
    "gateway": "WWTR Gateway",
    "road_america": "Road America",
    "mid_ohio": "Mid-Ohio Sports Car Course",
    "nashville_super": "Nashville Superspeedway",
    "toronto": "Streets of Toronto (Markham)",
    "milwaukee": "Milwaukee Mile",
    "laguna_seca": "WeatherTech Raceway Laguna Seca",
    "daytona": "Daytona International Speedway",
    "lemans": "Circuit de la Sarthe (Le Mans)",
    "fuji": "Fuji Speedway"
};

const seriesNames = {
    "f1": "Formula 1",
    "f2": "Formula 2",
    "indycar": "Indycar",
    "wec_prototype": "WEC (Hypercar/LMP1)",
    "wec_gt3": "WEC (LMGT3/GTE)",
    "imsa_gtp": "IMSA (GTP/DPi)",
    "imsa_gtd": "IMSA (GTD Pro/GTD)"
};

fetch('data.json')
    .then(response => response.json())
    .then(data => {
        database = data;
        trackSelect.innerHTML = '<option value="" disabled selected>Choose a track...</option>';
        
        // Sort tracks alphabetically based on their display names
        const sortedTrackKeys = Object.keys(database).sort((a, b) => {
            const nameA = trackNames[a] || a;
            const nameB = trackNames[b] || b;
            return nameA.localeCompare(nameB);
        });

        // Populate the dropdown using the sorted array
        for (const trackKey of sortedTrackKeys) {
            const option = document.createElement('option');
            option.value = trackKey;
            option.textContent = trackNames[trackKey] || trackKey; 
            trackSelect.appendChild(option);
        }
    })
    .catch(error => console.error('Error loading data:', error));

trackSelect.addEventListener('change', () => {
    const selectedTrack = trackSelect.value;
    const availableSeries = database[selectedTrack];

    seriesSelect.innerHTML = '<option value="" disabled selected>Choose a series...</option>';
    for (const seriesKey in availableSeries) {
        const option = document.createElement('option');
        option.value = seriesKey;
        option.textContent = seriesNames[seriesKey] || seriesKey;
        seriesSelect.appendChild(option);
    }

    seriesSelect.disabled = false;
    resultsContainer.classList.add('hidden');
    noDataContainer.classList.add('hidden');
});

seriesSelect.addEventListener('change', () => {
    const track = trackSelect.value;
    const series = seriesSelect.value;
    const data = database[track][series];
    
    document.getElementById('q-time').textContent = data.quali.time;
    document.getElementById('q-driver').textContent = data.quali.driver;
    document.getElementById('q-team').textContent = data.quali.team;
    document.getElementById('q-year').textContent = data.quali.year;
    
    document.getElementById('r-time').textContent = data.race.time;
    document.getElementById('r-driver').textContent = data.race.driver;
    document.getElementById('r-team').textContent = data.race.team;
    document.getElementById('r-year').textContent = data.race.year;
    
    resultsContainer.classList.remove('hidden');
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js');
    });
}
