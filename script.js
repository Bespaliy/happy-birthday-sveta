const candle = document.getElementById('candle');
const flame = document.getElementById('flame');
const congratulations = document.getElementById('congratulations');
const blowoutSound = document.getElementById('blowout-sound');
let blowing = false;
let blowDuration = 0;
let blowTimeout;

const startListening = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(stream);
    microphone.connect(analyser);

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const checkVolume = () => {
        analyser.getByteFrequencyData(dataArray);
        const volume = dataArray.reduce((sum, value) => sum + value) / dataArray.length;

        if (volume > 50) { // Arbitrary threshold for blowing
            if (!blowing) {
                blowing = true;
                blowDuration = 0; // Reset blow duration on first blow
                blowTimeout = setInterval(() => {
                    blowDuration += 100; // Increase duration with time
                }, 100);
            }
        } else {
            if (blowing) {
                clearInterval(blowTimeout);
                blowing = false;
            }
        }

        if (blowing && blowDuration >= 3000) { // 3 seconds to blow out the candle
            blowOutCandle();
        }

        requestAnimationFrame(checkVolume);
    };

    checkVolume();
};

const blowOutCandle = () => {
    blowoutSound.play(); // Play blowout sound
    flame.classList.add('candle-out');
    congratulations.classList.add('show');
    setTimeout(() => {
        alert("Joe, you're amazing! Keep smiling!");
        window.location.reload(); // Restart the game after blowing out the candle
    }, 1000); // Wait for the animation to finish
};

// Start listening for microphone input
startListening();
