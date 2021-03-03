var shapes = [];
var sides = 4;

var bg;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.style('display', 'block');
  canvas.parent('sketch-holder');
  noStroke();
  bg=100;

}

function draw() {
//   background('#055A4E');
//  colorMode(HSB);
  bg = bg + 80;
  background('#0f0c24');
  background(bg);

  // generate shape, every so often generate new shape
  if (frameCount % 90 == 0)
    sides = int(random(4, 12));
  if (frameCount % 16 == 0) {
    shapes.push(new Polygon(sides));
  }

  // run thru objects render to screen and grow
  for (var i = 0; i < shapes.length; i++) {
    shapes[i].render();
    shapes[i].grow();
  }

  print(shapes.length);
}



// object
function Polygon(_sides) {

  this.x = width / 2;
  this.y = height / 2;
  this.sides = _sides;
  this.radius = 2;

  this.render = function() {
    stroke(255, max(0, 255 - this.radius * 0.5));
    strokeWeight(4 - this.radius * 0.001);
    fill(0 + random(45), 100, 215, 100 - this.radius / 6);

    var angle = TWO_PI / this.sides;

    beginShape();
      for (var a = 0; a < TWO_PI; a += angle) {
        var px = this.x + cos(a) * this.radius;
        var py = this.y + sin(a) * this.radius;
  
        vertex(px, py);
      }
    endShape(CLOSE);

  };

  this.grow = function() {

    this.radius += 3;

    if (this.radius > width /2) {
      shapes.splice(0, 1); // remove shape
    }

  };

} // Polygon object