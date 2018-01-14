var entities;
var newEntities;

var mapX;
var mapY;
var mapZ;

var showNutrition = true;


// Misc functions

// Initialize important coordinate variables
function initCoords() {
    mapX = width / 2;
    mapY = height / 2;
    mapZ = -500;
}

// Initialize entity arrays
function initEntities() {
    entities = [];
    newEntities = [];

    // Spawn example entities
    for (var i = 0; i < 10; i++) {
        var x = random(-mapX, mapX);
        var y = random(-mapY, mapY);
        var e = new Entity(x, y, random(mapZ));
        e.color = [255, 0, 0];
        e.radius = random(10, 50);
        e.accAmt = random(0.4);
        e.topSpeed = random(10);
        entities.push(e);
    }
}


// Main p5 functions

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    initCoords();
    initEntities();
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

    for (var i = 0; i < entities.length; i++) {
        entities[i].act();
    }
}


// User input

function keyPressed() {
    switch (keyCode) {
        case 13:
            // Enter
            initEntities();
            break;
        case 78:
            // N
            showNutrition = !showNutrition;
            break;
    }
}
