let tracks = [];
let currentStage = -1;
const totalDuration = 485;
let startTime;
let stageStartTime;
let started = false;
let loading = false;
let loadedTracks = 0;
const totalTracks = 4;
let fft;
let amplitude;
let offset = 0;
//let myFont;

function minSec(min, sec) {
    return min * 60 + sec;
}

let timeline = [
  { time: minSec(0,0), stage: 0 },
  { time: minSec(0,5), stage: 1 },
  { time: minSec(0,15), stage: 2 },
  { time: minSec(0,20), stage: 1 },
  { time: minSec(0,35), stage: 2 },
  { time: minSec(0,40), stage: 1 },
  { time: minSec(0,45), stage: 2 },
  { time: minSec(0,50), stage: 1 },
  { time: minSec(1,15), stage: 3 },
  { time: minSec(1,20), stage: 1 },
  { time: minSec(1,25), stage: 3 },
  { time: minSec(1,30), stage: 1 },
  { time: minSec(1,35), stage: 3 },
  { time: minSec(1,40), stage: 0 },
  { time: minSec(2,5), stage: 1 },
  { time: minSec(2,20), stage: 3 },
  { time: minSec(2,25), stage: 0 },
  { time: minSec(2,30), stage: 1 },
  { time: minSec(2,40), stage: 2 },
  { time: minSec(2,45), stage: 1 },
  { time: minSec(3,10), stage: 3 },
  { time: minSec(3,15), stage: 1 },
  { time: minSec(3,20), stage: 2 },
  { time: minSec(3,30), stage: 1 },
  { time: minSec(3,35), stage: 1 },
  { time: minSec(3,40), stage: 3 },
  { time: minSec(3,45), stage: 1 },
  { time: minSec(3,50), stage: 3 },
  { time: minSec(3,55), stage: 0 },
  { time: minSec(4,0), stage: 1 },
  { time: minSec(4,10), stage: 3 },
  { time: minSec(4,15), stage: 1 },
  { time: minSec(4,20), stage: 3 },
  { time: minSec(4,25), stage: 1 },
  { time: minSec(4,30), stage: 2 },
  { time: minSec(4,35), stage: 1 },
  { time: minSec(4,45), stage: 2 },
  { time: minSec(4,50), stage: 1 },
  { time: minSec(5,25), stage: 2 },
  { time: minSec(5,30), stage: 1 },
  { time: minSec(5,40), stage: 2 },
  { time: minSec(5,45), stage: 1 },
  { time: minSec(5,50), stage: 2 },
  { time: minSec(5,55), stage: 0 },
  { time: minSec(6,0), stage: 1 },
  { time: minSec(6,55), stage: 3 },
  { time: minSec(7,0), stage: 1 },
  { time: minSec(7,15), stage: 2 },
  { time: minSec(7,20), stage: 1 },
  { time: minSec(7,35), stage: 3 },
  { time: minSec(7,40), stage: 1 },
  { time: minSec(7,45), stage: 0 },
  { time: minSec(7,50), stage: 1 },
  { time: minSec(8,0), stage: 0 },
  { time: minSec(8,5), stage: 0 }
];

function setup() {
    createCanvas(windowWidth, windowHeight);
    // textFont(myFont);
    textAlign(CENTER, CENTER);
    pixelDensity(1); 
    fft = new p5.FFT(0.8, 512);
    amplitude = new p5.Amplitude();
}

function draw() {
  background(0);
  fill(255);
  textSize(windowHeight * 0.02);

  if (!started) {
    if (!loading) {
        text("click to load assets", width/2, height/2 - 40);
      text("this experience contains flashing lights which may", width/2, height/2 + 20);
      text("not be suitable for viewers with photosensitive epilepsy.", width/2, height/2 + 40);
    } else if (loadedTracks < totalTracks) {
        text("loading assets... (" + loadedTracks + "/" + totalTracks + ")", width/2, height/2);
    } else {
        text("this is a time-mapped biometric dream compression system", width/2, height/2 - 60);
        text("by Jennifer Leigh Whitehead", width/2, height/2 - 40);
        text("click anywhere to begin.", width/2, height/2);
        text("this experience will continue indefinitely unless you press 's'", width/2, height/2 +40);
        text("one loop is 485 seconds (8 minutes 5 seconds)", width/2, height/2 + 60);
    }
    return;
  }

  let elapsed = (millis() - startTime) / 1000;
  let loopTime = elapsed % totalDuration;

  let stage = getStage(loopTime);

  if (stage !== currentStage) {
    switchStage(stage);
    currentStage = stage;
  }
  
  let stageElapsed = (millis() - stageStartTime) / 1000;

  drawStageVisuals(currentStage, stageElapsed);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
  if (!started && !loading) {
    loading = true;
    userStartAudio();

    const trackFiles = [
      'assets/silent.mp3',
      'assets/coresleep.mp3',
      'assets/deepsleep.mp3',
      'assets/REM.mp3'
    ];

    trackFiles.forEach((file, i) => {
      tracks[i] = loadSound(
        file,
        () => {
          loadedTracks++;
          console.log(file, 'loaded, loadedTracks =', loadedTracks);

          if (loadedTracks === totalTracks) {
            console.log('All tracks loaded');
          }
        },
        (err) => console.error(file, 'failed to load:', err)
      );
    });
  } 
  else if (loading && loadedTracks === totalTracks && !started) {
    started = true;
    startTime = millis();
    currentStage = getStage(0);
    fullscreen(true);
    noCursor();
    tracks[currentStage].loop();
    console.log('Timeline started');
  }
}

