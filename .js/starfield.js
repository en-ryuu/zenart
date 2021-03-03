    var myp5, sketch;
  
    sketch = function(p) {
      p.stars = [];
      p.setup = function() {
        var i;
        p.canvas = p.createCanvas(window.innerWidth, window.innerHeight);
        p.canvas.style('display', 'block');
        p.canvas.parent('sketch-holder');
        i = 0;
        while (i < 500) {
          p.stars[i] = new p.Star();
          i++;
        }
      };
      p.draw = function() {
        var i;
        p.background('#0c0a16');
        p.translate(p.width / 2, p.height / 2);
        i = 0;
        while (i < p.stars.length) {
          p.stars[i].update();
          p.stars[i].show();
          i++;
        }
      };
      p.Star = function() {
        this.x = p.random(-p.width, p.width);
        this.y = p.random(-p.height, p.height);
        this.z = p.random(0, p.width);
        this.pz = this.z;
        this.update = function() {
          this.z = this.z - 10;
          if (this.z < 1) {
            this.z = p.width;
            this.x = p.random(-p.width, p.width);
            this.y = p.random(-p.height, p.height);
            this.pz = this.z;
          }
        };
        this.show = function() {
          var px, py, sx, sy;
          sx = p.map(this.x / this.z, 0, 1, 0, p.width);
          sy = p.map(this.y / this.z, 0, 1, 0, p.width);
          px = p.map(this.x / this.pz, 0, 1, 0, p.width);
          py = p.map(this.y / this.pz, 0, 1, 0, p.width);
          this.pz = this.z;
          p.stroke(255);
          p.line(px, py, sx, sy);
        };
      };
      return p.windowResized = function() {
        p.resizeCanvas(window.innerWidth, window.innerHeight);
      };
    };
  
    myp5 = new p5(sketch);
  
