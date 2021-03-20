// Select number of cross sections
var symmetry, sets;

//Define global variables for curve points and anchors, mouseX, mouseY variables
var sx, sy, ax1, ay1, ax2, ay2, ex, ey, mx, my, pmx, pmy, t;
var gui, noDraw, resetV;

// Define the angles for Symmetry
let angle;

var settings = {
  sym: 6,
  brushStroke: 2,
  dual: false,
  n: 75,
  stx: 2,
  auto: false,
  nFrame: 90,
  frames: 60,
  t: 12,
};

// Color Picker Object
var ColorObject = function () {
  this.color = [0, 255, 237]; // RGB with alpha
  // this.color2 = [188, 61, 61];
  this.color2 = [255, 255, 255];
  this.a = 75;
  this.bgColor = 1;
};

function setBackground() {
  if (colorObject.bgColor == 1) {
    background("#000000");
  }
  if (colorObject.bgColor == 2) {
    background("#0b0918");
  }
  if (colorObject.bgColor == 3) {
    background("#cccccc");
  }
  if (colorObject.bgColor == 4) {
    background("#ffffff");
  }
  if (colorObject.bgColor == 5) {
    background("#0b0918");
  }
}

var colorObject = new ColorObject();

// Setup initial Canvas ------------------------------------------------------------------------------------------------

function setup() {
  // colorMode(HSB, 300);

  // Default Symmetry
  angleMode(DEGREES); // How are the angles defined .. In degrees
  symmetry = settings.sym;
  angle = 360 / symmetry;

  createGUI(); // Create a GUI object for this sketch

  noDraw = false; // Drawing is enabled

  // frameRate(25); // How many frames per second (default: 20 or 25)

  stroke(0, 50); // Grayscale(0) , Alpha (18)
  noFill(); // Don't fill the color inside shapes

  t = 0; // Increase the t value for noise

  canvas = createCanvas(window.innerWidth, window.innerHeight);
  canvas.style("display", "block");
  canvas.parent("sketch-holder");

  // background('#0f0c24'); // The sweet easy on eye color
  // background(colorObject.bgColor);
  setBackground();
}

// Clear the screen
function clearScreen() {
  // background('#0b0918');
  setBackground();
}
// Use key "R" to clear the screen
function keyPressed() {
  if (keyCode === 82) {
    clearScreen();
  }
}

// Full Screen Function
function screenFull() {
  let fs = fullscreen();
  fullscreen(!fs);
}

// Main function for drawing. Loops infinitely until stopped.
function draw() {
  // Reset settings if changed
  if (resetV == true) {
    frameRate(settings.frames);
    symmetry = settings.sym;
    angle = 360 / symmetry;
    resetV = false;
  }

  translate(width / 2, height / 2); // Define the center of symmetry

  // Noise Settings
  noiseDetail(2, 0.001); // no of octaves, falloff factor .. Learn more : https://p5js.org/reference/#/p5/noiseDetail
  noiseSeed(settings.n); // Define a specific noise seed

  // If mouse is inside the canvas
  if (
    mouseX > 0 &&
    mouseX < width &&
    mouseY > 0 &&
    mouseY < height &&
    noDraw == false
  ) {
    //Translate mouse position to match translated canvas
    setMousePos();

    // When mouse is pressed Draw
    if (settings.auto == false && mouseIsPressed) {
      drawFunc();
    } else {
      if (settings.auto == true) {
        drawFunc();
        clearFrame();
      }
    }
  }
  t += settings.t / 1000; // Increment t for varying noise
}

function setMousePos() {
  mx = mouseX - width / 2;
  my = mouseY - height / 2;
  pmx = pmouseX - width / 2;
  pmy = pmouseY - height / 2;
}