function getStage(currentTime) {
  for (let i = timeline.length - 1; i >= 0; i--) {
    if (currentTime >= timeline[i].time) return timeline[i].stage;
  }
  return 0;
}

// pause/play functionality
function switchStage(newStage) {
  for (let t of tracks) if (t.isPlaying()) t.pause();
  tracks[newStage].loop();
}

function drawStageVisuals(stage, stageElapsed) {
  let level = amplitude.getLevel();
  let spectrum = fft.analyze();

  switch(stage) {

case 0: {
  background(0);
  stroke(255);
  strokeWeight(5);
  line(0, height / 2, width, height / 2);
  break;
}

case 1: {
  background(0);
  noFill();

  let bass = fft.getEnergy("bass");
  let mid = fft.getEnergy("mid");
  let treble = fft.getEnergy("treble");

  let waveCount = 3;
  let linesPerWave = 30;
  let lineSpacing = 10; 

  for (let w = 0; w < waveCount; w++) {
    let groupHeight = linesPerWave * lineSpacing;
    let totalHeight = groupHeight * 3;
    let startY = (height - totalHeight) / 2;

    let groupSpacing = groupHeight * 0.8; // 0.8 = closer together
    let offsetY = startY + w * groupSpacing;

    let waveColor;
    let freqEnergy;
    if (w === 0) { waveColor = color(51, 51, 255, 200); freqEnergy = bass; }
    if (w === 1) { waveColor = color(255, 51, 255, 200); freqEnergy = mid; }
    if (w === 2) { waveColor = color(127, 0, 255, 200); freqEnergy = treble; }

    stroke(waveColor);
    strokeWeight(5); // fat


    for (let l = 0; l < linesPerWave; l++) {
      let lineOffset = l * lineSpacing; // vertical offset per parallel line
      beginShape();
      let t = frameCount * 0.01;
      let waveAmp = map(freqEnergy, 0, 255, 50, 150);

      // phantom start
      let prevX = -10;
      let prevPhase = noise(prevX * 0.005, t) * TWO_PI;
      let prevNoise = noise(prevX * 0.01 + t * 0.5, t + w*10) * 100;
      let prevY = offsetY + lineOffset + sin(prevX * 0.02 + t + prevPhase + w) * waveAmp + prevNoise;
      curveVertex(prevX, prevY);

      // main wave
      for (let x = 0; x <= width; x += 5) {
        let phaseOffset = noise(x * 0.005, t) * TWO_PI;
        let wavelength = 0.015 + noise(t + w*10) * 0.01;
        let noiseFactor = noise(x * 0.01 + t * 0.5, t + w*10) * 100;
        let y = offsetY + lineOffset + sin(x * wavelength + t + phaseOffset + w) * waveAmp + noiseFactor;
        curveVertex(x, y);
      }

      // phantom end
      let endX = width + 10;
      let endPhase = noise(endX * 0.005, t) * TWO_PI;
      let endNoise = noise(endX * 0.01 + t * 0.5, t + w*10) * 100;
      let endY = offsetY + lineOffset + sin(endX * 0.02 + t + endPhase + w) * waveAmp + endNoise;
      curveVertex(endX, endY);

      endShape();
    }
  }
  break;
}
  case 2: {
  background(0);
  noFill();
      
  let bass = fft.getEnergy("bass");
  let mid = fft.getEnergy("mid");
  let treble = fft.getEnergy("treble");

  let waveCount = 3;
  let linesPerWave = 30;
  let lineSpacing = 10; 

  for (let w = 0; w < waveCount; w++) {
    let groupHeight = linesPerWave * lineSpacing;
    let totalHeight = groupHeight * 3;
    let startY = (height - totalHeight) / 2;

    let groupSpacing = groupHeight * 0.8;
    let offsetY = startY + w * groupSpacing;

    let waveColor;
    let freqEnergy;
    if (w === 0) { waveColor = color(255, 255, 255, 200); freqEnergy = bass; }
    if (w === 1) { waveColor = color(255, 255, 255, 200); freqEnergy = mid; }
    if (w === 2) { waveColor = color(255, 255, 255, 200); freqEnergy = treble; }

    stroke(waveColor);
    strokeWeight(5); // fat

    // moiré effect
    for (let l = 0; l < linesPerWave; l++) {
      let lineOffset = l * lineSpacing; // vertical offset per parallel line
      beginShape();
      let t = frameCount * 0.01;
      let waveAmp = map(freqEnergy, 0, 255, 50, 150);

      // phantom start
      let prevX = -10;
      let prevPhase = noise(prevX * 0.005, t) * TWO_PI;
      let prevNoise = noise(prevX * 0.01 + t * 0.5, t + w*10) * 100;
      let prevY = offsetY + lineOffset + sin(prevX * 0.02 + t + prevPhase + w) * waveAmp + prevNoise;
      curveVertex(prevX, prevY);

      // main wave
      for (let x = 0; x <= width; x += 5) {
        let phaseOffset = noise(x * 0.005, t) * TWO_PI;
        let wavelength = 0.015 + noise(t + w*10) * 0.01;
        let noiseFactor = noise(x * 0.01 + t * 0.5, t + w*10) * 100;
        let y = offsetY + lineOffset + sin(x * wavelength + t + phaseOffset + w) * waveAmp + noiseFactor;
        curveVertex(x, y);
      }

      // phantom end
      let endX = width + 10;
      let endPhase = noise(endX * 0.005, t) * TWO_PI;
      let endNoise = noise(endX * 0.01 + t * 0.5, t + w*10) * 100;
      let endY = offsetY + lineOffset + sin(endX * 0.02 + t + endPhase + w) * waveAmp + endNoise;
      curveVertex(endX, endY);

      endShape();
    }
  }
  break;
  }

case 3: {
  background(0);
  noFill();

  let bpm = 165;
  let beatInterval = 60 / bpm; // seconds per beat
  let t = millis() / 1000;      // current time in seconds
  let beatPhase = t * TWO_PI / beatInterval; // full sine cycle per beat

  let waveCount = 5;     
  let linesPerWave = 30;
  let lineSpacing = 10;

  let groupHeight = linesPerWave * lineSpacing;
  let groupSpacing = groupHeight * 0.5; // closer together
  let totalHeight = groupHeight * waveCount * 0.5;
  let startY = (height - totalHeight) / 2;

  // rainbow-ish colors
  let colors = [
    color(51, 51, 255, 200),
    color(179, 255, 0, 200),
    color(255, 51, 255, 200),
    color(255, 128, 0, 200),
    color(127, 0, 255, 200),
  ];

  for (let w = 0; w < waveCount; w++) {
    let offsetY = startY + w * groupSpacing;
    let waveColor = colors[w];
    stroke(waveColor);
    strokeWeight(5);

    for (let l = 0; l < linesPerWave; l++) {
      let lineOffset = l * lineSpacing;
      beginShape();

      let lineT = t + w * 0.05 + l * 0.02; // subtle offsets per wave/line
      let waveAmp = map(sin(beatPhase + w * 0.3), -1, 1, 50, 200); // pulse to BPM

      // phantom start
      let prevX = -10;
      let prevPhase = noise(prevX * 0.005, lineT) * TWO_PI;
      let prevNoise = noise(prevX * 0.01 + lineT * 0.3, lineT + w*10) * 50;
      let prevY = offsetY + lineOffset + sin(prevX * 0.02 + lineT + prevPhase + w) * waveAmp + prevNoise;
      curveVertex(prevX, prevY);

      // main wave
      for (let x = 0; x <= width; x += 5) {
        let phaseOffset = noise(x * 0.005, lineT) * TWO_PI;
        let wavelength = 0.015 + noise(lineT + w*10) * 0.01;
        let noiseFactor = noise(x * 0.01 + lineT * 0.3, lineT + w*10) * 50;
        let y = offsetY + lineOffset + sin(x * wavelength + lineT + phaseOffset + w) * waveAmp + noiseFactor;
        curveVertex(x, y);
      }

      // phantom end
      let endX = width + 10;
      let endPhase = noise(endX * 0.005, lineT) * TWO_PI;
      let endNoise = noise(endX * 0.01 + lineT * 0.3, lineT + w*10) * 50;
      let endY = offsetY + lineOffset + sin(endX * 0.02 + lineT + endPhase + w) * waveAmp + endNoise;
      curveVertex(endX, endY);

      endShape();
    }
  }

  break;
}


    default:
      background(0);
      break;
  }
}

function keyPressed() {
  // Press 's' to stop the performance
  if (key === 's' || key === 'S') {
    stopAll();
  }
}

function stopAll() {
  tracks.forEach(t => t.stop()); // stop all audio
  noLoop();                     // stop draw() loop
  fullscreen(false);
  cursor();
  background(0);
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("performance stopped", width/2, height/2);
}