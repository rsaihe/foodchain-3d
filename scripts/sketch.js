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

var camPos = 0;
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
    var total = entities.length + newEntities.length;
    var dynamic = getByName(entities, ['pred', 'prey']).length;
    if (total <= 0 || total > 600 || dynamic === 0) initEntities();

    // Randomly spawn food on the map
    if (random(10) < 1) {
        var x = random(-mapX, mapX);
        var y = random(-mapY, mapY);
        var z = random(mapZ);
        newEntities.push(createEntity(x, y, z, entity.food));
    }

    // Lighting
    ambientLight(60);

    // Camera
    if (camPos === 0) {
        // front
        var camX = map(mouseX, 0, width, -200, 200);
        var camY = map(mouseY, 0, height, -200, 200);
        var camZ = (height/2) / tan(PI/6);
        camera(camX, camY, camZ, camX, camY, 0, 0, 1, 0);
        directionalLight(255, 255, 255, -1, -1, 0);
    } else if (camPos === 1) {
        // right
        var camX = mapX + (height/2) / tan(PI/6);
        var camY = map(mouseY, 0, height, -200, 200);
        var camZ = mapZ / 2 + map(mouseX, 0, width, 200, -200);
        camera(camX, camY, camZ, 0, camY, camZ, 0, 1, 0);
        directionalLight(255, 255, 255, 0, -1, -1);
    } else if (camPos === 2) {
        // back
        var camX = map(mouseX, 0, width, 200, -200);
        var camY = map(mouseY, 0, height, -200, 200);
        var camZ = mapZ - (height/2) / tan(PI/6);
        camera(camX, camY, camZ, camX, camY, 0, 0, 1, 0);
        directionalLight(255, 255, 255, 1, -1, 0);
    } else if (camPos === 3) {
        // left
        var camX = -mapX - (height/2) / tan(PI/6);
        var camY = map(mouseY, 0, height, -200, 200);
        var camZ = mapZ / 2 + map(mouseX, 0, width, -200, 200);
        camera(camX, camY, camZ, 0, camY, camZ, 0, 1, 0);
        directionalLight(255, 255, 255, 0, -1, 1);
    } else if (camPos === 4) {
        // top
        var camX = map(mouseY, 0, height, -200, 200);
        var camY = -mapY - (height/2) / tan(PI/6);
        var camZ = mapZ/2 + map(mouseX, 0, width, 200, -200);
        camera(camX, camY, camZ, camX, 0, camZ, 1, 0, 0);
        directionalLight(255, 255, 255, 0, -1, 1);
    } else if (camPos === 5) {
        // bottom
        var camX = map(mouseY, 0, height, -200, 200);
        var camY = mapY + (height/2) / tan(PI/6);
        var camZ = mapZ/2 + map(mouseX, 0, width, -200, 200);
        camera(camX, camY, camZ, camX, 0, camZ, 1, 0, 0);
        directionalLight(255, 255, 255, 0, -1, -1);
    }
    //ortho(-mapX, mapX, -mapY, mapY, mapZ, 0);

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
            camPos = 0;
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
                camPos = 0;
            }
            break;
        case 67:
            // C
            keyIsDown(SHIFT) ? camPos-- : camPos++;
            if (camPos < 0) camPos = 5;
            if (camPos > 5) camPos = 0;
            break;
        case 78:
            // N
            showNutrition = !showNutrition;
            break;
        case 82:
            // R
            camPos = 0;
            break;
    }
}