function drawFunc() {
  // Draw one part of the symmetry and copy it to the remaining by rotating
  for (let i = 0; i < symmetry; i++) {
    // Color Definitions
    // let random_index = Math.floor(Math.random() * TONES_2.length); // For gradient effect
    const [r, g, b] = colorObject.color; // Define primary color
    const a = colorObject.a;

    rotate(angle); // Rotating the image

    strokeWeight(Math.random() * 6); // Thickness of stroke from 1 to 6

    stroke(r, g, b, a * noise(t + 32)); // Defining color of current stroke

    assignPoints(); // Define the Start, End and anchor points for the bezier curve

    drawBezier(sx, sy, ax1, ay1, ax2, ay2, ex, ey, a); // Function to draw the Bezier curves
    drawBezier(
      sx / 2,
      sy / 2,
      ax1 / 2,
      ay1 / 2,
      ax2 / 2,
      ay2 / 2,
      ex / 2,
      ey / 2,
      a
    );
    drawBezier(
      sx / 4,
      sy / 4,
      ax1 / 4,
      ay1 / 4,
      ax2 / 4,
      ay2 / 4,
      ex / 4,
      ey / 4,
      a
    );
    //clearFrame(); // For auto clearing canvas after x frames
  }
}

function drawBezier(sx, sy, ax1, ay1, ax2, ay2, ex, ey, a) {
  //    Secondary color definitions
  const [r2, g2, b2] = colorObject.color2; // Define secondary color

  // Initial Bezier curves
  bezier(sx, sy, ax1, ay1, ax2, ay2, ex, ey);
  push();
  scale(1, -1);

  // Stroke here for Dual color effect after translating the shape
  if (settings.dual == true) {
    stroke(r2, g2, b2, a * noise(t + 32));
  }

  bezier(sx, sy, ax1, ay1, ax2, ay2, ex, ey);
  pop();
}

//Clear Frames after every 'n' frames
function clearFrame() {
  if (frameCount % settings.nFrame == 0) {
    clearScreen();
  }
}

// Gui for settings
function createGUI() {
  // gui = new dat.GUI();
  gui = new dat.GUI();
  gui.domElement.id = "gui";
  gui_container.appendChild(gui.domElement);
  var obj = {
    Save: function () {
      save("design.jpg");
    },
    Clear: function () {
      setBackground();
    },
    Link: function () {
      window.open("https://www.deviantart.com/en-ryuu", _self);
    },
  };
  gui.add(obj, "Save").name("Save Canvas");
  gui.add(obj, "Clear").name("Clear Canvas (R)");
  gui
    .add(settings, "sym")
    .name("n-fold symmetry")
    .min(2)
    .step(1)
    .max(8)
    .onChange(settings.resetVar);
  gui
    .add(settings, "t")
    .name("Speed of variation")
    .min(1)
    .step(1)
    .max(20)
    .onChange(settings.resetVar);

  var guiColor = gui.addFolder("Color Options");
  guiColor.open();
  guiColor.addColor(colorObject, "color").name("Primary Color");
  guiColor.add(colorObject, "a").name("Max opacity").min(5).max(255);
  guiColor.add(settings, "dual").name("Dual Color");
  guiColor.addColor(colorObject, "color2").name("Secondary Color");
  guiColor.add(colorObject, "bgColor", {
    Darker: 1,
    Dark: 2,
    Lighter: 3,
    Light: 4,
    Picker: 5,
  }).name("Background").onChange(clearScreen);

  gui
    .add(settings, "stx", {
      Weave: 1,
      Uniform: 2,
      Uniform2: 3,
      Flower: 4,
      Vortex: 5,
      Frost: 6,
      UseAuto: 7,
    })
    .name("Presets");

  var guiAutomation = gui.addFolder("Automation");
  guiAutomation.add(settings, "auto").name("AutoDraw");
  guiAutomation.add(settings, "nFrame").name("Clear After n frame");

  var guiAdvanced = gui.addFolder("Advanced options");
  guiAdvanced.add(settings, "frames").name("Frames/sec")
    .min(22)
    .step(4)
    .max(120)
    .onChange(settings.resetVar);
  guiAdvanced.add(settings, "n").name("Noise seed").min(1).max(1000);

  var deviantart = gui
    .add({
        fun: function () {
          window.open("https://www.deviantart.com/en-ryuu");
          ga("send", "event", "link button", "deviantart");
        },
      },
      "fun"
    )
    .name("Author Profile");
  deviantart.__li.className = "cr function bigFont";
  deviantart.__li.style.borderLeft = "3px solid #8C8C8C";
  var deviantartIcon = document.createElement("span");
  deviantart.domElement.parentElement.appendChild(deviantartIcon);
  deviantartIcon.className = "icon deviantart";
  // gui.add(settings,'brushStroke').name('StrokeSize').min(2).step(1).max(5).onChange(settings.resetVar);

  if (isMobile()) {
    gui.close();
  }
}

