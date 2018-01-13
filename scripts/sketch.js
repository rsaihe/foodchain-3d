var entities;
var newEntities;
var e;


// Main p5 functions

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    e = new Entity(0, 0, 0);
    e.color = [255, 0, 0];
    e.radius = 50;
}

function draw() {
    background(0);

    // Camera
    var camX = map(mouseX, 0, width, -200, 200);
    var camY = map(mouseY, 0, height, -200, 200);
    camera(camX, camY, (height/2) / tan(PI/6), camX, camY, 0, 0, 1, 0);

    // Lighting
    ambientLight(60);
    directionalLight(255, -PI/4, -PI/4, 0);

    e.draw();
}
