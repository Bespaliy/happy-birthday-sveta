let audioContext;
let microphone, meter;

function volumeAudioProcess(event) {
    const input = event.inputBuffer.getChannelData(0);
    let total = 0;

    // Calculate the total volume of the input
    for (let i = 0; i < input.length; i++) {
        total += Math.abs(input[i]);
    }

    // Average the volume
    const volume = total / input.length;

    // Store the volume in the processor
    this.volume = volume;

    // Clipping logic
    if (volume > this.clipLevel) {
        this.clipping = true;
        this.lastClip = window.performance.now();
    }
}


function createAudioMeter(audioContext, clipLevel = 0.98, averaging = 0.95, clipLag = 750) {
    // Create a ScriptProcessorNode for processing audio
    const processor = audioContext.createScriptProcessor(512);

    // Initialize properties for volume processing
    processor.clipping = false;
    processor.lastClip = 0;
    processor.volume = 0;
    processor.clipLevel = clipLevel;
    processor.averaging = averaging;
    processor.clipLag = clipLag;

    // Connect the processor to the audio context's destination
    processor.connect(audioContext.destination);

    // Volume processing function
    processor.onaudioprocess = volumeAudioProcess;

    // Method to check if clipping has occurred
    processor.checkClipping = function() {
        if (!this.clipping) return false;

        // Reset clipping state if enough time has passed
        if ((this.lastClip + this.clipLag) < window.performance.now()) {
            this.clipping = false;
        }
        return this.clipping;
    };

    // Method to shut down the processor
    processor.shutdown = function() {
        this.disconnect();
        this.onaudioprocess = null;
    };

    return processor;
}


// Get request for microphone usage
const requestAudioAccess = () => {
    if (navigator.mediaDevices) {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then((stream) => setAudioStream(stream))
            .catch((err) => alert('This pen requires a microphone to work properly.'));
    } else alert('Your browser does not support required microphone access.');
};

// Set up to record volume
const setAudioStream = (stream) => {
    audioContext = new AudioContext();
    microphone = audioContext.createMediaStreamSource(stream);
    meter = createAudioMeter(audioContext);

    const filter = audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;

    microphone.connect(filter);
    filter.connect(meter);
};

// Check if is blowing
let lowpass = 0;
const ALPHA = 0.5, THRESHOLD = 0.09;
const isBlowing = () => {
    lowpass = ALPHA * meter.volume + (1.0 - ALPHA) * lowpass;
    return (lowpass > THRESHOLD);
};

requestAudioAccess();

// Candle and flame simulation
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const cw = canvas.width = 800;
const ch = canvas.height = 400;

const particles = [];
const MAX_PART_COUNT = 100;

const REIGNITE_RATE = 2; // rate at which flame will recover
const MAX_PART_DOWNTIME = 15; // max limit at which smothered flame will recover

const rand = (min, max) => (min + Math.random() * (max - min));

// Fire Particle class
class FlameParticle {
    constructor(x = cw / 2, y = ch / 2) {
        this.radius = 15;
        this.speed = { x: rand(-0.5, 0.5), y: 2.5 };
        this.life = rand(50, 100);
        this.alpha = 0.5;

        this.x = x;
        this.y = y;
        this.curAlpha = this.alpha;
        this.curLife = this.life;
    }

    update() {
        if (this.curLife <= 90) {
            this.radius -= Math.min(this.radius, 0.25);
            this.curAlpha -= 0.005;
        }

        if (microphone && isBlowing())
            this.x += rand(-meter.volume, meter.volume) * 50;

        this.curLife -= this.speed.y;
        this.y -= this.speed.y;
        this.draw();
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, Math.PI * 2, false);
        ctx.fillStyle = `rgba(254, 252, 207, ${this.curAlpha})`;
        ctx.fill();
        ctx.closePath();
    }
}

// Update and render function
const update = () => {
    ctx.clearRect(0, 0, cw, ch);
    if (particles.length < MAX_PART_COUNT) {
        particles.push(new FlameParticle());
    }

    particles.forEach((particle, index) => {
        particle.update();
        if (particle.curLife < 0) {
            particles.splice(index, 1);
        }
    });

    requestAnimationFrame(update);
};

