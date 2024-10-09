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

            if (average > 60) { // Adjust this threshold as needed
                // If a strong blow is detected
                if (average > 85) { // Check for hard blow

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
                    const audio = document.getElementById('birthdayAudio');
                    const flower = document.querySelector('.flower');
                    const thread = document.querySelector('.thread');
                    const header = document.querySelector('.header');
                    const cake = document.querySelector('.cake');
                    cake.classList.add('hidden');
                    flower.classList.add('show');
                    header.classList.add('show');
                    thread.classList.add('hidden');
                    audio.play();
                    happyGo();
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



var select = function(el) {
        return document.getElementById(el);
    },
    svg = select("svg"),
    eyes_happy = select("eyes-happy"),
    mouth_happy = select("mouth-happy"),
    cheeks = select("cheeks"),
    stem_1 = select("tige"),
    stem_4 = select("tige-3"),
    head = select("head"),
    face = select("face"),
    leaf_group_1 = select("leaf-group-1"),
    leaf_group_2 = select("leaf-group-2"),
    leaf_group_3 = select("leaf-group-3"),
    leaf_group_4 = select("leaf-group-4"),
    leaf_stem_1 = select("leaf-stem-1"),
    leaf_stem_2 = select("leaf-stem-2"),
    leaf_stem_3 = select("leaf-stem-3"),
    leaf_stem_4 = select("leaf-stem-4"),
    leaf_1 = select("leaf-1"),
    leaf_2 = select("leaf-2"),
    leaf_3 = select("leaf-3"),
    leaf_4 = select("leaf-4");


function happyGo(){
    timelineInit();
    gsap.to("svg", { visibility: "visible" });
    var tlHappy = new TimelineMax();
    tlHappy
        .to(
            leaf_stem_1,
            0.3,
            { attr: { x2: 250, y2: 340 }, transformOrigin: "50% 50%" },
            "one"
        )
        .to(leaf_1, 0.3, { x: -15, y: -7 }, "one")
        .to(
            leaf_stem_2,
            0.3,
            { attr: { x2: 240, y2: 267 }, transformOrigin: "50% 50%" },
            "one"
        )
        .to(leaf_2, 0.3, { x: -15, y: -7 }, "one")
        .add(happy2());

    tlHappy.timeScale(4);


    eyes_happy.style.display = "block";
    mouth_happy.style.display = "block";
    cheeks.style.display = "block";
    timelineInit();
    tlHappy.play();
};
function timelineInit() {
    gsap.to(stem_1, {
        scaleY: 1,
        rotation: 0,
        transformOrigin: "center bottom"
    });
    gsap.to(head, {
        y: 0,
        x: 0,
        rotation: 0,
        transformOrigin: "center bottom"
    });
    gsap.to(leaf_group_1, {
        y: 0,
        x: 0,
        rotation: 0,
        transformOrigin: "right bottom"
    });
    gsap.to(leaf_group_2, {
        y: 0,
        x: 0,
        rotation: 0,
        transformOrigin: "right bottom"
    });
    gsap.to(leaf_group_3, {
        y: 0,
        x: 0,
        rotation: 0,
        transformOrigin: "left bottom"
    });
    gsap.to(leaf_group_4, {
        y: 0,
        x: 0,
        rotation: 0,
        transformOrigin: "left bottom"
    });
    gsap.to(head, { y: 0 });
    gsap.to(face, { x: 0, y: 0 });
    gsap.to(leaf_stem_1, { attr: { x2: 289, y2: 360 } });
    gsap.to(leaf_stem_2, { attr: { x2: 287.2, y2: 287 } });
    gsap.to(leaf_stem_3, { attr: { x2: 313.3, y2: 278.1 } });
    gsap.to(leaf_stem_4, { attr: { x2: 312.6, y2: 351.2 } });
    gsap.to(leaf_1, { x: 0, y: 0 });
    gsap.to(leaf_2, { x: 0, y: 0 });
    gsap.to(leaf_3, { x: 0, y: 0 });
    gsap.to(leaf_4, { x: 0, y: 0 });
    gsap.to(stem_1, {
        attr: { d: "M300.8,398.4c0,0,2.1-60.3,1.7-80.3c-0.5-23-6.2-92-6.2-92" }
    });
}





function happy2() {
    var tlHappy2 =  gsap.timeline({repeat: -1 });
    tlHappy2
        .to(
            leaf_stem_3,
            0.3,
            { attr: { x2: 335, y2: 268 }, transformOrigin: "50% 50%" },
            "two+=0.5"
        )
        .to(leaf_3, 0.3, { x: 15, y: -7 }, "two+=0.5")
        .to(
            leaf_stem_4,
            0.3,
            { attr: { x2: 340, y2: 337 }, transformOrigin: "50% 50%" },
            "two+=0.5"
        )
        .to(leaf_4, 0.3, { x: 15, y: -7 }, "two+=0.5")
        .to(
            leaf_stem_1,
            0.3,
            { attr: { x2: 289, y2: 360 }, transformOrigin: "50% 50%" },
            "two+=0.5"
        )
        .to(leaf_1, 0.3, { x: -2, y: 0 }, "two+=0.5")
        .to(
            leaf_stem_2,
            0.3,
            { attr: { x2: 287.2, y2: 287 }, transformOrigin: "50% 50%" },
            "two+=0.5"
        )
        .to(leaf_2, 0.3, { x: -5, y: 0 }, "two+=0.5")
        .to(
            head,
            0.3,
            {
                y: 0,
                x: 5,
                rotation: 5,
                transformOrigin: "center bottom",
                ease: Power0.easeNone
            },
            "two+=0.5"
        )
        .to(
            stem_1,
            0.3,
            { x: 2, morphSVG: stem_4, ease: Power0.easeNone },
            "two+=0.5"
        )
        .to(
            leaf_stem_3,
            0.3,
            { attr: { x2: 313.3, y2: 278.1 }, transformOrigin: "50% 50%" },
            "three+=0.5"
        )
        .to(leaf_3, 0.3, { x: 0, y: 0 }, "three+=0.5")
        .to(
            leaf_stem_4,
            0.3,
            { attr: { x2: 312.6, y2: 351.2 }, transformOrigin: "50% 50%" },
            "three+=0.5"
        )
        .to(leaf_4, 0.3, { x: 0, y: 0 }, "three+=0.5")
        .to(
            leaf_stem_1,
            0.3,
            { attr: { x2: 250, y2: 340 }, transformOrigin: "50% 50%" },
            "three+=0.5"
        )
        .to(leaf_1, 0.3, { x: -15, y: -7 }, "three+=0.5")
        .to(
            leaf_stem_2,
            0.3,
            { attr: { x2: 235, y2: 265 }, transformOrigin: "50% 50%" },
            "three+=0.5"
        )
        .to(leaf_2, 0.3, { x: -15, y: -7 }, "three+=0.5")
        .to(
            head,
            0.3,
            {
                y: 0,
                x: 0,
                rotation: 0,
                transformOrigin: "center bottom",
                ease: Power0.easeNone
            },
            "three+=0.5"
        )
        .to(
            stem_1,
            0.3,
            { x: 0, morphSVG: stem_1, ease: Power0.easeNone },
            "three+=0.5"
        );
    return tlHappy2;
}


