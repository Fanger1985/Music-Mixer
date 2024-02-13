// Define wavesurfer instances at the top level of your script
var wavesurferLeft = WaveSurfer.create({
    container: '#waveformLeft',
    waveColor: 'violet',
    progressColor: 'purple',
    cursorColor: 'navy',
    backend: 'WebAudio'
});

var wavesurferRight = WaveSurfer.create({
    container: '#waveformRight',
    waveColor: 'lightgreen',
    progressColor: 'green',
    cursorColor: 'navy',
    backend: 'WebAudio'
});

// Format time in MM:SS
function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
}

// Update Time Counter for a WaveSurfer instance
function updateTimeCounters(wavesurfer, currentTimeId, totalTimeId) {
    const currentTimeElem = document.getElementById(currentTimeId);
    const totalTimeElem = document.getElementById(totalTimeId);

    wavesurfer.on('audioprocess', function() {
        currentTimeElem.textContent = formatTime(wavesurfer.getCurrentTime());
    });

    wavesurfer.on('ready', function() {
        totalTimeElem.textContent = formatTime(wavesurfer.getDuration());
    });

    wavesurfer.on('seek', function() {
        currentTimeElem.textContent = formatTime(wavesurfer.getCurrentTime());
    });

    wavesurfer.on('finish', function() {
        currentTimeElem.textContent = formatTime(0);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Function to load a track and display its waveform
    function loadTrack(input, side) {
        const file = input.files[0];
        const url = URL.createObjectURL(file);

        if (side === 'left') {
            document.getElementById('trackNameLeft').textContent = file.name;
            wavesurferLeft.load(url);
        } else {
            document.getElementById('trackNameRight').textContent = file.name;
            wavesurferRight.load(url);
        }
    }

    // Toggle play/pause for a WaveSurfer instance and update button text
    function togglePlay(wavesurfer, buttonId) {
        wavesurfer.playPause();
        const button = document.getElementById(buttonId);
        button.textContent = wavesurfer.isPlaying() ? 'Pause' : 'Play';
    }

    // Setup event listeners for the file input elements
    document.getElementById('fileInputLeft').onchange = function() {
        loadTrack(this, 'left');
    };

    document.getElementById('fileInputRight').onchange = function() {
        loadTrack(this, 'right');
    };

    // Attach event listeners to the play buttons
    document.getElementById('playLeft').addEventListener('click', function() {
        togglePlay(wavesurferLeft, 'playLeft');
    });

    document.getElementById('playRight').addEventListener('click', function() {
        togglePlay(wavesurferRight, 'playRight');
    });

    // Update time counters for both WaveSurfer instances
    updateTimeCounters(wavesurferLeft, 'currentTimeLeft', 'totalTimeLeft');
    updateTimeCounters(wavesurferRight, 'currentTimeRight', 'totalTimeRight');

    // Initialize volume controls
    const volumeLeft = document.getElementById('volumeLeft');
    const volumeRight = document.getElementById('volumeRight');

    // Function to adjust individual track volumes
    volumeLeft.addEventListener('input', function() {
        wavesurferLeft.setVolume(this.value / 100);
    });

    volumeRight.addEventListener('input', function() {
        wavesurferRight.setVolume(this.value / 100);
    });

// Adjust the balance between tracks using the main slider
const balanceSlider = document.getElementById('colorSlider');
balanceSlider.addEventListener('input', function() {
    const balance = this.value;
    // Set volume for left and right based on balance slider
    const volumeLeft = balance <= 50 ? 1 : 1 - 2 * (balance - 50) / 100;
    const volumeRight = balance >= 50 ? 1 : 1 - 2 * (50 - balance) / 100;

    // Apply volume adjustments considering individual volume controls
    const volumeControlLeft = document.getElementById('volumeLeft').value / 100;
    const volumeControlRight = document.getElementById('volumeRight').value / 100;

    wavesurferLeft.setVolume(volumeLeft * volumeControlLeft);
    wavesurferRight.setVolume(volumeRight * volumeControlRight);
});

});