navigator.mediaDevices.getUserMedia({ audio: true })
    .then(function(stream) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        analyser.fftSize = 256; // Size of the FFT for frequency analysis

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        // Function to detect blow
        function detectBlow() {
            analyser.getByteFrequencyData(dataArray);
            const total = dataArray.reduce((acc, val) => acc + val, 0);
            const average = total / dataArray.length;

            const flameElement = document.querySelector('.flame');

            if (!flameElement) return;

            if (average > 50) { // Adjust this threshold as needed
                // If a strong blow is detected
                if (average > 115) { // Check for hard blow

                    console.log(average)
                    flameElement.classList.remove('blowing', 'reverse'); // Ensure other classes are removed
                    flameElement.classList.add('extinguish'); // Extinguish the flame
                    flameElement.style.animation = 'extinguishFlame 0.5s forwards';
                    flameElement.remove();
                    document.querySelector('.glow')?.remove();
                    document.querySelector('.blinking-glow')?.remove();
                } else {
                    // If blow is detected, scale down the flame
                    flameElement.classList.add('blowing'); // Start blowing animation
                    flameElement.classList.remove('reverse', 'extinguish'); // Ensure other classes are removed
                }
            } else {
                // Reset the flame size
                flameElement.classList.remove('blowing', 'extinguish'); // Stop current animations
                flameElement.classList.add('reverse'); // Reverse animation to go back to original height
            }

            requestAnimationFrame(detectBlow); // Repeat the detection
        }

        detectBlow(); // Start detecting
    })
    .catch(function(err) {
        console.error('Error accessing microphone:', err);
    });
