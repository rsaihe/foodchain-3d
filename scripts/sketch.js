var entities;
var newEntities;

var mapX;
var mapY;
var mapZ;

var presets = [
    {
        food: 30,
        pred: 10,
        prey: 20
    },
    {
        food: 30,
        fungus: 8,
        pred: 10,
        prey: 20
    }
];
var currentPreset = 0;

var camMode = true;
var showNutrition = true;
var showPerception = false;


// Misc functions

// Initialize important coordinate variables
function initCoords() {
    mapX = width / 2;
    mapY = height / 2;
    mapZ = -1000;
}

// Initialize entity arrays
function initEntities() {
    entities = [];
    newEntities = [];

    // Setup initial entities from preset
    var preset = presets[currentPreset];
    var keys = Object.keys(preset);
    for (var i = 0; i < keys.length; i++) {
        var template = keys[i];
        var count = preset[template];
        for (var j = 0; j < count; j++) {
            var x = random(-mapX, mapX);
            var y = random(-mapY, mapY);
            var z = random(mapZ);
            entities.push(createEntity(x, y, z, entity[template]));
        }
    }
}

// Remove dead entities from entities array
function removeDead(entities) {
    for (var i = entities.length - 1; i >= 0; i--) {
        var e = entities[i];
        if (e.alive) continue;
        entities.splice(i, 1);
        e.onDeath();
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

    // Restart if there are too many or too few entities
    var total = entities.length;
    var static = getByName(entities, ['food', 'fungus', 'hive']).length;
    var dynamic = total - static;
    if (total <= 0 || total > 600 || dynamic === 0) initEntities();

    // Randomly spawn food on the map
    if (random(10) < 1) {
        var x = random(-mapX, mapX);
        var y = random(-mapY, mapY);
        var z = random(mapZ);
        entities.push(createEntity(x, y, z, entity.food));
    }

    // Camera
    if (camMode) {
        var camX = map(mouseX, 0, width, -200, 200);
        var camY = map(mouseY, 0, height, -200, 200);
        camera(camX, camY, (height/2) / tan(PI/6), camX, camY, 0, 0, 1, 0);
    } else {
        ortho(-mapX, mapX, -mapY, mapY, mapZ, 0);
    }

    // Lighting
    ambientLight(60);
    directionalLight(255, 255, 255, -1, -1, 0);

    for (var i = 0; i < entities.length; i++) {
        entities[i].act();
    }

    removeDead(entities);
    entities = entities.concat(newEntities);
    newEntities = [];
}


// User input

function keyPressed() {
    switch (keyCode) {
        case 13:
            // Enter
            initEntities();
            break;
        case 17:
            // Ctrl
            showPerception = !showPerception;
            break;
        case 48:
        case 49:
        case 50:
        case 51:
        case 52:
        case 53:
        case 54:
        case 55:
        case 56:
        case 57:
            // 0-9
            var n = keyCode - 49;
            if (currentPreset !== n && presets.length > n) {
                currentPreset = n;
                initEntities();
            }
            break;
        case 67:
            // C
            camMode = !camMode;
            break;
        case 78:
            // N
            showNutrition = !showNutrition;
            break;
    }
}
