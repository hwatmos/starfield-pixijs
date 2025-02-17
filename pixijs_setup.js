///////////////////////////////////////////////////////
// pixijs setup and starfield parameters

const app = new PIXI.Application({
    autoResize: true,
    resolution: devicePixelRatio,
    backgroundColor: 0x3d3b49
  });
  document.querySelector('#frame').appendChild(app.view);
  
  let maxX = app.screen.width;
  let maxY = app.screen.height;
  let halfX = maxX/2.;
  let halfY = maxY/2.;
  let minAlpha = 0.4;
  let maxAlpha = 0.9;
  let zoom = 1;
  
  // Resize function window
  function resize() {
  
    // Get the p
    const parent = app.view.parentNode;
  
    // Listen for window resize events
    window.addEventListener('resize', resize);
  
    // Resize the renderer
    app.renderer.resize(parent.clientWidth, parent.clientHeight);
  
    // You can use the 'screen' property as the renderer visible
    // area, this is more useful than view.width/height because
    // it handles resolution
    //rect.position.set(app.screen.width, app.screen.height);
    maxX = app.screen.width;
    maxY = app.screen.height;
    halfX = maxX/2.;
    halfY = maxY/2.;
  }
  
  resize();