// Check if the client is in a mobile device or not
function isMobile() {
  return /Mobi|Android/i.test(navigator.userAgent);
}

// On mouse over gui, Disable Drawing
function setStatus() {
  noDraw = true;
}
// On mouse out gui, re-enable Drawing
function removeStatus() {
  noDraw = false;
}

settings.resetVar = function () {
  resetV = true;
};

settings.refresh = function () {
  setBackground();
};

//Preset definitions -------------------------------------------------------------------------------------------------------------
function assignPoints() {
  if (settings.stx == 1) {
    // Weave
    sx = pmx + 50 * noise(t + 80);
    ax1 = pmx + 200 * noise(t + 25);
    ax2 = pmx - 200 * noise(t + 35);
    ex = pmx - 50 + 50 * noise(t + 45);
    sy = pmy + 50 * noise(t + 50);
    ay1 = pmy - 200 * noise(t + 65);
    ay2 = pmy - 200 * noise(t + 75);
    ey = pmy - 100 + 50 * noise(t + 85);
  }

  if (settings.stx == 2) {
    //Sweet Spot
    sx = (width / 2) * noise(t + 15);
    ax1 = width * noise(t + 25);
    ax2 = width * noise(t + 35);
    ex = width * noise(t + 45);
    sy = (height / 2) * noise(t + 55);
    ay1 = height * noise(t + 65);
    ay2 = height * noise(t + 75);
    ey = height * noise(t + 85);
  }

  if (settings.stx == 3) {
    //The Sweet spot 2
    sx = pmx;
    ax1 = width * noise(t + 25);
    ax2 = height * noise(t + 35);
    ex = width * noise(t + 45);
    sy = pmy;
    ay1 = height * noise(t + 65);
    ay2 = height * noise(t + 75);
    ey = width * noise(t + 85);
  }

  if (settings.stx == 4) {
    // Frost
    sx = pmx;
    ax1 = pmx * noise(t + 25);
    ax2 = pmx * noise(t + 35);
    ex = pmx * noise(t + 45);
    sy = pmx;
    ay1 = pmx * noise(t + 65);
    ay2 = pmx * noise(t + 75);
    ey = pmx * noise(t + 85);
  }

  if (settings.stx == 5) {
    //  Wormhole
    sx = mouseX;
    ex = mouseX;
    sy = mouseY;
    ey = mouseY;
    ax1 = mouseX * noise(t);
    ax2 = mouseX * noise(t);
    ay1 = mouseY * noise(t);
    ay2 = mouseY * noise(t);
  }

  if (settings.stx == 6) {
    //Super Sweet spot
    sx = pmx;
    ax1 = pmx * noise(t + 25);
    ax2 = pmx * noise(t + 35);
    ex = pmx * noise(t + 45);
    sy = pmx;
    ay1 = pmx * noise(t + 65);
    ay2 = pmx * noise(t + 75);
    ey = pmx * noise(t + 85);
  }

  if (settings.stx == 7) {
    sx = (width / 2) * noise(t + 15);
    ax1 = width * noise(t + 25);
    ax2 = width * noise(t + 35);
    ex = width * noise(t + 45);
    sy = (height / 2) * noise(t + 55);
    ay1 = height * noise(t + 65);
    ay2 = height * noise(t + 75);
    ey = height * noise(t + 85);
  }

  //For Debugging purposes
  // function printPoints() {
  //   print('MouseX: ' + mx + ' MouseY: ' + my);
  //   print('Startx: ' + sx + ' Starty: ' + sy);
  //   print('AnchorX1: ' + ax1 + ' AnchorY1: ' + ay1);
  //   print('AnchorX2: ' + ax2 + ' AnchorY2: ' + ay2);
  //   print('EndX: ' + ex + ' EndY: ' + ey);
  // }
}