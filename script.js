let W = window.innerWidth;
let H = window.innerHeight;
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const maxConfettis = 150;
const particles = [];

const possibleColors = [
    "DodgerBlue",
    "OliveDrab",
    "Gold",
    "Pink",
    "SlateBlue",
    "LightBlue",
    "Gold",
    "Violet",
    "PaleGreen",
    "SteelBlue",
    "SandyBrown",
    "Chocolate",
    "Crimson"
];

function randomFromTo(from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from);
}

function confettiParticle() {
    this.x = Math.random() * W; // x
    this.y = Math.random() * H - H; // y
    this.r = randomFromTo(11, 33); // radius
    this.d = Math.random() * maxConfettis + 11;
    this.color =
        possibleColors[Math.floor(Math.random() * possibleColors.length)];
    this.tilt = Math.floor(Math.random() * 33) - 11;
    this.tiltAngleIncremental = Math.random() * 0.07 + 0.05;
    this.tiltAngle = 0;

    this.draw = function() {
        context.beginPath();
        context.lineWidth = this.r / 2;
        context.strokeStyle = this.color;
        context.moveTo(this.x + this.tilt + this.r / 3, this.y);
        context.lineTo(this.x + this.tilt, this.y + this.tilt + this.r / 5);
        return context.stroke();
    };
}

function Draw() {
    const results = [];
    // Magical recursive functional love
    requestAnimationFrame(Draw);

    context.clearRect(0, 0, W, window.innerHeight);

    for (var i = 0; i < maxConfettis; i++) {
        results.push(particles[i].draw());
    }

    let particle = {};
    let remainingFlakes = 0;
    for (var i = 0; i < maxConfettis; i++) {
        particle = particles[i];

        particle.tiltAngle += particle.tiltAngleIncremental;
        particle.y += (Math.cos(particle.d) + 3 + particle.r / 2) / 2;
        particle.tilt = Math.sin(particle.tiltAngle - i / 3) * 15;

        if (particle.y <= H) remainingFlakes++;

        // If a confetti has fluttered out of view,
        // bring it back to above the viewport and let if re-fall.
        if (particle.x > W + 30 || particle.x < -30 || particle.y > H) {
            particle.x = Math.random() * W;
            particle.y = -30;
            particle.tilt = Math.floor(Math.random() * 10) - 20;
        }
    }

    return results;
}


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
                    window.addEventListener(
                        "resize",
                        function() {
                            W = window.innerWidth;
                            H = window.innerHeight;
                            canvas.width = window.innerWidth;
                            canvas.height = window.innerHeight;
                        },
                        false
                    );
                    for (var i = 0; i < maxConfettis; i++) {
                        particles.push(new confettiParticle());
                    }
                    canvas.width = W;
                    canvas.height = H;
                    Draw();
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