// Start the animation loop
update();
// let audioContext;
// let microphone, meter;
//
// function volumeAudioProcess(event) {
//     const input = event.inputBuffer.getChannelData(0);
//     let total = 0;
//
//     // Calculate the total volume of the input
//     for (let i = 0; i < input.length; i++) {
//         total += Math.abs(input[i]);
//     }
//
//     // Average the volume
//     const volume = total / input.length;
//
//     // Store the volume in the processor
//     this.volume = volume;
//
//     // Clipping logic
//     if (volume > this.clipLevel) {
//         this.clipping = true;
//         this.lastClip = window.performance.now();
//     }
// }
//
//
// function createAudioMeter(audioContext, clipLevel = 0.98, averaging = 0.95, clipLag = 750) {
//     // Create a ScriptProcessorNode for processing audio
//     const processor = audioContext.createScriptProcessor(512);
//
//     // Initialize properties for volume processing
//     processor.clipping = false;
//     processor.lastClip = 0;
//     processor.volume = 0;
//     processor.clipLevel = clipLevel;
//     processor.averaging = averaging;
//     processor.clipLag = clipLag;
//
//     // Connect the processor to the audio context's destination
//     processor.connect(audioContext.destination);
//
//     // Volume processing function
//     processor.onaudioprocess = volumeAudioProcess;
//
//     // Method to check if clipping has occurred
//     processor.checkClipping = function() {
//         if (!this.clipping) return false;
//
//         // Reset clipping state if enough time has passed
//         if ((this.lastClip + this.clipLag) < window.performance.now()) {
//             this.clipping = false;
//         }
//         return this.clipping;
//     };
//
//     // Method to shut down the processor
//     processor.shutdown = function() {
//         this.disconnect();
//         this.onaudioprocess = null;
//     };
//
//     return processor;
// }
//
//
// // Get request for microphone usage
// const requestAudioAccess = () => {
//     if (navigator.mediaDevices) {
//         navigator.mediaDevices.getUserMedia({ audio: true })
//             .then((stream) => setAudioStream(stream))
//             .catch((err) => alert('This pen requires a microphone to work properly.'));
//     } else alert('Your browser does not support required microphone access.');
// };
//
// // Set up to record volume
// const setAudioStream = (stream) => {
//     audioContext = new AudioContext();
//     microphone = audioContext.createMediaStreamSource(stream);
//     meter = createAudioMeter(audioContext);
//
//     const filter = audioContext.createBiquadFilter();
//     filter.type = 'lowpass';
//     filter.frequency.value = 400;
//
//     microphone.connect(filter);
//     filter.connect(meter);
// };
//
// // Check if is blowing
// let lowpass = 0;
// const ALPHA = 0.5, THRESHOLD = 0.09, STRONG_BLOW_THRESHOLD = 0.20; // Added STRONG_BLOW_THRESHOLD
//
// const isBlowing = () => {
//     if (!meter) return false;
//     lowpass = ALPHA * meter.volume + (1.0 - ALPHA) * lowpass;
//     return (lowpass > THRESHOLD);
// };
//
// // Function to check for strong blows
// const isStrongBlowing = () => {
//     return (lowpass > STRONG_BLOW_THRESHOLD);
// };
//
// requestAudioAccess();
//
// // Candle and flame simulation
// const canvas = document.getElementById('canvas');
// const ctx = canvas.getContext('2d');
// const cw = canvas.width = 800;
// const ch = canvas.height = 400;
//
// const particles = [];
// const MAX_PART_COUNT = 100;
//
// const REIGNITE_RATE = 2; // rate at which flame will recover
// const MAX_PART_DOWNTIME = 15; // max limit at which smothered flame will recover
//
// const rand = (min, max) => (min + Math.random() * (max - min));
//
// // Fire Particle class
// class FlameParticle {
//     constructor(x = cw / 2, y = ch / 2) {
//         this.radius = 15;
//         this.speed = { x: rand(-0.5, 0.5), y: 2.5 };
//         this.life = rand(50, 100);
//         this.alpha = 0.5;
//         this.isExtinguished = false; // Track if particle is extinguished
//
//         this.x = x;
//         this.y = y;
//         this.curAlpha = this.alpha;
//         this.curLife = this.life;
//     }
//
//     update() {
//         if (this.curLife <= 90) {
//             this.radius -= Math.min(this.radius, 0.25);
//             this.curAlpha -= 0.005;
//         }
//
//         // Check if the particle should be extinguished
//         if (microphone && isStrongBlowing() && !this.isExtinguished) {
//             this.isExtinguished = true; // Mark particle as extinguished
//             this.curAlpha = 0; // Set alpha to 0 to make it disappear
//         }
//
//         // Move particle if not extinguished
//         if (!this.isExtinguished) {
//             if (isBlowing()) {
//                 this.x += rand(-meter.volume, meter.volume) * 50;
//             }
//         }
//
//         this.curLife -= this.speed.y;
//         this.y -= this.speed.y;
//         this.draw();
//     }
//
//     draw() {
//         ctx.beginPath();
//         ctx.arc(this.x, this.y, this.radius, Math.PI * 2, false);
//         ctx.fillStyle = `rgba(254, 252, 207, ${this.curAlpha})`;
//         ctx.fill();
//         ctx.closePath();
//     }
// }
//
// // Update and render function
// const update = () => {
//     ctx.clearRect(0, 0, cw, ch);
//     if (particles.length < MAX_PART_COUNT) {
//         particles.push(new FlameParticle());
//     }
//
//     particles.forEach((particle, index) => {
//         particle.update();
//         if (particle.curLife < 0 || particle.isExtinguished) {
//             particles.splice(index, 1);
//         }
//     });
//
//     requestAnimationFrame(update);
// };
//
// // Start the animation loop
// update();
