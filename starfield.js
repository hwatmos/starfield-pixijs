//$.getScript("v2_setup.js", function() {
  

///////////////////////////////////////////////////////
// Interactivity

var mouseEventHandler = function(e){
  isZoomed = 1 - isZoomed;
  console.log('---------' + isZoomed);
}

let container = new PIXI.Container();
container.hitArea = new PIXI.Rectangle(0, 0, maxX, maxY);
container.interactive = true;
//container.on("mousedown", mouseEventHandler);
container.on("mouseup", mouseEventHandler);
//container.on("wheel",mouseEventHandler);
//container.on("mouseover", mouseEventHandler);
//container.on("mousemove", mouseEventHandler);

let isZoomed = 0;
let curZoom = 0;

///////////////////////////////////////////////////////
// Blur

const blurFilter = new PIXI.filters.BlurFilter();
blurFilter.blur = 0;

///////////////////////////////////////////////////////
// Stars

function Star(time, shooting = false) {
  // three layers of starts. Each layer is located at different depth/distance from the camera.
  // 0 is the closest, 2 is the furthest
  this.depth = Math.floor(Math.random()*3); // 0, 1, or 2 since random() does not include 1.
  //this.depth=0;

  // initial position
  this.x = Math.random() * maxX;
  this.y = Math.random() * maxY;
  this.dispX = this.x;
  this.dispY = this.y;

  // whether this star should flicker and how long is the cycle
  this.flicker = Math.random() < 0.22;
  this.flickerCycle = 10 + Math.random() * 20;
  // random time offset for flickering
  this.flickerOffset = Math.random();

  // brightness settings
  this.minAlpha = 0.2 + Math.random()*0.3;
  this.maxAlpha = 0.5 + Math.random()*0.4;
  // initial brightness
  this.alpha = this.minAlpha + Math.random() * (this.maxAlpha - this.minAlpha);

  // star's color. (src: https://colorswall.com/palette/207)
  let colorPalette = [0xafc9ff, 0xc7d8ff, 0xfff4f3, 0xffe5cf, 0xffd9b2, 0xffffff, 0xffa651];
  this.color = colorPalette[Math.floor(Math.random() * 6)];

  // speed
  let speedList = [1,0.7,0.5];
  this.speed = speedList[this.depth] -0.1 + 0.2*Math.random();

  // size
  let sizesList = [1,.7,.4];
  this.size = sizesList[this.depth] - 0.1 + 0.2* Math.random();

  // zoom
  this.zoom = 1;

  // Shooting starts are faster and larger.
  // Their init y location is also beyond the edge of the screen
  // so that they don't immediately appear on the screen.
  this.shooting = shooting;
  if (shooting) {
    this.speed = this.speed * 10;
    this.size = this.size + 1;
    this.y = maxY * 5 + Math.random() * 1000;
  }

  // Birth time aka when was this star created
  this.birth = time;

  // Reset, called when star exits the screen
  this.reset = function (time) {
    this.x = Math.random() * maxX;
    this.y = maxY;
    this.birth = time;
    if (this.shooting) {
      this.y = maxY * 5 + Math.random() * 1000;
    }
  }

  // Movement
  this.move = function (time, timeDelta) {
    // Move up
    this.y = this.y - this.speed * timeDelta;
    if (this.y < 0) {
      this.reset(time);
    }

    // Movement adjustment when zoomed in
    let difX = halfX-this.x;
    let difY = halfY-this.y;
    if (this.depth<2) {
      this.dispX = - difX * (1-this.depth/2+1)*(1+curZoom*(2-this.depth)/2) + halfX;
      this.dispY = - difY * (1-this.depth/2+1)*(1+curZoom*(2-this.depth)/2) + halfY;
      this.zoom = 1+curZoom*(4-this.depth)/4;
    } else {
      this.dispX = this.x;
      this.dispY = this.y;
    }
    this.sprite.transform.scale._x = this.zoom;
    this.sprite.transform.scale._y = this.zoom*2;

    // Apply movement changes to the sprite
    this.sprite.x = this.dispX;
    this.sprite.y = this.dispY;

    // Star that flickers
    if (this.flicker) {
      let alphaCos = Math.cos((time - this.birth + this.flickerOffset) / this.flickerCycle);
      this.alpha = this.minAlpha + alphaCos * (1 - this.minAlpha);
      this.sprite.alpha = this.alpha;
    }
  }

  // Sprite
  this.gr = new PIXI.Graphics();
  this.gr.beginFill(this.color);
  this.gr.lineStyle(0);
  this.gr.drawCircle(this.x, this.y, this.size);
  this.gr.endFill();

  this.texture = app.renderer.generateTexture(this.gr);
  this.sprite = new PIXI.Sprite(this.texture);

  if (this.depth==0){
    this.sprite.filters = [blurFilter];
  }

  container.addChild(this.sprite);
}


let star = new Star(0);
let numStars = 700;
let stars = [];
let numShootStars = 2;

for (let i = 0; i < numStars; i++) {
  //console.log(i);
  let shooting = false;
  if (Math.random() < 2 / numStars) {
    console.log(i);
    shooting = true;
  }
  stars.push(new Star(0, shooting));
}
app.stage.addChild(container);
//app.stage.addChild(graphics);

///////////////////////////////////////////////////////
// Branding

/* Text */
const style = new PIXI.TextStyle({
  fontFamily: 'Courier New',
  fontSize: 36,
  //fontStyle: 'italic',
  //fontWeight: 'bold',
  //fill: ['#ffffff', '#00ff99'], // gradient
  fill: '#33ff00',
  //stroke: '#4a1850',
  strokeThickness: 0,
  //dropShadow: true,
  //dropShadowColor: '#000000',
  //dropShadowBlur: 4,
  //dropShadowAngle: Math.PI / 6,
  //dropShadowDistance: 6,
  //wordWrap: true,
  //wordWrapWidth: 440,
  lineJoin: 'round',
});

const richText = new PIXI.Text('0xhwatmos', style);
richText.x = 10;
richText.y = 50;
richText.interactive = true;
richText.on('pointerdown', (event) => { console.log('clicked!'); });

app.stage.addChild(richText);

///////////////////////////////////////////////////////
// Main loop

// Add a ticker callback to move the sprite back and forth
let elapsed = 0.0;
app.ticker.add((delta) => {
  elapsed += delta;
  //sprite.x = 100.0 + Math.cos(elapsed/50.0) * 100.0;
  star.move(elapsed, delta);
  for (let i = 0; i < numStars; i++) {
    stars[i].move(elapsed, delta);
  }

  if (isZoomed==0 & curZoom>0) {
    curZoom -= 0.05;
    console.log(curZoom);
  } else if (isZoomed==1 & curZoom<1) {
    curZoom += 0.05;
    console.log(curZoom);
  }
  blurFilter.blur=curZoom*5;

});


//});